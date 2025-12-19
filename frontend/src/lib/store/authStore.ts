import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { connectSocket, disconnectSocket } from '../socket';

export interface User {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  emailVerified: boolean;
  role: 'user' | 'admin';
  
  // Stats
  totalChallenges: number;
  activeChallenges: number;
  completedChallenges: number;
  failedChallenges: number;
  successRate: number;
  
  // Gamification
  points?: number;
  streak?: {
    current: number;
    longest: number;
    lastCheckIn?: string;
    freezesAvailable: number;
    freezesUsed: number;
  };
  
  // Financial
  totalDeposited: number;
  totalEarned: number;
  totalDonated: number;
  balance?: {
      amount: number;
      currency: string;
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        // Save tokens to localStorage for API client
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        // Connect WebSocket
        connectSocket(accessToken);
        
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      logout: () => {
        // Remove tokens from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
        
        // Disconnect WebSocket
        disconnectSocket();
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        // Only use localStorage in browser
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      skipHydration: true, // Important for SSR
    }
  )
);
