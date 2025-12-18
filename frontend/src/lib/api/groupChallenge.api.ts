import apiClient from './client';

export const groupChallengeApi = {
    create: async (challengeData: any, invitedUserIds: string[]) => {
        const response = await apiClient.post('/challenges/group', {
            ...challengeData,
            invitedUsers: invitedUserIds
        });
        return response.data;
    },

    join: async (challengeId: string) => {
        const response = await apiClient.post(`/challenges/${challengeId}/join`);
        return response.data;
    },

    decline: async (challengeId: string) => {
        const response = await apiClient.post(`/challenges/${challengeId}/decline`);
        return response.data;
    },

    getLeaderboard: async (challengeId: string) => {
        const response = await apiClient.get(`/challenges/${challengeId}/leaderboard`);
        return response.data;
    }
};
