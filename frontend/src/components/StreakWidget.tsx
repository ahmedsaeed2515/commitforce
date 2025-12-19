'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import apiClient from '@/lib/api/client';
import FreezePurchaseModal from './FreezePurchaseModal';
import toast from 'react-hot-toast';
import { Flame, Star, Snowflake, Plus, Rocket } from 'lucide-react';

interface StreakStats {
    streak?: {
        current: number;
        longest: number;
        lastCheckIn?: string;
        freezesAvailable: number;
        freezesUsed: number;
    };
    points: number;
    level: number;
}

export default function StreakWidget() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<StreakStats | null>(null);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    const fetchStats = useCallback(async () => {
        try {
            const res = await apiClient.get('/gamification/stats');
            if (res.data.success) {
                setStats(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch gamification stats');
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleUseFreeze = async () => {
        try {
            const res = await apiClient.post('/gamification/freeze/use');
            if (res.data.success) {
                toast.success(res.data.data.message);
                fetchStats();
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Failed to use freeze');
        }
    };

    const streakInDanger = useCallback(() => {
        if (!stats?.streak?.lastCheckIn) return false;
        const now = new Date().getTime();
        const lastCheckIn = new Date(stats.streak.lastCheckIn).getTime();
        const hoursSince = (now - lastCheckIn) / (1000 * 60 * 60);
        return hoursSince > 24 && hoursSince < 48;
    }, [stats]);

    if (!stats) return null;

    return (
        <>
            <div className="bg-linear-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-sm text-white/70">Current Streak</div>
                        <div className="text-5xl font-black text-white">{stats.streak?.current || 0}</div>
                        <div className="text-sm text-white/50 flex items-center gap-1">
                            days <Flame className="w-4 h-4 text-orange-400" />
                        </div>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                        <Flame className="w-10 h-10 text-orange-400" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                        <div className="text-xs text-white/50 flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Longest
                        </div>
                        <div className="text-2xl font-bold text-white">{stats.streak?.longest || 0}</div>
                    </div>
                    <div>
                        <div className="text-xs text-white/50 flex items-center gap-1">
                            <Snowflake className="w-3 h-3" />
                            Freezes
                        </div>
                        <div className="text-2xl font-bold text-white flex items-center gap-1">
                            <Snowflake className="w-5 h-5 text-blue-400" />
                            {stats.streak?.freezesAvailable || 0}
                        </div>
                    </div>
                </div>

                {/* Freeze Actions */}
                <div className="mt-4 space-y-2">
                    {streakInDanger() && stats.streak && stats.streak.freezesAvailable > 0 && (
                        <button
                            onClick={handleUseFreeze}
                            className="w-full bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 backdrop-blur-sm py-2.5 px-4 rounded-xl font-bold transition text-blue-400 flex items-center justify-center gap-2"
                        >
                            <Snowflake className="w-5 h-5" />
                            Use Freeze (Save Streak!)
                        </button>
                    )}
                    
                    <button
                        onClick={() => setShowPurchaseModal(true)}
                        className="w-full bg-white/10 hover:bg-white/15 backdrop-blur-sm py-2.5 px-4 rounded-xl font-medium transition text-sm text-white/70 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Buy More Freezes
                    </button>
                </div>

                {stats.streak && stats.streak.current >= 3 && (
                    <div className="mt-4 bg-white/10 rounded-xl p-3 text-center text-sm text-white/70 flex items-center justify-center gap-2">
                        <Rocket className="w-4 h-4 text-indigo-400" />
                        <span><span className="font-bold text-white">Keep it up!</span> You&apos;re on fire!</span>
                    </div>
                )}
            </div>

            <FreezePurchaseModal
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                onSuccess={fetchStats}
                userPoints={stats.points || 0}
                userBalance={user?.balance?.amount || 0}
            />
        </>
    );
}
