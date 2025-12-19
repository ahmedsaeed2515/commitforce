import apiClient from './client';

export interface ProfileData {
  fullName?: string;
  username?: string;
  bio?: string;
  avatar?: File;
  [key: string]: unknown;
}

export const settingsApi = {
  updateProfile: async (data: ProfileData) => {
    const formData = new FormData();
    (Object.keys(data) as Array<keyof ProfileData>).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key as string, data[key] as string | Blob);
      }
    });

    const response = await apiClient.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePassword: async (data: Record<string, string>) => {
    const response = await apiClient.put('/users/password', data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient.delete('/users');
    return response.data;
  }
};
