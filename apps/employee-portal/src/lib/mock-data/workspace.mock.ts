// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Workspace Mock Data
// ═══════════════════════════════════════════════════════════════════

import type {
  RecentActivity,
  UpcomingMeeting,
  SprintSummary,
  ProjectHealthItem,
  TaskSummaryItem,
} from '@/lib/types/workspace.types';

export const mockSprintSummary: SprintSummary = {
  id: 'sprint-14',
  name: 'Sprint 14 — Auth & Payments',
  progress: 68,
  totalTasks: 34,
  completedTasks: 23,
  daysRemaining: 4,
  startDate: '2026-06-23',
  endDate: '2026-07-07',
};

export const mockTodayTasks: TaskSummaryItem[] = [
  { id: 'task-1', title: 'Implement JWT refresh token rotation', priority: 'HIGH', status: 'IN_PROGRESS', projectName: 'Mervi Platform', dueDate: '2026-07-03' },
  { id: 'task-2', title: 'Fix Razorpay webhook signature validation', priority: 'CRITICAL', status: 'TODO', projectName: 'Client Portal', dueDate: '2026-07-03' },
  { id: 'task-3', title: 'Write unit tests for auth middleware', priority: 'MEDIUM', status: 'TODO', projectName: 'Mervi Platform', dueDate: '2026-07-04' },
  { id: 'task-4', title: 'Review PR #247 — Dashboard analytics', priority: 'HIGH', status: 'REVIEW', projectName: 'Analytics Engine', dueDate: '2026-07-03' },
  { id: 'task-5', title: 'Update API documentation for v2 endpoints', priority: 'LOW', status: 'BACKLOG', projectName: 'Mervi Platform' },
];

export const mockUpcomingMeetings: UpcomingMeeting[] = [
  { id: 'meet-1', title: 'Daily Standup', startTime: '2026-07-03T09:30:00', endTime: '2026-07-03T09:45:00', type: 'standup', attendees: 8, isOngoing: true },
  { id: 'meet-2', title: 'Sprint Review — Sprint 14', startTime: '2026-07-03T14:00:00', endTime: '2026-07-03T15:00:00', type: 'review', attendees: 12 },
  { id: 'meet-3', title: '1:1 with Arjun', startTime: '2026-07-03T16:00:00', endTime: '2026-07-03T16:30:00', type: 'one-on-one', attendees: 2 },
];

export const mockRecentActivities: RecentActivity[] = [
  { id: 'act-1', type: 'pr', title: 'Merged PR #245', description: 'Add CSRF protection to auth endpoints', timestamp: '2026-07-03T08:45:00', projectName: 'Mervi Platform', actorName: 'Vijay S.' },
  { id: 'act-2', type: 'deployment', title: 'Deployed to staging', description: 'v2.4.1 — Auth service with MFA flow', timestamp: '2026-07-03T07:30:00', projectName: 'Mervi Platform', actorName: 'CI/CD Bot' },
  { id: 'act-3', type: 'task', title: 'Completed task', description: 'Configure Redis caching for session store', timestamp: '2026-07-02T18:20:00', projectName: 'Infrastructure', actorName: 'Vijay S.' },
  { id: 'act-4', type: 'comment', title: 'Commented on PR #247', description: 'Suggested refactoring chart data transform logic', timestamp: '2026-07-02T16:50:00', projectName: 'Analytics Engine', actorName: 'Priya K.' },
  { id: 'act-5', type: 'review', title: 'Code review requested', description: 'Review Kafka consumer error handling', timestamp: '2026-07-02T15:10:00', projectName: 'Notification Service', actorName: 'Arjun M.' },
  { id: 'act-6', type: 'sprint', title: 'Sprint 14 started', description: '34 tasks, 89 story points, 2 weeks', timestamp: '2026-06-23T10:00:00', projectName: 'Mervi Platform', actorName: 'System' },
];

export const mockProjectHealth: ProjectHealthItem[] = [
  { id: 'proj-1', name: 'Mervi Platform v2', status: 'on-track', progress: 72, nextMilestone: 'Beta Release', dueDate: '2026-07-15' },
  { id: 'proj-2', name: 'Client Portal', status: 'on-track', progress: 95, nextMilestone: 'Production Deploy', dueDate: '2026-07-05' },
  { id: 'proj-3', name: 'Analytics Engine', status: 'at-risk', progress: 45, nextMilestone: 'Dashboard MVP', dueDate: '2026-07-10' },
  { id: 'proj-4', name: 'Mobile App', status: 'behind', progress: 28, nextMilestone: 'Design Review', dueDate: '2026-07-08' },
];

export const mockNotifications = [
  { id: 'n1', type: 'mention' as const, title: 'Mentioned in PR #247', message: 'Priya mentioned you in a code review comment', read: false, createdAt: '2026-07-03T08:30:00', actionUrl: '/development/pull-requests', actorName: 'Priya K.' },
  { id: 'n2', type: 'assignment' as const, title: 'New task assigned', message: 'Fix Razorpay webhook signature validation', read: false, createdAt: '2026-07-03T07:00:00', actionUrl: '/tasks', actorName: 'Arjun M.' },
  { id: 'n3', type: 'deployment' as const, title: 'Deployment successful', message: 'v2.4.1 deployed to staging successfully', read: true, createdAt: '2026-07-03T07:30:00', actorName: 'CI/CD' },
  { id: 'n4', type: 'meeting' as const, title: 'Meeting in 15 minutes', message: 'Daily Standup starts at 9:30 AM', read: true, createdAt: '2026-07-03T09:15:00', actorName: 'Calendar' },
  { id: 'n5', type: 'approval' as const, title: 'Leave approved', message: 'Your leave request for July 14-15 has been approved', read: true, createdAt: '2026-07-02T14:00:00', actorName: 'HR System' },
];
