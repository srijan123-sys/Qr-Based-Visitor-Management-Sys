// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Dashboard.jsx — Vercel Geist Style
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import React, { useState, useEffect, useMemo } from 'react';
import API from '../api/axios.js';
import { toast } from 'react-hot-toast';
import { 
  FiUsers, 
  FiClock, 
  FiCheckCircle, 
  FiSearch, 
  FiUserPlus, 
  FiRefreshCw, 
  FiDownload, 
  FiPhone, 
  FiBriefcase, 
  FiX,
  FiShield,
  FiCamera
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PHONE_REGEX = /^\d{10}$/;

const Dashboard = ({ user }) => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [submittingWalkIn, setSubmittingWalkIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [walkInPhoneError, setWalkInPhoneError] = useState('');

  const [walkInForm, setWalkInForm] = useState({
    name: '', phone: '', purpose: '', hostName: ''
  });

  const [facePreview, setFacePreview] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [user]);

  const fetchVisitors = async () => {
    try {
      setRefreshing(true);
      const endpoint = user?.role === 'user' ? '/visitors/me' : '/visitors';
      const res = await API.get(endpoint);
      setVisitors(res.data || []);
    } catch (error) {
      toast.error('Failed to sync visitor logs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCheckOut = async (id, visitorName) => {
    try {
      if (user?.role === 'user') {
        await API.put(`/visitors/checkout-self/${id}`);
      } else {
        await API.put(`/visitors/checkout/${id}`);
      }
      toast.success(`${visitorName || 'Visitor'} checked out`);
      fetchVisitors();
    } catch (error) {
      toast.error('Failed to checkout visitor');
    }
  };

  const handleWalkInPhoneChange = (value) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setWalkInForm(prev => ({ ...prev, phone: digitsOnly }));
    if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
      setWalkInPhoneError(`${digitsOnly.length}/10 digits`);
    } else {
      setWalkInPhoneError('');
    }
  };

  const handleWalkInSubmit = async (e) => {
    e.preventDefault();
    if (!PHONE_REGEX.test(walkInForm.phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }
    setSubmittingWalkIn(true);
    try {
      await API.post('/visitors/checkin', {
        ...walkInForm,
        receptionQrId: 'walk-in-desk'
      });
      toast.success(`Registered ${walkInForm.name} successfully!`);
      setWalkInForm({ name: '', phone: '', purpose: '', hostName: '' });
      setWalkInPhoneError('');
      setShowWalkInModal(false);
      fetchVisitors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check in');
    } finally {
      setSubmittingWalkIn(false);
    }
  };

  const exportCSV = () => {
    if (visitors.length === 0) return toast.error('No logs to export');
    const headers = ['Name', 'Phone', 'Email', 'Host', 'Purpose', 'Status', 'CheckOutMethod', 'CheckInTime', 'CheckOutTime'];
    const rows = visitors.map(v => [
      `"${v.name}"`, `"${v.phone}"`, `"${v.email || ''}"`, `"${v.hostName}"`,
      `"${v.purpose}"`, `"${v.status}"`, `"${v.checkOutMethod || 'N/A'}"`,
      `"${new Date(v.checkInTime).toLocaleString()}"`,
      `"${v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : 'N/A'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `visitor_log_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Visitor log exported');
  };

  const activeVisitors = visitors.filter(v => v.status === 'Checked In');
  const checkedOutVisitors = visitors.filter(v => v.status === 'Checked Out');
  const totalToday = visitors.filter(v => new Date(v.checkInTime).toDateString() === new Date().toDateString());

  const filteredVisitors = useMemo(() => {
    return visitors.filter(v => {
      const match = (v.name + v.phone + v.hostName + v.purpose).toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
      if (filterStatus === 'INSIDE') return v.status === 'Checked In';
      if (filterStatus === 'CHECKED_OUT') return v.status === 'Checked Out';
      return true;
    });
  }, [visitors, searchTerm, filterStatus]);

  const getCheckoutMethodBadge = (method) => {
    if (method === 'auto') return <span className="badge badge-zinc" style={{ fontSize: 9 }}>AUTO 5PM</span>;
    if (method === 'self') return <span className="badge badge-zinc" style={{ fontSize: 9 }}>SELF</span>;
    return null;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--mute)' }}>Loading logs...</p>
      </div>
    );
  }

  // Basic User view
  if (user?.role === 'user') {
    return (
      <div className="animate-fade-in" style={{ maxWidth: 860, margin: '0 auto', paddingBottom: 64 }}>
        <div style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: 16, marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink)' }}>My Active Passes</h1>
          <p style={{ fontSize: 13, color: 'var(--mute)' }}>View your check-ins and independently check out.</p>
        </div>
        {visitors.length === 0 ? (
          <div className="card-flat" style={{ textAlign: 'center', padding: 48 }}>
            <FiShield size={32} color="var(--mute)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--mute)', fontSize: 13 }}>You have no active or past visits.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {visitors.map(v => (
              <div key={v._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{v.hostName}</h3>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--mute)' }}>{v.purpose}</p>
                    </div>
                    {v.status === 'Checked In' 
                      ? <span className="badge badge-blue">ACTIVE</span>
                      : <span className="badge badge-zinc">COMPLETED</span>
                    }
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--mute)', lineHeight: '20px', marginBottom: 24 }}>
                    <p>In: {new Date(v.checkInTime).toLocaleString()}</p>
                    {v.checkOutTime && <p>Out: {new Date(v.checkOutTime).toLocaleString()} {getCheckoutMethodBadge(v.checkOutMethod)}</p>}
                  </div>
                </div>
                {v.status === 'Checked In' && (
                  <button onClick={() => handleCheckOut(v._id, v.name)} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    Check Out Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Admin / Receptionist View
  return (
    <div className="animate-fade-in" style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 64 }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, borderBottom: '1px solid var(--hairline)', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 28, fontWeight: 600, letterSpacing: '-1px', color: 'var(--ink)' }}>
              Live Visitor Log
            </h1>
            <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0070f3' }} className="pulse"></span> LIVE
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--mute)' }}>Real-time front-desk access control & digital security log.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'var(--canvas-panel)', border: '1px solid var(--hairline)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--mute)' }}>
            <FiClock /> {currentTime.toLocaleTimeString()}
          </div>
          <button onClick={() => setShowWalkInModal(true)} className="btn-primary" style={{ height: 32 }}>
            <FiUserPlus /> Walk-in
          </button>
          <button onClick={exportCSV} className="btn-secondary" style={{ height: 32 }}>
            <FiDownload /> Export
          </button>
          <button onClick={fetchVisitors} disabled={refreshing} className="btn-secondary" style={{ height: 32, padding: '0 10px' }} title="Refresh logs">
            <FiRefreshCw className={refreshing ? 'spinner' : ''} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20, borderTop: '2px solid var(--link)' }}>
          <p className="text-eyebrow" style={{ marginBottom: 4 }}>Currently In Building</p>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: 'var(--ink)', margin: '8px 0' }}>{activeVisitors.length}</h3>
          <p style={{ fontSize: 12, color: 'var(--mute)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--link)' }}></span> Active on premises
          </p>
        </div>
        <div className="card" style={{ padding: 20, borderTop: '2px solid #f5a623' }}>
          <p className="text-eyebrow" style={{ marginBottom: 4 }}>Total Visitors Today</p>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: 'var(--ink)', margin: '8px 0' }}>{totalToday.length}</h3>
          <p style={{ fontSize: 12, color: 'var(--mute)' }}>Registered today</p>
        </div>
        <div className="card" style={{ padding: 20, borderTop: '2px solid #50e3c2' }}>
          <p className="text-eyebrow" style={{ marginBottom: 4 }}>Checked Out Today</p>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: 'var(--ink)', margin: '8px 0' }}>{checkedOutVisitors.length}</h3>
          <p style={{ fontSize: 12, color: 'var(--mute)' }}>Safely departed</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260, maxWidth: 400 }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mute)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search visitor, phone, host..."
            className="input-field input-field-icon"
            style={{ height: 36, fontSize: 13 }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--mute)', cursor: 'pointer' }}>
              <FiX />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', background: 'var(--canvas-panel)', border: '1px solid var(--hairline)', borderRadius: 6, padding: 2 }}>
          {['ALL', 'INSIDE', 'CHECKED_OUT'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 500,
                background: filterStatus === status ? 'var(--ink)' : 'transparent',
                color: filterStatus === status ? 'var(--canvas)' : 'var(--mute)',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {status === 'ALL' ? `All (${visitors.length})` : status === 'INSIDE' ? `Inside (${activeVisitors.length})` : `Out (${checkedOutVisitors.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Visitor Records</h2>
            <p style={{ fontSize: 12, color: 'var(--mute)' }}>Showing {filteredVisitors.length} entries</p>
          </div>
          {user?.role === 'admin' && (
            <Link to="/create" style={{ fontSize: 12, fontWeight: 600, color: 'var(--link)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Desk QR Code &rarr;
            </Link>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', minWidth: 800 }}>
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Host</th>
                <th>Purpose</th>
                <th>Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 48 }}>
                    <FiShield size={24} color="var(--mute)" style={{ margin: '0 auto 12px' }} />
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>No visitors found</p>
                    <p style={{ fontSize: 13, color: 'var(--mute)' }}>Try adjusting your search or filter.</p>
                  </td>
                </tr>
              ) : (
                filteredVisitors.map(v => (
                  <tr key={v._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {v.faceImage ? (
                          <button onClick={() => setFacePreview(v)} style={{ width: 32, height: 32, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--hairline)', cursor: 'pointer', padding: 0 }}>
                            <img src={v.faceImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </button>
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--canvas-panel)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--body)' }}>
                            {v.name?.charAt(0) || 'V'}
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{v.name}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--mute)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <FiPhone size={10} /> {v.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 13, color: 'var(--ink)' }}>@{v.hostName}</span>
                    </td>
                    <td>
                      <span className="badge badge-zinc" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        <FiBriefcase size={10} /> {v.purpose}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink)' }}>
                        {new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--mute)' }}>
                        {new Date(v.checkInTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    <td>
                      {v.status === 'Checked In' ? (
                        <span className="badge badge-blue">Checked In</span>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                          <span className="badge badge-zinc">Checked Out</span>
                          {getCheckoutMethodBadge(v.checkOutMethod)}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {v.status === 'Checked In' ? (
                        <button onClick={() => handleCheckOut(v._id, v.name)} className="btn-secondary" style={{ height: 28, fontSize: 11 }}>
                          Check Out
                        </button>
                      ) : (
                        <div style={{ fontSize: 11, color: 'var(--mute)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                          <FiCheckCircle /> Out {new Date(v.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Face Preview Modal */}
      {facePreview && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setFacePreview(null)}>
          <div className="card" style={{ width: 320, padding: 24, textAlign: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setFacePreview(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--mute)', cursor: 'pointer' }}>
              <FiX size={18} />
            </button>
            <div style={{ width: 120, height: 120, borderRadius: 12, overflow: 'hidden', margin: '0 auto 16px', border: '1px solid var(--hairline)' }}>
              <img src={facePreview.faceImage} alt="Face ID" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span className="text-eyebrow" style={{ display: 'block', marginBottom: 8 }}>FACE ID CAPTURE</span>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{facePreview.name}</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--mute)', marginBottom: 4 }}>Phone: {facePreview.phone} • Host: @{facePreview.hostName}</p>
            <p style={{ fontSize: 12, color: 'var(--mute)' }}>Checked in: {new Date(facePreview.checkInTime).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Walk-in Modal */}
      {showWalkInModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: 16 }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: 32 }}>
            <button onClick={() => setShowWalkInModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--mute)', cursor: 'pointer' }}>
              <FiX size={18} />
            </button>
            
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink)' }}>Manual Walk-in</h2>
              <p style={{ fontSize: 13, color: 'var(--mute)' }}>Register a guest directly at the reception desk</p>
            </div>

            <form onSubmit={handleWalkInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 6 }}>Full Name *</label>
                <input type="text" required value={walkInForm.name} onChange={e => setWalkInForm({ ...walkInForm, name: e.target.value })} placeholder="Alex Mercer" className="input-field" />
              </div>
              
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 6 }}>Phone Number *</label>
                <input type="tel" required value={walkInForm.phone} onChange={e => handleWalkInPhoneChange(e.target.value)} placeholder="9876543210" maxLength={10} className="input-field" style={{ fontFamily: 'var(--font-mono)' }} />
                {walkInPhoneError && <p style={{ fontSize: 11, color: '#e00', marginTop: 4 }}>{walkInPhoneError}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 6 }}>Host *</label>
                  <input type="text" required value={walkInForm.hostName} onChange={e => setWalkInForm({ ...walkInForm, hostName: e.target.value })} placeholder="Sarah Connor" className="input-field" />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 6 }}>Purpose *</label>
                  <input type="text" required value={walkInForm.purpose} onChange={e => setWalkInForm({ ...walkInForm, purpose: e.target.value })} placeholder="Meeting" className="input-field" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--hairline)' }}>
                <button type="button" onClick={() => setShowWalkInModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={submittingWalkIn} className="btn-primary">
                  {submittingWalkIn ? 'Registering...' : 'Complete Check-In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
