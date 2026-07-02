// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Project Service
// ═══════════════════════════════════════════════════════════════════

import { get } from '@/lib/api-client';
import type { Project, ProjectPhase, ProjectMember, ActivityEntry } from '@/lib/types';
import { mockProjects, mockProjectPhases, mockTeamMembers, mockActivity } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const projectService = {
  async getProjects(): Promise<Project[]> {
    if (USE_MOCK) { await delay(400); return mockProjects; }
    return get<Project[]>('/client-portal/projects');
  },

  async getProject(id: string): Promise<Project> {
    if (USE_MOCK) { await delay(300); return mockProjects.find((p) => p.id === id) || mockProjects[0]; }
    return get<Project>(`/client-portal/projects/${id}`);
  },

  async getProjectTimeline(id: string): Promise<ProjectPhase[]> {
    if (USE_MOCK) { await delay(400); return mockProjectPhases; }
    return get<ProjectPhase[]>(`/client-portal/projects/${id}/timeline`);
  },

  async getProjectMembers(id: string): Promise<ProjectMember[]> {
    if (USE_MOCK) { await delay(200); return mockTeamMembers; }
    return get<ProjectMember[]>(`/client-portal/projects/${id}/members`);
  },

  async getProjectActivity(id: string): Promise<ActivityEntry[]> {
    if (USE_MOCK) { await delay(300); return mockActivity.filter((a) => a.projectId === id); }
    return get<ActivityEntry[]>(`/client-portal/projects/${id}/activity`);
  },
};
