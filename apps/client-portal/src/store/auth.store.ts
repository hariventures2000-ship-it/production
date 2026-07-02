// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Auth Store (Production)
// Access token in memory ONLY. Refresh via HTTP-only cookie.
// ═══════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserSession } from '@/lib/types';

interface AuthState {
  // In-memory only — NOT persisted
  accessToken: string | null;

  // Persisted (user info only, no tokens)
  user: UserSession | null;
  isAuthenticated: boolean;
  tempEmail: string | null;
  tempToken: string | null;
  isHydrated: boolean;

  // Actions
  setAuth: (user: UserSession) => void;
  setAccessToken: (token: string) => void;
  setTempCredentials: (email: string, tempToken: string) => void;
  setHydrated: (state: boolean) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<UserSession>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      tempEmail: null,
      tempToken: null,
      isHydrated: false,

      setAuth: (user) =>
        set({ user, isAuthenticated: true, tempEmail: null, tempToken: null }),

      setAccessToken: (accessToken) =>
        set({ accessToken }),

      setTempCredentials: (tempEmail, tempToken) =>
        set({ tempEmail, tempToken }),

      setHydrated: (isHydrated) =>
        set({ isHydrated }),

      clearAuth: () =>
        set({ accessToken: null, user: null, isAuthenticated: false, tempEmail: null, tempToken: null }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'mervi-client-auth',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist user session info — NEVER tokens
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tempEmail: state.tempEmail,
        tempToken: state.tempToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
