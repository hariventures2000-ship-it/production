// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Auth Service
// Production auth: Email/Password → TOTP MFA → JWT + HTTP-only cookies
// ═══════════════════════════════════════════════════════════════════

import { get, post } from '@/lib/api-client';
import type { LoginCredentials, LoginResponse, MfaVerifyResponse, UserSession, PasswordResetRequest, PasswordReset } from '@/lib/types';
import { mockUserSession } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (USE_MOCK) {
      await delay(800);
      return { requiresMfa: true, tempToken: 'mock-temp-token' };
    }
    return post<LoginResponse>('/auth/client/login', credentials);
  },

  async verifyTotp(tempToken: string, code: string): Promise<MfaVerifyResponse> {
    if (USE_MOCK) {
      await delay(600);
      return { user: mockUserSession };
    }
    return post<MfaVerifyResponse>('/auth/client/verify-totp', { tempToken, code });
  },

  async forgotPassword(data: PasswordResetRequest): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      return;
    }
    await post('/auth/client/forgot-password', data);
  },

  async resetPassword(data: PasswordReset): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      return;
    }
    await post('/auth/client/reset-password', data);
  },

  async refreshToken(): Promise<void> {
    // Uses HTTP-only cookie — no token in JS
    if (USE_MOCK) return;
    await post('/auth/refresh');
  },

  async getCurrentSession(): Promise<UserSession | null> {
    if (USE_MOCK) {
      await delay(300);
      return mockUserSession;
    }
    try {
      return await get<UserSession>('/auth/session');
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    if (USE_MOCK) return;
    await post('/auth/logout');
  },
};

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
