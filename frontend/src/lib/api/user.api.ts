import apiClient from './client';

// User API
export const userApi = {
    // Search users
    search: async (query: string, page: number = 1) => {
        const response = await apiClient.get('/users/search', {
            params: { q: query, page }
        });
        return response.data;
    },

    // Get user profile by username
    getProfile: async (username: string) => {
        const response = await apiClient.get(`/users/${username}`);
        return response.data;
    },

    // Get user by ID
    getById: async (id: string) => {
        const response = await apiClient.get(`/users/id/${id}`);
        return response.data;
    },

    // Get recommended friends
    getRecommended: async (limit: number = 10) => {
        const response = await apiClient.get('/users/friends/recommended', {
            params: { limit }
        });
        return response.data;
    },

    // Update profile
    updateProfile: async (data: FormData) => {
        const response = await apiClient.put('/users/profile', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Get analytics
    getAnalytics: async () => {
        const response = await apiClient.get('/users/analytics');
        return response.data;
    }
};
