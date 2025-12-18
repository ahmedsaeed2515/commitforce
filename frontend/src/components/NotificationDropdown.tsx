'use client';

import { useState, useEffect, useRef } from 'react';
import { notificationApi } from '@/lib/api/notification.api';
import { useClickAway } from 'react-use';
import Link from 'next/link';

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  useClickAway(ref, () => setIsOpen(false));

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications();
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n: any) => !n.read).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    await notificationApi.markAllAsRead();
    fetchNotifications();
  };

  const toggleDropdown = () => {
    if (!isOpen) fetchNotifications(); // Refresh on open
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative ml-3" ref={ref}>
      <button
        onClick={toggleDropdown}
        className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
      >
        <span className="sr-only">View notifications</span>
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-400"></span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
           <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
               <span className="font-semibold text-sm text-gray-700">Notifications</span>
               {unreadCount > 0 && (
                   <button onClick={handleMarkAllRead} className="text-xs text-indigo-600 hover:text-indigo-500">
                       Mark all read
                   </button>
               )}
           </div>
           
           <div className="max-h-96 overflow-y-auto">
               {notifications.length === 0 ? (
                   <div className="px-4 py-6 text-center text-sm text-gray-500">
                       No notifications yet.
                   </div>
               ) : (
                   notifications.map((notification) => (
                       <div key={notification._id} className={`px-4 py-3 hover:bg-gray-50 flex items-start ${!notification.read ? 'bg-indigo-50' : ''}`}>
                           <div className="flex-1">
                               <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                               <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                               <p className="text-xs text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleTimeString()}</p>
                           </div>
                           {!notification.read && (
                               <span className="h-2 w-2 bg-indigo-600 rounded-full mt-2"></span>
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
