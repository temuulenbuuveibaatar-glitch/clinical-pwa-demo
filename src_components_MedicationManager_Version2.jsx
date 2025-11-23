import React, { useState } from 'react';

export default function MedicationManager(){
  const [fileMsg, setFileMsg] = useState('');
  async function handleUpload(e){
    const f = e.target.files[0];
    if(!f) return;
    const fd = new FormData();
    fd.append('file', f);
    setFileMsg('Uploading...');
    try{
      const res = await fetch('/api/import/medications', { method: 'POST', body: fd, credentials: 'include' });
      const json = await res.json();
      setFileMsg(`Imported ${json.imported || 0} records`);
    }catch(err){
      setFileMsg('Upload failed: ' + (err.message || err));
    }
  }
  return (
    <div>
      <h3>Medication Import</h3>
      <p>Upload a CSV (columns: name, formulation, dose, renal_adjustment or similar). Admin only.</p>
      <input type="file" accept=".csv" onChange={handleUpload} />
      <div style={{marginTop:8}}>{fileMsg}</div>
    </div>
  );
}