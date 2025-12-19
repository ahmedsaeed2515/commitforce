import apiClient from './client';
import { CreateChallengeData } from './challenge.api';

export interface CreateGroupChallengeData extends Omit<CreateChallengeData, 'goalType'> {
  goalType?: string;
  challengeType: 'group' | 'duel';
  requiredCheckIns?: number;
}

export const groupChallengeApi = {
    create: async (challengeData: CreateGroupChallengeData, invitedUserIds: string[]) => {
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
