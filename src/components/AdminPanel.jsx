import React, {useEffect, useState} from 'react';

export default function AdminPanel(){
  const [users,setUsers] = useState([]);

  useEffect(()=>{
    // In a full app, fetch API /users.
    fetch('/seeds/users.json').then(r=>r.json()).then(setUsers).catch(()=>{});
  },[]);

  return (
    <div>
      <h2>Admin Panel (Demo)</h2>
      <h3>Seeded Users</h3>
      <ul>
        {users.map(u=>(<li key={u.id}>{u.email} — {u.role}</li>))}
      </ul>
      <p>Features to add: create users, invite links, role management, hospital settings, audits.</p>
    </div>
  );
}