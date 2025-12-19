'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { challengeApi } from '@/lib/api/challenge.api';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Target, CheckCircle, Flame, Heart, Wallet, Star, Settings, 
  CreditCard, Calendar, Sparkles, BarChart3, Trophy, Gamepad2, Medal, ChevronRight
} from 'lucide-react';

interface Challenge {
  _id: string;
  title: string;
  status: string;
  endDate: string;
  checkInFrequency: string;
  progress?: number;
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await challengeApi.getAll();
      if (res.success) {
        setChallenges(res.data.challenges || res.data);
      }
    } catch {
      console.error('Failed to fetch profile data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');
  const level = Math.floor((user.points || 0) / 100) + 1;

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Profile Header */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            {/* Cover */}
            <div className="h-40 bg-linear-to-br from-indigo-500 via-purple-600 to-pink-500 relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-5 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-5 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
              
              {/* Level Badge */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-300" />
                Level {level}
              </div>
            </div>

            <div className="px-8 pb-8 relative">
              {/* Avatar */}
              <div className="-mt-20 mb-6 flex justify-between items-end">
                <div className="relative group">
                  {user.avatar ? (
                    <div className="w-36 h-36 ring-4 ring-[#0a0a1a] shadow-2xl overflow-hidden rounded-full">
                      <Image
                        src={user.avatar}
                        alt={user.fullName}
                        width={144}
                        height={144}
                        className="rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-36 h-36 rounded-full ring-4 ring-[#0a0a1a] shadow-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-bold text-white group-hover:scale-105 transition-transform">
                      {user.fullName[0]}
                    </div>
                  )}
                  {/* Online indicator */}
                  <div className="absolute bottom-3 right-3 w-6 h-6 bg-green-500 rounded-full ring-4 ring-[#0a0a1a]"></div>
                </div>

                <div className="flex gap-3 mb-4">
                  <Link href="/settings" className="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 font-medium hover:bg-white/5 transition flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </Link>
                  <Link href="/wallet/deposit" className="bg-linear-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-indigo-400 hover:to-purple-500 transition flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Add Funds
                  </Link>
                </div>
              </div>

              {/* User Info */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-1">{user.fullName}</h1>
                <p className="text-lg text-white/50">@{user.username}</p>
                {user.bio && (
                  <p className="mt-3 text-white/60 max-w-2xl">{user.bio}</p>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { Icon: Target, value: user.totalChallenges || challenges.length, label: 'Challenges', color: 'from-indigo-500/20 to-indigo-500/5', border: 'border-indigo-500/20', iconColor: 'text-indigo-400' },
                  { Icon: CheckCircle, value: `${user.successRate || 0}%`, label: 'Success Rate', color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/20', iconColor: 'text-green-400' },
                  { Icon: Flame, value: user.streak?.current || 0, label: 'Day Streak', color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/20', iconColor: 'text-orange-400' },
                  { Icon: Heart, value: `$${user.totalDonated || 0}`, label: 'To Charity', color: 'from-pink-500/20 to-pink-500/5', border: 'border-pink-500/20', iconColor: 'text-pink-400' },
                  { Icon: Wallet, value: `$${user.balance?.amount || 0}`, label: 'Wallet', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20', iconColor: 'text-purple-400' },
                ].map((stat, i) => (
                  <div key={i} className={`bg-linear-to-br ${stat.color} backdrop-blur-sm border ${stat.border} rounded-2xl p-4 text-center`}>
                    <stat.Icon className={`w-6 h-6 mx-auto mb-2 ${stat.iconColor}`} />
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Challenges */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-400" />
                Active Challenges
              </h2>
              <Link href="/challenges" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white/5 rounded-2xl h-40 animate-pulse"></div>
                ))}
              </div>
            ) : activeChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeChallenges.map((challenge, index) => (
                  <Link
                    href={`/challenges/${challenge._id}`}
                    key={challenge._id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:border-white/20 hover:scale-[1.02] transition-all"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition">
                        {challenge.title}
                      </h3>
                      <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium px-2 py-1 rounded-full">Active</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
                      <div className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '45%' }}></div>
                    </div>

                    <div className="flex justify-between text-sm text-white/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Ends {new Date(challenge.endDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        {challenge.checkInFrequency} check-ins
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-dashed border-white/20 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                  <Target className="w-8 h-8 text-indigo-400" />
                </div>
                <p className="text-white/50 mb-4">You have no active challenges.</p>
                <Link href="/challenges/create" className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-500 transition">
                  Create Your First Challenge
                </Link>
              </div>
            )}
          </div>

          {/* Past Achievements */}
          {completedChallenges.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Past Achievements
              </h2>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                <div className="divide-y divide-white/5">
                  {completedChallenges.map((challenge, index) => (
                    <Link
                      href={`/challenges/${challenge._id}`}
                      key={challenge._id}
                      className="flex items-center justify-between p-5 hover:bg-white/5 transition group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-indigo-400 transition">
                            {challenge.title}
                          </p>
                          <p className="text-sm text-white/50">
                            Completed {new Date(challenge.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium px-3 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        Success
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: '/analytics', Icon: BarChart3, label: 'Analytics', color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/20', iconColor: 'text-green-400' },
              { href: '/clubs', Icon: Trophy, label: 'My Clubs', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20', iconColor: 'text-purple-400' },
              { href: '/gamification', Icon: Gamepad2, label: 'Badges', color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/20', iconColor: 'text-orange-400' },
              { href: '/leaderboard', Icon: Medal, label: 'Leaderboard', color: 'from-yellow-500/20 to-yellow-500/5', border: 'border-yellow-500/20', iconColor: 'text-yellow-400' },
            ].map((action, i) => (
              <Link key={i} href={action.href} className={`bg-linear-to-br ${action.color} border ${action.border} p-6 rounded-2xl text-center group hover:scale-[1.02] transition-all`}>
                <action.Icon className={`w-8 h-8 mx-auto mb-2 ${action.iconColor} group-hover:scale-110 transition-transform`} />
                <p className="font-medium text-white">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
