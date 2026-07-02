// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Activity Service
// ═══════════════════════════════════════════════════════════════════

import { get } from '@/lib/api-client';
import type { ActivityEntry } from '@/lib/types';
import { mockActivity } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const activityService = {
  async getActivity(filters?: { type?: string; projectId?: string }): Promise<ActivityEntry[]> {
    if (USE_MOCK) {
      await delay(400);
      let items = [...mockActivity];
      if (filters?.type) items = items.filter((a) => a.type === filters.type);
      if (filters?.projectId) items = items.filter((a) => a.projectId === filters.projectId);
      return items;
    }
    return get<ActivityEntry[]>('/client-portal/activity', filters);
  },
};
