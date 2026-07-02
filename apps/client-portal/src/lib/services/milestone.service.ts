// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Milestone Service
// Pipeline: Milestone → QA → Client Approval → Invoice → Razorpay → Verified
// ═══════════════════════════════════════════════════════════════════

import { get, post } from '@/lib/api-client';
import type { Milestone, ApprovalEntry } from '@/lib/types';
import { mockMilestones } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const milestoneService = {
  async getMilestones(projectId: string): Promise<Milestone[]> {
    if (USE_MOCK) { await delay(400); return mockMilestones.filter((m) => m.projectId === projectId); }
    return get<Milestone[]>(`/client-portal/projects/${projectId}/milestones`);
  },

  async getMilestone(id: string): Promise<Milestone> {
    if (USE_MOCK) { await delay(300); return mockMilestones.find((m) => m.id === id) || mockMilestones[0]; }
    return get<Milestone>(`/client-portal/milestones/${id}`);
  },

  async approveMilestone(id: string, comment?: string): Promise<ApprovalEntry> {
    if (USE_MOCK) {
      await delay(600);
      return { id: `a-${Date.now()}`, action: 'APPROVED', actor: 'Client', comment, timestamp: new Date().toISOString() };
    }
    return post<ApprovalEntry>(`/client-portal/milestones/${id}/approve`, { comment });
  },

  async rejectMilestone(id: string, reason: string): Promise<ApprovalEntry> {
    if (USE_MOCK) {
      await delay(600);
      return { id: `a-${Date.now()}`, action: 'REJECTED', actor: 'Client', comment: reason, timestamp: new Date().toISOString() };
    }
    return post<ApprovalEntry>(`/client-portal/milestones/${id}/reject`, { reason });
  },

  async requestChanges(id: string, feedback: string): Promise<ApprovalEntry> {
    if (USE_MOCK) {
      await delay(600);
      return { id: `a-${Date.now()}`, action: 'CHANGES_REQUESTED', actor: 'Client', comment: feedback, timestamp: new Date().toISOString() };
    }
    return post<ApprovalEntry>(`/client-portal/milestones/${id}/request-changes`, { feedback });
  },
};
