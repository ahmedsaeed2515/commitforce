'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { gamificationApi } from '@/lib/api/gamification.api';
import toast from 'react-hot-toast';
import { 
  Trophy, Star, Flame, Target, Zap, Crown, 
  Medal, Award, Shield, Gem, Lock, CheckCircle,
  TrendingUp, Calendar, Users, Gift
} from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface Badge {
  type: string;
  name: string;
  earnedAt?: string;
  unlocked: boolean;
  description: string;
  icon: React.ReactNode;
  color: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface UserStats {
  totalChallenges: number;
  completedChallenges: number;
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  level: number;
  xp: number;
  badges: string[];
}

const BADGE_DEFINITIONS: Omit<Badge, 'unlocked' | 'earnedAt'>[] = [
  { type: 'first_challenge', name: 'First Steps', description: 'Complete your first challenge', icon: <Target className="w-6 h-6" />, color: 'from-green-400 to-emerald-600', rarity: 'common' },
  { type: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: <Flame className="w-6 h-6" />, color: 'from-orange-400 to-red-600', rarity: 'common' },
  { type: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: <Flame className="w-6 h-6" />, color: 'from-red-400 to-rose-600', rarity: 'uncommon' },
  { type: 'streak_100', name: 'Century Champion', description: 'Maintain a 100-day streak', icon: <Crown className="w-6 h-6" />, color: 'from-amber-400 to-yellow-600', rarity: 'rare' },
  { type: 'streak_365', name: 'Eternal Flame', description: 'Maintain a 365-day streak', icon: <Zap className="w-6 h-6" />, color: 'from-purple-400 to-pink-600', rarity: 'legendary' },
  { type: 'challenges_5', name: 'Challenge Seeker', description: 'Complete 5 challenges', icon: <Medal className="w-6 h-6" />, color: 'from-blue-400 to-indigo-600', rarity: 'common' },
  { type: 'challenges_10', name: 'Goal Getter', description: 'Complete 10 challenges', icon: <Award className="w-6 h-6" />, color: 'from-indigo-400 to-purple-600', rarity: 'uncommon' },
  { type: 'challenges_25', name: 'Achievement Hunter', description: 'Complete 25 challenges', icon: <Shield className="w-6 h-6" />, color: 'from-purple-400 to-violet-600', rarity: 'rare' },
  { type: 'challenges_50', name: 'Legend', description: 'Complete 50 challenges', icon: <Gem className="w-6 h-6" />, color: 'from-pink-400 to-rose-600', rarity: 'epic' },
  { type: 'challenges_100', name: 'Immortal', description: 'Complete 100 challenges', icon: <Crown className="w-6 h-6" />, color: 'from-yellow-400 to-amber-600', rarity: 'legendary' },
  { type: 'early_bird', name: 'Early Bird', description: 'Check in before 6 AM', icon: <Calendar className="w-6 h-6" />, color: 'from-cyan-400 to-blue-600', rarity: 'uncommon' },
  { type: 'night_owl', name: 'Night Owl', description: 'Check in after midnight', icon: <Star className="w-6 h-6" />, color: 'from-violet-400 to-purple-600', rarity: 'uncommon' },
  { type: 'social_butterfly', name: 'Social Butterfly', description: 'Join 5 clubs', icon: <Users className="w-6 h-6" />, color: 'from-teal-400 to-green-600', rarity: 'rare' },
  { type: 'perfectionist', name: 'Perfectionist', description: 'Complete a challenge with 100% check-ins', icon: <CheckCircle className="w-6 h-6" />, color: 'from-emerald-400 to-teal-600', rarity: 'rare' },
  { type: 'level_10', name: 'Rising Star', description: 'Reach level 10', icon: <TrendingUp className="w-6 h-6" />, color: 'from-orange-400 to-amber-600', rarity: 'uncommon' },
  { type: 'level_25', name: 'Superstar', description: 'Reach level 25', icon: <Star className="w-6 h-6" />, color: 'from-yellow-400 to-orange-600', rarity: 'rare' },
];

const RARITY_STYLES = {
  common: 'border-gray-500/30 bg-gray-500/10',
  uncommon: 'border-green-500/30 bg-green-500/10',
  rare: 'border-blue-500/30 bg-blue-500/10',
  epic: 'border-purple-500/30 bg-purple-500/10',
  legendary: 'border-yellow-500/30 bg-yellow-500/10 animate-pulse',
};

export default function AchievementsPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await gamificationApi.getStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        toast.error('Failed to load achievements');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Map badges with unlock status
  const badges: Badge[] = BADGE_DEFINITIONS.map(def => ({
    ...def,
    unlocked: stats?.badges?.includes(def.type) || false,
    earnedAt: stats?.badges?.includes(def.type) ? new Date().toISOString() : undefined,
  }));

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalBadges = badges.length;
  const completionPercentage = Math.round((unlockedCount / totalBadges) * 100);

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    if (badge.unlocked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={150} recycle={false} />}
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2">Achievements</h1>
            <p className="text-white/60 max-w-md mx-auto">
              Track your progress and unlock badges as you complete challenges
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats?.completedChallenges || 0}</p>
              <p className="text-white/50 text-sm">Challenges Completed</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats?.currentStreak || 0}</p>
              <p className="text-white/50 text-sm">Current Streak</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats?.level || 1}</p>
              <p className="text-white/50 text-sm">Current Level</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                <Medal className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-white">{unlockedCount}/{totalBadges}</p>
              <p className="text-white/50 text-sm">Badges Unlocked</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-indigo-400" />
                Collection Progress
              </h3>
              <span className="text-indigo-400 font-bold">{completionPercentage}%</span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 relative"
                style={{ width: `${completionPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <p className="text-white/40 text-sm mt-3">
              {unlockedCount === totalBadges 
                ? '🎉 Congratulations! You have unlocked all badges!' 
                : `${totalBadges - unlockedCount} badges remaining to complete your collection`
              }
            </p>
          </div>

          {/* Badges Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              All Badges
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {badges.map((badge) => (
                <button
                  key={badge.type}
                  onClick={() => handleBadgeClick(badge)}
                  className={`relative p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                    badge.unlocked 
                      ? RARITY_STYLES[badge.rarity] 
                      : 'border-white/5 bg-white/5 opacity-50'
                  }`}
                >
                  {/* Badge Icon */}
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                    badge.unlocked 
                      ? `bg-gradient-to-br ${badge.color} shadow-lg` 
                      : 'bg-white/10'
                  }`}>
                    {badge.unlocked ? badge.icon : <Lock className="w-6 h-6 text-white/30" />}
                  </div>
                  
                  {/* Badge Name */}
                  <p className={`font-semibold text-center text-sm ${badge.unlocked ? 'text-white' : 'text-white/40'}`}>
                    {badge.name}
                  </p>
                  
                  {/* Rarity Label */}
                  <p className={`text-xs text-center mt-1 capitalize ${
                    badge.rarity === 'legendary' ? 'text-yellow-400' :
                    badge.rarity === 'epic' ? 'text-purple-400' :
                    badge.rarity === 'rare' ? 'text-blue-400' :
                    badge.rarity === 'uncommon' ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {badge.rarity}
                  </p>

                  {/* Unlocked Checkmark */}
                  {badge.unlocked && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Badge Detail Modal */}
          {selectedBadge && (
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedBadge(null)}
            >
              <div 
                className={`bg-[#0a0a1a] border-2 rounded-3xl p-8 max-w-sm w-full ${
                  selectedBadge.unlocked ? RARITY_STYLES[selectedBadge.rarity] : 'border-white/10'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                  selectedBadge.unlocked 
                    ? `bg-gradient-to-br ${selectedBadge.color} shadow-2xl` 
                    : 'bg-white/10'
                }`}>
                  {selectedBadge.unlocked 
                    ? <div className="w-12 h-12">{selectedBadge.icon}</div>
                    : <Lock className="w-12 h-12 text-white/30" />
                  }
                </div>
                
                <h3 className="text-2xl font-bold text-white text-center mb-2">
                  {selectedBadge.name}
                </h3>
                
                <p className={`text-center text-sm mb-4 capitalize ${
                  selectedBadge.rarity === 'legendary' ? 'text-yellow-400' :
                  selectedBadge.rarity === 'epic' ? 'text-purple-400' :
                  selectedBadge.rarity === 'rare' ? 'text-blue-400' :
                  selectedBadge.rarity === 'uncommon' ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {selectedBadge.rarity}
                </p>
                
                <p className="text-white/60 text-center mb-6">
                  {selectedBadge.description}
                </p>
                
                {selectedBadge.unlocked ? (
                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Unlocked
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white/40 rounded-full text-sm">
                      <Lock className="w-4 h-4" />
                      Locked
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="w-full mt-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
