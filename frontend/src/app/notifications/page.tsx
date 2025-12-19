'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notificationApi } from '@/lib/api/notification.api';
import toast from 'react-hot-toast';
import { 
  Bell, Check, CheckCheck, Trash2, Filter, 
  Target, Trophy, Users, MessageCircle, Flame,
  Calendar, Star, AlertCircle, Settings, ChevronDown
} from 'lucide-react';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  challenge: <Target className="w-5 h-5" />,
  achievement: <Trophy className="w-5 h-5" />,
  club: <Users className="w-5 h-5" />,
  comment: <MessageCircle className="w-5 h-5" />,
  streak: <Flame className="w-5 h-5" />,
  reminder: <Calendar className="w-5 h-5" />,
  badge: <Star className="w-5 h-5" />,
  system: <AlertCircle className="w-5 h-5" />,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  challenge: 'from-indigo-500 to-purple-500',
  achievement: 'from-amber-500 to-yellow-500',
  club: 'from-purple-500 to-pink-500',
  comment: 'from-blue-500 to-cyan-500',
  streak: 'from-orange-500 to-red-500',
  reminder: 'from-green-500 to-emerald-500',
  badge: 'from-yellow-500 to-orange-500',
  system: 'from-gray-500 to-slate-500',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationApi.getAll();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // Note: Add delete API if available
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                <p className="text-white/50">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition"
                >
                  <Filter className="w-4 h-4" />
                  <span className="capitalize">{filter}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-[#0a0a1a] border border-white/10 rounded-xl overflow-hidden shadow-xl z-20">
                    {(['all', 'unread', 'read'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => {
                          setFilter(f);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition ${
                          filter === f ? 'text-indigo-400 bg-indigo-500/10' : 'text-white/70'
                        }`}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mark All as Read */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-xl hover:bg-indigo-500/30 transition"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}

              {/* Settings Link */}
              <Link
                href="/settings"
                className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <Bell className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {filter === 'unread' ? 'No unread notifications' : 
                 filter === 'read' ? 'No read notifications' : 
                 'No notifications yet'}
              </h3>
              <p className="text-white/50">
                {filter === 'all' 
                  ? "When you get notifications, they'll show up here" 
                  : 'Try changing the filter'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const iconColor = NOTIFICATION_COLORS[notification.type] || NOTIFICATION_COLORS.system;
                const icon = NOTIFICATION_ICONS[notification.type] || NOTIFICATION_ICONS.system;

                return (
                  <div
                    key={notification._id}
                    className={`group bg-white/5 backdrop-blur-sm border rounded-2xl p-5 transition-all hover:bg-white/10 ${
                      notification.read ? 'border-white/5' : 'border-indigo-500/30 bg-indigo-500/5'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconColor} flex items-center justify-center shrink-0`}>
                        {icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className={`font-semibold ${notification.read ? 'text-white/80' : 'text-white'}`}>
                              {notification.title}
                            </h4>
                            <p className="text-white/50 text-sm mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                          
                          {/* Unread indicator */}
                          {!notification.read && (
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-white/40">
                            {formatDate(notification.createdAt)}
                          </span>

                          {/* Actions */}
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification._id)}
                                className="p-1.5 text-white/40 hover:text-green-400 transition"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification._id)}
                              className="p-1.5 text-white/40 hover:text-red-400 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {notification.link && (
                              <Link
                                href={notification.link}
                                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                              >
                                View
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{notifications.length}</p>
              <p className="text-white/50 text-sm">Total</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-indigo-400">{unreadCount}</p>
              <p className="text-white/50 text-sm">Unread</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{notifications.length - unreadCount}</p>
              <p className="text-white/50 text-sm">Read</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
