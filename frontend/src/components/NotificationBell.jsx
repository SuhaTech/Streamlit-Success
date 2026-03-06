import React, { useState, useEffect, useRef } from 'react';
import axios from '../api/axios';
import { Bell, X, Check, CheckCheck } from 'lucide-react';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Fetch notifications on mount and poll every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications/mine');
      setNotifications(res.data.notifications || []);
      setUnreadCount((res.data.notifications || []).filter(n => !n.read).length);
    } catch (err) {
      // Silently fail — notifications are non-critical
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read');
    }
  };

  const TYPE_ICONS = {
    application: '📋',
    job: '💼',
    document: '📄',
    log: '📝',
    announcement: '📢',
    system: '⚙️',
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-gray-100 transition">
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[32rem] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  <CheckCheck size={12} /> Read all
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">No notifications</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n._id}
                  className={`px-4 py-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer transition ${!n.read ? 'bg-indigo-50/50' : ''}`}
                  onClick={() => !n.read && markAsRead(n._id)}>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{TYPE_ICONS[n.type] || '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.read ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed whitespace-normal break-words">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
