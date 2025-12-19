import apiClient from './client';

// Daily Quest API
export const dailyQuestApi = {
    // Get today's quests
    getQuests: async () => {
        const response = await apiClient.get('/daily-quests');
        return response.data;
    },

    // Get quest descriptions
    getDescriptions: async () => {
        const response = await apiClient.get('/daily-quests/descriptions');
        return response.data;
    }
};
