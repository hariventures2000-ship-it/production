// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Calendar Service
// ═══════════════════════════════════════════════════════════════════

import { get } from '@/lib/api-client';
import type { CalendarEvent } from '@/lib/types';
import { mockCalendarEvents } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const calendarService = {
  async getEvents(startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
    if (USE_MOCK) { await delay(300); return mockCalendarEvents; }
    return get<CalendarEvent[]>('/client-portal/calendar', { startDate, endDate });
  },
};
