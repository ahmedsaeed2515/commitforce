'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import Image from 'next/image';
import { challengeApi } from '@/lib/api/challenge.api';
import { feedApi } from '@/lib/api/feed.api';
import DailyQuestsWidget from '@/components/DailyQuestsWidget';
import { 
  Plus, Target, Globe, Calendar, Wallet, Flame, TrendingUp, Star,
  Trophy, Users, BarChart3, Gamepad2, ChevronRight, CheckCircle, Zap,
  Snowflake, Hand
} from 'lucide-react';
import { ChallengeRowSkeleton } from '@/components/ui/Skeletons';

interface Challenge {
  _id: string;
  title: string;
  endDate: string;
  checkInFrequency: string;
  progress?: number;
  deposit?: {
    amount: number;
    currency: string;
  };
}

interface FeedItem {
  _id: string;
  user: {
    fullName: string;
    avatar?: string;
  };
  challenge: {
    title: string;
  };
  createdAt: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [recentActivity, setRecentActivity] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const challengesRes = await challengeApi.getAll({ status: 'active' });
        if (challengesRes.success) {
          setActiveChallenges(challengesRes.data.challenges || challengesRes.data);
        }

        const feedRes = await feedApi.getFeed(1, 3);
        if (feedRes.success) {
          setRecentActivity(feedRes.data.checkIns);
        }
      } catch (error) {
        console.error('Error loading dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user) return null;

  const level = Math.floor((user.points || 0) / 100) + 1;
  const xpProgress = (user.points || 0) % 100;
  const totalStaked = activeChallenges.reduce((sum, c) => sum + (c.deposit?.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Welcome Header */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between">
            {/* Left - Welcome */}
            <div>
              <p className="text-white/50 text-sm font-medium mb-1 flex items-center gap-1.5">
                {greeting}
                <Hand className="w-4 h-4" />
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {user.fullName}
              </h1>
              <p className="text-white/50">
                You have <span className="text-indigo-400 font-semibold">{activeChallenges.length}</span> active commitments
              </p>
            </div>

            {/* Right - Quick Actions */}
            <div className="flex items-center gap-3">
              <Link 
                href="/challenges/create"
                className="relative group"
              >
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition" />
                <div className="relative bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:from-indigo-400 hover:to-purple-500 transition-all">
                  <Plus className="w-5 h-5" />
                  New Challenge
                </div>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: 'Total Staked', 
                value: `$${totalStaked}`, 
                Icon: Wallet, 
                color: 'from-green-500/20 to-emerald-500/20',
                border: 'border-green-500/20',
                iconColor: 'text-green-400'
              },
              { 
                label: 'Current Streak', 
                value: `${user.streak?.current || 0} days`, 
                Icon: Flame, 
                color: 'from-orange-500/20 to-red-500/20',
                border: 'border-orange-500/20',
                iconColor: 'text-orange-400'
              },
              { 
                label: 'Success Rate', 
                value: `${user.successRate || 0}%`, 
                Icon: TrendingUp, 
                color: 'from-blue-500/20 to-cyan-500/20',
                border: 'border-blue-500/20',
                iconColor: 'text-blue-400'
              },
              { 
                label: 'Total Points', 
                value: user.points || 0, 
                Icon: Star, 
                color: 'from-purple-500/20 to-pink-500/20',
                border: 'border-purple-500/20',
                iconColor: 'text-purple-400'
              },
            ].map((stat, i) => (
              <div 
                key={i} 
                className={`bg-linear-to-br ${stat.color} backdrop-blur-sm border ${stat.border} rounded-2xl p-5 hover:scale-[1.02] transition-all`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <stat.Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  <span className="text-sm text-white/50">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Challenges */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Challenges */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Target className="w-6 h-6 text-indigo-400" />
                    Active Challenges
                  </h2>
                  <Link href="/challenges" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <ChallengeRowSkeleton key={i} />
                    ))}
                  </div>
                ) : activeChallenges.length > 0 ? (
                  <div className="space-y-4">
                    {activeChallenges.slice(0, 4).map((challenge, index) => (
                      <div 
                        key={challenge._id} 
                        className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-5 flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/25">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-indigo-300 transition">{challenge.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-white/50 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(challenge.endDate).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span className="capitalize">{challenge.checkInFrequency}</span>
                              {challenge.deposit && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-400 flex items-center gap-1">
                                    <Wallet className="w-3 h-3" />
                                    ${challenge.deposit.amount}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/challenges/${challenge._id}`}
                          className="bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500/30 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1"
                        >
                          Check In
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                      <Target className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No active challenges</h3>
                    <p className="text-white/50 mb-6">Start your journey by creating your first challenge</p>
                    <Link 
                      href="/challenges/create" 
                      className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-500 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Create Challenge
                    </Link>
                  </div>
                )}
              </div>

              {/* Activity Feed */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Globe className="w-6 h-6 text-blue-400" />
                    Community Activity
                  </h2>
                  <Link href="/feed" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition flex items-center gap-1">
                    View Feed <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((item) => (
                      <div key={item._id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                        <div className="shrink-0">
                          {item.user?.avatar ? (
                            <Image
                              src={item.user.avatar}
                              alt={item.user.fullName}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {item.user?.fullName?.[0]}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white">
                            <span className="font-semibold">{item.user?.fullName}</span>
                            <span className="text-white/50"> checked in to </span>
                            <span className="text-indigo-400 font-medium">{item.challenge?.title}</span>
                          </p>
                          <p className="text-sm text-white/40 mt-1">
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className="text-green-400 text-sm font-medium bg-green-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/50">
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Level Card */}
              <div className="bg-linear-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <span className="text-white font-bold text-2xl">{level}</span>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Current Level</p>
                    <p className="text-white font-bold text-lg">Level {level}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Progress to Level {level + 1}</span>
                    <span className="text-indigo-400 font-medium">{xpProgress}/100 XP</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Daily Quests */}
              <DailyQuestsWidget />

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { href: '/clubs', Icon: Trophy, label: 'Clubs', color: 'from-purple-500/20 to-purple-500/5', iconColor: 'text-purple-400' },
                    { href: '/users', Icon: Users, label: 'Friends', color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-400' },
                    { href: '/analytics', Icon: BarChart3, label: 'Analytics', color: 'from-green-500/20 to-green-500/5', iconColor: 'text-green-400' },
                    { href: '/gamification', Icon: Gamepad2, label: 'Badges', color: 'from-orange-500/20 to-orange-500/5', iconColor: 'text-orange-400' },
                  ].map((action, i) => (
                    <Link 
                      key={i}
                      href={action.href} 
                      className={`bg-linear-to-br ${action.color} border border-white/5 p-4 rounded-xl text-center hover:scale-105 transition-all group`}
                    >
                      <action.Icon className={`w-6 h-6 mx-auto mb-2 ${action.iconColor} group-hover:scale-110 transition-transform`} />
                      <span className="text-sm font-medium text-white/70">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Streak Card */}
              <div className="bg-linear-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    Streak
                  </h3>
                  <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Snowflake className="w-3 h-3" />
                    {user.streak?.freezesAvailable || 0} Freezes
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">{user.streak?.current || 0}</p>
                    <p className="text-sm text-white/50">Current</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">{user.streak?.longest || 0}</p>
                    <p className="text-sm text-white/50">Longest</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
