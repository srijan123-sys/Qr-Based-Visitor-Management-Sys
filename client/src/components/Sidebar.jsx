// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Sidebar.jsx — Vercel Geist Navigation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiUsers, FiGrid, FiLogOut, FiShield, FiInfo, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { HiOutlineQrcode } from 'react-icons/hi';
import { useTheme } from '../App.jsx';

const navItems = (user) => {
  const items = [];

  if (['admin', 'receptionist'].includes(user?.role)) {
    items.push({ to: '/dashboard', label: 'Visitor Log', icon: FiUsers, live: true });
  }
  if (user?.role === 'user') {
    items.push({ to: '/dashboard', label: 'My Passes', icon: FiUsers });
  }
  if (['admin', 'receptionist'].includes(user?.role)) {
    items.push({ to: '/create', label: 'Reception QR', icon: FiGrid, tag: 'Desk' });
  }
  if (user?.role === 'admin') {
    items.push({ to: '/users', label: 'Manage Users', icon: FiShield });
  }
  items.push({ to: '/about', label: 'About QR-MS', icon: FiInfo });

  return items;
};

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const items = navItems(user);

  // ── Desktop sidebar content ──────────────────────────────────────
  const SidebarContent = ({ onClose }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid var(--hairline)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Logo ring */}
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #007cf0, #7928ca, #ff0080)',
            padding: '1.5px',
            flexShrink: 0,
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'var(--canvas)',
              borderRadius: 7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <HiOutlineQrcode style={{ color: 'var(--ink)', fontSize: 16 }} />
            </div>
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '-0.3px',
              color: 'var(--ink)',
            }}>
              QR-Pass
            </span>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--mute)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginTop: 1,
            }}>
              Visitor Management
            </p>
          </div>
        </div>

        {/* Mobile close btn */}
        {onClose && (
          <button onClick={onClose} className="btn-ghost-sm" style={{ padding: '0 6px', width: 28, height: 28 }}>
            <FiX size={14} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Eyebrow */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--mute)',
          padding: '6px 10px',
          marginBottom: 4,
        }}>
          Operations
        </div>

        {items.map(({ to, label, icon: Icon, live, tag }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `nav-link${isActive ? ' active' : ''}`
            }
            style={{ justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={15} style={{ flexShrink: 0 }} />
              {label}
            </span>
            {live && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="status-dot" style={{ width: 5, height: 5 }} />
              </span>
            )}
            {tag && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: 4,
                background: 'var(--canvas-panel)',
                color: 'var(--mute)',
                border: '1px solid var(--hairline)',
              }}>
                {tag}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer — User card + controls */}
      <div style={{
        padding: '12px 8px',
        borderTop: '1px solid var(--hairline)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        {/* User card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 10px',
          borderRadius: 6,
          border: '1px solid var(--hairline)',
          background: 'var(--canvas-panel)',
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'var(--ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--canvas)',
            fontSize: 12,
            fontWeight: 600,
            flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Guest'}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
              {user?.role || 'user'}
            </p>
          </div>
        </div>

        {/* Controls row */}
        <div style={{ display: 'flex', gap: 6 }}>
          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ flex: 1 }}
          >
            {theme === 'dark'
              ? <FiSun size={14} />
              : <FiMoon size={14} />
            }
          </button>

          {/* Logout */}
          <button
            onClick={handleLogoutClick}
            className="btn-ghost-sm"
            style={{ flex: 1, color: 'var(--error)' }}
            title="Sign Out"
          >
            <FiLogOut size={13} />
            <span style={{ fontSize: 12 }}>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ────────────────────────────────────────── */}
      <aside className="sidebar" style={{ display: 'none' }} id="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* ── Desktop Sidebar (md+) visible via CSS ─────────────────── */}
      <style>{`
        @media (min-width: 768px) {
          #desktop-sidebar { display: flex !important; }
          #mobile-header { display: none !important; }
          #mobile-bottomnav { display: none !important; }
          .main-content { padding: 32px !important; padding-bottom: 32px !important; }
        }
        @media (max-width: 767px) {
          #desktop-sidebar { display: none !important; }
          #mobile-header { display: flex !important; }
          #mobile-bottomnav { display: flex !important; }
          .main-content { padding: 20px 16px !important; padding-bottom: 80px !important; }
        }
      `}</style>

      {/* ── Mobile Top Header ─────────────────────────────────────── */}
      <header id="mobile-header" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: 52,
        background: 'var(--canvas)',
        borderBottom: '1px solid var(--hairline)',
        backdropFilter: 'blur(12px)',
        display: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: 'linear-gradient(135deg, #007cf0, #7928ca)',
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
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
            QR-Pass
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <FiSun size={13} /> : <FiMoon size={13} />}
          </button>
          <button
            className="btn-ghost-sm"
            onClick={() => setMobileOpen(true)}
            style={{ padding: '0 8px', gap: 0 }}
          >
            <FiMenu size={15} />
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer Overlay ──────────────────────────────────── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* ── Mobile Drawer ─────────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: 260,
        zIndex: 70,
        background: 'var(--canvas)',
        borderRight: '1px solid var(--hairline)',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </div>

      {/* ── Mobile Bottom Nav ──────────────────────────────────────── */}
      <nav id="mobile-bottomnav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 0',
        background: 'var(--canvas)',
        borderTop: '1px solid var(--hairline)',
        display: 'none',
      }}>
        {items.map(({ to, label, icon: Icon, live }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '4px 12px',
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              color: isActive ? 'var(--ink)' : 'var(--mute)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            })}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={18} />
              {live && (
                <span style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: '#0070f3',
                }} />
              )}
            </div>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
