// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Meeting Service
// ═══════════════════════════════════════════════════════════════════

import { get } from '@/lib/api-client';
import type { Meeting } from '@/lib/types';
import { mockMeetings } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const meetingService = {
  async getMeetings(): Promise<Meeting[]> {
    if (USE_MOCK) { await delay(400); return mockMeetings; }
    return get<Meeting[]>('/client-portal/meetings');
  },

  async getMeeting(id: string): Promise<Meeting> {
    if (USE_MOCK) { await delay(300); return mockMeetings.find((m) => m.id === id) || mockMeetings[0]; }
    return get<Meeting>(`/client-portal/meetings/${id}`);
  },
};
