// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AdminPanel.jsx — Vercel Geist Style
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import React, { useState, useEffect } from 'react';
import API from '../api/axios.js';
import { toast } from 'react-hot-toast';
import { FiShield, FiTrash2, FiAlertTriangle } from 'react-icons/fi';

const AdminPanel = ({ user: currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (userId, email) => {
    if (!window.confirm(`Are you absolutely sure you want to delete ${email}? This action cannot be undone.`)) return;
    try {
      await API.delete(`/users/${userId}`);
      toast.success('User deleted permanently');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const roleColors = {
    admin: { bg: '#ff4d4d18', color: '#ff4444', border: '#ff444430' },
    receptionist: { bg: '#7928ca18', color: '#7928ca', border: '#7928ca30' },
    user: { bg: '#0070f318', color: '#0070f3', border: '#0070f330' },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 920, margin: '0 auto', paddingBottom: 64 }}>

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <p className="text-eyebrow" style={{ marginBottom: 8 }}>Administration</p>
        <h1 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: '-1px',
          color: 'var(--ink)',
          lineHeight: '36px',
          marginBottom: 6,
        }}>
          User Management
        </h1>
        <p className="text-body-md">
          Manage system access, assign roles, and remove unauthorized accounts.
        </p>
        <div style={{ marginTop: 20, height: 1, background: 'var(--hairline)' }} />
      </div>

      {/* Users table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        {/* Table header */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiShield style={{ fontSize: 14, color: 'var(--mute)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--mute)' }}>
              System Users
            </span>
          </div>
          <span className="badge">{users.length} total</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isSelf = u._id === currentUser._id;
                const isBoss = u.email === 'thewisdom620@gmail.com';
                const locked = isSelf || isBoss;
                const rc = roleColors[u.role] || roleColors.user;

                return (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: 'var(--canvas-panel)',
                          border: '1px solid var(--hairline)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--body)',
                          flexShrink: 0,
                        }}>
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {u.name}
                            {isSelf && (
                              <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: 9, padding: '1px 5px',
                                borderRadius: 3, background: 'var(--link-soft)', color: 'var(--link)',
                                border: '1px solid rgba(0,112,243,0.2)',
                              }}>
                                YOU
                              </span>
                            )}
                            {isBoss && (
                              <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: 9, padding: '1px 5px',
                                borderRadius: 3, background: 'rgba(245,166,35,0.12)', color: '#f5a623',
                                border: '1px solid rgba(245,166,35,0.25)',
                              }}>
                                👑 OWNER
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--mute)' }}>
                        {u.email}
                      </span>
                    </td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={locked}
                        className="input-field"
                        style={{
                          height: 28,
                          padding: '0 24px 0 8px',
                          fontSize: 12,
                          fontFamily: 'var(--font-mono)',
                          width: 'auto',
                          minWidth: 130,
                          background: rc.bg,
                          color: rc.color,
                          borderColor: rc.border,
                          opacity: locked ? 0.45 : 1,
                          cursor: locked ? 'not-allowed' : 'pointer',
                          fontWeight: 500,
                          letterSpacing: '0.02em',
                        }}
                      >
                        <option value="admin">Admin</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="user">User</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(u._id, u.email)}
                        disabled={locked}
                        className="btn-danger"
                        style={{ opacity: locked ? 0.35 : 1, cursor: locked ? 'not-allowed' : 'pointer' }}
                        title={locked ? 'Cannot delete this user' : 'Delete user'}
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security warning */}
      <div style={{
        display: 'flex',
        gap: 12,
        padding: '14px 16px',
        borderRadius: 8,
        border: '1px solid rgba(245,166,35,0.3)',
        background: 'rgba(245,166,35,0.06)',
        alignItems: 'flex-start',
      }}>
        <FiAlertTriangle style={{ color: '#f5a623', flexShrink: 0, marginTop: 1, fontSize: 15 }} />
        <p style={{ fontSize: 13, color: 'var(--body)', lineHeight: '20px' }}>
          <strong style={{ color: 'var(--ink)' }}>Security warning:</strong>{' '}
          Changing a user's role to Admin grants them the same privileges as you — including user deletion, QR management, and full system access. Assign roles carefully.
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;
