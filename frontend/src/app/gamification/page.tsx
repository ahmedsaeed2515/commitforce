'use client';

import StreakWidget from '@/components/StreakWidget';
import BadgesDisplay from '@/components/BadgesDisplay';
import DailyQuestsWidget from '@/components/DailyQuestsWidget';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import { 
  Gamepad2, Flame, Star, Snowflake, Trophy, Target, Zap, 
  Plus, BarChart3, Lightbulb, Medal, CheckCircle
} from 'lucide-react';

export default function GamificationPage() {
    const { user } = useAuthStore();
    const level = Math.floor((user?.points || 0) / 100) + 1;
    const progress = ((user?.points || 0) % 100);

    return (
        <div className="min-h-screen bg-[#0a0a1a]">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
            </div>

            <div className="relative z-10 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-linear-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl overflow-hidden mb-8 relative">
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                        </div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-8">
                            <div className="text-white">
                                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                                    <Gamepad2 className="w-10 h-10" />
                                    Your Progress
                                </h1>
                                <p className="text-white/80 text-lg">
                                    Track your streaks, earn badges, and level up!
                                </p>
                            </div>
                            
                            {/* Level Badge */}
                            <div className="flex items-center gap-4">
                                <div className="text-center p-6 bg-white/20 backdrop-blur-sm rounded-2xl">
                                    <div className="text-5xl font-black text-white mb-1">{level}</div>
                                    <div className="text-white/80 text-sm font-medium">LEVEL</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-white">{user?.points || 0}</div>
                                    <div className="text-white/80 text-sm">Total Points</div>
                                    <div className="w-32 h-2 bg-white/30 rounded-full mt-2 overflow-hidden">
                                        <div 
                                            className="h-full bg-yellow-400 rounded-full transition-all"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-white/60 text-xs mt-1">{progress}/100 to next level</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { Icon: Flame, value: user?.streak?.current || 0, label: 'Day Streak', color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/20', iconColor: 'text-orange-400' },
                            { Icon: Star, value: user?.streak?.longest || 0, label: 'Best Streak', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20', iconColor: 'text-purple-400' },
                            { Icon: Snowflake, value: user?.streak?.freezesAvailable || 0, label: 'Freeze Tokens', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20', iconColor: 'text-blue-400' },
                            { Icon: Trophy, value: user?.completedChallenges || 0, label: 'Completed', color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/20', iconColor: 'text-green-400' },
                        ].map((stat, i) => (
                            <div key={i} className={`bg-linear-to-br ${stat.color} backdrop-blur-sm border ${stat.border} rounded-2xl p-5 text-center`}>
                                <stat.Icon className={`w-8 h-8 mx-auto mb-2 ${stat.iconColor}`} />
                                <div className="text-3xl font-bold text-white">{stat.value}</div>
                                <div className="text-sm text-white/50">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Streak Widget */}
                        <div className="lg:col-span-1">
                            <StreakWidget />
                        </div>

                        {/* Daily Quests */}
                        <div className="lg:col-span-1">
                            <DailyQuestsWidget />
                        </div>

                        {/* Quick Actions & Tips */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Pro Tips */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                                    Pro Tips
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { Icon: Flame, text: 'Check in daily to maintain your streak and earn freeze tokens!', bg: 'from-indigo-500/10 to-indigo-500/5', border: 'border-indigo-500/20', title: 'Streak Power:' },
                                        { Icon: Target, text: 'Finish all daily quests for bonus XP!', bg: 'from-green-500/10 to-green-500/5', border: 'border-green-500/20', title: 'Complete Quests:' },
                                        { Icon: Trophy, text: 'Team up and earn more together!', bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/20', title: 'Join Clubs:' },
                                    ].map((tip, i) => (
                                        <div key={i} className={`flex items-start gap-3 p-3 bg-linear-to-br ${tip.bg} border ${tip.border} rounded-xl`}>
                                            <tip.Icon className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
                                            <div className="text-sm text-white/60">
                                                <strong className="text-white">{tip.title}</strong> {tip.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    Quick Actions
                                </h3>
                                <div className="space-y-2">
                                    <Link href="/challenges/create" className="w-full text-center bg-linear-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-500 transition flex items-center justify-center gap-2">
                                        <Plus className="w-5 h-5" />
                                        New Challenge
                                    </Link>
                                    <Link href="/clubs" className="w-full text-center px-4 py-3 rounded-xl border border-purple-500/30 text-purple-400 font-semibold hover:bg-purple-500/10 transition flex items-center justify-center gap-2">
                                        <Trophy className="w-5 h-5" />
                                        Browse Clubs
                                    </Link>
                                    <Link href="/analytics" className="w-full text-center px-4 py-3 rounded-xl border border-white/10 text-white/60 font-semibold hover:bg-white/5 transition flex items-center justify-center gap-2">
                                        <BarChart3 className="w-5 h-5" />
                                        View Analytics
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Badges Section */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Medal className="w-6 h-6 text-yellow-400" />
                                Your Badges
                            </h2>
                            <div className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm font-medium px-3 py-1 rounded-full">
                                Collection
                            </div>
                        </div>
                        <BadgesDisplay />
                    </div>

                    {/* Achievement Progress */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mt-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-400" />
                            Achievement Progress
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AchievementProgress 
                                title="7-Day Streak" 
                                current={user?.streak?.current || 0} 
                                target={7} 
                                Icon={Flame}
                                color="orange"
                            />
                            <AchievementProgress 
                                title="30-Day Streak" 
                                current={user?.streak?.current || 0} 
                                target={30} 
                                Icon={Zap}
                                color="yellow"
                            />
                            <AchievementProgress 
                                title="Complete 5 Challenges" 
                                current={user?.completedChallenges || 0} 
                                target={5} 
                                Icon={Target}
                                color="blue"
                            />
                            <AchievementProgress 
                                title="Earn 500 Points" 
                                current={user?.points || 0} 
                                target={500} 
                                Icon={Star}
                                color="purple"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AchievementProgress({ title, current, target, Icon, color }: {
    title: string;
    current: number;
    target: number;
    Icon: React.ComponentType<{ className?: string }>;
    color: string;
}) {
    const percentage = Math.min((current / target) * 100, 100);
    const isComplete = current >= target;
    
    const bgColors: Record<string, string> = {
        orange: 'from-orange-500/20 to-orange-500/5',
        yellow: 'from-yellow-500/20 to-yellow-500/5',
        blue: 'from-blue-500/20 to-blue-500/5',
        purple: 'from-purple-500/20 to-purple-500/5',
    };

    const borderColors: Record<string, string> = {
        orange: 'border-orange-500/30',
        yellow: 'border-yellow-500/30',
        blue: 'border-blue-500/30',
        purple: 'border-purple-500/30',
    };

    const barColors: Record<string, string> = {
        orange: 'from-orange-400 to-orange-600',
        yellow: 'from-yellow-400 to-yellow-600',
        blue: 'from-blue-400 to-blue-600',
        purple: 'from-purple-400 to-purple-600',
    };

    const iconColors: Record<string, string> = {
        orange: 'text-orange-400',
        yellow: 'text-yellow-400',
        blue: 'text-blue-400',
        purple: 'text-purple-400',
    };

    return (
        <div className={`p-4 rounded-xl bg-linear-to-br ${bgColors[color]} border ${isComplete ? 'border-green-500/30' : borderColors[color]}`}>
            <div className="flex items-center gap-3 mb-3">
                <Icon className={`w-6 h-6 ${iconColors[color]}`} />
                <div className="flex-1">
                    <p className="font-semibold text-white">{title}</p>
                    <p className="text-sm text-white/50">{current} / {target}</p>
                </div>
                {isComplete && <CheckCircle className="w-6 h-6 text-green-400" />}
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full bg-linear-to-r ${barColors[color]} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
