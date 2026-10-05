// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CheckIn.jsx — Vercel Geist Style
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
  FiCamera,
  FiRotateCcw,
  FiLogOut,
  FiMail
} from 'react-icons/fi';

const PHONE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const CheckIn = () => {
  const { qrId } = useParams();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', purpose: '', hostName: '' });
  const [loading, setLoading] = useState(false);
  const [visitorPass, setVisitorPass] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const [faceImage, setFaceImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const purposes = ['Business Meeting', 'Job Interview', 'Package Delivery', 'Client Presentation', 'Personal Visit'];

  const handlePhoneChange = (value) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: digitsOnly }));
    if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
      setPhoneError(`${digitsOnly.length}/10 digits entered`);
    } else {
      setPhoneError('');
    }
  };

  const handleEmailChange = (value) => {
    setFormData(prev => ({ ...prev, email: value }));
    if (value.trim() !== '' && !EMAIL_REGEX.test(value.trim())) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      toast.error('Camera access denied. Please allow camera permissions.');
    }
  }, []);

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 320;
    canvas.height = 320;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, canvas.width, canvas.height);
    setFaceImage(canvas.toDataURL('image/jpeg', 0.7));
    stopCamera();
    toast.success('Face photo captured!');
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const retakePhoto = useCallback(() => {
    setFaceImage(null);
    startCamera();
  }, [startCamera]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!PHONE_REGEX.test(formData.phone)) return toast.error('Phone number must be exactly 10 numeric digits');
    if (formData.email.trim() !== '' && !EMAIL_REGEX.test(formData.email.trim())) return toast.error('Valid email required');
    setLoading(true);
    try {
      const res = await API.post('/visitors/checkin', {
        ...formData, email: formData.email.trim(), receptionQrId: qrId || 'general-reception', faceImage: faceImage || ''
      });
      toast.success('Check-in confirmed!');
      setVisitorPass({ ...res.data.data, passNumber: `VP-${Math.floor(1000 + Math.random() * 9000)}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      stopCamera();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelfCheckout = async () => {
    if (!visitorPass?._id) return;
    setCheckingOut(true);
    try {
      await API.put(`/visitors/checkout-self/${visitorPass._id}`);
      toast.success('Successfully checked out!');
      setCheckedOut(true);
    } catch (error) {
      toast.error('Checkout failed.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (visitorPass) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card animate-fade-in" style={{ width: '100%', maxWidth: 400, textAlign: 'center', padding: 32 }}>
          {visitorPass.faceImage ? (
            <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', border: '1px solid var(--hairline)' }}>
              <img src={visitorPass.faceImage} alt="Face ID" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--canvas-panel)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <FiCheckCircle size={24} color="var(--ink)" />
            </div>
          )}
          <span className="text-eyebrow" style={{ display: 'block', marginBottom: 12 }}>DIGITAL VISITOR PASS</span>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>
            {checkedOut ? "You're Checked Out!" : "You're Checked In!"}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--mute)', marginBottom: 24 }}>
            {checkedOut ? 'Thank you for visiting! Have a great day.' : 'Please proceed to the lobby. Your host has been notified.'}
          </p>
          <div style={{ padding: 16, background: 'var(--canvas-panel)', borderRadius: 8, border: '1px solid var(--hairline)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--hairline)', paddingBottom: 8 }}>
              <span className="text-eyebrow">PASS NO.</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--ink)' }}>{visitorPass.passNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--hairline)', paddingBottom: 8 }}>
              <span className="text-eyebrow">VISITOR</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{visitorPass.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--hairline)', paddingBottom: 8 }}>
              <span className="text-eyebrow">HOST</span>
              <span style={{ fontSize: 13, color: 'var(--mute)' }}>@{visitorPass.hostName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--hairline)', paddingBottom: 8 }}>
              <span className="text-eyebrow">PURPOSE</span>
              <span style={{ fontSize: 13, color: 'var(--mute)' }}>{visitorPass.purpose}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--hairline)', paddingBottom: 8 }}>
              <span className="text-eyebrow">CHECK-IN TIME</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink)' }}>{visitorPass.timestamp}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-eyebrow">STATUS</span>
              {checkedOut ? <span className="badge badge-zinc">Checked Out</span> : <span className="badge badge-blue">Active</span>}
            </div>
          </div>
          {!checkedOut && (
            <button onClick={handleSelfCheckout} disabled={checkingOut} className="btn-danger" style={{ width: '100%', justifyContent: 'center', height: 40, marginBottom: 12 }}>
              {checkingOut ? 'Checking Out...' : <><FiLogOut /> Check Out — I'm Leaving</>}
            </button>
          )}
          <button onClick={() => { setVisitorPass(null); setCheckedOut(false); setFaceImage(null); setFormData({ name: '', phone: '', email: '', purpose: '', hostName: '' }); }} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', height: 40 }}>
            Check In Another Guest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: 440, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 100, background: 'var(--canvas-panel)', border: '1px solid var(--hairline)', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--ink)', marginBottom: 16 }}>
            <FiShield size={12} /> QR-Pass • Access Control
          </div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 600, letterSpacing: '-0.8px', color: 'var(--ink)', marginBottom: 8 }}>
            Visitor Check-In
          </h1>
          <p style={{ fontSize: 13, color: 'var(--mute)' }}>Please register your arrival below.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Face Capture */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiCamera /> Face Photo *</span>
            </label>
            {!faceImage && !cameraActive && (
              <button type="button" onClick={startCamera} style={{ width: '100%', padding: '24px 12px', background: 'var(--canvas-panel)', border: '1px dashed var(--hairline)', borderRadius: 8, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--canvas)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' }}>
                  <FiCamera size={18} />
                </div>
                <span style={{ fontSize: 12, color: 'var(--mute)' }}>Tap to open camera & capture face</span>
              </button>
            )}
            {cameraActive && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: 240, margin: '0 auto 12px', aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--hairline)' }}>
                  <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <div style={{ width: 140, height: 160, borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.5)' }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button type="button" onClick={capturePhoto} className="btn-primary">Capture</button>
                  <button type="button" onClick={stopCamera} className="btn-secondary">Cancel</button>
                </div>
              </div>
            )}
            {faceImage && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, margin: '0 auto 12px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--hairline)' }}>
                  <img src={faceImage} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <button type="button" onClick={retakePhoto} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--link)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <FiRotateCcw size={10} /> Retake Photo
                </button>
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 8 }}>Full Name *</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mute)' }} />
              <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" className="input-field input-field-icon" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 8 }}>Phone Number *</label>
            <div style={{ position: 'relative' }}>
              <FiPhone style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mute)' }} />
              <input type="tel" required value={formData.phone} onChange={e => handlePhoneChange(e.target.value)} placeholder="9876543210" maxLength={10} className="input-field input-field-icon" style={{ fontFamily: 'var(--font-mono)' }} />
            </div>
            {phoneError && <p style={{ fontSize: 11, color: '#e00', marginTop: 6 }}>{phoneError}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 8 }}>Email (Optional)</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mute)' }} />
              <input type="email" value={formData.email} onChange={e => handleEmailChange(e.target.value)} placeholder="visitor@example.com" className="input-field input-field-icon" />
            </div>
            {emailError && <p style={{ fontSize: 11, color: '#e00', marginTop: 6 }}>{emailError}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 8 }}>Whom are you visiting? *</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mute)' }} />
              <input type="text" required value={formData.hostName} onChange={e => setFormData({ ...formData, hostName: e.target.value })} placeholder="Jane Smith" className="input-field input-field-icon" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 8 }}>Purpose of Visit *</label>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <FiBriefcase style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mute)' }} />
              <input type="text" required value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} placeholder="Type purpose..." className="input-field input-field-icon" />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {purposes.map(p => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setFormData({ ...formData, purpose: p })}
                  style={{
                    fontSize: 11,
                    padding: '4px 8px',
                    borderRadius: 6,
                    border: '1px solid var(--hairline)',
                    background: formData.purpose === p ? 'var(--ink)' : 'var(--canvas-panel)',
                    color: formData.purpose === p ? 'var(--canvas)' : 'var(--mute)',
                    cursor: 'pointer'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <button type="submit" disabled={loading || !faceImage} className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: 44 }}>
              {loading ? 'Registering...' : !faceImage ? <><FiCamera /> Capture Face Photo First</> : 'Complete Check-In'}
            </button>
            {!faceImage && <p style={{ fontSize: 10, color: 'var(--mute)', textAlign: 'center', marginTop: 8 }}>Face photo is required for security</p>}
          </div>
        </form>

        <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--hairline)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)' }}>
          Reception Station: {qrId || 'Lobby Desk'}
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
