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
              <main style={{
                flex: 1,
                overflowY: 'auto',
                padding: '32px',
                minHeight: '100vh',
                paddingBottom: '80px',
              }}
              className="main-content"
              >
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
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          } />
        </Routes>
      )}
    </ThemeContext.Provider>
  );
}

export default App;
