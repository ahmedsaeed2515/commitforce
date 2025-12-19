'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';
import { Trophy, CheckCircle } from 'lucide-react';

interface Badge {
    _id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserBadge {
    badge: Badge;
    earnedAt: string;
}

export default function BadgesDisplay() {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [myBadges, setMyBadges] = useState<UserBadge[]>([]);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const [allRes, myRes] = await Promise.all([
                    apiClient.get('/gamification/badges'),
                    apiClient.get('/gamification/my-badges')
                ]);

                if (allRes.data.success) setBadges(allRes.data.data);
                if (myRes.data.success) setMyBadges(myRes.data.data);
            } catch {
                console.error('Failed to fetch badges');
            }
        };
        
        fetchBadges();
    }, []);

    const hasBadge = (badgeId: string) => {
        return myBadges.some((mb) => mb.badge._id === badgeId);
    };

    const getRarityStyles = (rarity: string, earned: boolean) => {
        if (!earned) {
            return 'bg-white/5 border-white/10 opacity-50 grayscale';
        }
        switch (rarity) {
            case 'common': return 'bg-linear-to-br from-gray-500/20 to-gray-500/5 border-gray-500/30';
            case 'rare': return 'bg-linear-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30';
            case 'epic': return 'bg-linear-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30';
            case 'legendary': return 'bg-linear-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30';
            default: return 'bg-white/5 border-white/10';
        }
    };

    const getRarityLabel = (rarity: string) => {
        const colors: Record<string, string> = {
            common: 'text-gray-400',
            rare: 'text-blue-400',
            epic: 'text-purple-400',
            legendary: 'text-yellow-400',
        };
        return colors[rarity] || 'text-white/50';
    };

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.map((badge) => {
                    const earned = hasBadge(badge._id);
                    return (
                        <div
                            key={badge._id}
                            className={`
                                relative p-4 rounded-xl border-2 transition-all hover:scale-[1.02]
                                ${getRarityStyles(badge.rarity, earned)}
                            `}
                        >
                            <div className="text-center">
                                <div className="text-4xl mb-2">{badge.icon}</div>
                                <div className="font-bold text-sm text-white">
                                    {badge.name}
                                </div>
                                <div className="text-xs text-white/50 mt-1">
                                    {badge.description}
                                </div>
                                <div className={`text-xs mt-2 font-medium capitalize ${getRarityLabel(badge.rarity)}`}>
                                    {badge.rarity}
                                </div>
                                {earned && (
                                    <div className="absolute top-2 right-2">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 text-center text-sm text-white/50 flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Collected: {myBadges.length} / {badges.length}
            </div>
        </div>
    );
}
