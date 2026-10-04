import React from 'react';
import { FiInfo, FiShield, FiCpu, FiCode, FiLayers } from 'react-icons/fi';
import { HiOutlineQrcode } from 'react-icons/hi';

const About = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12 pt-4 px-4 sm:px-0">
      <div className="border-b border-white/[0.06] pb-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full bg-[#0A0A0F] rounded-[10px] flex items-center justify-center">
            <FiInfo className="text-indigo-400 text-2xl" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">About QR-MS</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Learn more about the QR Management System.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core System Info */}
        <div className="bg-[#13131F]/80 backdrop-blur-xl border border-white/[0.08] p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-3 text-white font-semibold text-lg border-b border-white/[0.06] pb-3">
            <HiOutlineQrcode className="text-cyan-400 text-xl" />
            What is QR-MS?
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            QR-MS (QR Management System) is an enterprise-grade digital visitor management application designed to modernize the front-desk experience. It replaces manual paper logs with an automated, secure, and touchless QR-based check-in workflow.
          </p>
          <div className="pt-2">
            <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider mb-2">Key Highlights</h4>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                Contactless QR Scanning for fast Check-Ins
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                Automated Checkout via Cron Jobs (5:00 PM)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                Real-time Analytics and CSV Exporting
              </li>
            </ul>
          </div>
        </div>

        {/* Security & Access */}
        <div className="bg-[#13131F]/80 backdrop-blur-xl border border-white/[0.08] p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-3 text-white font-semibold text-lg border-b border-white/[0.06] pb-3">
            <FiShield className="text-orange-400 text-xl" />
            Role-Based Access
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The system employs strict RBAC (Role-Based Access Control) to ensure data privacy and security.
          </p>
          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">USER</span>
                <span className="text-sm font-semibold text-white">Basic Access</span>
              </div>
              <p className="text-xs text-zinc-500">Can view and manage their own personal visits independently.</p>
            </div>
            
            <div className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">RECEPTIONIST</span>
                <span className="text-sm font-semibold text-white">Desk Control</span>
              </div>
              <p className="text-xs text-zinc-500">Can view the live visitor log and provide Reception QR codes.</p>
            </div>

            <div className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/20">ADMIN</span>
                <span className="text-sm font-semibold text-white">Full Access</span>
              </div>
              <p className="text-xs text-zinc-500">Complete control over users, QR generation, and system operations.</p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="md:col-span-2 bg-[#13131F]/80 backdrop-blur-xl border border-white/[0.08] p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
            <FiCpu className="text-3xl text-zinc-500" />
          </div>
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <h3 className="text-lg font-semibold text-white">Powered by Modern Tech</h3>
            <p className="text-sm text-zinc-400">
              Built on the robust MERN stack (MongoDB, Express, React, Node.js) with Tailwind CSS for a premium, glassmorphic UI. Engineered for speed, security, and scalability.
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.08]">React 18</span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.08]">Node.js</span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.08]">MongoDB</span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.08]">Tailwind 4</span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.08]">JWT Auth</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center pt-8 pb-4">
        <p className="text-xs font-mono text-zinc-600">
          QR-MS Core System v1.0.0 &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default About;
