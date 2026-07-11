// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Meeting Service
// Meeting CRUD, agenda, notes, action items, AI features
// ═══════════════════════════════════════════════════════════════════

import { get } from '@/lib/api-client';
import { USE_MOCK, delay } from '@/lib/constants';
import { mockMeetings } from '@/lib/mock-data/workspace.mock';
import type { Meeting } from '@/lib/types/workspace.types';

export const meetingService = {
  async getMeetings(filter?: string): Promise<Meeting[]> {
    if (USE_MOCK) {
      await delay(300);
      if (filter === 'upcoming') return mockMeetings.filter((m) => m.status === 'scheduled' || m.status === 'in-progress');
      if (filter === 'past') return mockMeetings.filter((m) => m.status === 'completed');
      if (filter === 'cancelled') return mockMeetings.filter((m) => m.status === 'cancelled');
      if (filter === 'recurring') return mockMeetings.filter((m) => m.isRecurring);
      return mockMeetings;
    }
    return get('/employee/meetings', { filter });
  },

  async getMeetingById(id: string): Promise<Meeting | undefined> {
    if (USE_MOCK) {
      await delay(200);
      return mockMeetings.find((m) => m.id === id);
    }
    return get(`/employee/meetings/${id}`);
  },

  async getAISummary(meetingId: string): Promise<string> {
    if (USE_MOCK) {
      await delay(500);
      return '## Meeting Summary\n\n**Key Decisions:**\n- Approved the CDC-based pipeline architecture\n- Agreed on Redis caching for hot aggregates\n- Set target latency at 500ms p99\n\n**Action Items:**\n- Benchmark current throughput (Karthik — July 5)\n- Draft new pipeline design doc (Arjun — July 7)\n\n**Risks:**\n- MongoDB aggregation performance may degrade under load\n- Need to validate Kafka consumer group rebalancing strategy';
    }
    return get(`/employee/meetings/${meetingId}/ai-summary`);
  },
};
