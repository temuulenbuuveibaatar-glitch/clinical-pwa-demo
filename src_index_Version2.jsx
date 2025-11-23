import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { initDB } from './db/pouch.js';
import './serviceWorker.js';

initDB().catch(console.error);

createRoot(document.getElementById('root')).render(<App />);