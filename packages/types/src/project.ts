// ═══════════════════════════════════════════════════════════════════
// HARIVENTURE DIGITAL PRODUCTION — Project & Task Types
// ═══════════════════════════════════════════════════════════════════

import { Department } from './role';

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  DESIGN = 'DESIGN',
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  DEPLOYMENT = 'DEPLOYMENT',
  MAINTENANCE = 'MAINTENANCE',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  TESTING = 'TESTING',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum TaskType {
  FEATURE = 'FEATURE',
  BUG = 'BUG',
  CHORE = 'CHORE',
  SPIKE = 'SPIKE',
  STORY = 'STORY',
}

export enum SprintStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: 'Planning',
  [ProjectStatus.DESIGN]: 'Design',
  [ProjectStatus.DEVELOPMENT]: 'Development',
  [ProjectStatus.TESTING]: 'Testing',
  [ProjectStatus.DEPLOYMENT]: 'Deployment',
  [ProjectStatus.MAINTENANCE]: 'Maintenance',
  [ProjectStatus.COMPLETED]: 'Completed',
  [ProjectStatus.ON_HOLD]: 'On Hold',
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: 'bg-gray-100 text-gray-700',
  [ProjectStatus.DESIGN]: 'bg-purple-100 text-purple-700',
  [ProjectStatus.DEVELOPMENT]: 'bg-blue-100 text-blue-700',
  [ProjectStatus.TESTING]: 'bg-yellow-100 text-yellow-700',
  [ProjectStatus.DEPLOYMENT]: 'bg-orange-100 text-orange-700',
  [ProjectStatus.MAINTENANCE]: 'bg-teal-100 text-teal-700',
  [ProjectStatus.COMPLETED]: 'bg-green-100 text-green-700',
  [ProjectStatus.ON_HOLD]: 'bg-red-100 text-red-700',
};

export const TASK_STATUS_ORDER: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.REVIEW,
  TaskStatus.TESTING,
  TaskStatus.DONE,
];

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completedAt?: string;
  status: 'PENDING' | 'COMPLETED';
}

export interface BurndownPoint {
  date: string;
  remainingPoints: number;
  idealPoints: number;
}
