'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { notificationApi } from '@/lib/api/notification.api';
import { useClickAway } from 'react-use';
import { Bell, CheckCheck, Inbox } from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  useClickAway(ref, () => setIsOpen(false));

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationApi.getNotifications();
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n: Notification) => !n.read).length);
      }
    } catch {
      console.error('Failed to fetch notifications');
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    await notificationApi.markAllAsRead();
    fetchNotifications();
  };

  const toggleDropdown = () => {
    if (!isOpen) fetchNotifications();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
      >
        <span className="sr-only">View notifications</span>
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-[#0a0a1a] bg-red-500"></span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl overflow-hidden shadow-2xl bg-[#0a0a1a] border border-white/10 z-50">
          <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
            <span className="font-semibold text-sm text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" />
              Notifications
            </span>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead} 
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>
           
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Inbox className="w-8 h-8 text-white/30 mx-auto mb-2" />
                <p className="text-sm text-white/50">No notifications yet.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`px-4 py-3 hover:bg-white/5 flex items-start gap-3 border-b border-white/5 last:border-0 ${!notification.read ? 'bg-indigo-500/10' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{notification.title}</p>
                    <p className="text-sm text-white/50 mt-1 line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-white/30 mt-1">{new Date(notification.createdAt).toLocaleTimeString()}</p>
                  </div>
                  {!notification.read && (
                    <span className="h-2 w-2 bg-indigo-500 rounded-full mt-2 shrink-0"></span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
