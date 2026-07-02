// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Profile Service
// ═══════════════════════════════════════════════════════════════════

import { get, patch, post } from '@/lib/api-client';
import type { UserProfile, SecuritySettings, NotificationPreferences } from '@/lib/types';
import { mockUserProfile, mockSecuritySettings, mockNotificationPrefs } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    if (USE_MOCK) { await delay(300); return mockUserProfile; }
    return get<UserProfile>('/client-portal/profile');
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    if (USE_MOCK) { await delay(400); return { ...mockUserProfile, ...data }; }
    return patch<UserProfile>('/client-portal/profile', data);
  },

  async getSecuritySettings(): Promise<SecuritySettings> {
    if (USE_MOCK) { await delay(300); return mockSecuritySettings; }
    return get<SecuritySettings>('/client-portal/profile/security');
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (USE_MOCK) { await delay(500); return; }
    await post('/client-portal/profile/change-password', { currentPassword, newPassword });
  },

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    if (USE_MOCK) { await delay(200); return mockNotificationPrefs; }
    return get<NotificationPreferences>('/client-portal/profile/notification-preferences');
  },

  async updateNotificationPreferences(data: NotificationPreferences): Promise<void> {
    if (USE_MOCK) { await delay(300); return; }
    await patch('/client-portal/profile/notification-preferences', data);
  },

  async revokeSession(sessionId: string): Promise<void> {
    if (USE_MOCK) { await delay(300); return; }
    await post(`/client-portal/profile/sessions/${sessionId}/revoke`);
  },
};
