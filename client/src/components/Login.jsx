// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Login.jsx — Vercel Geist Auth Page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { FiArrowRight, FiSun, FiMoon } from 'react-icons/fi';
import { HiOutlineQrcode } from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../api/axios.js';
import { useTheme } from '../App.jsx';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    try {
      setLoading(true);
      const res = await API.post('/auth/login', form);
      toast.success('Welcome back!');
      onLogin(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
      {/* Hero mesh gradient — only decorative element per Vercel design */}
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
        {/* Wordmark */}
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
          {/* Theme toggle */}
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <FiSun size={14} /> : <FiMoon size={14} />}
          </button>
          <Link to="/signup" className="btn-ghost-sm" style={{ textDecoration: 'none' }}>
            Sign Up
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
          {/* Eyebrow */}
          <p className="text-eyebrow" style={{ textAlign: 'center', marginBottom: 12 }}>
            Visitor Management System
          </p>

          {/* Headline */}
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
            Sign in to QR-Pass
          </h1>

          <p className="text-body-md" style={{ textAlign: 'center', marginBottom: 36 }}>
            Enter your credentials to access the dashboard.
          </p>

          {/* Card */}
          <div className="card card-lg" style={{ boxShadow: 'var(--shadow-float)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

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
                }}
                htmlFor="login-email"
                >
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <HiOutlineMail style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--mute)',
                    fontSize: 16,
                    pointerEvents: 'none',
                  }} />
                  <input
                    type="email"
                    id="login-email"
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--mute)',
                  }}
                  htmlFor="login-password"
                  >
                    Password
                  </label>
                  <Link to="/forgotpassword" style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 12,
                    color: 'var(--link)',
                    textDecoration: 'none',
                  }}
                  onMouseOver={e => e.target.style.textDecoration = 'underline'}
                  onMouseOut={e => e.target.style.textDecoration = 'none'}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <HiOutlineLockClosed style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--mute)',
                    fontSize: 16,
                    pointerEvents: 'none',
                  }} />
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    className="input-field input-field-icon"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary btn-full btn-lg"
                disabled={loading}
                style={{ marginTop: 4 }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff', width: 16, height: 16 }} />
                    Signing in...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Sign In
                    <FiArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ margin: '24px 0', borderTop: '1px solid var(--hairline)' }} />

            {/* Footer */}
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--mute)' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'var(--link)', textDecoration: 'none', fontWeight: 500 }}
                onMouseOver={e => e.target.style.textDecoration = 'underline'}
                onMouseOut={e => e.target.style.textDecoration = 'none'}
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
