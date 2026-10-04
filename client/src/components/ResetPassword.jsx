import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiOutlineLockClosed } from 'react-icons/hi';
import { FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../api/axios.js';

export default function ResetPassword({ onLogin }) {
  const { resettoken } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      const res = await API.put(`/auth/resetpassword/${resettoken}`, { password });
      toast.success('Password reset successfully!');
      
      // Navigate to login so they can use their new password
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0F]">
      <div className="card max-w-md w-full border border-white/[0.12] p-8 shadow-2xl relative bg-[#13131F]/90 backdrop-blur-xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-orange-500 p-[1.5px] mx-auto mb-3 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0A0A0F] rounded-[14px] flex items-center justify-center">
              <FiShield className="text-cyan-400 text-xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create New Password</h1>
          <p className="text-xs text-zinc-400 mt-2">
            Enter your new password below. Make sure it is at least 6 characters long.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5" htmlFor="password">
              New Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-lg" />
              <input
                type="password"
                id="password"
                className="input-field !pl-10 text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-lg" />
              <input
                type="password"
                id="confirmPassword"
                className="input-field !pl-10 text-sm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full !py-3 text-sm shadow-xl shadow-orange-500/25 justify-center mt-2"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/[0.06] text-center text-xs text-zinc-400">
          <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
