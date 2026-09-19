import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiUsers, FiGrid, FiLogOut } from 'react-icons/fi';
import { HiOutlineQrcode } from 'react-icons/hi';

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <>
      {/* ── Desktop Sidebar (hidden on mobile, visible md+) ──────────── */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-[#10101A]/90 backdrop-blur-xl border-r border-white/[0.08] justify-between select-none z-20 shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-orange-500 p-[1.5px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#0A0A0F] rounded-[10px] flex items-center justify-center">
                  <HiOutlineQrcode className="text-cyan-400 text-xl" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-white tracking-tight font-sans">QR-Pass</span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    QR-MS
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-500 tracking-wider uppercase">Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-6 space-y-1.5">
            <div className="px-3 pb-2">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                Operations
              </span>
            </div>

            <NavLink
              to="/dashboard"
              className={({ isActive }) => `
                flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group
                ${isActive 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-sm shadow-cyan-500/10' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'}
              `}
            >
              <div className="flex items-center gap-3">
                <FiUsers className="text-lg transition-transform group-hover:scale-110" />
                <span>Visitor Log</span>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </NavLink>

            <NavLink
              to="/create"
              className={({ isActive }) => `
                flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group
                ${isActive 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-sm shadow-cyan-500/10' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'}
              `}
            >
              <div className="flex items-center gap-3">
                <FiGrid className="text-lg transition-transform group-hover:scale-110" />
                <span>Reception QR</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.06] text-zinc-400">Desk</span>
            </NavLink>
          </div>

          {/* Quick System Badge */}
          <div className="px-4 py-2 mx-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Desk Station</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0E0E18]/60 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center font-bold text-white shadow-md shadow-orange-500/20 text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate leading-tight">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-zinc-400 truncate font-mono">{user?.email || 'admin@vault.io'}</p>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all duration-200"
          >
            <FiLogOut className="text-sm" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Header (visible on mobile only) ───────────────── */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#10101A]/95 backdrop-blur-xl border-b border-white/[0.08] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-orange-500 p-[1.5px]">
            <div className="w-full h-full bg-[#0A0A0F] rounded-[7px] flex items-center justify-center">
              <HiOutlineQrcode className="text-cyan-400 text-base" />
            </div>
          </div>
          <span className="text-base font-bold text-white tracking-tight">QR-Pass</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <button
            onClick={handleLogoutClick}
            className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-white/[0.06]"
            title="Sign Out"
          >
            <FiLogOut size={16} />
          </button>
        </div>
      </header>

      {/* ── Mobile Floating Bottom Navigation (visible on mobile only) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#10101A]/95 backdrop-blur-2xl border-t border-white/[0.1] px-6 py-2 flex items-center justify-around shadow-2xl">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `
            flex flex-col items-center gap-1 py-1 px-4 rounded-xl text-xs font-semibold transition-all
            ${isActive 
              ? 'text-cyan-400 scale-105' 
              : 'text-zinc-400 hover:text-white'}
          `}
        >
          <div className="relative">
            <FiUsers size={20} />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>
          <span>Visitor Log</span>
        </NavLink>

        <NavLink
          to="/create"
          className={({ isActive }) => `
            flex flex-col items-center gap-1 py-1 px-4 rounded-xl text-xs font-semibold transition-all
            ${isActive 
              ? 'text-cyan-400 scale-105' 
              : 'text-zinc-400 hover:text-white'}
          `}
        >
          <FiGrid size={20} />
          <span>Reception QR</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Sidebar;
