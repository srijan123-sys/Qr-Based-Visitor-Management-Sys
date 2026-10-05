// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  React Entry Point — Vercel Geist Design
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

// Apply dark mode class to <html> on load
const saved = localStorage.getItem('qr_theme') || 'dark';
document.documentElement.classList.add(saved);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          className: 'toast-vercel',
          style: {
            fontFamily: "'Geist', 'Inter', sans-serif",
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#0070f3', secondary: '#ffffff' },
          },
          error: {
            iconTheme: { primary: '#ff4444', secondary: '#ffffff' },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
