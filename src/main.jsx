import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Auto-recover once if a visitor has a stale tab open across a new Vercel deploy
window.addEventListener('vite:preloadError', (event) => {
  const reloadKey = 'portfolio_vite_preload_reloaded';
  if (!sessionStorage.getItem(reloadKey)) {
    event.preventDefault();
    sessionStorage.setItem(reloadKey, '1');
    window.location.reload();
  }
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
