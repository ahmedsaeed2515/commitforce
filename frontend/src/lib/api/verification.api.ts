import apiClient from './client';

export const verificationApi = {
  getPendingCheckIns: async () => {
    const response = await apiClient.get('/verifications/pending');
    return response.data;
  },

  verifyCheckIn: async (checkInId: string, status: 'approved' | 'rejected', notes?: string) => {
    const response = await apiClient.post(`/verifications/${checkInId}`, {
      status,
      notes
    });
    return response.data;
  },
};
