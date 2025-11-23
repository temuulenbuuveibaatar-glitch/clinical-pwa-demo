// Kidney-failure medication checklist (non-AI CDS).
// This rule checks basic renal-risk flags and suggests reviewing drug doses.
// Input: context {eGFR, meds: [{name, dose, route, frequency}], allergies}
// Output: suggestions array of {medName, flag, suggestion, rationale}

export function runKidneyMedicationChecklist(context){
  const { eGFR, meds = [], allergies = [] } = context;
  const suggestions = [];

  // conservative thresholds
  if (typeof eGFR !== 'number') {
    suggestions.push({ medName: null, flag: 'missing_egfr', suggestion: 'Check renal function (eGFR) before dosing', rationale: 'Renal dosing depends on eGFR' });
    return suggestions;
  }

  meds.forEach(m => {
    const name = (m.name || '').toLowerCase();
    // Example conservative rules (extend with formulary)
    if (name.includes('amoxicillin') && eGFR < 30) {
      suggestions.push({
        medName: m.name,
        flag: 'renal_adjustment_recommended',
        suggestion: 'Consider dose reduction or alternative; consult pharmacy',
        rationale: `eGFR ${eGFR} mL/min may require dose adjustment for ${m.name}`
      });
    }
    if (name.includes('metformin') && eGFR < 30) {
      suggestions.push({
        medName: m.name,
        flag: 'contraindicated_in_severe_renal_impairment',
        suggestion: 'Metformin is generally contraindicated at eGFR < 30; consult guidelines',
        rationale: `eGFR ${eGFR} mL/min increases lactic acidosis risk`
      });
    }
    if (name.includes('ibuprofen') && eGFR < 60) {
      suggestions.push({
        medName: m.name,
        flag: 'nephrotoxic_risk',
        suggestion: 'Avoid NSAIDs in impaired renal function; consider acetaminophen if analgesia needed',
        rationale: `NSAIDs can reduce renal perfusion, eGFR ${eGFR} mL/min`
      });
    }
    // Generic: if severe renal impairment, suggest pharmacy review
    if (eGFR < 15) {
      suggestions.push({
        medName: m.name,
        flag: 'severe_renal_impairment',
        suggestion: 'Urgent pharmacy/renal review required for dosing and timing',
        rationale: `Severe renal impairment (eGFR ${eGFR}) affects many medication clearances`
      });
    }
  });

  return suggestions;
}