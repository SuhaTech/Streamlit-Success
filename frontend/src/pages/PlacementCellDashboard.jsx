import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  Users, BarChart3, Briefcase, FileCheck, Bell, Search, Plus,
  LayoutDashboard, Settings, Shield, Trash2, Edit, CheckCircle2,
  ArrowRight, Building2, Award, Filter, Download, RefreshCw,
  UserCheck, AlertCircle, Send,
} from 'lucide-react';

const VALID_ROLES = ['student', 'recruiter', 'mentor', 'internal_guide', 'placement_cell', 'hod', 'dean'];

const PlacementCellDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userPages, setUserPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastRole, setBroadcastRole] = useState('');

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage);
      if (roleFilter) params.append('role', roleFilter);
      if (userSearch) params.append('search', userSearch);
      const res = await axios.get(`/api/admin/users?${params.toString()}`);
      setUsers(res.data.users);
      setTotalUsers(res.data.total);
      setUserPages(res.data.pages);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"? This action cannot be undone.`)) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastTitle || !broadcastMessage) {
      alert('Title and message are required');
      return;
    }
    try {
      const payload = { title: broadcastTitle, message: broadcastMessage };
      if (broadcastRole) payload.targetRole = broadcastRole;
      await axios.post('/api/notifications/broadcast', payload);
      alert('Broadcast sent successfully!');
      setBroadcastTitle('');
      setBroadcastMessage('');
      setBroadcastRole('');
    } catch (err) {
      alert('Failed to send broadcast');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'users', label: 'User Management', icon: Users },
    { key: 'broadcast', label: 'Broadcast', icon: Bell },
    { key: 'approvals', label: 'Job Approvals', icon: FileCheck },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  useEffect(() => {
    if (activeTab === 'approvals') fetchPendingJobs();
  }, [activeTab]);

  const fetchPendingJobs = async () => {
    try {
      setLoadingPending(true);
      const res = await axios.get('/api/jobs/pending');
      setPendingJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Failed to load pending jobs', err);
      setPendingJobs([]);
    } finally {
      setLoadingPending(false);
    }
  };

  const handleApprove = async (jobId) => {
    if (!window.confirm('Approve this job and publish it for students?')) return;
    try {
      await axios.put(`/api/jobs/${jobId}/approve`);
      fetchPendingJobs();
      fetchStats();
      alert('Job approved');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (jobId) => {
    const reason = window.prompt('Enter reason for rejection (optional):');
    if (reason === null) return;
    try {
      await axios.put(`/api/jobs/${jobId}/reject`, { reason });
      fetchPendingJobs();
      fetchStats();
      alert('Job rejected and recruiter notified');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-64px)] p-4">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 text-lg">{user?.name}</h3>
            <p className="text-sm text-gray-500">Placement Cell</p>
          </div>
          <nav className="space-y-1">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === t.key ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                <t.icon size={18} />
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Placement Cell Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="bg-blue-500" />
                <StatCard icon={UserCheck} label="Students" value={stats?.totalStudents || 0} color="bg-green-500" />
                <StatCard icon={Building2} label="Recruiters" value={stats?.totalRecruiters || 0} color="bg-purple-500" />
                <StatCard icon={Briefcase} label="Open Jobs" value={stats?.openJobs || 0} color="bg-indigo-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Users by Role</h3>
                  {stats?.roleCounts?.map(rc => (
                    <div key={rc._id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm text-gray-700 capitalize">{rc._id?.replace('_', ' ')}</span>
                      <span className="font-semibold text-gray-800">{rc.count}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Application Stats</h3>
                  {stats?.applicationsByStatus?.map(as => (
                    <div key={as._id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm text-gray-700 capitalize">{as._id?.replace('_', ' ')}</span>
                      <span className="font-semibold text-gray-800">{as.count}</span>
                    </div>
                  ))}
                  {(!stats?.applicationsByStatus || stats.applicationsByStatus.length === 0) && (
                    <p className="text-gray-400 text-sm text-center py-4">No applications yet</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard icon={Briefcase} label="Total Jobs" value={stats?.totalJobs || 0} color="bg-teal-500" />
                <StatCard icon={FileCheck} label="Pending Documents" value={stats?.pendingDocuments || 0} color="bg-yellow-500" />
              </div>
            </div>
          )}

          {/* APPROVALS TAB */}
          {activeTab === 'approvals' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Job Approvals</h2>
              <div className="bg-white rounded-xl shadow-sm p-6">
                {loadingPending ? (
                  <p className="text-sm text-gray-500">Loading pending jobs...</p>
                ) : (
                  <div className="space-y-4">
                    {pendingJobs.length === 0 && <p className="text-sm text-gray-500">No pending job approvals</p>}
                    {pendingJobs.map(j => (
                      <div key={j._id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{j.title} — <span className="text-sm text-gray-500">{j.company}</span></p>
                          <p className="text-sm text-gray-600 mt-1">{j.description?.slice(0, 200)}{j.description && j.description.length > 200 ? '...' : ''}</p>
                          <p className="text-xs text-gray-400 mt-2">Posted by: {j.postedBy?.name || 'Recruiter'} • {new Date(j.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <button onClick={() => handleApprove(j._id)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Approve</button>
                          <button onClick={() => handleReject(j._id)} className="px-4 py-2 bg-rose-500 text-white rounded-lg">Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
              
              {/* Search & Filter */}
              <div className="flex items-center gap-4 mb-6">
                <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input type="text" placeholder="Search by name or email..." className="pl-10 pr-4 py-2 border rounded-lg w-full max-w-md text-sm"
                    value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                </form>
                <select className="border rounded-lg px-3 py-2 text-sm" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}>
                  <option value="">All Roles</option>
                  {VALID_ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                </select>
                <button onClick={() => { fetchUsers(); fetchStats(); }} className="p-2 rounded-lg border hover:bg-gray-50">
                  <RefreshCw size={18} className="text-gray-500" />
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-4">Showing {users.length} of {totalUsers} users (Page {currentPage} of {userPages})</p>

              {/* Users table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                        <td className="px-4 py-3 text-gray-500">{u.email}</td>
                        <td className="px-4 py-3">
                          <select className="border rounded px-2 py-1 text-xs" value={u.role}
                            onChange={e => handleRoleChange(u._id, e.target.value)}>
                            {VALID_ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteUser(u._id, u.name)}
                            className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {userPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50">Prev</button>
                  {Array.from({ length: Math.min(userPages, 5) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setCurrentPage(p)}
                      className={`px-3 py-1 border rounded text-sm ${currentPage === p ? 'bg-indigo-600 text-white' : ''}`}>{p}</button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(userPages, p + 1))} disabled={currentPage === userPages}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
                </div>
              )}
            </div>
          )}

          {/* BROADCAST TAB */}
          {activeTab === 'broadcast' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Broadcast</h2>
              <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input type="text" className="w-full border rounded-lg p-2 text-sm" value={broadcastTitle}
                      onChange={e => setBroadcastTitle(e.target.value)} placeholder="e.g. Important: Campus Drive Update" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea className="w-full border rounded-lg p-2 text-sm" rows={4} value={broadcastMessage}
                      onChange={e => setBroadcastMessage(e.target.value)} placeholder="Enter your announcement message..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                    <select className="w-full border rounded-lg p-2 text-sm" value={broadcastRole} onChange={e => setBroadcastRole(e.target.value)}>
                      <option value="">All Users</option>
                      {VALID_ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <button onClick={handleBroadcast}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2">
                    <Send size={16} /> Send Broadcast
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="bg-blue-500" />
                <StatCard icon={Briefcase} label="Total Jobs" value={stats?.totalJobs || 0} color="bg-teal-500" />
                <StatCard icon={Award} label="Total Applications" value={stats?.totalApplications || 0} color="bg-purple-500" />
                <StatCard icon={CheckCircle2} label="Open Positions" value={stats?.openJobs || 0} color="bg-green-500" />
                <StatCard icon={FileCheck} label="Pending Documents" value={stats?.pendingDocuments || 0} color="bg-yellow-500" />
                <StatCard icon={Building2} label="Companies/Recruiters" value={stats?.totalRecruiters || 0} color="bg-indigo-500" />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
    <div className={`${color} p-3 rounded-xl text-white`}><Icon size={24} /></div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

export default PlacementCellDashboard;
