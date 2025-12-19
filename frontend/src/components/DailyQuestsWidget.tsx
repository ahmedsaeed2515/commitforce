'use client';

import { useState, useEffect } from 'react';
import { dailyQuestApi } from '@/lib/api/dailyQuest.api';

import { Calendar, Heart, Eye, MessageSquare, CheckCircle, Share2, Trophy, Sparkles } from 'lucide-react';

interface Quest {
    type: string;
    target: number;
    progress: number;
    completed: boolean;
    rewardPoints: number;
}

interface DailyQuests {
    quests: Quest[];
    allCompleted: boolean;
    bonusReward: number;
}

const questConfig: Record<string, { Icon: React.ComponentType<{ className?: string }>, label: string }> = {
    like_posts: { Icon: Heart, label: 'Like 3 posts' },
    view_challenges: { Icon: Eye, label: 'View 5 challenges' },
    comment: { Icon: MessageSquare, label: 'Leave 2 comments' },
    check_in: { Icon: CheckCircle, label: 'Complete a check-in' },
    share: { Icon: Share2, label: 'Share a challenge' }
};

export default function DailyQuestsWidget() {
    const [dailyQuests, setDailyQuests] = useState<DailyQuests | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchQuests();
    }, []);

    const fetchQuests = async () => {
        try {
            setIsLoading(true);
            const res = await dailyQuestApi.getQuests();
            if (res.success) {
                setDailyQuests(res.data);
            }
        } catch {
            console.error('Failed to load daily quests');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-white/5 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!dailyQuests) return null;

    const completedCount = dailyQuests.quests.filter(q => q.completed).length;
    const totalPoints = dailyQuests.quests.reduce((sum, q) => sum + (q.completed ? q.rewardPoints : 0), 0);

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    Daily Quests
                </h3>
                <span className="text-sm text-white/50">
                    {completedCount}/{dailyQuests.quests.length} Completed
                </span>
            </div>

            {dailyQuests.allCompleted && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                    <span className="text-green-400 font-medium flex items-center justify-center gap-2">
                        <Trophy className="w-5 h-5" />
                        All quests completed! +{dailyQuests.bonusReward} bonus points!
                    </span>
                </div>
            )}

            <div className="space-y-3">
                {dailyQuests.quests.map((quest, index) => {
                    const config = questConfig[quest.type] || { Icon: Sparkles, label: quest.type };
                    const IconComponent = config.Icon;
                    
                    return (
                        <div
                            key={index}
                            className={`p-3 rounded-xl border transition ${
                                quest.completed
                                    ? 'bg-green-500/10 border-green-500/20'
                                    : 'bg-white/5 border-white/10'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className={`flex items-center gap-2 ${quest.completed ? 'line-through text-white/40' : 'text-white/70'}`}>
                                    <IconComponent className={`w-4 h-4 ${quest.completed ? 'text-green-400' : 'text-indigo-400'}`} />
                                    {config.label}
                                </span>
                                <span className="text-sm font-medium text-indigo-400">
                                    +{quest.rewardPoints} pts
                                </span>
                            </div>
                            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 rounded-full ${
                                        quest.completed ? 'bg-green-500' : 'bg-linear-to-r from-indigo-500 to-purple-500'
                                    }`}
                                    style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                                ></div>
                            </div>
                            <div className="mt-1 text-xs text-white/40 text-right">
                                {quest.progress}/{quest.target}
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalPoints > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10 text-center">
                    <span className="text-white/50">Points earned today: </span>
                    <span className="font-bold text-indigo-400">{totalPoints}</span>
                </div>
            )}
        </div>
    );
}
