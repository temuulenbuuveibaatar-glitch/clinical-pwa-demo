import React, {useEffect, useState} from 'react';
import {db, syncToServer} from '../db/pouch.js';
import {runSepsisRule} from '../cds/sepsisRule.js';
import {logEvent} from '../audit/logger.js';

export default function ClinicianDashboard(){
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [vitals, setVitals] = useState({hr:0, rr:0, sbp:0, temp:0, conf:false});
  const [suggestion, setSuggestion] = useState(null);

  useEffect(()=>{
    db.find({selector:{type:'patient'}}).then(res=>{
      setPatients(res.docs || []);
    }).catch(console.error);
  },[]);

  async function handleAssess(){
    if(!selected) return;
    const res = runSepsisRule(vitals);
    setSuggestion(res);
    await logEvent({action:'cds_evaluate', patient:selected._id, rule:'sepsis_v1', result:res});
  }

  async function handleSync(){
    await syncToServer();
    await logEvent({action:'manual_sync'});
    const res = await db.find({selector:{type:'patient'}});
    setPatients(res.docs || []);
  }

  return (
    <div>
      <div style={{display:'flex', gap:24}}>
        <div style={{flex:1}}>
          <h3>Patients</h3>
          <ul>
            {patients.map(p=>(
              <li key={p._id}>
                <button onClick={()=>setSelected(p)}>{p.name || p._id}</button>
              </li>
            ))}
            {patients.length===0 && <li>No patients in local DB (seed sample via sync).</li>}
          </ul>
          <button onClick={handleSync}>Sync</button>
        </div>

        <div style={{flex:2}}>
          <h3>Assessment</h3>
          <div>
            <label>HR <input type="number" value={vitals.hr} onChange={e=>setVitals(s=>({...s,hr:parseInt(e.target.value||0)}))} /></label>
            <label style={{marginLeft:8}}>RR <input type="number" value={vitals.rr} onChange={e=>setVitals(s=>({...s,rr:parseInt(e.target.value||0)}))} /></label>
            <label style={{marginLeft:8}}>SBP <input type="number" value={vitals.sbp} onChange={e=>setVitals(s=>({...s,sbp:parseInt(e.target.value||0)}))} /></label>
            <label style={{marginLeft:8}}>Temp <input type="number" value={vitals.temp} onChange={e=>setVitals(s=>({...s,temp:parseFloat(e.target.value||0)}))} /></label>
            <label style={{marginLeft:8}}>Altered Mentation <input type="checkbox" checked={vitals.conf} onChange={e=>setVitals(s=>({...s,conf:e.target.checked}))} /></label>
          </div>
          <div style={{marginTop:8}}>
            <button disabled={!selected} onClick={handleAssess}>Run Sepsis Triage Rule</button>
          </div>

          <div style={{marginTop:16}}>
            <h4>Suggestion</h4>
            {suggestion ? (
              <div>
                <strong>Severity:</strong> {suggestion.severity} <br/>
                <strong>Action:</strong> {suggestion.action} <br/>
                <strong>Rationale:</strong> {suggestion.rationale} <br/>
                <em>Clinician must confirm before any treatment. This is decision support only.</em>
              </div>
            ) : <div>No suggestion yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}