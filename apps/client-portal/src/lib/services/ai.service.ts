// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — AI Service
// ═══════════════════════════════════════════════════════════════════

import { post } from '@/lib/api-client';
import type { AIQueryResponse } from '@/lib/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const mockResponses: Record<string, string> = {
  default: 'Based on my analysis of your project data, the TechCorp Enterprise Portal is progressing well at 62% completion. The current phase is Frontend Development, which is 78% complete. There is one milestone awaiting your approval — Frontend Module Phase 1 — with an associated invoice of ₹4,90,000. The next scheduled meeting is Sprint 14 Review on July 4th.',
};

export const aiService = {
  async query(question: string): Promise<AIQueryResponse> {
    if (USE_MOCK) {
      await delay(1200);
      return {
        answer: mockResponses.default,
        sources: ['Project Dashboard', 'Milestone Tracker', 'Invoice INV-2026-002'],
      };
    }
    return post<AIQueryResponse>('/ai-assistant/query', { query: question });
  },
};
