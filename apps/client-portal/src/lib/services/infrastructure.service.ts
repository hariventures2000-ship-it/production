// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Infrastructure Service
// Consolidates: Domains, Hosting, SSL, CDN, Storage, Mail, API Keys, Monitoring
// ═══════════════════════════════════════════════════════════════════

import { get } from '@/lib/api-client';
import type { InfraOverview } from '@/lib/types';
import { mockInfrastructure } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const infrastructureService = {
  async getOverview(): Promise<InfraOverview> {
    if (USE_MOCK) { await delay(500); return mockInfrastructure; }
    return get<InfraOverview>('/client-portal/infrastructure');
  },
};
