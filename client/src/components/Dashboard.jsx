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
  FiShield
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'INSIDE' | 'CHECKED_OUT'
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [submittingWalkIn, setSubmittingWalkIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Walk-in form state
  const [walkInForm, setWalkInForm] = useState({
    name: '',
    phone: '',
    purpose: '',
    hostName: ''
  });

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setRefreshing(true);
      const res = await API.get('/visitors');
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
      await API.put(`/visitors/checkout/${id}`);
      toast.success(`${visitorName || 'Visitor'} checked out successfully`);
      fetchVisitors();
    } catch (error) {
      toast.error('Failed to checkout visitor');
    }
  };

  const handleWalkInSubmit = async (e) => {
    e.preventDefault();
    setSubmittingWalkIn(true);
    try {
      await API.post('/visitors/checkin', {
        ...walkInForm,
        receptionQrId: 'walk-in-desk'
      });
      toast.success(`Registered ${walkInForm.name} successfully!`);
      setWalkInForm({ name: '', phone: '', purpose: '', hostName: '' });
      setShowWalkInModal(false);
      fetchVisitors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check in walk-in visitor');
    } finally {
      setSubmittingWalkIn(false);
    }
  };

  const exportCSV = () => {
    if (visitors.length === 0) {
      toast.error('No visitor logs to export');
      return;
    }
    const headers = ['Name', 'Phone', 'Host', 'Purpose', 'Status', 'CheckInTime', 'CheckOutTime'];
    const rows = visitors.map(v => [
      `"${v.name}"`,
      `"${v.phone}"`,
      `"${v.hostName}"`,
      `"${v.purpose}"`,
      `"${v.status}"`,
      `"${new Date(v.checkInTime).toLocaleString()}"`,
      `"${v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : 'N/A'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `visitor_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Visitor log exported as CSV');
  };

  // Metrics
  const activeVisitors = visitors.filter(v => v.status === 'Checked In');
  const checkedOutVisitors = visitors.filter(v => v.status === 'Checked Out');
  const totalToday = visitors.filter(v => 
    new Date(v.checkInTime).toDateString() === new Date().toDateString()
  );

  // Filtered list
  const filteredVisitors = useMemo(() => {
    return visitors.filter(v => {
      const matchesSearch = 
        v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.hostName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.purpose?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterStatus === 'INSIDE') return v.status === 'Checked In';
      if (filterStatus === 'CHECKED_OUT') return v.status === 'Checked Out';
      return true;
    });
  }, [visitors, searchTerm, filterStatus]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
        <p className="font-mono text-sm text-zinc-400">Loading QR Management System logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col gap-4 pb-2 border-b border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Live Visitor Log
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                LIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Real-time front-desk access control & digital security log.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] font-mono text-xs text-zinc-300">
            <FiClock className="text-cyan-400" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowWalkInModal(true)}
            className="btn-primary col-span-2 sm:col-auto shadow-lg shadow-orange-500/25 justify-center text-xs sm:text-sm py-2.5"
          >
            <FiUserPlus />
            <span>+ Walk-in Check-In</span>
          </button>

          <button
            onClick={exportCSV}
            className="btn-secondary justify-center text-xs sm:text-sm py-2.5"
          >
            <FiDownload />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchVisitors}
            disabled={refreshing}
            className="btn-secondary justify-center text-xs sm:text-sm py-2.5"
            title="Refresh logs"
          >
            <FiRefreshCw className={`${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
        {/* Active In Building */}
        <div className="card card-glow-cyan border-l-4 border-l-cyan-500 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">
                Currently In Building
              </p>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {activeVisitors.length}
              </h3>
              <p className="text-xs text-cyan-400 mt-1.5 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                Active on premises
              </p>
            </div>
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FiClock className="text-xl sm:text-2xl" />
            </div>
          </div>
        </div>

        {/* Total Today */}
        <div className="card card-glow-orange border-l-4 border-l-orange-500 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">
                Total Visitors Today
              </p>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {totalToday.length}
              </h3>
              <p className="text-xs text-orange-400 mt-1.5 font-medium">
                Registered today
              </p>
            </div>
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <FiUsers className="text-xl sm:text-2xl" />
            </div>
          </div>
        </div>

        {/* Checked Out */}
        <div className="card border-l-4 border-l-emerald-500 p-4 sm:p-5 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">
                Checked Out Today
              </p>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {checkedOutVisitors.length}
              </h3>
              <p className="text-xs text-emerald-400 mt-1.5 font-medium">
                Safely departed
              </p>
            </div>
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FiCheckCircle className="text-xl sm:text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-base pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search visitor, phone, host, purpose..."
            className="input-field !pl-10 !py-2.5 text-xs sm:text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* Filter Pills — horizontally scrollable on mobile */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-x-auto select-none shrink-0">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              filterStatus === 'ALL'
                ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({visitors.length})
          </button>
          <button
            onClick={() => setFilterStatus('INSIDE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              filterStatus === 'INSIDE'
                ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Inside ({activeVisitors.length})
          </button>
          <button
            onClick={() => setFilterStatus('CHECKED_OUT')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              filterStatus === 'CHECKED_OUT'
                ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Checked Out ({checkedOutVisitors.length})
          </button>
        </div>
      </div>

      {/* Main Records Container */}
      <div className="card !p-0 overflow-hidden border border-white/[0.08] shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">Visitor Records</h2>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
              Showing {filteredVisitors.length} of {visitors.length} total entries
            </p>
          </div>
          <Link
            to="/create"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>Desk QR Code</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* ── Desktop Table (hidden on mobile, visible md+) ──────────── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] text-zinc-400 text-xs font-mono uppercase tracking-wider border-b border-white/[0.06]">
                <th className="py-3.5 px-5 font-semibold">Visitor</th>
                <th className="py-3.5 px-5 font-semibold">Host (To Meet)</th>
                <th className="py-3.5 px-5 font-semibold">Purpose</th>
                <th className="py-3.5 px-5 font-semibold">Check-In Time</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-sm">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3 px-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-500">
                        <FiShield className="text-2xl text-cyan-400/50" />
                      </div>
                      <h3 className="text-base font-bold text-white">No visitors found</h3>
                      <p className="text-xs text-zinc-400">
                        {searchTerm 
                          ? `No records match "${searchTerm}". Try resetting your search filter.`
                          : 'No visitor logs yet. Generate your Reception QR Code or register a walk-in visitor to begin.'}
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        <Link to="/create" className="btn-cyan text-xs !py-2">
                          View Reception QR
                        </Link>
                        <button
                          onClick={() => setShowWalkInModal(true)}
                          className="btn-secondary text-xs !py-2"
                        >
                          + Walk-in Check-In
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((visitor) => {
                  const initials = visitor.name
                    ? visitor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                    : 'V';

                  return (
                    <tr 
                      key={visitor._id} 
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                              {visitor.name}
                            </div>
                            <div className="text-zinc-500 text-xs flex items-center gap-1 font-mono">
                              <FiPhone className="text-[10px]" />
                              <span>{visitor.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                          <span className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 text-xs shrink-0">
                            @
                          </span>
                          <span>{visitor.hostName}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] border border-white/[0.06] text-zinc-300">
                          <FiBriefcase className="text-zinc-500" />
                          <span>{visitor.purpose}</span>
                        </span>
                      </td>

                      <td className="py-4 px-5 font-mono text-xs text-zinc-400">
                        <div>
                          {new Date(visitor.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {new Date(visitor.checkInTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        {visitor.status === 'Checked In' ? (
                          <span className="badge badge-cyan">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                            Checked In
                          </span>
                        ) : (
                          <span className="badge badge-zinc">
                            <FiCheckCircle className="text-emerald-400" />
                            Checked Out
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right">
                        {visitor.status === 'Checked In' ? (
                          <button
                            onClick={() => handleCheckOut(visitor._id, visitor.name)}
                            className="btn-danger text-xs font-semibold shadow-sm shadow-red-500/10 hover:shadow-red-500/25"
                          >
                            Check Out
                          </button>
                        ) : (
                          <div className="text-zinc-500 text-xs font-mono inline-flex items-center gap-1.5">
                            <FiCheckCircle className="text-emerald-400" />
                            <span>Out {new Date(visitor.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Visitor Cards (visible on mobile only, < md) ─────── */}
        <div className="md:hidden divide-y divide-white/[0.06]">
          {filteredVisitors.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-500 mx-auto mb-3">
                <FiShield className="text-xl text-cyan-400/50" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">No visitors found</h4>
              <p className="text-xs text-zinc-400 mb-4">
                {searchTerm ? 'Try adjusting your search query.' : 'No visitors recorded yet.'}
              </p>
              <button
                onClick={() => setShowWalkInModal(true)}
                className="btn-primary text-xs !py-2 w-full justify-center"
              >
                + Walk-in Check-In
              </button>
            </div>
          ) : (
            filteredVisitors.map((visitor) => {
              const initials = visitor.name
                ? visitor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                : 'V';

              return (
                <div key={visitor._id} className="p-4 space-y-3">
                  {/* Top Row: Avatar + Name + Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 shrink-0">
                        {initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm leading-snug">{visitor.name}</h4>
                        <a
                          href={`tel:${visitor.phone}`}
                          className="text-zinc-400 hover:text-cyan-300 text-xs flex items-center gap-1 font-mono mt-0.5"
                        >
                          <FiPhone className="text-[10px]" />
                          <span>{visitor.phone}</span>
                        </a>
                      </div>
                    </div>

                    {visitor.status === 'Checked In' ? (
                      <span className="badge badge-cyan text-[11px] shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        Active
                      </span>
                    ) : (
                      <span className="badge badge-zinc text-[11px] shrink-0">
                        <FiCheckCircle className="text-emerald-400" />
                        Out
                      </span>
                    )}
                  </div>

                  {/* Details Pill Row */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-zinc-300">
                      Host: <strong className="text-white">@{visitor.hostName}</strong>
                    </span>
                    <span className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-zinc-300 flex items-center gap-1">
                      <FiBriefcase className="text-zinc-500 text-[10px]" />
                      <span>{visitor.purpose}</span>
                    </span>
                    <span className="text-zinc-500 font-mono text-[11px] ml-auto">
                      {new Date(visitor.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Action Button */}
                  {visitor.status === 'Checked In' && (
                    <button
                      onClick={() => handleCheckOut(visitor._id, visitor.name)}
                      className="btn-danger w-full !py-2.5 text-xs font-semibold justify-center shadow-sm"
                    >
                      Check Out Visitor
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Walk-in Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="card w-full max-w-lg max-h-[92vh] overflow-y-auto border border-white/[0.12] shadow-2xl relative p-5 sm:p-6">
            <button
              onClick={() => setShowWalkInModal(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.08]"
            >
              <FiX size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <FiUserPlus size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Manual Walk-in Check-In</h3>
                <p className="text-xs text-zinc-400">Register a guest directly at the reception desk</p>
              </div>
            </div>

            <form onSubmit={handleWalkInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Visitor Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={walkInForm.name}
                  onChange={(e) => setWalkInForm({ ...walkInForm, name: e.target.value })}
                  placeholder="e.g. Alex Mercer"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={walkInForm.phone}
                  onChange={(e) => setWalkInForm({ ...walkInForm, phone: e.target.value })}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="input-field text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Whom to Meet (Host) *
                  </label>
                  <input
                    type="text"
                    required
                    value={walkInForm.hostName}
                    onChange={(e) => setWalkInForm({ ...walkInForm, hostName: e.target.value })}
                    placeholder="e.g. Sarah Connor"
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Purpose of Visit *
                  </label>
                  <input
                    type="text"
                    required
                    value={walkInForm.purpose}
                    onChange={(e) => setWalkInForm({ ...walkInForm, purpose: e.target.value })}
                    placeholder="e.g. Meeting, Interview"
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWalkIn}
                  className="btn-primary text-sm shadow-lg shadow-orange-500/25"
                >
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
