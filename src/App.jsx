import React from 'react';
import ClinicianDashboard from './components/ClinicianDashboard.jsx';

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, Arial', padding: 16 }}>
      <h1>Clinical PWA Prototype</h1>
      <ClinicianDashboard />
      <footer style={{ marginTop: 24, fontSize: 12, color: '#666' }}>
        Prototype — not for production use.
      </footer>
    </div>
  );
}