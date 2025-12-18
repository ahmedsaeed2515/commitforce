import apiClient from './client';

export const leaderboardApi = {
  getLeaderboard: async (limit: number = 10) => {
    const response = await apiClient.get(`/leaderboard?limit=${limit}`);
    return response.data;
  },
};
