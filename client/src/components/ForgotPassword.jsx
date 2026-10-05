// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ForgotPassword.jsx — Vercel Geist Style
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineQrcode } from 'react-icons/hi';
import { FiArrowLeft, FiArrowRight, FiSun, FiMoon } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../api/axios.js';
import { useTheme } from '../App.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    try {
      setLoading(true);
      const res = await API.post('/auth/forgotpassword', { email });
      if (res.data.resetUrl) {
        toast.success(
          <div>
            Reset link generated! (Demo Mode) <br />
            <a href={res.data.resetUrl} className="underline" style={{ color: 'var(--link)', fontWeight: 600 }}>
              Click here to Reset Password
            </a>
          </div>,
          { duration: 10000 }
        );
      } else {
        toast.success(res.data.message || 'Email sent successfully');
      }
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email');
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
          <Link to="/login" className="btn-ghost-sm" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiArrowLeft size={13} /> Back
          </Link>
        </div>
      </header>

      {/* Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px', position: 'relative', zIndex: 10,
      }}>
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: 380 }}>
          <p className="text-eyebrow" style={{ textAlign: 'center', marginBottom: 12 }}>Account Recovery</p>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 28, fontWeight: 600, letterSpacing: '-1px', color: 'var(--ink)', textAlign: 'center', lineHeight: '36px', marginBottom: 8 }}>
            Reset your password
          </h1>
          <p className="text-body-md" style={{ textAlign: 'center', marginBottom: 36 }}>
            Enter your email and we'll send you a reset link.
          </p>

          <div className="card card-lg" style={{ boxShadow: 'var(--shadow-float)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{
                  display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
                  letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 8,
                }} htmlFor="forgot-email">
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <HiOutlineMail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mute)', fontSize: 16, pointerEvents: 'none' }} />
                  <input
                    type="email"
                    id="forgot-email"
                    className="input-field input-field-icon"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 4 }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff', width: 16, height: 16 }} />
                    Sending link...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Send Reset Link <FiArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>
            <div style={{ margin: '24px 0', borderTop: '1px solid var(--hairline)' }} />
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--mute)' }}>
              Remembered?{' '}
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
