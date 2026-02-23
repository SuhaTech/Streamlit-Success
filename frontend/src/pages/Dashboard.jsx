import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <div className="p-10">Please log in first.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 uppercase">{user.role} Portal</h1>
        <button 
          onClick={() => { logout(); navigate('/login'); }}
          className="bg-red-500 text-white px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </nav>

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">Welcome, {user.email}!</h2>

        {/* Show Student View */}
        {user.role === 'student' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
              <h3 className="font-bold">Available Jobs</h3>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
              <h3 className="font-bold">Applications Sent</h3>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        )}

        {/* Show Admin View */}
        {user.role === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-slate-700">
              <h3 className="font-bold">Total Students</h3>
              <p className="text-2xl font-bold">450</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
              <h3 className="font-bold">Partner Companies</h3>
              <p className="text-2xl font-bold">25</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;