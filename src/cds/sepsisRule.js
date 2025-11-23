export function runSepsisRule(vitals){
  const {hr=0, rr=0, sbp=999, temp=36, conf=false} = vitals;
  let score = 0;
  if (hr > 90) score++;
  if (rr >= 22) score++;
  if (temp > 38 || temp < 36) score++;
  if (sbp <= 100) score++;
  if (conf) score++;

  let severity = 'low';
  let action = 'Continue observation; repeat vitals per protocol.';
  if (score >= 3){
    severity = 'high';
    action = 'Suspect sepsis — immediate clinician review, consider early antibiotics per local protocol, obtain lactate, blood cultures, and fluid resuscitation as appropriate. Do NOT administer treatment without clinician confirmation.';
  } else if (score === 2){
    severity = 'moderate';
    action = 'Alert clinician for assessment within 30 minutes; consider sepsis pathway.';
  }

  const rationale = `qSOFA-like count=${score}; thresholds: HR>90, RR>=22, Temp out of range, SBP<=100, altered mentation`;

  return {severity, action, rationale, score};
}