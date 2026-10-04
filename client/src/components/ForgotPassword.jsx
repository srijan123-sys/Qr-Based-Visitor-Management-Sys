import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import { FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../api/axios.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/auth/forgotpassword', { email });
      
      if (res.data.previewUrl) {
        toast.success(
          <div>
            Email "sent"! <br />
            <a href={res.data.previewUrl} target="_blank" rel="noreferrer" className="underline text-blue-300 font-bold">
              Click here to view the Email
            </a>
          </div>,
          { duration: 8000 }
        );
        // Automatically open the fake email in a new tab
        window.open(res.data.previewUrl, '_blank');
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0F]">
      <div className="card max-w-md w-full border border-white/[0.12] p-8 shadow-2xl relative bg-[#13131F]/90 backdrop-blur-xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-orange-500 p-[1.5px] mx-auto mb-3 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0A0A0F] rounded-[14px] flex items-center justify-center">
              <FiShield className="text-cyan-400 text-xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reset Password</h1>
          <p className="text-xs text-zinc-400 mt-2">
            Enter your email address and we will send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-lg" />
              <input
                type="email"
                id="email"
                className="input-field !pl-10 text-sm"
                placeholder="admin@vault.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full !py-3 text-sm shadow-xl shadow-orange-500/25 justify-center mt-2"
            disabled={loading}
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/[0.06] text-center text-xs text-zinc-400">
          Remembered your password?{' '}
          <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
