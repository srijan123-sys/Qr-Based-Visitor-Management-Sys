// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  App.jsx — Root Component with Routing + Theme
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import CreateQR from './components/CreateQR.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import CheckIn from './components/CheckIn.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import About from './components/About.jsx';
import { Toaster } from 'react-hot-toast';

// ── Theme Context ──────────────────────────────────────────────────
export const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('qr_theme') || 'dark');

  // Sync theme class on <html>
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('dark', 'light');
    html.classList.add(theme);
    localStorage.setItem('qr_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

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
        background: 'var(--canvas)',
      }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Not authenticated → auth pages OR public check-in */}
      {!user ? (
        <>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword/:resettoken" element={<ResetPassword onLogin={handleLogin} />} />
            <Route path="/checkin/:qrId" element={<CheckIn />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </>
      ) : (
        /* Authenticated → dashboard layout OR public check-in */
        <Routes>
          <Route path="/checkin/:qrId" element={<CheckIn />} />
          <Route path="*" element={
            <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--canvas)' }}>
              <Sidebar user={user} onLogout={handleLogout} />
              <main className="main-content" style={{ flex: 1, minHeight: '100vh' }}>
                <Routes>
                  <Route path="/" element={<Dashboard user={user} />} />
                  <Route path="/dashboard" element={<Dashboard user={user} />} />
                  <Route path="/create" element={
                    ['admin', 'receptionist'].includes(user.role)
                      ? <CreateQR />
                      : <Navigate to="/dashboard" replace />
                  } />
                  <Route path="/users" element={
                    user.role === 'admin'
                      ? <AdminPanel user={user} />
                      : <Navigate to="/dashboard" replace />
                  } />
                  <Route path="/about" element={<About />} />
                  <Route path="/settings" element={<div className="animate-fade-in" style={{maxWidth:600, margin: '0 auto', padding: '48px 0'}}><h1 style={{fontSize: 24, fontWeight: 600, color: 'var(--ink)'}}>Settings</h1><p style={{color: 'var(--mute)', marginTop: 8}}>User settings and preferences will be configured here.</p></div>} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
                
                {/* ── Footer ──────────────────────────────────────────────────────── */}
                <footer style={{
                  marginTop: 64,
                  paddingTop: 24,
                  borderTop: '1px solid var(--hairline)',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--mute)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}>
                  <p>QR Based Visitor Management System • Sigma University</p>
                  <p>Made by Srijan, Daxesh, Vaibhav, and Mayur</p>
                </footer>
              </main>

              {/* ── Desktop Sidebar (md+) visible via CSS ─────────────────── */}
              <style>{`
                @media (min-width: 768px) {
                  #desktop-sidebar { display: flex !important; position: fixed; top: 0; left: 0; bottom: 0; width: 240px; z-index: 50; }
                  #mobile-header { display: none !important; }
                  #mobile-bottomnav { display: none !important; }
                  .main-content { margin-left: 240px; padding: 48px 32px 80px 32px !important; }
                }
                @media (max-width: 767px) {
                  #desktop-sidebar { display: none !important; }
                  #mobile-header { display: flex !important; }
                  #mobile-bottomnav { display: flex !important; }
                  .main-content { margin-left: 0; padding: 20px 16px 80px 16px !important; padding-top: 72px !important; }
                }
              `}</style>
            </div>
          } />
        </Routes>
      )}
    </ThemeContext.Provider>
  );
}

export default App;
