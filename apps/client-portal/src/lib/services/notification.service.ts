// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Notification Service
// ═══════════════════════════════════════════════════════════════════

import { get, post, patch } from '@/lib/api-client';
import type { Notification } from '@/lib/types';
import { mockNotifications } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    if (USE_MOCK) { await delay(300); return mockNotifications; }
    return get<Notification[]>('/notifications');
  },

  async markAsRead(id: string): Promise<void> {
    if (USE_MOCK) { await delay(100); return; }
    await patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    if (USE_MOCK) { await delay(200); return; }
    await post('/notifications/read-all');
  },

  async archive(id: string): Promise<void> {
    if (USE_MOCK) { await delay(100); return; }
    await patch(`/notifications/${id}/archive`);
  },
};
