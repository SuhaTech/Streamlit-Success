import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  Users, BookOpen, FileText, CheckCircle2, XCircle, Clock,
  LayoutDashboard, ArrowRight, AlertCircle, Search, Eye,
  MessageSquare, Calendar,
} from 'lucide-react';

const LOG_STATUS_COLORS = {
  submitted: 'bg-blue-100 text-blue-700',
  under_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  needs_revision: 'bg-red-100 text-red-700',
};

const InternalGuideDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch students assigned to this guide
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Get internship forms assigned to this guide to also get company details
      const res = await axios.get('/api/internship-forms');
      
      const mappedStudents = res.data.map(form => ({
        ...form.student,
        internshipFormId: form._id,
        companyName: form.companyName,
        role: form.role,
        stipend: form.stipend,
        joiningDate: form.joiningDate,
        internshipPeriod: form.internshipPeriod
      }));
      setStudents(mappedStudents);
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentLogs = async (studentId) => {
    try {
      const res = await axios.get(`/api/logs/student/${studentId}`);
      setLogs(res.data.logs);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    }
  };

  const handleReviewLog = async (logId, status) => {
    try {
      await axios.put(`/api/logs/${logId}/review`, {
        status,
        guideComment: reviewComment,
      });
      setReviewComment('');
      if (selectedStudent) fetchStudentLogs(selectedStudent._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Review failed');
    }
  };

  const viewStudentLogs = (student) => {
    setSelectedStudent(student);
    fetchStudentLogs(student._id);
    setActiveTab('logs');
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'students', label: 'My Students', icon: Users },
    { key: 'logs', label: 'Weekly Logs', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-64px)] p-4">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 text-lg">{user?.name}</h3>
            <p className="text-sm text-gray-500">Internal Guide</p>
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

        {/* Main */}
        <main className="flex-1 p-6">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Internal Guide Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={Users} label="My Students" value={students.length} color="bg-blue-500" />
                <StatCard icon={BookOpen} label="Pending Logs" value="-" color="bg-yellow-500" />
                <StatCard icon={CheckCircle2} label="Reviewed" value="-" color="bg-green-500" />
              </div>

              {students.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Students Overview</h3>
                  {students.slice(0, 8).map(s => (
                    <div key={s._id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium text-gray-800">{s.name}</p>
                        <p className="text-sm text-gray-500">{s.email}</p>
                      </div>
                      <button onClick={() => viewStudentLogs(s)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        View Logs <ArrowRight size={14} className="inline" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {students.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No students assigned yet</p>
                </div>
              )}
            </div>
          )}

          {/* STUDENTS TAB */}
          {activeTab === 'students' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Students</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input type="text" placeholder="Search students..." className="pl-10 pr-4 py-2 border rounded-lg w-full max-w-md text-sm"
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                  <div key={s._id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{s.name}</h3>
                        <p className="text-sm text-gray-500">{s.email}</p>
                        {s.department && <p className="text-xs text-gray-400 mt-1">{s.department}</p>}
                        
                        {s.companyName && (
                          <div className="mt-2 text-sm bg-blue-50 p-2 rounded text-blue-800 border border-blue-100">
                            Interning at <span className="font-semibold">{s.companyName}</span> as {s.role}
                          </div>
                        )}
                      </div>
                      <button onClick={() => viewStudentLogs(s)}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100">
                        <Eye size={14} className="inline mr-1" /> Logs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {students.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No students assigned to you yet</p>
                </div>
              )}
            </div>
          )}

          {/* LOGS TAB */}
          {activeTab === 'logs' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setActiveTab('students')} className="text-gray-400 hover:text-gray-600">← Back</button>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedStudent ? `Logs: ${selectedStudent.name}` : 'Select a student'}
                </h2>
              </div>

              {!selectedStudent ? (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <p className="text-gray-500">Select a student from the Students tab to view their logs</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No logs submitted yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.map(log => (
                    <div key={log._id} className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">Week {log.weekNumber}: {log.title}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-3">
                            <span><Clock size={14} className="inline mr-1" />{log.hoursWorked}h worked</span>
                            <span><Calendar size={14} className="inline mr-1" />{new Date(log.createdAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${LOG_STATUS_COLORS[log.status] || 'bg-gray-100 text-gray-500'}`}>
                          {log.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-4 whitespace-pre-wrap">{log.logText}</p>

                      {log.guideComment && (
                        <div className="bg-indigo-50 p-3 rounded-lg mb-4">
                          <p className="text-xs font-medium text-indigo-600 mb-1">Your Comment:</p>
                          <p className="text-sm text-indigo-800">{log.guideComment}</p>
                        </div>
                      )}

                      {(log.status === 'submitted' || log.status === 'under_review') && (
                        <div className="flex items-center gap-3">
                          <input type="text" placeholder="Add feedback..." className="flex-1 border rounded-lg p-2 text-sm"
                            value={reviewComment} onChange={e => setReviewComment(e.target.value)} />
                          <button onClick={() => handleReviewLog(log._id, 'approved')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button onClick={() => handleReviewLog(log._id, 'needs_revision')}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-1">
                            <MessageSquare size={14} /> Revise
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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

export default InternalGuideDashboard;
