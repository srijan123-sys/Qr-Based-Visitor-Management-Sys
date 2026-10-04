import React, { useState, useEffect } from 'react';
import API from '../api/axios.js';
import { toast } from 'react-hot-toast';
import { FiShield, FiTrash2, FiUserCheck, FiUserX, FiAlertTriangle } from 'react-icons/fi';

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
    if (!window.confirm(`Are you absolutely sure you want to delete ${email}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await API.delete(`/users/${userId}`);
      toast.success('User deleted permanently');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-2 pb-2 border-b border-white/[0.06]">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <FiShield className="text-red-500" /> Super Admin Control Panel
        </h1>
        <p className="text-sm text-zinc-400">
          Manage system access, assign roles, and remove unauthorized accounts. With great power comes great responsibility.
        </p>
      </div>

      <div className="card !p-0 overflow-hidden border border-red-500/20 shadow-2xl shadow-red-500/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-red-500/10 text-red-400 text-xs font-mono uppercase tracking-wider border-b border-red-500/20">
                <th className="py-3 px-4 font-semibold">User Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Current Role</th>
                <th className="py-3 px-4 font-semibold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-sm">
              {users.map(u => (
                <tr key={u._id} className={`transition-colors ${u.email === 'thewisdom620@gmail.com' ? 'bg-amber-500/5' : 'hover:bg-white/[0.02]'}`}>
                  <td className="py-3 px-4 text-white font-medium">
                    {u.name}
                    {u._id === currentUser._id && (
                      <span className="ml-2 text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded uppercase font-mono">You</span>
                    )}
                    {u.email === 'thewisdom620@gmail.com' && (
                      <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">👑 Final Boss</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-zinc-400 font-mono text-xs">{u.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      disabled={u._id === currentUser._id || u.email === 'thewisdom620@gmail.com'}
                      className={`text-xs font-semibold px-2 py-1 rounded outline-none cursor-pointer ${
                        u.role === 'admin' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      } ${(u._id === currentUser._id || u.email === 'thewisdom620@gmail.com') ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="admin">Admin (Full Power)</option>
                      <option value="receptionist">Receptionist (Limited)</option>
                      <option value="user">User (No Dashboard Access)</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(u._id, u.email)}
                      disabled={u._id === currentUser._id || u.email === 'thewisdom620@gmail.com'}
                      className={`p-2 rounded-lg transition-colors ${
                        (u._id === currentUser._id || u.email === 'thewisdom620@gmail.com')
                          ? 'text-zinc-600 cursor-not-allowed'
                          : 'text-zinc-400 hover:bg-red-500/20 hover:text-red-400'
                      }`}
                      title={(u._id === currentUser._id || u.email === 'thewisdom620@gmail.com') ? "Cannot delete this user" : "Delete User"}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs flex gap-3 items-start">
        <FiAlertTriangle className="text-lg shrink-0 mt-0.5" />
        <div>
          <strong>Security Warning:</strong> Changing a user's role to 'Admin' gives them the exact same powers as you. They will be able to delete QR codes, view all logs, and even delete other receptionists. Please assign roles carefully.
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
