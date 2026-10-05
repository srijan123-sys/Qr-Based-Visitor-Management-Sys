// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Signup.jsx — Vercel Geist Registration Page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import { FiArrowRight, FiSun, FiMoon } from 'react-icons/fi';
import { HiOutlineQrcode } from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../api/axios.js';
import { useTheme } from '../App.jsx';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Signup({ onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      toast.error('Please enter a valid email address (e.g. user@example.com)');
      return;
    }
    try {
      setLoading(true);
      const res = await API.post('/auth/signup', form);
      toast.success('Account created successfully!');
      onLogin(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--canvas)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Hero mesh gradient */}
      <div className="hero-mesh" style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: theme === 'dark' ? 1 : 0.4,
      }} />

      {/* Top bar */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        height: 56,
        borderBottom: '1px solid var(--hairline)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: 'linear-gradient(135deg, #007cf0, #7928ca, #ff0080)',
            padding: '1.5px',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'var(--canvas)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <HiOutlineQrcode style={{ color: 'var(--ink)', fontSize: 14 }} />
            </div>
          </div>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, letterSpacing: '-0.3px', color: 'var(--ink)' }}>
            QR-Pass
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <FiSun size={14} /> : <FiMoon size={14} />}
          </button>
          <Link to="/login" className="btn-ghost-sm" style={{ textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </header>

      {/* Center form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        position: 'relative',
        zIndex: 10,
      }}>
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: 400 }}>
          <p className="text-eyebrow" style={{ textAlign: 'center', marginBottom: 12 }}>
            New Account
          </p>

          <h1 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: '-1.28px',
            color: 'var(--ink)',
            textAlign: 'center',
            lineHeight: '40px',
            marginBottom: 8,
          }}>
            Get started for free
          </h1>

          <p className="text-body-md" style={{ textAlign: 'center', marginBottom: 36 }}>
            Create your QR-Pass admin account in seconds.
          </p>

          <div className="card card-lg" style={{ boxShadow: 'var(--shadow-float)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'var(--mute)',
                  marginBottom: 8,
                }} htmlFor="signup-name">
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <HiOutlineUser style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--mute)', fontSize: 16, pointerEvents: 'none',
                  }} />
                  <input
                    type="text"
                    id="signup-name"
                    name="name"
                    className="input-field input-field-icon"
                    placeholder="Srijan Pradhan"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'var(--mute)',
                  marginBottom: 8,
                }} htmlFor="signup-email">
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <HiOutlineMail style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--mute)', fontSize: 16, pointerEvents: 'none',
                  }} />
                  <input
                    type="email"
                    id="signup-email"
                    name="email"
                    className="input-field input-field-icon"
                    placeholder="admin@company.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'var(--mute)',
                  marginBottom: 8,
                }} htmlFor="signup-password">
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <HiOutlineLockClosed style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--mute)', fontSize: 16, pointerEvents: 'none',
                  }} />
                  <input
                    type="password"
                    id="signup-password"
                    name="password"
                    className="input-field input-field-icon"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary btn-full btn-lg"
                disabled={loading}
                style={{ marginTop: 4 }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff', width: 16, height: 16 }} />
                    Creating account...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Create Account
                    <FiArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>

            <div style={{ margin: '24px 0', borderTop: '1px solid var(--hairline)' }} />

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--mute)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--link)', textDecoration: 'none', fontWeight: 500 }}
                onMouseOver={e => e.target.style.textDecoration = 'underline'}
                onMouseOut={e => e.target.style.textDecoration = 'none'}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
