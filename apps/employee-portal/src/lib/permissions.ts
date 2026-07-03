// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — RBAC Permission System
// ═══════════════════════════════════════════════════════════════════

import type { PortalRole } from './constants';

// ── Permission Definitions ────────────────────────────────────────

export type Permission =
  // Projects
  | 'projects.view'
  | 'projects.create'
  | 'projects.edit'
  | 'projects.delete'
  | 'projects.budget.view'
  // Agile
  | 'agile.sprint.create'
  | 'agile.sprint.manage'
  | 'agile.backlog.manage'
  // Tasks
  | 'tasks.view'
  | 'tasks.create'
  | 'tasks.assign'
  | 'tasks.delete'
  // Development
  | 'development.view'
  | 'development.merge'
  | 'development.deploy'
  // Documentation
  | 'docs.view'
  | 'docs.create'
  | 'docs.edit'
  | 'docs.delete'
  // QA
  | 'qa.view'
  | 'qa.manage'
  // Deployment
  | 'deployment.view'
  | 'deployment.trigger'
  | 'deployment.rollback'
  // Reports
  | 'reports.view'
  | 'reports.executive'
  | 'reports.financial'
  // HR
  | 'hr.self.view'
  | 'hr.team.view'
  // Settings
  | 'settings.org.manage'
  | 'settings.api_tokens'
  // AI
  | 'ai.use';

// ── Role → Permission Map ─────────────────────────────────────────

const ROLE_PERMISSIONS: Record<PortalRole, Permission[]> = {
  EMPLOYEE: [
    'projects.view', 'tasks.view', 'tasks.create',
    'development.view', 'docs.view', 'docs.create', 'docs.edit',
    'reports.view', 'hr.self.view', 'ai.use',
  ],
  SENIOR_DEVELOPER: [
    'projects.view', 'tasks.view', 'tasks.create', 'tasks.assign',
    'development.view', 'development.merge',
    'docs.view', 'docs.create', 'docs.edit',
    'qa.view', 'reports.view', 'hr.self.view', 'ai.use',
    'agile.backlog.manage',
  ],
  UI_UX_DESIGNER: [
    'projects.view', 'tasks.view', 'tasks.create',
    'docs.view', 'docs.create', 'docs.edit',
    'reports.view', 'hr.self.view', 'ai.use',
  ],
  QA_ENGINEER: [
    'projects.view', 'tasks.view', 'tasks.create',
    'development.view', 'qa.view', 'qa.manage',
    'docs.view', 'docs.create', 'docs.edit',
    'reports.view', 'hr.self.view', 'ai.use',
  ],
  DEVOPS_ENGINEER: [
    'projects.view', 'tasks.view', 'tasks.create',
    'development.view', 'development.deploy',
    'deployment.view', 'deployment.trigger', 'deployment.rollback',
    'docs.view', 'docs.create', 'docs.edit',
    'reports.view', 'hr.self.view', 'ai.use',
  ],
  BUSINESS_ANALYST: [
    'projects.view', 'projects.budget.view',
    'tasks.view', 'tasks.create',
    'docs.view', 'docs.create', 'docs.edit',
    'reports.view', 'reports.executive',
    'hr.self.view', 'ai.use',
  ],
  TEAM_LEAD: [
    'projects.view', 'projects.create', 'projects.edit',
    'agile.sprint.create', 'agile.sprint.manage', 'agile.backlog.manage',
    'tasks.view', 'tasks.create', 'tasks.assign', 'tasks.delete',
    'development.view', 'development.merge',
    'qa.view', 'qa.manage',
    'deployment.view', 'deployment.trigger',
    'docs.view', 'docs.create', 'docs.edit', 'docs.delete',
    'reports.view', 'reports.executive',
    'hr.self.view', 'hr.team.view',
    'ai.use',
  ],
  PROJECT_MANAGER: [
    'projects.view', 'projects.create', 'projects.edit', 'projects.budget.view',
    'agile.sprint.create', 'agile.sprint.manage', 'agile.backlog.manage',
    'tasks.view', 'tasks.create', 'tasks.assign', 'tasks.delete',
    'development.view',
    'qa.view', 'qa.manage',
    'deployment.view', 'deployment.trigger',
    'docs.view', 'docs.create', 'docs.edit', 'docs.delete',
    'reports.view', 'reports.executive', 'reports.financial',
    'hr.self.view', 'hr.team.view',
    'ai.use',
  ],
  HR: [
    'projects.view',
    'tasks.view',
    'docs.view', 'docs.create', 'docs.edit',
    'reports.view',
    'hr.self.view', 'hr.team.view',
    'ai.use',
  ],
  FINANCE: [
    'projects.view', 'projects.budget.view',
    'reports.view', 'reports.financial',
    'hr.self.view',
    'ai.use',
  ],
  MANAGING_DIRECTOR: [
    'projects.view', 'projects.create', 'projects.edit', 'projects.delete', 'projects.budget.view',
    'agile.sprint.create', 'agile.sprint.manage', 'agile.backlog.manage',
    'tasks.view', 'tasks.create', 'tasks.assign', 'tasks.delete',
    'development.view', 'development.merge', 'development.deploy',
    'qa.view', 'qa.manage',
    'deployment.view', 'deployment.trigger', 'deployment.rollback',
    'docs.view', 'docs.create', 'docs.edit', 'docs.delete',
    'reports.view', 'reports.executive', 'reports.financial',
    'hr.self.view', 'hr.team.view',
    'settings.org.manage', 'settings.api_tokens',
    'ai.use',
  ],
  CEO: [
    'projects.view', 'projects.create', 'projects.edit', 'projects.delete', 'projects.budget.view',
    'agile.sprint.create', 'agile.sprint.manage', 'agile.backlog.manage',
    'tasks.view', 'tasks.create', 'tasks.assign', 'tasks.delete',
    'development.view', 'development.merge', 'development.deploy',
    'qa.view', 'qa.manage',
    'deployment.view', 'deployment.trigger', 'deployment.rollback',
    'docs.view', 'docs.create', 'docs.edit', 'docs.delete',
    'reports.view', 'reports.executive', 'reports.financial',
    'hr.self.view', 'hr.team.view',
    'settings.org.manage', 'settings.api_tokens',
    'ai.use',
  ],
  SUPER_ADMIN: [
    'projects.view', 'projects.create', 'projects.edit', 'projects.delete', 'projects.budget.view',
    'agile.sprint.create', 'agile.sprint.manage', 'agile.backlog.manage',
    'tasks.view', 'tasks.create', 'tasks.assign', 'tasks.delete',
    'development.view', 'development.merge', 'development.deploy',
    'qa.view', 'qa.manage',
    'deployment.view', 'deployment.trigger', 'deployment.rollback',
    'docs.view', 'docs.create', 'docs.edit', 'docs.delete',
    'reports.view', 'reports.executive', 'reports.financial',
    'hr.self.view', 'hr.team.view',
    'settings.org.manage', 'settings.api_tokens',
    'ai.use',
  ],
};

// ── Permission Check Utilities ────────────────────────────────────

export function hasPermission(role: PortalRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: PortalRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(role: PortalRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function getPermissions(role: PortalRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function isManagementRole(role: PortalRole): boolean {
  return ['TEAM_LEAD', 'PROJECT_MANAGER', 'MANAGING_DIRECTOR', 'CEO', 'SUPER_ADMIN'].includes(role);
}

export function isExecutiveRole(role: PortalRole): boolean {
  return ['MANAGING_DIRECTOR', 'CEO', 'SUPER_ADMIN'].includes(role);
}
