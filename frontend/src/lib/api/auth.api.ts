import apiClient from './client';

import { User } from '../store/authStore';

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

/**
 * Get current user
 */
export const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

/**
 * Logout user
 */
export const logout = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

/**
 * Forgot password
 */
export const forgotPassword = async (email: string) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

/**
 * Reset password
 */
export const resetPassword = async (token: string, password: string) => {
  const response = await apiClient.post(`/auth/reset-password/${token}`, { password });
  return response.data;
};

/**
 * Verify email
 */
export const verifyEmail = async (token: string) => {
  const response = await apiClient.get(`/auth/verify-email/${token}`);
  return response.data;
};

// Auth API object for easier imports
export const authApi = {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
