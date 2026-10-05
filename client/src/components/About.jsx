// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  About.jsx — Vercel Geist Style
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import React from 'react';
import { FiInfo, FiShield, FiCpu, FiZap, FiCheck } from 'react-icons/fi';
import { HiOutlineQrcode } from 'react-icons/hi';

const techStack = ['React 18', 'Vite', 'Node.js', 'Express', 'MongoDB', 'Tailwind 4', 'JWT Auth', 'Mongoose'];

const roles = [
  { tag: 'USER', label: 'Basic Access', desc: 'Can view and manage their own personal visits independently.', color: '#0070f3' },
  { tag: 'RECEPTIONIST', label: 'Desk Control', desc: 'Can view the live visitor log and provide Reception QR codes.', color: '#7928ca' },
  { tag: 'ADMIN', label: 'Full Access', desc: 'Complete control over users, QR generation, and system operations.', color: '#ff4d4d' },
];

const features = [
  'Contactless QR Scanning for fast Check-Ins',
  'Role-Based Access Control (RBAC)',
  'Automated Checkout via Cron Jobs (5:00 PM)',
  'Real-time Analytics and CSV Exporting',
  'JWT-secured REST API',
  'Mobile-responsive UI',
];

const About = () => {
  return (
    <div className="animate-fade-in" style={{ maxWidth: 860, margin: '0 auto', paddingBottom: 64 }}>

      {/* Page Header */}
      <div style={{ marginBottom: 40 }}>
        <p className="text-eyebrow" style={{ marginBottom: 8 }}>About</p>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 32, fontWeight: 600, letterSpacing: '-1.28px', color: 'var(--ink)', lineHeight: '40px', marginBottom: 8 }}>
          QR-Pass — Visitor Management System
        </h1>
        <p className="text-body-lg">
          An enterprise-grade digital visitor management platform designed to modernize the front-desk experience.
        </p>
        <div style={{ marginTop: 16, height: 1, background: 'var(--hairline)' }} />
      </div>

      {/* Feature grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 1, background: 'var(--hairline)', border: '1px solid var(--hairline)', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
        {/* What is QR-MS */}
        <div className="card-flat" style={{ borderRadius: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <HiOutlineQrcode style={{ fontSize: 18, color: 'var(--ink)' }} />
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 600, letterSpacing: '-0.3px', color: 'var(--ink)' }}>
              What is QR-Pass?
            </h2>
          </div>
          <p className="text-body-md" style={{ lineHeight: '22px' }}>
            QR-Pass replaces manual paper visitor logs with an automated, secure, and touchless QR-based check-in workflow — engineered for speed, security, and scalability.
          </p>
        </div>

        {/* Key features */}
        <div className="card-flat" style={{ borderRadius: 0 }}>
          <p className="text-eyebrow" style={{ marginBottom: 16 }}>Key Features</p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {features.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--body)', lineHeight: '18px' }}>
                <FiCheck style={{ color: 'var(--link)', flexShrink: 0, marginTop: 2, fontSize: 14 }} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Role-based access */}
      <div className="card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <FiShield style={{ fontSize: 16, color: 'var(--ink)' }} />
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--ink)' }}>
            Role-Based Access Control
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {roles.map(({ tag, label, desc, color }) => (
            <div key={tag} style={{
              padding: '16px',
              borderRadius: 8,
              border: '1px solid var(--hairline)',
              background: 'var(--canvas-panel)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: 4,
                  background: `${color}18`,
                  color,
                  border: `1px solid ${color}35`,
                  letterSpacing: '0.05em',
                }}>
                  {tag}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{label}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--mute)', lineHeight: '18px' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <FiCpu style={{ fontSize: 16, color: 'var(--ink)' }} />
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--ink)' }}>
            Technology Stack
          </h2>
        </div>
        <p className="text-body-md" style={{ marginBottom: 20, maxWidth: 500 }}>
          Built on the robust MERN stack with Tailwind CSS 4 — engineered for performance, security, and developer experience.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {techStack.map(t => (
            <span key={t} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid var(--hairline)',
              background: 'var(--canvas-panel)',
              color: 'var(--body)',
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      </div>
    </div>
  );
};

export default About;
