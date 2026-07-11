// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Calendar Service
// Calendar CRUD operations
// ═══════════════════════════════════════════════════════════════════

import { get } from '@/lib/api-client';
import { USE_MOCK, delay } from '@/lib/constants';
import { mockCalendarEvents } from '@/lib/mock-data/workspace.mock';
import type { CalendarEvent } from '@/lib/types/workspace.types';

export const calendarService = {
  async getEvents(startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
    if (USE_MOCK) {
      await delay(300);
      if (startDate && endDate) {
        return mockCalendarEvents.filter((e) => {
          const d = new Date(e.startTime);
          return d >= new Date(startDate) && d <= new Date(endDate);
        });
      }
      return mockCalendarEvents;
    }
    return get('/employee/calendar/events', { startDate, endDate });
  },

  async getEventById(id: string): Promise<CalendarEvent | undefined> {
    if (USE_MOCK) {
      await delay(200);
      return mockCalendarEvents.find((e) => e.id === id);
    }
    return get(`/employee/calendar/events/${id}`);
  },
};
