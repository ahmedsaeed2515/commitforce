'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { userApi } from '@/lib/api/user.api';
import DailyQuestsWidget from '@/components/DailyQuestsWidget';
import Link from 'next/link';
import { 
  BarChart3, Target, CheckCircle, Flame, TrendingUp, Star, 
  Zap, Plus, Trophy, Award, Lightbulb, Snowflake, Gamepad2
} from 'lucide-react';

interface ChallengeStat {
    total: number;
    completed: number;
    failed: number;
    active: number;
}

interface MonthlyData {
    month: string;
    checkIns: number;
    completed: number;
}



export default function AnalyticsPage() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<ChallengeStat>({ total: 0, completed: 0, failed: 0, active: 0 });
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);
            const res = await userApi.getAnalytics();
            if (res.success) {
                setStats(res.data.stats);
                setMonthlyData(res.data.monthlyData);
            }
        } catch {
            console.error('Failed to fetch analytics');
        } finally {
            setIsLoading(false);
        }
    };

    const successRate = stats.total > 0 
        ? Math.round((stats.completed / (stats.completed + stats.failed)) * 100) || 0
        : 0;

    const successProbability = calculateSuccessProbability(user?.streak?.current || 0, successRate);
    const level = Math.floor((user?.points || 0) / 100) + 1;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a1a] py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="h-12 w-1/3 rounded-xl bg-white/5 animate-pulse mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white/5 rounded-2xl h-40 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a1a]">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
            </div>

            <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                                <BarChart3 className="w-10 h-10 text-green-400" />
                                Your Analytics
                            </h1>
                            <p className="text-white/50">Track your progress and performance insights</p>
                        </div>
                        <Link href="/gamification" className="bg-linear-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-indigo-400 hover:to-purple-500 transition flex items-center gap-2">
                            <Gamepad2 className="w-5 h-5" />
                            View Badges
                        </Link>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                        {[
                            { title: 'Total Challenges', value: stats.total, Icon: Target, color: 'from-indigo-500/20 to-purple-500/20', border: 'border-indigo-500/20', iconColor: 'text-indigo-400' },
                            { title: 'Completed', value: stats.completed, Icon: CheckCircle, color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/20', iconColor: 'text-green-400' },
                            { title: 'Active Now', value: stats.active, Icon: Flame, color: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/20', iconColor: 'text-orange-400' },
                            { title: 'Success Rate', value: `${successRate}%`, Icon: TrendingUp, color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/20', iconColor: 'text-purple-400' },
                        ].map((stat, i) => (
                            <div 
                                key={i} 
                                className={`bg-linear-to-br ${stat.color} backdrop-blur-sm border ${stat.border} rounded-2xl p-6 text-center`}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <stat.Icon className={`w-8 h-8 mx-auto mb-3 ${stat.iconColor}`} />
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                                <p className="text-sm text-white/50 mt-1">{stat.title}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Success Probability */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Zap className="w-6 h-6 text-yellow-400" />
                                    Success Probability
                                </h2>
                                <div className="flex items-center gap-8">
                                    <div className="relative w-40 h-40">
                                        {/* Outer glow */}
                                        <div className={`absolute inset-0 rounded-full blur-xl opacity-30 ${
                                            successProbability >= 70 ? 'bg-green-400' : 
                                            successProbability >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                                        }`}></div>
                                        
                                        {/* Circle */}
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                stroke="rgba(255,255,255,0.1)"
                                                strokeWidth="14"
                                                fill="none"
                                            />
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                stroke={successProbability >= 70 ? '#10b981' : successProbability >= 40 ? '#f59e0b' : '#ef4444'}
                                                strokeWidth="14"
                                                fill="none"
                                                strokeDasharray={`${successProbability * 4.4} 440`}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                            <span className="text-4xl font-bold text-white">{successProbability}%</span>
                                            <span className="text-xs text-white/50">probability</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white/60 mb-4">
                                            Based on your current <span className="font-bold text-orange-400">{user?.streak?.current || 0}-day streak</span> and past performance.
                                        </p>
                                        <div className={`p-4 rounded-xl ${
                                            successProbability >= 70 ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 
                                            successProbability >= 40 ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400' : 
                                            'bg-red-500/10 border border-red-500/20 text-red-400'
                                        }`}>
                                            <p className="font-semibold flex items-center gap-2">
                                                {successProbability >= 70 ? (
                                                    <><Zap className="w-5 h-5" /> You&apos;re on fire! Keep it up!</>
                                                ) : successProbability >= 40 ? (
                                                    <><Flame className="w-5 h-5" /> Good progress, stay consistent!</>
                                                ) : (
                                                    <><Target className="w-5 h-5" /> Consider smaller goals to build momentum</>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Activity */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <BarChart3 className="w-6 h-6 text-blue-400" />
                                    Monthly Activity
                                </h2>
                                <div className="flex items-end gap-3 h-52">
                                    {monthlyData.map((data, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center group">
                                            <div className="w-full relative" style={{ height: `${(data.checkIns / 25) * 100}%` }}>
                                                <div 
                                                    className="absolute inset-0 bg-linear-to-t from-indigo-600 to-indigo-400 rounded-t-lg transform group-hover:scale-y-105 origin-bottom transition-transform shadow-lg"
                                                >
                                                    <div className="absolute inset-0 bg-white/20 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                </div>
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 text-xs px-2 py-1 rounded font-medium">
                                                    {data.checkIns}
                                                </div>
                                            </div>
                                            <span className="text-sm text-white/50 mt-3 font-medium">{data.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Streak Stats */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Flame className="w-6 h-6 text-orange-400" />
                                    Streak Stats
                                </h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { Icon: Flame, value: user?.streak?.current || 0, label: 'Current Streak', color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/20', iconColor: 'text-orange-400' },
                                        { Icon: Star, value: user?.streak?.longest || 0, label: 'Longest Streak', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20', iconColor: 'text-purple-400' },
                                        { Icon: Snowflake, value: user?.streak?.freezesAvailable || 0, label: 'Freezes Left', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20', iconColor: 'text-blue-400' },
                                    ].map((stat, i) => (
                                        <div key={i} className={`bg-linear-to-br ${stat.color} border ${stat.border} rounded-2xl p-4 text-center`}>
                                            <stat.Icon className={`w-6 h-6 mx-auto mb-2 ${stat.iconColor}`} />
                                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                                            <p className="text-xs text-white/50">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <DailyQuestsWidget />

                            {/* Points & Level */}
                            <div className="bg-linear-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6 text-center">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400" />
                                    Points & Level
                                </h3>
                                <div className="relative inline-block">
                                    <div className="w-28 h-28 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-2xl mx-auto mb-4">
                                        <div>
                                            <span className="text-3xl font-bold">{level}</span>
                                            <span className="block text-xs opacity-80">LEVEL</span>
                                        </div>
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                        <Star className="w-3 h-3" />
                                        {user?.points || 0}
                                    </div>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
                                    <div 
                                        className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full"
                                        style={{ width: `${((user?.points || 0) % 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-white/50 mt-2">
                                    {100 - ((user?.points || 0) % 100)} XP to next level
                                </p>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <Link href="/challenges/create" className="w-full text-center bg-linear-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-500 transition flex items-center justify-center gap-2">
                                        <Plus className="w-5 h-5" />
                                        New Challenge
                                    </Link>
                                    <Link href="/clubs" className="w-full text-center px-4 py-3 rounded-xl border border-purple-500/30 text-purple-400 font-medium hover:bg-purple-500/10 transition flex items-center justify-center gap-2">
                                        <Trophy className="w-5 h-5" />
                                        Join a Club
                                    </Link>
                                    <Link href="/leaderboard" className="w-full text-center px-4 py-3 rounded-xl border border-white/10 text-white/60 font-medium hover:bg-white/5 transition flex items-center justify-center gap-2">
                                        <Award className="w-5 h-5" />
                                        Leaderboard
                                    </Link>
                                </div>
                            </div>

                            {/* Fun Fact */}
                            <div className="bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
                                <div className="flex items-start gap-3">
                                    <Lightbulb className="w-6 h-6 text-yellow-400 shrink-0" />
                                    <div>
                                        <p className="font-bold text-white mb-1">Did you know?</p>
                                        <p className="text-sm text-white/60">
                                            Users with a 7+ day streak are 3x more likely to complete their challenges!
                                        </p>
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

function calculateSuccessProbability(currentStreak: number, successRate: number): number {
    const streakBonus = Math.min(currentStreak * 2, 30);
    const baseProb = successRate * 0.7;
    const probability = Math.round(baseProb + streakBonus);
    return Math.min(probability, 99);
}
