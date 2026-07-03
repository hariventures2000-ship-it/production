// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Auth Store
// Access token in memory ONLY. Refresh via HTTP-only cookie.
// ═══════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PortalRole } from '@/lib/constants';

// ── User Session ──────────────────────────────────────────────────

export interface UserSession {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: PortalRole;
  subRole?: string;
  department?: string;
  tenantId?: string;
  mfaEnabled: boolean;
  isFirstLogin?: boolean;
}

// ── Auth State ────────────────────────────────────────────────────

interface AuthState {
  // In-memory only — NOT persisted
  accessToken: string | null;

  // Persisted (user info only, no tokens)
  user: UserSession | null;
  isAuthenticated: boolean;
  tempToken: string | null;
  isHydrated: boolean;

  // Actions
  setAuth: (user: UserSession) => void;
  setAccessToken: (token: string) => void;
  setTempToken: (token: string) => void;
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
      tempToken: null,
      isHydrated: false,

      setAuth: (user) =>
        set({ user, isAuthenticated: true, tempToken: null }),

      setAccessToken: (accessToken) =>
        set({ accessToken }),

      setTempToken: (tempToken) =>
        set({ tempToken }),

      setHydrated: (isHydrated) =>
        set({ isHydrated }),

      clearAuth: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          tempToken: null,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'mervi-employee-auth',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist user session info — NEVER tokens
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tempToken: state.tempToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
