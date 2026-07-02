// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Approval Service
// ═══════════════════════════════════════════════════════════════════

import { get, post } from '@/lib/api-client';
import type { ApprovalItem, ApprovalEntry } from '@/lib/types';
import { mockApprovals } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const approvalService = {
  async getPendingApprovals(): Promise<ApprovalItem[]> {
    if (USE_MOCK) { await delay(400); return mockApprovals; }
    return get<ApprovalItem[]>('/client-portal/approvals');
  },

  async approve(id: string, comment?: string): Promise<ApprovalEntry> {
    if (USE_MOCK) {
      await delay(500);
      return { id: `ae-${Date.now()}`, action: 'APPROVED', actor: 'Client', comment, timestamp: new Date().toISOString() };
    }
    return post<ApprovalEntry>(`/client-portal/approvals/${id}/approve`, { comment });
  },

  async reject(id: string, reason: string): Promise<ApprovalEntry> {
    if (USE_MOCK) {
      await delay(500);
      return { id: `ae-${Date.now()}`, action: 'REJECTED', actor: 'Client', comment: reason, timestamp: new Date().toISOString() };
    }
    return post<ApprovalEntry>(`/client-portal/approvals/${id}/reject`, { reason });
  },

  async requestChanges(id: string, feedback: string): Promise<ApprovalEntry> {
    if (USE_MOCK) {
      await delay(500);
      return { id: `ae-${Date.now()}`, action: 'CHANGES_REQUESTED', actor: 'Client', comment: feedback, timestamp: new Date().toISOString() };
    }
    return post<ApprovalEntry>(`/client-portal/approvals/${id}/request-changes`, { feedback });
  },
};
