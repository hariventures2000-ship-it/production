import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthSession } from '@hariventure/types';

interface AuthState {
  accessToken: string | null;
  user: AuthSession | null;
  isAuthenticated: boolean;
  tempEmail: string | null;
  isHydrated: boolean;

  // Actions
  setAuth: (accessToken: string, user: AuthSession) => void;
  setAccessToken: (token: string) => void;
  setTempEmail: (email: string) => void;
  setHydrated: (state: boolean) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<AuthSession>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      tempEmail: null,
      isHydrated: false,

      setAuth: (accessToken, user) =>
        set({ accessToken, user, isAuthenticated: true }),

      setAccessToken: (accessToken) =>
        set({ accessToken }),

      setTempEmail: (tempEmail) => 
        set({ tempEmail }),

      setHydrated: (isHydrated) => 
        set({ isHydrated }),

      clearAuth: () =>
        set({ accessToken: null, user: null, isAuthenticated: false, tempEmail: null }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'mervi-client-auth',
      storage: createJSONStorage(() => sessionStorage), // session storage for client login security
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tempEmail: state.tempEmail,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
