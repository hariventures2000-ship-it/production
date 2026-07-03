// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Auth Types
// ═══════════════════════════════════════════════════════════════════

import type { PortalRole } from '@/lib/constants';

// ── Login ─────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  requiresMfa: true;
  requiresMfaSetup?: boolean;
  tempToken: string;
}

// ── MFA ───────────────────────────────────────────────────────────

export interface MfaSetupResponse {
  qrCodeUri: string;
  qrCodeImage: string;
  manualEntryKey: string;
}

export interface MfaVerifyPayload {
  tempToken: string;
  code: string;
}

export interface MfaVerifyResponse {
  accessToken: string;
  user: UserSession;
}

export interface MfaEnableResponse {
  enabled: true;
  backupCodes: string[];
}

// ── Session ───────────────────────────────────────────────────────

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

// ── Password Reset ────────────────────────────────────────────────

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// ── Sessions & Devices ────────────────────────────────────────────

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface TrustedDevice {
  id: string;
  device: string;
  browser: string;
  os: string;
  trustedAt: string;
  lastUsed: string;
}
