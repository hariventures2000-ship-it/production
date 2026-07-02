// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Document Service
// ═══════════════════════════════════════════════════════════════════

import { get, post } from '@/lib/api-client';
import type { Document as MerviDocument, DocumentVersion, Comment } from '@/lib/types';
import { mockDocuments } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const documentService = {
  async getDocuments(projectId: string, filters?: { search?: string; type?: string }): Promise<MerviDocument[]> {
    if (USE_MOCK) {
      await delay(400);
      let docs = mockDocuments.filter((d) => d.projectId === projectId);
      if (filters?.search) docs = docs.filter((d) => d.name.toLowerCase().includes(filters.search!.toLowerCase()));
      if (filters?.type) docs = docs.filter((d) => d.type === filters.type);
      return docs;
    }
    return get<MerviDocument[]>(`/client-portal/projects/${projectId}/documents`, filters);
  },

  async getDocument(id: string): Promise<MerviDocument> {
    if (USE_MOCK) { await delay(300); return mockDocuments.find((d) => d.id === id) || mockDocuments[0]; }
    return get<MerviDocument>(`/client-portal/documents/${id}`);
  },

  async getVersionHistory(id: string): Promise<DocumentVersion[]> {
    if (USE_MOCK) {
      await delay(300);
      const doc = mockDocuments.find((d) => d.id === id);
      const versions: DocumentVersion[] = [];
      for (let i = doc?.version || 1; i >= 1; i--) {
        versions.push({ id: `v-${i}`, version: i, uploadedBy: doc?.uploadedBy || 'Unknown', uploadedAt: doc?.uploadedAt || '', sizeBytes: doc?.sizeBytes || 0, changeNote: i === doc?.version ? 'Latest version' : `Revision ${i}` });
      }
      return versions;
    }
    return get<DocumentVersion[]>(`/client-portal/documents/${id}/versions`);
  },

  async downloadDocument(id: string): Promise<void> {
    if (USE_MOCK) { alert('Mock: Document download triggered'); return; }
    const res = await get<{ url: string }>(`/client-portal/documents/${id}/download`);
    if (res?.url) window.open(res.url, '_blank');
  },

  async approveDocument(id: string): Promise<void> {
    if (USE_MOCK) { await delay(400); return; }
    await post(`/client-portal/documents/${id}/approve`);
  },

  async addComment(id: string, content: string): Promise<Comment> {
    if (USE_MOCK) {
      await delay(300);
      return { id: `c-${Date.now()}`, author: 'Rajesh Kumar', content, createdAt: new Date().toISOString() };
    }
    return post<Comment>(`/client-portal/documents/${id}/comments`, { content });
  },
};
