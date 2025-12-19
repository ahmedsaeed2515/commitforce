'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import toast from 'react-hot-toast';

export default function BadgeNotificationListener() {
    useEffect(() => {
        const socket = getSocket();

        socket.on('badge:earned', (data: {
            badge: {
                name: string;
                description: string;
                icon: string;
                rarity: string;
            };
            rewards?: {
                points?: number;
                freezeTokens?: number;
            };
        }) => {
            // Show toast notification
            toast.success(
                `🏆 Badge Earned: ${data.badge.icon} ${data.badge.name}!`,
                { 
                    duration: 5000,
                    style: {
                        background: '#10b981',
                        color: '#fff',
                        fontWeight: 'bold'
                    }
                }
            );

            // Show rewards if any
            if (data.rewards) {
                const rewardText: string[] = [];
                if (data.rewards.points) rewardText.push(`+${data.rewards.points} points`);
                if (data.rewards.freezeTokens) rewardText.push(`+${data.rewards.freezeTokens} freeze tokens`);
                
                if (rewardText.length > 0) {
                    setTimeout(() => {
                        toast.success(`Rewards: ${rewardText.join(', ')}`, { duration: 3000 });
                    }, 500);
                }
            }
        });

        return () => {
            socket.off('badge:earned');
        };
    }, []);

    return null; // This component doesn't render anything
}
