// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Constants & Navigation Configuration
// ═══════════════════════════════════════════════════════════════════

import {
  LayoutDashboard,
  FolderKanban,
  GitBranch,
  FileText,
  CheckSquare,
  TestTube,
  Rocket,
  MessageSquare,
  BarChart3,
  Timer,
  Users,
  Sparkles,
  Settings,
  Briefcase,
  KanbanSquare,
  Code2,
  BookOpen,
  Bug,
  Container,
  Radio,
  ClipboardList,
  CalendarDays,
  Video,
  Target,
  Zap,
} from 'lucide-react';
import type { ComponentType } from 'react';

// ── Employee Portal Roles (internal to this portal) ───────────────

export type PortalRole =
  | 'EMPLOYEE'
  | 'SENIOR_DEVELOPER'
  | 'UI_UX_DESIGNER'
  | 'QA_ENGINEER'
  | 'DEVOPS_ENGINEER'
  | 'BUSINESS_ANALYST'
  | 'TEAM_LEAD'
  | 'PROJECT_MANAGER'
  | 'HR'
  | 'FINANCE'
  | 'MANAGING_DIRECTOR'
  | 'CEO'
  | 'SUPER_ADMIN';

// ── Navigation Types ──────────────────────────────────────────────

export interface NavItem {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
  roles?: PortalRole[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
  roles?: PortalRole[];
}

// ── Sidebar Navigation ───────────────────────────────────────────

export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Workspace',
    items: [
      { name: 'Dashboard', href: '/workspace', icon: LayoutDashboard },
      { name: 'My Work', href: '/workspace/my-work', icon: Briefcase },
      { name: 'Calendar', href: '/workspace/calendar', icon: CalendarDays },
      { name: 'Meetings', href: '/workspace/meetings', icon: Video },
      { name: 'Messages', href: '/communication', icon: MessageSquare },
    ],
  },
  {
    label: 'Projects',
    items: [
      { name: 'All Projects', href: '/projects', icon: FolderKanban },
    ],
  },
  {
    label: 'Agile',
    items: [
      { name: 'Sprint Board', href: '/agile/board', icon: KanbanSquare },
      { name: 'Backlog', href: '/agile/backlog', icon: ClipboardList },
      { name: 'Planning', href: '/agile/planning', icon: Target },
      { name: 'Velocity', href: '/agile/velocity', icon: Zap },
    ],
  },
  {
    label: 'Development',
    items: [
      { name: 'Dev Hub', href: '/development', icon: Code2 },
      { name: 'Repositories', href: '/development/repositories', icon: GitBranch },
      { name: 'Pull Requests', href: '/development/pull-requests', icon: GitBranch },
      { name: 'CI/CD', href: '/development/ci-cd', icon: Container },
    ],
    roles: ['EMPLOYEE', 'SENIOR_DEVELOPER', 'DEVOPS_ENGINEER', 'TEAM_LEAD', 'PROJECT_MANAGER', 'CEO', 'SUPER_ADMIN'],
  },
  {
    label: 'Documentation',
    items: [
      { name: 'Docs', href: '/documentation', icon: BookOpen },
      { name: 'Knowledge Base', href: '/documentation/knowledge-base', icon: FileText },
    ],
  },
  {
    label: 'Tasks',
    items: [
      { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
    ],
  },
  {
    label: 'QA',
    items: [
      { name: 'QA Center', href: '/qa', icon: TestTube },
      { name: 'Bug Reports', href: '/qa/bug-reports', icon: Bug },
    ],
    roles: ['QA_ENGINEER', 'TEAM_LEAD', 'PROJECT_MANAGER', 'SENIOR_DEVELOPER', 'CEO', 'SUPER_ADMIN'],
  },
  {
    label: 'Deployment',
    items: [
      { name: 'Deploy Center', href: '/deployment', icon: Rocket },
      { name: 'Environments', href: '/deployment/environments', icon: Radio },
    ],
    roles: ['DEVOPS_ENGINEER', 'TEAM_LEAD', 'PROJECT_MANAGER', 'CEO', 'SUPER_ADMIN'],
  },
  {
    label: 'Reports',
    items: [
      { name: 'Analytics', href: '/reports', icon: BarChart3 },
    ],
  },
  {
    label: 'Productivity',
    items: [
      { name: 'Time Tracking', href: '/productivity', icon: Timer },
    ],
  },
  {
    label: 'HR',
    items: [
      { name: 'HR Self-Service', href: '/hr', icon: Users },
    ],
  },
  {
    label: 'Account',
    items: [
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

// ── Priority Config ───────────────────────────────────────────────

export const PRIORITY_CONFIG = {
  CRITICAL: { label: 'Critical', color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950', dot: 'bg-red-500' },
  HIGH: { label: 'High', color: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950', dot: 'bg-orange-500' },
  MEDIUM: { label: 'Medium', color: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950', dot: 'bg-yellow-500' },
  LOW: { label: 'Low', color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950', dot: 'bg-blue-500' },
} as const;

// ── Status Config ─────────────────────────────────────────────────

export const TASK_STATUS_CONFIG = {
  BACKLOG: { label: 'Backlog', color: 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800' },
  TODO: { label: 'To Do', color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900' },
  REVIEW: { label: 'In Review', color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900' },
  TESTING: { label: 'Testing', color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900' },
  DONE: { label: 'Done', color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900' },
} as const;

// ── App Constants ─────────────────────────────────────────────────

export const APP_NAME = 'Mervi';
export const APP_FULL_NAME = 'Mervi Employee Portal';
export const APP_DESCRIPTION = 'Internal digital workspace for software delivery';
export const APP_VERSION = '1.0.0';

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

export function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
