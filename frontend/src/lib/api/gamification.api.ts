import apiClient from './client';

export interface GamificationStats {
  totalChallenges: number;
  completedChallenges: number;
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  level: number;
  xp: number;
  badges: string[];
  freezeTokens: number;
}

export interface Badge {
  type: string;
  name: string;
  earnedAt: string;
}

/**
 * Get user gamification stats
 */
export const getStats = async () => {
  const response = await apiClient.get('/gamification/stats');
  return response.data;
};

/**
 * Get user badges
 */
export const getBadges = async () => {
  const response = await apiClient.get('/gamification/badges');
  return response.data;
};

/**
 * Use a freeze token
 */
export const useFreezeToken = async () => {
  const response = await apiClient.post('/gamification/freeze');
  return response.data;
};

/**
 * Get streak info
 */
export const getStreak = async () => {
  const response = await apiClient.get('/gamification/streak');
  return response.data;
};

/**
 * Claim daily reward
 */
export const claimDailyReward = async () => {
  const response = await apiClient.post('/gamification/daily-reward');
  return response.data;
};

// Gamification API object for easier imports
export const gamificationApi = {
  getStats,
  getBadges,
  useFreezeToken,
  getStreak,
  claimDailyReward,
};
