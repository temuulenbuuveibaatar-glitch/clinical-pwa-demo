import React, {useEffect, useState} from 'react';
import MedicationManager from './MedicationManager';

export default function AdminPanel(){
  const [users,setUsers] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    fetch('/seeds/users.json').then(r=>r.json()).then(setUsers).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  return (
    <div>
      <h2>Admin Panel (Demo)</h2>
      {loading ? <div>Loading...</div> : (
        <>
          <h3>Seeded Users</h3>
          <ul>
            {users.map(u=>(<li key={u.id}>{u.email} — {u.role}</li>))}
          </ul>
        </>
      )}
      <MedicationManager />
      <div style={{marginTop:24}}>
        <h3>Emergency Guides</h3>
        <p>Place exported guides under <code>/data/content/</code> or use the import script to ingest guides from the International-emergency-guide repo.</p>
      </div>
      <p style={{marginTop:16}}>Features to add: create users, invite links, role management, hospital settings, audits, export logs.</p>
    </div>
  );
}