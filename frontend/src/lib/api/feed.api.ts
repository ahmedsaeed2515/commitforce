import apiClient from './client';

export const feedApi = {
  getFeed: async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get(`/feed?page=${page}&limit=${limit}`);
    return response.data;
  },

  likeCheckIn: async (checkInId: string) => {
    const response = await apiClient.post(`/feed/${checkInId}/like`);
    return response.data;
  },
};

