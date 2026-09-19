// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Login.jsx — Authentication Page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../api/axios.js';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0F]">
      <div className="card max-w-md w-full border border-white/[0.12] p-8 shadow-2xl relative bg-[#13131F]/90 backdrop-blur-xl animate-fade-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-orange-500 p-[1.5px] mx-auto mb-3 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0A0A0F] rounded-[14px] flex items-center justify-center">
              <FiShield className="text-cyan-400 text-xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">QR-Pass</h1>
          <p className="text-xs text-zinc-400 mt-1">QR-Based Management System — Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5" htmlFor="login-email">
              Email Address
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-lg" />
              <input
                type="email"
                id="login-email"
                name="email"
                className="input-field !pl-10 text-sm"
                placeholder="admin@vault.io"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5" htmlFor="login-password">
              Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-lg" />
              <input
                type="password"
                id="login-password"
                name="password"
                className="input-field !pl-10 text-sm"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full !py-3 text-sm shadow-xl shadow-orange-500/25 justify-center mt-2"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/[0.06] text-center text-xs text-zinc-400">
          Don't have an admin account?{' '}
          <Link to="/signup" className="text-cyan-400 font-semibold hover:underline">
            Register new account
          </Link>
        </div>
      </div>
    </div>
  );
}
