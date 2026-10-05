// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Sidebar.jsx — Vercel Geist Navigation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiUsers, FiGrid, FiLogOut, FiShield, FiInfo, FiSun, FiMoon, FiMenu, FiX, FiSettings, FiChevronUp } from 'react-icons/fi';
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const desktopContains = desktopMenuRef.current && desktopMenuRef.current.contains(e.target);
      const mobileContains = mobileMenuRef.current && mobileMenuRef.current.contains(e.target);
      
      if (!desktopContains && !mobileContains) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const items = navItems(user);

  const renderContent = (isMobile, onClose) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Brand */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid var(--hairline)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #007cf0, #7928ca, #ff0080)',
            padding: '1.5px', flexShrink: 0,
          }}>
            <div style={{ width: '100%', height: '100%', background: 'var(--canvas)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HiOutlineQrcode style={{ color: 'var(--ink)', fontSize: 16 }} />
            </div>
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, letterSpacing: '-0.3px', color: 'var(--ink)' }}>QR-Pass</span>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 1 }}>Visitor Management</p>
          </div>
        </div>
        {isMobile && onClose && (
          <button onClick={onClose} className="btn-ghost-sm" style={{ padding: '0 6px', width: 28, height: 28 }}>
            <FiX size={14} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {!isMobile && (
          <>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--mute)', padding: '6px 10px', marginBottom: 4 }}>
              Operations
            </div>
            {items.map(({ to, label, icon: Icon, live, tag }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                style={{ justifyContent: 'space-between' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  {label}
                </span>
                {live && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#0070f3' }} className="pulse" />
                  </span>
                )}
                {tag && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'var(--canvas-panel)', color: 'var(--mute)', border: '1px solid var(--hairline)' }}>
                    {tag}
                  </span>
                )}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Footer User Profile Menu */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--hairline)', position: 'relative' }} ref={isMobile ? mobileMenuRef : desktopMenuRef}>
        
        {/* Popover Menu */}
        {userMenuOpen && (
          <div className="animate-fade-in" style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 8,
            right: 8,
            background: 'var(--canvas-elevated)',
            border: '1px solid var(--hairline)',
            borderRadius: 8,
            boxShadow: 'var(--shadow-float)',
            overflow: 'hidden',
            zIndex: 100,
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hairline)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{user?.name}</p>
              <p style={{ fontSize: 12, color: 'var(--mute)' }}>{user?.email || 'Receptionist'}</p>
            </div>
            <div style={{ padding: 4 }}>
              <button 
                onClick={() => { navigate('/settings'); setUserMenuOpen(false); if (isMobile) onClose(); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--ink)', fontSize: 13, cursor: 'pointer', textAlign: 'left', borderRadius: 4 }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--canvas-panel)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FiSettings size={14} />
                User Settings
              </button>
              <button 
                onClick={() => { toggleTheme(); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--ink)', fontSize: 13, cursor: 'pointer', textAlign: 'left', borderRadius: 4 }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--canvas-panel)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {theme === 'dark' ? <FiSun size={14} /> : <FiMoon size={14} />}
                Theme: {theme === 'dark' ? 'Dark' : 'Light'}
              </button>
              <button 
                onClick={handleLogoutClick}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--error)', fontSize: 13, cursor: 'pointer', textAlign: 'left', borderRadius: 4 }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.1)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FiLogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* User Card Trigger */}
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid var(--hairline)',
            background: userMenuOpen ? 'var(--canvas-panel)' : 'transparent',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => !userMenuOpen && (e.currentTarget.style.backgroundColor = 'var(--canvas-panel)')}
          onMouseOut={e => !userMenuOpen && (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--canvas)', fontSize: 12, fontWeight: 600, flexShrink: 0,
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={{ minWidth: 0, textAlign: 'left' }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Guest'}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase' }}>
                {user?.role || 'user'}
              </p>
            </div>
          </div>
          <FiChevronUp size={14} style={{ color: 'var(--mute)', transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sidebar" style={{ display: 'none' }} id="desktop-sidebar">
        {renderContent(false)}
      </aside>

      <header id="mobile-header" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 52,
        background: 'var(--canvas)', borderBottom: '1px solid var(--hairline)', backdropFilter: 'blur(12px)',
        display: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn-ghost-sm" onClick={() => setMobileOpen(true)} style={{ padding: '0 8px', marginLeft: -8, marginRight: 4 }}>
            <FiMenu size={18} />
          </button>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #007cf0, #7928ca)', padding: '1.5px' }}>
            <div style={{ width: '100%', height: '100%', background: 'var(--canvas)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HiOutlineQrcode style={{ color: 'var(--ink)', fontSize: 14 }} />
            </div>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.3px' }}>QR-Pass</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Right side placeholder */}
        </div>
      </header>

      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
      )}

      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 260, zIndex: 70,
        background: 'var(--canvas)', borderRight: '1px solid var(--hairline)',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {renderContent(true, () => setMobileOpen(false))}
      </div>
      
      <nav id="mobile-bottomnav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: 'var(--canvas)', borderTop: '1px solid var(--hairline)', display: 'none',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '8px 0' }}>
          {items.map(({ to, label, icon: Icon, live }) => (
            <NavLink
              key={to} to={to}
              style={({ isActive }) => ({
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 12px',
                borderRadius: 6, fontSize: 10, fontWeight: 500, fontFamily: 'var(--font-sans)',
                color: isActive ? 'var(--ink)' : 'var(--mute)', textDecoration: 'none',
              })}
            >
              <div style={{ position: 'relative' }}>
                <Icon size={18} />
                {live && <span style={{ position: 'absolute', top: -2, right: -2, width: 5, height: 5, borderRadius: '50%', background: '#0070f3' }} />}
              </div>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
        <div style={{ textAlign: 'center', paddingBottom: '6px', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--mute)' }}>
          QR-Pass Core v1.0.0 &copy; {new Date().getFullYear()} — All rights reserved.
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
