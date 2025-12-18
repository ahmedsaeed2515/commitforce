import apiClient from './client';

export interface CreateChallengeData {
  title: string;
  description: string;
  category: string;
  goalType: 'numeric' | 'boolean' | 'milestone';
  targetValue?: number;
  unit?: string;
  startDate: string;
  endDate: string;
  deposit?: {
    amount: number;
    currency: string;
  };
  checkInFrequency: string;
  isPublic: boolean;
  coverImage?: File;
}

export const challengeApi = {
  create: async (data: any) => {
    // Convert data to FormData for file upload
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key === 'deposit' && typeof data[key] === 'object') {
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    const response = await apiClient.post('/challenges', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async (filters: any = {}) => {
    const response = await apiClient.get('/challenges', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/challenges/${id}`);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'deposit' && typeof data[key] === 'object') {
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    const response = await apiClient.put(`/challenges/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/challenges/${id}`);
    return response.data;
  },

  // Check-in methods
  checkIn: async (challengeId: string, data: any) => {
    const formData = new FormData();
    // Add check-in specific fields (photos, notes, etc.)
    if (data.image) formData.append('image', data.image);
    if (data.note) formData.append('note', data.note);
    if (data.value) formData.append('value', data.value.toString());

    const response = await apiClient.post(`/challenges/${challengeId}/checkins`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getCheckIns: async (challengeId: string) => {
    const response = await apiClient.get(`/challenges/${challengeId}/checkins`);
    return response.data;
  },
};
