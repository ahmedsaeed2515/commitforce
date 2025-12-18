'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';

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
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            const [allRes, myRes] = await Promise.all([
                apiClient.get('/gamification/badges'),
                apiClient.get('/gamification/my-badges')
            ]);

            if (allRes.data.success) setBadges(allRes.data.data);
            if (myRes.data.success) setMyBadges(myRes.data.data);
        } catch (error) {
            console.error('Failed to fetch badges');
        }
    };

    const hasBadge = (badgeId: string) => {
        return myBadges.some((mb) => mb.badge._id === badgeId);
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'bg-gray-100 border-gray-300';
            case 'rare': return 'bg-blue-100 border-blue-400';
            case 'epic': return 'bg-purple-100 border-purple-400';
            case 'legendary': return 'bg-yellow-100 border-yellow-400';
            default: return 'bg-gray-100 border-gray-300';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Badges Collection 🏆
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.map((badge) => {
                    const earned = hasBadge(badge._id);
                    return (
                        <div
                            key={badge._id}
                            className={`
                                relative p-4 rounded-xl border-2 transition-all
                                ${earned 
                                    ? getRarityColor(badge.rarity) + ' shadow-md' 
                                    : 'bg-gray-50 border-gray-200 opacity-40 grayscale'
                                }
                            `}
                        >
                            <div className="text-center">
                                <div className="text-4xl mb-2">{badge.icon}</div>
                                <div className="font-bold text-sm text-gray-900">
                                    {badge.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {badge.description}
                                </div>
                                {earned && (
                                    <div className="absolute top-2 right-2">
                                        <span className="text-xl">✅</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
                Collected: {myBadges.length} / {badges.length}
            </div>
        </div>
    );
}
