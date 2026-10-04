import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  FiCamera,
  FiRotateCcw,
  FiLogOut,
  FiMail
} from 'react-icons/fi';

// ── Validation Regex (same as backend) ────────────────────
const PHONE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const CheckIn = () => {
  const { qrId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    purpose: '',
    hostName: ''
  });
  const [loading, setLoading] = useState(false);
  const [visitorPass, setVisitorPass] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  // ── Face Capture State ──────────────────────────────────
  const [faceImage, setFaceImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // ── Phone validation errors ─────────────────────────────
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const purposes = ['Business Meeting', 'Job Interview', 'Package Delivery', 'Client Presentation', 'Personal Visit'];

  // ── Phone input handler — digits only ───────────────────
  const handlePhoneChange = (value) => {
    // Strip all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Cap at 10 digits
    const capped = digitsOnly.slice(0, 10);
    
    setFormData(prev => ({ ...prev, phone: capped }));

    if (capped.length > 0 && capped.length !== 10) {
      setPhoneError(`${capped.length}/10 digits entered`);
    } else {
      setPhoneError('');
    }
  };

  // ── Email input handler ─────────────────────────────────
  const handleEmailChange = (value) => {
    setFormData(prev => ({ ...prev, email: value }));
    
    if (value.trim() !== '' && !EMAIL_REGEX.test(value.trim())) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // ── Camera: Start ───────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      console.error('Camera access denied:', err);
      toast.error('Camera access denied. Please allow camera permissions to capture your face.');
    }
  }, []);

  // ── Attach stream to video when active ──────────────────
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  // ── Camera: Capture snapshot ────────────────────────────
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = 320;
    canvas.height = 320;

    // Draw mirrored (selfie mode)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    // Center-crop to square
    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    
    ctx.drawImage(video, sx, sy, size, size, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    setFaceImage(dataUrl);

    // Stop camera stream
    stopCamera();
    toast.success('Face photo captured!');
  }, []);

  // ── Camera: Stop ────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // ── Retake photo ────────────────────────────────────────
  const retakePhoto = useCallback(() => {
    setFaceImage(null);
    startCamera();
  }, [startCamera]);

  // ── Form Submission ─────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side phone validation
    if (!PHONE_REGEX.test(formData.phone)) {
      toast.error('Phone number must be exactly 10 numeric digits');
      return;
    }

    // Client-side email validation (optional field)
    if (formData.email.trim() !== '' && !EMAIL_REGEX.test(formData.email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/visitors/checkin', {
        ...formData,
        email: formData.email.trim(),
        receptionQrId: qrId || 'general-reception',
        faceImage: faceImage || ''
      });
      toast.success('Check-in confirmed!');
      setVisitorPass({
        ...res.data.data,
        passNumber: `VP-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      // Clean up camera if still active
      stopCamera();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed. Please verify with reception.');
    } finally {
      setLoading(false);
    }
  };

  // ── Self-Checkout Handler ───────────────────────────────
  const handleSelfCheckout = async () => {
    if (!visitorPass?._id) return;

    setCheckingOut(true);
    try {
      await API.put(`/visitors/checkout-self/${visitorPass._id}`);
      toast.success('You have been successfully checked out!');
      setCheckedOut(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed. Please contact reception.');
    } finally {
      setCheckingOut(false);
    }
  };

  // ── Success State — Digital Visitor Pass ────────────────
  if (visitorPass) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0F] text-center animate-fade-in">
        <div className="card max-w-md w-full border border-white/[0.12] p-8 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#181826] to-[#0E0E18]">
          {/* Ambient glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Face Photo or Check Icon */}
          {visitorPass.faceImage ? (
            <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/20">
              <img src={visitorPass.faceImage} alt="Face ID" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <FiCheckCircle />
            </div>
          )}

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-2">
            <span>DIGITAL VISITOR PASS</span>
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {checkedOut ? "You're Checked Out!" : "You're Checked In!"}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 mb-6">
            {checkedOut 
              ? 'Thank you for visiting! Have a great day.' 
              : 'Please proceed to the lobby. Your host has been notified of your arrival.'}
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
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="text-zinc-500">CHECK-IN TIME</span>
              <span className="text-emerald-400">{visitorPass.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">STATUS</span>
              <span className={checkedOut ? 'text-orange-400' : 'text-emerald-400'}>
                {checkedOut ? '✓ Checked Out' : '● Active'}
              </span>
            </div>
          </div>

          {/* Self-Checkout Button (only visible if not already checked out) */}
          {!checkedOut && (
            <button
              onClick={handleSelfCheckout}
              disabled={checkingOut}
              className="w-full mb-3 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-red-500/15 to-orange-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:border-red-500/50 hover:text-red-300"
            >
              {checkingOut ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-red-300/30 border-t-red-300 rounded-full animate-spin"></span>
                  <span>Checking Out...</span>
                </span>
              ) : (
                <>
                  <FiLogOut />
                  <span>Check Out — I'm Leaving</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => {
              setVisitorPass(null);
              setCheckedOut(false);
              setFaceImage(null);
              setFormData({ name: '', phone: '', email: '', purpose: '', hostName: '' });
            }}
            className="btn-secondary w-full text-xs font-semibold"
          >
            Check In Another Guest
          </button>
        </div>
      </div>
    );
  }

  // ── Registration Form ───────────────────────────────────
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
          {/* ── Face Capture Section ──────────────────────── */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5">
                <FiCamera className="text-cyan-400" />
                Face Photo (Identity Scan) *
              </span>
            </label>

            {!faceImage && !cameraActive && (
              <button
                type="button"
                onClick={startCamera}
                className="w-full py-6 rounded-xl border-2 border-dashed border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <FiCamera className="text-xl" />
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-cyan-400 transition-colors font-medium">
                  Tap to open camera & capture face
                </span>
              </button>
            )}

            {/* Live Camera View */}
            {cameraActive && (
              <div className="space-y-3">
                <div className="relative w-full max-w-[280px] mx-auto aspect-square rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/10">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  {/* Face guide overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-40 h-48 rounded-[50%] border-2 border-white/30 border-dashed"></div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/60 font-mono">
                    Align your face within the guide
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="btn-primary !py-2.5 !px-6 text-xs shadow-lg shadow-orange-500/20"
                  >
                    <FiCamera /> Capture
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="btn-secondary !py-2.5 !px-4 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Captured Photo Preview */}
            {faceImage && (
              <div className="space-y-2">
                <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/10">
                  <img src={faceImage} alt="Face captured" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/90 py-0.5 text-center text-[9px] text-white font-bold uppercase">
                    ✓ Captured
                  </div>
                </div>
                <button
                  type="button"
                  onClick={retakePhoto}
                  className="flex items-center gap-1.5 mx-auto text-xs text-zinc-400 hover:text-cyan-400 transition-colors"
                >
                  <FiRotateCcw className="text-[10px]" /> Retake Photo
                </button>
              </div>
            )}

            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

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

          {/* Phone Number — 10 digits only */}
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
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="e.g. 9876543210"
                maxLength={10}
                inputMode="numeric"
                pattern="\d{10}"
                className={`input-field !pl-10 text-sm font-mono ${
                  phoneError ? '!border-red-500/50 focus:!border-red-500' : ''
                }`}
              />
            </div>
            {phoneError && (
              <p className="text-[11px] text-orange-400 mt-1 font-mono">{phoneError}</p>
            )}
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Email Address (Optional)
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="e.g. visitor@example.com"
                className={`input-field !pl-10 text-sm ${
                  emailError ? '!border-red-500/50 focus:!border-red-500' : ''
                }`}
              />
            </div>
            {emailError && (
              <p className="text-[11px] text-red-400 mt-1">{emailError}</p>
            )}
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
              disabled={loading || !faceImage}
              className={`w-full !py-3 text-sm shadow-xl justify-center rounded-xl font-semibold flex items-center gap-2 transition-all ${
                !faceImage 
                  ? 'bg-zinc-700/50 text-zinc-400 border border-white/[0.06] cursor-not-allowed' 
                  : 'btn-primary shadow-orange-500/25'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Registering Check-In...</span>
                </span>
              ) : !faceImage ? (
                <span className="flex items-center gap-2">
                  <FiCamera />
                  <span>Capture Face Photo First</span>
                </span>
              ) : (
                <span>Complete Visitor Registration</span>
              )}
            </button>
            {!faceImage && (
              <p className="text-[10px] text-zinc-500 text-center mt-1.5 font-mono">
                Face photo is required for security identification
              </p>
            )}
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
