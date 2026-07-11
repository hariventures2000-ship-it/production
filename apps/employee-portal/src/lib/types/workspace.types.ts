// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Workspace Types
// ═══════════════════════════════════════════════════════════════════

// ── Dashboard Widgets ─────────────────────────────────────────────

export interface DashboardWidget {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  color: 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'teal';
}

// ── Activities ────────────────────────────────────────────────────

export interface RecentActivity {
  id: string;
  type: 'commit' | 'pr' | 'task' | 'deployment' | 'review' | 'comment' | 'sprint' | 'bug' | 'mention';
  title: string;
  description: string;
  timestamp: string;
  projectName?: string;
  actorName: string;
  actorAvatar?: string;
}

// ── Quick Actions ─────────────────────────────────────────────────

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

// ── Meetings (Summary) ────────────────────────────────────────────

export type MeetingType = 'standup' | 'planning' | 'review' | 'retro' | 'one-on-one' | 'general' | 'workshop' | 'demo' | 'kickoff';
export type MeetingStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled';

export interface UpcomingMeeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: MeetingType;
  attendees: number;
  isOngoing?: boolean;
}

// ── Sprint ────────────────────────────────────────────────────────

export interface SprintSummary {
  id: string;
  name: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  daysRemaining: number;
  startDate: string;
  endDate: string;
  velocity?: number;
  capacity?: number;
  goal?: string;
}

// ── Project Health ────────────────────────────────────────────────

export interface ProjectHealthItem {
  id: string;
  name: string;
  status: 'on-track' | 'at-risk' | 'behind';
  progress: number;
  nextMilestone: string;
  dueDate: string;
  lead?: string;
  role?: string;
  recentActivity?: string;
}

// ── Task Summary ──────────────────────────────────────────────────

export interface TaskSummaryItem {
  id: string;
  title: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
  projectName: string;
  dueDate?: string;
}

// ── Workspace Task (Full) ─────────────────────────────────────────

export type WorkspaceTaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'TESTING' | 'DONE';
export type WorkspaceTaskPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type WorkspaceTaskType = 'STORY' | 'BUG' | 'TASK' | 'CHORE' | 'SPIKE';

export interface WorkspaceTask {
  id: string;
  key: string;
  title: string;
  description?: string;
  status: WorkspaceTaskStatus;
  priority: WorkspaceTaskPriority;
  type: WorkspaceTaskType;
  projectName: string;
  projectId: string;
  epicName?: string;
  sprintName?: string;
  sprintId?: string;
  dueDate?: string;
  storyPoints?: number;
  progress?: number;
  labels: string[];
  attachmentCount: number;
  commentCount: number;
  timeLogged: number; // minutes
  assignee?: { name: string; avatar?: string };
  reporter?: { name: string; avatar?: string };
  createdAt: string;
  updatedAt: string;
}

// ── Calendar ──────────────────────────────────────────────────────

export type CalendarEventType =
  | 'meeting'
  | 'sprint'
  | 'deployment'
  | 'leave'
  | 'birthday'
  | 'review'
  | 'deadline'
  | 'training'
  | 'personal';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  allDay?: boolean;
  type: CalendarEventType;
  color: string;
  isRecurring?: boolean;
  hasConflict?: boolean;
  location?: string;
  attendees?: number;
  projectName?: string;
}

// ── Full Meeting ──────────────────────────────────────────────────

export interface MeetingParticipant {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  status: 'accepted' | 'declined' | 'tentative' | 'pending';
}

export interface MeetingAgendaItem {
  id: string;
  title: string;
  duration?: number; // minutes
  presenter?: string;
  completed: boolean;
}

export interface MeetingActionItem {
  id: string;
  title: string;
  assignee: string;
  dueDate?: string;
  completed: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  organizer: string;
  organizerAvatar?: string;
  participants: MeetingParticipant[];
  startTime: string;
  endTime: string;
  type: MeetingType;
  status: MeetingStatus;
  projectName?: string;
  sprintName?: string;
  location?: string;
  meetingLink?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
  agenda: MeetingAgendaItem[];
  actionItems: MeetingActionItem[];
  notes?: string;
  hasRecording?: boolean;
  hasTranscript?: boolean;
  attachments: string[];
}

// ── Time Tracking ─────────────────────────────────────────────────

export interface TimeEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  projectName: string;
  date: string;
  duration: number; // minutes
  description?: string;
  startTime?: string;
  endTime?: string;
}

// ── Goals ─────────────────────────────────────────────────────────

export type GoalPeriod = 'weekly' | 'monthly' | 'quarterly';

export interface PersonalGoal {
  id: string;
  title: string;
  period: GoalPeriod;
  progress: number;
  target: number;
  unit: string;
  dueDate: string;
  status: 'on-track' | 'at-risk' | 'completed' | 'overdue';
}

// ── Blockers ──────────────────────────────────────────────────────

export interface Blocker {
  id: string;
  taskId: string;
  taskTitle: string;
  reason: string;
  owner: string;
  eta?: string;
  dependencies: string[];
  createdAt: string;
  severity: 'critical' | 'high' | 'medium';
}

// ── Performance ───────────────────────────────────────────────────

export interface PerformanceMetric {
  label: string;
  value: number;
  change?: number;
  target?: number;
}

export interface PerformanceChartPoint {
  week: string;
  tasksCompleted: number;
  storyPoints: number;
  bugsFixed: number;
  codeReviews: number;
}

// ── AI Insights ───────────────────────────────────────────────────

export type AIInsightType = 'warning' | 'suggestion' | 'info' | 'success';

export interface AIInsight {
  id: string;
  type: AIInsightType;
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
  priority: 'high' | 'medium' | 'low';
}
