// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Project Types
// ═══════════════════════════════════════════════════════════════════

export type ProjectStatus = 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED' | 'PLANNING';
export type ProjectHealth = 'ON_TRACK' | 'AT_RISK' | 'BEHIND';

export interface ProjectTeamMember {
  userId: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  status: ProjectStatus;
  health: ProjectHealth;
  progress: number;
  startDate: string;
  targetDate: string;
  lead: ProjectTeamMember;
  team: ProjectTeamMember[];
  budget: {
    allocated: number;
    spent: number;
    currency: string;
  };
  stats: {
    totalTasks: number;
    completedTasks: number;
    openIssues: number;
  };
  tags: string[];
}
