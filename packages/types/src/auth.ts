// ═══════════════════════════════════════════════════════════════════
// HARIVENTURE DIGITAL PRODUCTION — Auth Types
// ═══════════════════════════════════════════════════════════════════

import { Role, AuthType } from './role';

export interface JwtPayload {
  tokenVersion?: number;
  sub: string;           // user._id
  role: Role;
  authType: AuthType;
  tenantId?: string;     // Added for multi-tenancy
  mfaVerified?: boolean; // true after TOTP step for internal users
  isFirstLogin?: boolean;
  iat?: number;
  exp?: number;
}

export interface JwtRefreshPayload {
  sub: string;
  tokenFamily: string;   // rotation family for refresh token reuse detection
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;     // seconds
}

export interface TempTokenPayload {
  sub: string;
  purpose: 'OTP_VERIFY' | 'MFA_VERIFY' | 'MFA_SETUP';
}

// Client auth responses
export interface ClientLoginResponse {
  requiresOtp: true;
  tempToken: string;
  maskedEmail: string;   // e.g. j***@gmail.com
}

// Internal auth responses
export interface InternalLoginResponse {
  requiresMfa: true;
  requiresMfaSetup?: boolean;
  tempToken: string;
}

export interface MfaSetupResponse {
  qrCodeUri: string;     // otpauth:// URI for QR code
  qrCodeImage: string;   // base64 PNG QR code
  manualEntryKey: string; // backup manual entry key
}

export interface MfaEnableResponse {
  enabled: true;
  backupCodes: string[]; // 10 one-time codes shown ONCE
}

export interface AuthSession {
  userId: string;
  role: Role;
  authType: AuthType;
  tenantId?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  email?: string;        // clients
  username?: string;     // internal users
  mfaEnabled?: boolean;
}
