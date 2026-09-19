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
  FiShield,
  FiSmartphone
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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Reception Desk QR Code
          </h1>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
            FRONT-DESK
          </span>
        </div>
        <p className="text-sm text-zinc-400">
          Place this dynamic QR code at your building entrance or lobby desk for contactless visitor check-ins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Desk Configuration & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card space-y-5 border border-white/[0.08]">
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <FiMapPin />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Desk Settings</h3>
                <p className="text-xs text-zinc-400">Customize the reception checkpoint</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Location / Station Label
              </label>
              <input
                type="text"
                value={deskName}
                onChange={(e) => setDeskName(e.target.value)}
                placeholder="e.g. Main Lobby Desk"
                className="input-field text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Station Code ID
                </label>
                <button
                  onClick={generateNewId}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <FiRefreshCw className="text-[10px]" />
                  <span>Regenerate ID</span>
                </button>
              </div>
              <input
                type="text"
                value={qrId}
                onChange={(e) => setQrId(e.target.value)}
                className="input-field text-sm font-mono"
              />
            </div>

            {/* Direct Link Box */}
            <div className="p-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl space-y-2">
              <span className="text-[11px] font-mono text-zinc-400 block">
                Direct Scan / Public Form URL:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={checkInUrl}
                  className="input-field !py-1.5 !px-2.5 text-xs font-mono !bg-black/40 text-cyan-300 select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="btn-secondary !p-2 shrink-0"
                  title="Copy link"
                >
                  {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                </button>
                <a
                  href={checkInUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary !p-2 shrink-0 text-cyan-400"
                  title="Open test check-in"
                >
                  <FiExternalLink />
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadPNG}
                className="btn-primary flex-1 shadow-lg shadow-orange-500/20"
              >
                <FiDownload />
                <span>Download HD PNG</span>
              </button>

              <button
                onClick={handlePrint}
                className="btn-secondary flex-1"
              >
                <FiPrinter />
                <span>Print Stand Sign</span>
              </button>
            </div>
          </div>

          {/* Tips Card */}
          <div className="p-4 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/20 flex gap-3">
            <FiShield className="text-cyan-400 text-lg shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-300 space-y-1 leading-relaxed">
              <p className="font-semibold text-cyan-300">How it works for visitors:</p>
              <p className="text-zinc-400">
                Visitors scan this QR code with their default smartphone camera (no app download needed). 
                Once registered, their check-in appears live in your dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Stand Sign Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-md bg-gradient-to-b from-[#1E1E2F] to-[#12121E] border border-white/[0.12] rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Stand Header */}
            <div className="relative z-10 space-y-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs font-semibold text-cyan-400 font-mono">
                <FiShield />
                <span>QR-Pass • QR Access System</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Scan to Check In
              </h2>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Welcome to <span className="text-white font-medium">{deskName}</span>. Please register your visit below.
              </p>
            </div>

            {/* The QR Box */}
            <div className="relative z-10 p-5 bg-white rounded-2xl shadow-xl mx-auto w-fit border-4 border-cyan-400/20">
              <QRCodeSVG
                id="reception-qr-svg"
                value={checkInUrl}
                size={240}
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Steps Instruction Pill */}
            <div className="relative z-10 mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-center gap-6 text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">1</span>
                <span>Scan QR</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">2</span>
                <span>Enter Info</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">3</span>
                <span>Pass Issued</span>
              </div>
            </div>

            {/* Bottom Station ID Tag */}
            <div className="mt-4 pt-3 border-t border-white/[0.04] text-[10px] font-mono text-zinc-500">
              Station ID: {qrId} • Contactless Digital Reception
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQR;
