import React from 'react';
import ClinicianDashboard from './components/ClinicianDashboard.jsx';
import AdminPanel from './components/AdminPanel.jsx';

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, Arial', padding: 16 }}>
      <h1>Clinical PWA Prototype</h1>
      <ClinicianDashboard />
      <hr style={{margin:'24px 0'}} />
      <AdminPanel />
      <footer style={{ marginTop: 24, fontSize: 12, color: '#666' }}>
        Prototype — not for production use.
      </footer>
    </div>
  );
}