import apiClient from './client';

export const feedApi = {
  getFeed: async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get(`/feed?page=${page}&limit=${limit}`);
    return response.data;
  },
};
