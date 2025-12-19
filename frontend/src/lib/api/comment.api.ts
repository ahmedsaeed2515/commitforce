import apiClient from './client';

// Comment API
export const commentApi = {
    // Get comments for a check-in
    getComments: async (checkInId: string, page: number = 1) => {
        const response = await apiClient.get(`/social/check-ins/${checkInId}/comments`, {
            params: { page }
        });
        return response.data;
    },

    // Create a comment
    createComment: async (checkInId: string, content: string) => {
        const response = await apiClient.post(`/social/check-ins/${checkInId}/comments`, {
            content
        });
        return response.data;
    },

    // Like a comment
    likeComment: async (commentId: string) => {
        const response = await apiClient.post(`/social/comments/${commentId}/like`);
        return response.data;
    },

    // Delete a comment
    deleteComment: async (commentId: string) => {
        const response = await apiClient.delete(`/social/comments/${commentId}`);
        return response.data;
    }
};
