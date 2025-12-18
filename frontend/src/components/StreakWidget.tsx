'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import apiClient from '@/lib/api/client';
import FreezePurchaseModal from './FreezePurchaseModal';
import toast from 'react-hot-toast';

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
            <div className="bg-linear-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-sm opacity-90">Current Streak</div>
                        <div className="text-5xl font-black">{stats.streak?.current || 0}</div>
                        <div className="text-sm opacity-75">days 🔥</div>
                    </div>
                    <div className="text-6xl">🔥</div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                    <div>
                        <div className="text-xs opacity-75">Longest</div>
                        <div className="text-2xl font-bold">{stats.streak?.longest || 0}</div>
                    </div>
                    <div>
                        <div className="text-xs opacity-75">Freezes</div>
                        <div className="text-2xl font-bold">
                            🧊 {stats.streak?.freezesAvailable || 0}
                        </div>
                    </div>
                </div>

                {/* Freeze Actions */}
                <div className="mt-4 space-y-2">
                    {streakInDanger() && stats.streak && stats.streak.freezesAvailable > 0 && (
                        <button
                            onClick={handleUseFreeze}
                            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 px-4 rounded-lg font-bold transition"
                        >
                            🧊 Use Freeze (Save Streak!)
                        </button>
                    )}
                    
                    <button
                        onClick={() => setShowPurchaseModal(true)}
                        className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm py-2 px-4 rounded-lg font-medium transition text-sm"
                    >
                        + Buy More Freezes
                    </button>
                </div>

                {stats.streak && stats.streak.current >= 3 && (
                    <div className="mt-4 bg-white/20 rounded-lg p-3 text-center text-sm">
                        <span className="font-bold">Keep it up!</span> You&apos;re on fire! 🚀
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
