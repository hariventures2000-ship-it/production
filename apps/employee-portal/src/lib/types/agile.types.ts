// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Agile Types
// ═══════════════════════════════════════════════════════════════════

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'TESTING' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskType = 'STORY' | 'BUG' | 'TASK' | 'EPIC';

export interface Assignee {
  userId: string;
  name: string;
  avatar?: string;
}

export interface AgileTask {
  id: string;
  key: string; // e.g. MVP-124
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  storyPoints?: number;
  assignee?: Assignee;
  reporter: Assignee;
  sprintId?: string;
  epicId?: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  status: 'FUTURE' | 'ACTIVE' | 'CLOSED';
  startDate?: string;
  endDate?: string;
}

export interface Epic {
  id: string;
  key: string;
  name: string;
  color: string;
}

export interface BoardColumn {
  id: TaskStatus;
  title: string;
  taskIds: string[];
}
