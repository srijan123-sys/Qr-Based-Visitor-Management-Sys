// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  App.jsx — Root Component with Routing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import CreateQR from './components/CreateQR.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import CheckIn from './components/CheckIn.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('qr_user');
    const storedToken = localStorage.getItem('qr_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('qr_user');
        localStorage.removeItem('qr_token');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('qr_user', JSON.stringify(userData));
    localStorage.setItem('qr_token', userData.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('qr_user');
    localStorage.removeItem('qr_token');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
      }}>
        Loading...
      </div>
    );
  }

  // Not authenticated → show auth pages OR public check-in
  if (!user) {
    return (
      <>
        <Toaster position="top-right" toastOptions={{ className: 'glass-panel text-white' }} />
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="/checkin/:qrId" element={<CheckIn />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    );
  }

  // Authenticated → show dashboard layout OR public check-in (admins can check in too)
  return (
    <>
      <Toaster position="top-right" toastOptions={{ className: 'glass-panel text-white' }} />
      <Routes>
        <Route path="/checkin/:qrId" element={<CheckIn />} />
        <Route path="*" element={
          <div className="flex h-screen overflow-hidden">
            <Sidebar user={user} onLogout={handleLogout} />
            <div className="flex-1 overflow-y-auto bg-[#0A0A0F] p-4 md:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create" element={<CreateQR />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </>
  );
}

export default App;
