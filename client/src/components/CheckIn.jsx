import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios.js';
import { toast } from 'react-hot-toast';
import { 
  FiUser, 
  FiPhone, 
  FiBriefcase, 
  FiCheckCircle, 
  FiShield, 
  FiClock, 
  FiMapPin 
} from 'react-icons/fi';

const CheckIn = () => {
  const { qrId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    purpose: '',
    hostName: ''
  });
  const [loading, setLoading] = useState(false);
  const [visitorPass, setVisitorPass] = useState(null);

  const purposes = ['Business Meeting', 'Job Interview', 'Package Delivery', 'Client Presentation', 'Personal Visit'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/visitors/checkin', {
        ...formData,
        receptionQrId: qrId || 'general-reception'
      });
      toast.success('Check-in confirmed!');
      setVisitorPass({
        ...res.data.data,
        passNumber: `VP-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed. Please verify with reception.');
    } finally {
      setLoading(false);
    }
  };

  // Success State — Digital Visitor Pass
  if (visitorPass) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0F] text-center animate-fade-in">
        <div className="card max-w-md w-full border border-white/[0.12] p-8 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#181826] to-[#0E0E18]">
          {/* Ambient glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <FiCheckCircle />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-2">
            <span>DIGITAL VISITOR PASS</span>
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            You're Checked In!
          </h2>
          <p className="text-xs text-zinc-400 mt-1 mb-6">
            Please proceed to the lobby. Your host has been notified of your arrival.
          </p>

          {/* Pass Details Box */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-left space-y-3 font-mono text-xs mb-6">
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="text-zinc-500">PASS NO.</span>
              <span className="text-cyan-400 font-bold">{visitorPass.passNumber}</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="text-zinc-500">VISITOR</span>
              <span className="text-white font-bold">{visitorPass.name}</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="text-zinc-500">HOST</span>
              <span className="text-zinc-200">@{visitorPass.hostName}</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="text-zinc-500">PURPOSE</span>
              <span className="text-zinc-200">{visitorPass.purpose}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">CHECK-IN TIME</span>
              <span className="text-emerald-400">{visitorPass.timestamp}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setVisitorPass(null);
              setFormData({ name: '', phone: '', purpose: '', hostName: '' });
            }}
            className="btn-secondary w-full text-xs font-semibold"
          >
            Check In Another Guest
          </button>
        </div>
      </div>
    );
  }

  // Registration Form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#0A0A0F]">
      <div className="card max-w-lg w-full border border-white/[0.12] p-6 sm:p-8 shadow-2xl relative bg-[#13131F]/90 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <FiShield />
            <span>QR-Pass • Access Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Visitor Check-In
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Please register your arrival below to receive access clearance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Doe"
                className="input-field !pl-10 text-sm"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Phone Number *
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +1 (555) 000-0000"
                className="input-field !pl-10 text-sm"
              />
            </div>
          </div>

          {/* Host to Meet */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Whom are you visiting? (Host Name) *
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                required
                value={formData.hostName}
                onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                placeholder="e.g. Jane Smith / Engineering Dept"
                className="input-field !pl-10 text-sm"
              />
            </div>
          </div>

          {/* Purpose with quick chips */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Purpose of Visit *
            </label>
            <div className="relative mb-2">
              <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                required
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="Select below or type purpose..."
                className="input-field !pl-10 text-sm"
              />
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5">
              {purposes.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setFormData({ ...formData, purpose: p })}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    formData.purpose === p
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 text-sm shadow-xl shadow-orange-500/25 justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Registering Check-In...</span>
                </span>
              ) : (
                <span>Complete Visitor Registration</span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-white/[0.06] text-center text-[11px] font-mono text-zinc-500">
          Reception Station: <span className="text-zinc-400">{qrId || 'Lobby Desk'}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
