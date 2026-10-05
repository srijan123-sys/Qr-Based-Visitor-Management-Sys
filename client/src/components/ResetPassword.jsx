// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ResetPassword.jsx — Vercel Geist Style
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiOutlineLockClosed, HiOutlineQrcode } from 'react-icons/hi';
import { FiArrowRight, FiSun, FiMoon } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../api/axios.js';
import { useTheme } from '../App.jsx';

export default function ResetPassword({ onLogin }) {
  const { resettoken } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      await API.put(`/auth/resetpassword/${resettoken}`, { password });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
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
      <div className="hero-mesh" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        opacity: theme === 'dark' ? 1 : 0.4,
      }} />

      {/* Header */}
      <header style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 56, borderBottom: '1px solid var(--hairline)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #007cf0, #7928ca, #ff0080)', padding: '1.5px' }}>
            <div style={{ width: '100%', height: '100%', background: 'var(--canvas)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HiOutlineQrcode style={{ color: 'var(--ink)', fontSize: 14 }} />
            </div>
          </div>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, letterSpacing: '-0.3px', color: 'var(--ink)' }}>QR-Pass</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? <FiSun size={14} /> : <FiMoon size={14} />}
          </button>
        </div>
      </header>

      {/* Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px', position: 'relative', zIndex: 10,
      }}>
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: 380 }}>
          <p className="text-eyebrow" style={{ textAlign: 'center', marginBottom: 12 }}>Set New Password</p>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 28, fontWeight: 600, letterSpacing: '-1px', color: 'var(--ink)', textAlign: 'center', lineHeight: '36px', marginBottom: 8 }}>
            Create new password
          </h1>
          <p className="text-body-md" style={{ textAlign: 'center', marginBottom: 36 }}>
            Enter your new password below. Minimum 6 characters.
          </p>

          <div className="card card-lg" style={{ boxShadow: 'var(--shadow-float)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{
                  display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
                  letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 8,
                }} htmlFor="new-password">New Password</label>
                <div style={{ position: 'relative' }}>
                  <HiOutlineLockClosed style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mute)', fontSize: 16, pointerEvents: 'none' }} />
                  <input
                    type="password"
                    id="new-password"
                    className="input-field input-field-icon"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label style={{
                  display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
                  letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 8,
                }} htmlFor="confirm-password">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <HiOutlineLockClosed style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mute)', fontSize: 16, pointerEvents: 'none' }} />
                  <input
                    type="password"
                    id="confirm-password"
                    className="input-field input-field-icon"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 4 }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff', width: 16, height: 16 }} />
                    Resetting...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Reset Password <FiArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>
            <div style={{ margin: '24px 0', borderTop: '1px solid var(--hairline)' }} />
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--mute)' }}>
              <Link to="/login" style={{ color: 'var(--link)', textDecoration: 'none', fontWeight: 500 }}
                onMouseOver={e => e.target.style.textDecoration = 'underline'}
                onMouseOut={e => e.target.style.textDecoration = 'none'}
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
