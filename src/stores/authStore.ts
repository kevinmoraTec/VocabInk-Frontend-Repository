import { create } from 'zustand';
import api from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  onboardingCompleted: boolean;
  profileConfig?: {
    appLanguage?: string;
    contentLanguage?: string;
    englishLevel?: 'beginner' | 'intermediate' | 'advanced';
    role?: string;
    topics?: string[];
    source?: string;
    postFrequency?: string;
  };
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  verifyAuth: () => Promise<boolean>;
  completeOnboarding: (config: User['profileConfig']) => void;
}

// No persist middleware - auth state is verified via cookies/API
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
    try {
      await api.post('/v1/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    
    set({ user: null, isAuthenticated: false, isLoading: false });
    window.location.href = '/login';
  },
  verifyAuth: async () => {
    set({ isLoading: true });
    try {

      
      const response = await api.get('/v1/auth/verify');
      const data = response.data;

      
      
      if (data.authenticated && data.user) {
        // Map backend's onboarding_completed to user's onboardingCompleted
        // and map onboarding_data to profileConfig
        const userWithOnboarding = {
          ...data.user,
          onboardingCompleted: data.onboarding_completed || false,
          profileConfig: data.onboarding_data?.onboarding ? {
            appLanguage: data.onboarding_data.onboarding.appLanguage,
            contentLanguage: data.onboarding_data.onboarding.contentLanguage,
            englishLevel: data.onboarding_data.onboarding.englishLevel,
            role: data.onboarding_data.onboarding.role,
            topics: data.onboarding_data.onboarding.topics,
            source: data.onboarding_data.onboarding.source,
            postFrequency: data.onboarding_data.onboarding.postFrequency,
          } : undefined,
        };
        set({ user: userWithOnboarding, isAuthenticated: true, isLoading: false });
        return true;
      }
      
      set({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    } catch (error) {
      console.error('Auth verification failed:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },
  completeOnboarding: (config) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, onboardingCompleted: true, profileConfig: config }
        : null,
    })),
}));
