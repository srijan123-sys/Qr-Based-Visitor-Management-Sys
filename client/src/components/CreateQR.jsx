// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CreateQR.jsx — Vercel Geist Style
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-hot-toast';
import { 
  FiDownload, 
  FiPrinter, 
  FiCopy, 
  FiCheck, 
  FiExternalLink, 
  FiRefreshCw, 
  FiMapPin, 
  FiShield
} from 'react-icons/fi';

const CreateQR = () => {
  const [deskName, setDeskName] = useState('Main Reception Desk');
  const [qrId, setQrId] = useState('reception-desk-1');
  const [copied, setCopied] = useState(false);

  const generateNewId = () => {
    const randomHex = Math.random().toString(36).substring(2, 10);
    setQrId(`desk-${randomHex}`);
    toast.success('Generated new Reception QR code ID');
  };

  // URL visitor scans
  const checkInUrl = `${window.location.origin}/checkin/${qrId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(checkInUrl);
    setCopied(true);
    toast.success('Check-in link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    const svg = document.getElementById('reception-qr-svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 1024x1024 high resolution
      canvas.width = 1024;
      canvas.height = 1024;

      // Clean background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR centered
      ctx.drawImage(img, 64, 64, 896, 896);

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-Desk-${deskName.replace(/\s+/g, '-').toLowerCase()}-${qrId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success('HD QR Code downloaded');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1024, margin: '0 auto', paddingBottom: 64 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32, borderBottom: '1px solid var(--hairline)', paddingBottom: 24 }}>
        <p className="text-eyebrow" style={{ marginBottom: 8 }}>Setup</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 28, fontWeight: 600, letterSpacing: '-1px', color: 'var(--ink)', lineHeight: '36px' }}>
            Reception Desk QR Code
          </h1>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--canvas-panel)', border: '1px solid var(--hairline)', color: 'var(--ink)', fontWeight: 600 }}>
            FRONT-DESK
          </span>
        </div>
        <p className="text-body-md">
          Place this dynamic QR code at your building entrance or lobby desk for contactless visitor check-ins.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Left Column: Desk Configuration & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--hairline)', marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--canvas)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' }}>
                <FiMapPin />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.3px' }}>Desk Settings</h3>
                <p style={{ fontSize: 12, color: 'var(--mute)' }}>Customize the reception checkpoint</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 6 }}>
                  Location / Station Label
                </label>
                <input
                  type="text"
                  value={deskName}
                  onChange={(e) => setDeskName(e.target.value)}
                  placeholder="e.g. Main Lobby Desk"
                  className="input-field"
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)' }}>
                    Station Code ID
                  </label>
                  <button onClick={generateNewId} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--link)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <FiRefreshCw size={10} /> Regenerate ID
                  </button>
                </div>
                <input
                  type="text"
                  value={qrId}
                  onChange={(e) => setQrId(e.target.value)}
                  className="input-field"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>

              {/* Direct Link Box */}
              <div style={{ padding: 12, background: 'var(--canvas-panel)', border: '1px solid var(--hairline)', borderRadius: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Direct Scan / Public Form URL:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="text"
                    readOnly
                    value={checkInUrl}
                    className="input-field"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 11, height: 32, padding: '0 8px', color: 'var(--ink)' }}
                  />
                  <button onClick={handleCopyLink} className="btn-secondary" style={{ width: 32, height: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} title="Copy link">
                    {copied ? <FiCheck color="var(--link)" /> : <FiCopy />}
                  </button>
                  <a href={checkInUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ width: 32, height: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }} title="Open test check-in">
                    <FiExternalLink />
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button onClick={handleDownloadPNG} className="btn-primary" style={{ flex: 1, justifyContent: 'center', height: 36, fontSize: 13 }}>
                  <FiDownload /> Download HD PNG
                </button>
                <button onClick={handlePrint} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', height: 36, fontSize: 13 }}>
                  <FiPrinter /> Print Stand Sign
                </button>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--hairline)', background: 'var(--canvas-panel)', display: 'flex', gap: 12 }}>
            <FiShield style={{ color: 'var(--ink)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>How it works for visitors:</p>
              <p style={{ fontSize: 13, color: 'var(--mute)', lineHeight: '20px' }}>
                Visitors scan this QR code with their default smartphone camera (no app download needed). 
                Once registered, their check-in appears live in your dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Stand Sign Preview */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ 
            width: '100%', 
            maxWidth: 420, 
            background: 'var(--canvas)', 
            border: '1px solid var(--hairline)', 
            borderRadius: 16, 
            padding: 32, 
            textAlign: 'center',
            boxShadow: 'var(--shadow-float)'
          }}>
            {/* Stand Header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 100, background: 'var(--canvas-panel)', border: '1px solid var(--hairline)', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--ink)', marginBottom: 16 }}>
                <FiShield size={12} /> QR-Pass • QR Access System
              </div>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.8px', marginBottom: 8 }}>
                Scan to Check In
              </h2>
              <p style={{ fontSize: 13, color: 'var(--mute)', lineHeight: '18px' }}>
                Welcome to <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{deskName}</span>.<br/>Please register your visit below.
              </p>
            </div>

            {/* The QR Box */}
            <div style={{ 
              background: '#fff', 
              padding: 20, 
              borderRadius: 12, 
              display: 'inline-block',
              border: '1px solid var(--hairline)',
              marginBottom: 24
            }}>
              <QRCodeSVG
                id="reception-qr-svg"
                value={checkInUrl}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Steps Instruction Pill */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 16, 
              fontFamily: 'var(--font-mono)', 
              fontSize: 10, 
              color: 'var(--mute)',
              paddingTop: 24,
              borderTop: '1px solid var(--hairline)',
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--ink)', color: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>1</span>
                <span>Scan QR</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--ink)', color: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>2</span>
                <span>Enter Info</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--ink)', color: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>3</span>
                <span>Pass Issued</span>
              </div>
            </div>

            {/* Bottom Station ID Tag */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', paddingTop: 16, borderTop: '1px solid var(--hairline)' }}>
              Station ID: {qrId} • Digital Reception
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQR;
