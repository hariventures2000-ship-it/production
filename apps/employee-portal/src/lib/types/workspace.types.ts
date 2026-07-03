// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Workspace Types
// ═══════════════════════════════════════════════════════════════════

export interface DashboardWidget {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  color: 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'teal';
}

export interface RecentActivity {
  id: string;
  type: 'commit' | 'pr' | 'task' | 'deployment' | 'review' | 'comment' | 'sprint';
  title: string;
  description: string;
  timestamp: string;
  projectName?: string;
  actorName: string;
  actorAvatar?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

export interface UpcomingMeeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'standup' | 'planning' | 'review' | 'retro' | 'one-on-one' | 'general';
  attendees: number;
  isOngoing?: boolean;
}

export interface SprintSummary {
  id: string;
  name: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  daysRemaining: number;
  startDate: string;
  endDate: string;
}

export interface ProjectHealthItem {
  id: string;
  name: string;
  status: 'on-track' | 'at-risk' | 'behind';
  progress: number;
  nextMilestone: string;
  dueDate: string;
}

export interface TaskSummaryItem {
  id: string;
  title: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
  projectName: string;
  dueDate?: string;
}
