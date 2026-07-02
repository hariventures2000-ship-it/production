// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Ticket Service
// ═══════════════════════════════════════════════════════════════════

import { get, post } from '@/lib/api-client';
import type { SupportTicket, TicketMessage, KBArticle } from '@/lib/types';
import { mockTickets, mockKBArticles } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const ticketService = {
  async getTickets(filters?: { status?: string; type?: string }): Promise<SupportTicket[]> {
    if (USE_MOCK) {
      await delay(400);
      let tickets = [...mockTickets];
      if (filters?.status) tickets = tickets.filter((t) => t.status === filters.status);
      if (filters?.type) tickets = tickets.filter((t) => t.type === filters.type);
      return tickets;
    }
    return get<SupportTicket[]>('/tickets', filters);
  },

  async getTicket(id: string): Promise<SupportTicket> {
    if (USE_MOCK) { await delay(300); return mockTickets.find((t) => t.id === id) || mockTickets[0]; }
    return get<SupportTicket>(`/tickets/${id}`);
  },

  async createTicket(data: { subject: string; description: string; type: string; priority: string; projectId?: string }): Promise<SupportTicket> {
    if (USE_MOCK) {
      await delay(500);
      return { id: `tkt-${Date.now()}`, ticketNumber: `TKT-2026-${Math.floor(Math.random() * 900) + 100}`, ...data, type: data.type as SupportTicket['type'], status: 'OPEN', priority: data.priority as SupportTicket['priority'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), messageCount: 0, attachments: [] };
    }
    return post<SupportTicket>('/tickets', data);
  },

  async addMessage(ticketId: string, content: string): Promise<TicketMessage> {
    if (USE_MOCK) {
      await delay(300);
      return { id: `msg-${Date.now()}`, ticketId, sender: 'CLIENT', senderName: 'Rajesh Kumar', content, attachments: [], createdAt: new Date().toISOString() };
    }
    return post<TicketMessage>(`/tickets/${ticketId}/messages`, { content });
  },

  async getKnowledgeBase(): Promise<KBArticle[]> {
    if (USE_MOCK) { await delay(200); return mockKBArticles; }
    return get<KBArticle[]>('/knowledge-base');
  },
};
