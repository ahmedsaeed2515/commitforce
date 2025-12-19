'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import NotificationDropdown from './NotificationDropdown';
import { 
  LayoutDashboard, Target, Newspaper, Medal, Users, BarChart3, 
  Settings, LogOut, User, Gamepad2, CreditCard, Flame, Wallet, Menu, X, Trophy, MessageCircle
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { href: '/challenges', label: 'Challenges', Icon: Target },
    { href: '/feed', label: 'Feed', Icon: Newspaper },
    { href: '/leaderboard', label: 'Leaderboard', Icon: Medal },
    { href: '/clubs', label: 'Clubs', Icon: Users },
    { href: '/users', label: 'Users', Icon: Users },
    { href: '/analytics', label: 'Analytics', Icon: BarChart3 },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition" />
                <div className="relative w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">CommitForce</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive(link.href)
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                href="/admin/checks"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive('/admin/checks')
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Streak Badge */}
            {user?.streak && user.streak.current > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1.5 rounded-full text-sm font-medium">
                <Flame className="w-4 h-4" />
                <span>{user.streak.current} days</span>
              </div>
            )}

            {/* Wallet Balance */}
            <div className="hidden sm:flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-sm font-medium">
              <Wallet className="w-4 h-4" />
              <span>${user?.balance?.amount || 0}</span>
            </div>

            {/* Notifications */}
            <NotificationDropdown />

            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10 hover:ring-indigo-500/50 transition-all">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.fullName || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {user?.fullName?.[0]}
                  </div>
                )}
              </button>
              
              {/* Dropdown Menu */}
              <div className="hidden group-hover:block absolute right-0 mt-2 w-56 bg-[#0a0a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl z-50">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white">{user?.fullName}</p>
                  <p className="text-xs text-white/50">@{user?.username}</p>
                </div>
                <div className="py-1">
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition">
                    <User className="w-4 h-4" />
                    Your Profile
                  </Link>
                  <Link href="/gamification" className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition">
                    <Gamepad2 className="w-4 h-4" />
                    Badges & Progress
                  </Link>
                  <Link href="/achievements" className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition">
                    <Trophy className="w-4 h-4" />
                    Achievements
                  </Link>
                  <Link href="/wallet/deposit" className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition">
                    <CreditCard className="w-4 h-4" />
                    Deposit Funds
                  </Link>
                  <Link href="/messages" className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition">
                    <MessageCircle className="w-4 h-4" />
                    Messages
                  </Link>
                  <Link href="/notifications" className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition">
                    <Flame className="w-4 h-4" />
                    Notifications
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </div>
                <div className="border-t border-white/10 pt-1">
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/5">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl flex items-center gap-3 transition ${
                    isActive(link.href)
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
