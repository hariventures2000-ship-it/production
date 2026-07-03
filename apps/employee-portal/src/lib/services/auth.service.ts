// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Auth Service
// Production: Email/Password → TOTP MFA → JWT + HTTP-only cookies
// ═══════════════════════════════════════════════════════════════════

import { get, post } from '@/lib/api-client';
import { USE_MOCK, delay } from '@/lib/constants';
import type {
  LoginCredentials,
  LoginResponse,
  MfaVerifyPayload,
  MfaVerifyResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  UserSession,
} from '@/lib/types/auth.types';

const mockUser: UserSession = {
  userId: 'emp-001',
  email: 'employee@hariventures.com',
  firstName: 'Vijay',
  lastName: 'Salvatore',
  role: 'SENIOR_DEVELOPER',
  subRole: 'DEVELOPER',
  department: 'WEBSITE_DEVELOPMENT',
  tenantId: '6676aa9ae9a701309909dcda',
  mfaEnabled: true,
  isFirstLogin: false,
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (USE_MOCK) {
      await delay(800);
      return { requiresMfa: true, tempToken: 'mock-temp-token-' + Date.now() };
    }
    return post<LoginResponse>('/auth/internal/login', credentials);
  },

  async verifyMfa(payload: MfaVerifyPayload): Promise<MfaVerifyResponse> {
    if (USE_MOCK) {
      await delay(600);
      return {
        accessToken: 'mock-access-token-' + Date.now(),
        user: mockUser,
      };
    }
    return post<MfaVerifyResponse>('/auth/internal/verify-totp', payload);
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      return;
    }
    await post('/auth/internal/forgot-password', payload);
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      return;
    }
    await post('/auth/internal/reset-password', payload);
  },

  async refreshToken(): Promise<void> {
    if (USE_MOCK) return;
    await post('/auth/refresh');
  },

  async getCurrentSession(): Promise<UserSession | null> {
    if (USE_MOCK) {
      await delay(300);
      return mockUser;
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

  async logoutEverywhere(): Promise<void> {
    if (USE_MOCK) return;
    await post('/auth/logout-all');
  },
};
