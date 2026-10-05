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
import { Toaster, toast } from 'react-hot-toast';
import API from './api/axios.js';

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

  const handleUpdateProfile = async () => {
    const newName = document.getElementById('settings-name-input').value;
    if (!newName.trim()) return toast.error('Name cannot be empty');
    
    try {
      const res = await API.put('/auth/updateprofile', { name: newName });
      const data = res.data;
      if (data.success) {
        setUser(data.data);
        localStorage.setItem('qr_user', JSON.stringify(data.data));
        localStorage.setItem('qr_token', data.data.token);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Network error');
    }
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
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--canvas)' }}>
              
              {/* ── Middle Area (Sidebar + Scrollable Main) ── */}
              <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <Sidebar user={user} onLogout={handleLogout} />
                <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                  <div style={{ flex: 1, flexShrink: 0 }} className="content-wrapper">
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
                      <Route path="/settings" element={
                        <div className="animate-fade-in" style={{ maxWidth: 640, margin: '0 auto', paddingBottom: 48 }}>
                          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Settings</h1>
                          <p style={{ color: 'var(--mute)', marginBottom: 32, fontSize: 14 }}>Manage your account settings and preferences.</p>
                          
                          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 16 }}>Profile Information</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                              <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--mute)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                                <input id="settings-name-input" type="text" className="input-field" defaultValue={user?.name || ''} placeholder="Your Name" />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--mute)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                                <input type="email" className="input-field" defaultValue={user?.email || ''} readOnly style={{ opacity: 0.7, background: 'var(--canvas-panel)' }} />
                              </div>
                              <div style={{ marginTop: 8 }}>
                                <button onClick={handleUpdateProfile} className="btn-primary">Save Changes</button>
                              </div>
                            </div>
                          </div>

                          <div className="card" style={{ padding: 24 }}>
                            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 16 }}>Appearance</h2>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--hairline)', marginBottom: 16 }}>
                              <div>
                                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>Theme Preference</p>
                                <p style={{ fontSize: 13, color: 'var(--mute)', marginTop: 2 }}>Toggle between light and dark mode.</p>
                              </div>
                              <button onClick={toggleTheme} className="btn-secondary" style={{ minWidth: 120 }}>
                                {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                              </button>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div>
                                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>Compact Mode</p>
                                <p style={{ fontSize: 13, color: 'var(--mute)', marginTop: 2 }}>Decrease spacing in data tables.</p>
                              </div>
                              <button className="btn-secondary" style={{ minWidth: 120, opacity: 0.5, cursor: 'not-allowed' }}>
                                Coming Soon
                              </button>
                            </div>
                          </div>
                        </div>
                      } />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </div>
                </main>
              </div>
              
              {/* ── Footer ──────────────────────────────────────────────────────── */}
              <footer style={{
                flexShrink: 0,
                padding: '20px 24px',
                borderTop: '1px solid var(--hairline)',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--mute)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: 'var(--canvas-panel)'
              }} className="app-footer">
                <p>QR Based Visitor Management System • Sigma University</p>
                <p>Made by Srijan, Daxesh, Vaibhav, and Mayur</p>
                <p>QR-Pass Core v1.0.0 &copy; {new Date().getFullYear()} — All rights reserved.</p>
              </footer>

              {/* ── Desktop Sidebar (md+) visible via CSS ─────────────────── */}
              <style>{`
                @media (min-width: 768px) {
                  #desktop-sidebar { display: flex !important; flex-direction: column; height: 100%; width: 240px; z-index: 50; background: var(--canvas); border-right: 1px solid var(--hairline); flex-shrink: 0; }
                  #mobile-header { display: none !important; }
                  #mobile-bottomnav { display: none !important; }
                  .content-wrapper { padding: 48px 32px 32px 32px !important; }
                }
                @media (max-width: 767px) {
                  #desktop-sidebar { display: none !important; }
                  #mobile-header { display: flex !important; }
                  #mobile-bottomnav { display: flex !important; }
                  .content-wrapper { padding: 84px 16px 32px 16px !important; }
                  .app-footer { padding-bottom: 80px !important; flex-direction: column !important; text-align: center !important; gap: 12px; }
                  .app-footer > div { text-align: center !important; }
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
