import apiClient from './client';

// Club API for team challenges
export const clubApi = {
    // Create a new club
    create: async (data: { name: string; description?: string; category?: string; isPrivate?: boolean }) => {
        const response = await apiClient.post('/clubs', data);
        return response.data;
    },

    // Get club by ID
    getById: async (clubId: string) => {
        const response = await apiClient.get(`/clubs/${clubId}`);
        return response.data;
    },

    // Search clubs
    search: async (query?: string, category?: string, page: number = 1) => {
        const response = await apiClient.get('/clubs/search', {
            params: { q: query, category, page }
        });
        return response.data;
    },

    // Join a club
    join: async (clubId: string) => {
        const response = await apiClient.post(`/clubs/${clubId}/join`);
        return response.data;
    },

    // Leave a club
    leave: async (clubId: string) => {
        const response = await apiClient.post(`/clubs/${clubId}/leave`);
        return response.data;
    },

    // Get club leaderboard
    getLeaderboard: async (limit: number = 20) => {
        const response = await apiClient.get('/clubs/leaderboard', {
            params: { limit }
        });
        return response.data;
    }
};
