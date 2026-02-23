import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, LayoutDashboard, CheckCircle2, FileText, Send, ShieldCheck } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ activeTab, setActiveTab, searchTerm, setSearchTerm, logout: logoutProp, onLogoutClick }) => {
  const { logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => {
    if (onLogoutClick) { onLogoutClick(); return; }
    setShowConfirm(true);
  };
  const doLogout = () => {
    (logoutProp || authLogout)();
    setShowConfirm(false);
    navigate('/');
  };
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard size={14}/> },
    { id: 'applications', label: 'Tracking', icon: <CheckCircle2 size={14}/> },
    { id: 'logs', label: 'Weekly Logs', icon: <FileText size={14}/> },
    { id: 'docs', label: 'Documents', icon: <Send size={14}/> }
  ];

  return (<>
    <nav className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/60 px-10 py-5 flex justify-between items-center">
      <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab && setActiveTab('dashboard')}>
        <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white rotate-3 shadow-lg shadow-black/20">
          <ShieldCheck size={22} />
        </div>
        <span className="text-xl font-black tracking-tighter italic">STREAMLINING.</span>
      </div>

      {setActiveTab && (
        <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1.5 rounded-[1.5rem]">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-slate-400 hover:text-black'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        {setSearchTerm && (
          <div className="relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Search..." 
              className="pl-11 pr-5 py-2.5 bg-slate-100 rounded-2xl outline-none text-sm w-48 focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all border border-transparent focus:border-slate-200"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        <NotificationBell />
        <button 
          onClick={handleLogoutClick}
          className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
          title="Sign Out"
        >
          <LogOut size={20}/>
        </button>
      </div>
    </nav>

    {/* Logout confirmation (used when no external modal provided) */}
    {showConfirm && (
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)}></div>
        <div className="bg-white relative z-10 rounded-2xl p-8 shadow-2xl max-w-sm w-full">
          <h3 className="text-lg font-black mb-2">Sign out?</h3>
          <p className="text-sm text-slate-500 mb-6">You will be returned to the login page.</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowConfirm(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-sm font-bold hover:bg-slate-200 transition-all">Cancel</button>
            <button onClick={doLogout} className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-all">Sign Out</button>
          </div>
        </div>
      </div>
    )}
  </>);
};

export default Navbar;
