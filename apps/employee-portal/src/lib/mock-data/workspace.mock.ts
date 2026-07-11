// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Workspace Mock Data
// Production-quality realistic data for all workspace pages
// ═══════════════════════════════════════════════════════════════════

import type {
  RecentActivity,
  UpcomingMeeting,
  SprintSummary,
  ProjectHealthItem,
  TaskSummaryItem,
  WorkspaceTask,
  CalendarEvent,
  Meeting,
  TimeEntry,
  PersonalGoal,
  Blocker,
  PerformanceMetric,
  PerformanceChartPoint,
  AIInsight,
} from '@/lib/types/workspace.types';

// ── Sprint ────────────────────────────────────────────────────────

export const mockSprintSummary: SprintSummary = {
  id: 'sprint-14',
  name: 'Sprint 14 — Auth & Payments',
  progress: 68,
  totalTasks: 34,
  completedTasks: 23,
  daysRemaining: 4,
  startDate: '2026-06-23',
  endDate: '2026-07-07',
  velocity: 42,
  capacity: 55,
  goal: 'Complete JWT refresh, Razorpay integration, and MFA hardening.',
};

// ── Today's Tasks ─────────────────────────────────────────────────

export const mockTodayTasks: TaskSummaryItem[] = [
  { id: 'task-1', title: 'Implement JWT refresh token rotation', priority: 'HIGH', status: 'IN_PROGRESS', projectName: 'Mervi Platform', dueDate: '2026-07-03' },
  { id: 'task-2', title: 'Fix Razorpay webhook signature validation', priority: 'CRITICAL', status: 'TODO', projectName: 'Client Portal', dueDate: '2026-07-03' },
  { id: 'task-3', title: 'Write unit tests for auth middleware', priority: 'MEDIUM', status: 'TODO', projectName: 'Mervi Platform', dueDate: '2026-07-04' },
  { id: 'task-4', title: 'Review PR #247 — Dashboard analytics', priority: 'HIGH', status: 'REVIEW', projectName: 'Analytics Engine', dueDate: '2026-07-03' },
  { id: 'task-5', title: 'Update API documentation for v2 endpoints', priority: 'LOW', status: 'BACKLOG', projectName: 'Mervi Platform' },
];

// ── Upcoming Meetings ─────────────────────────────────────────────

export const mockUpcomingMeetings: UpcomingMeeting[] = [
  { id: 'meet-1', title: 'Daily Standup', startTime: '2026-07-03T09:30:00', endTime: '2026-07-03T09:45:00', type: 'standup', attendees: 8, isOngoing: true },
  { id: 'meet-2', title: 'Sprint Review — Sprint 14', startTime: '2026-07-03T14:00:00', endTime: '2026-07-03T15:00:00', type: 'review', attendees: 12 },
  { id: 'meet-3', title: '1:1 with Arjun', startTime: '2026-07-03T16:00:00', endTime: '2026-07-03T16:30:00', type: 'one-on-one', attendees: 2 },
];

// ── Recent Activities ─────────────────────────────────────────────

export const mockRecentActivities: RecentActivity[] = [
  { id: 'act-1', type: 'pr', title: 'Merged PR #245', description: 'Add CSRF protection to auth endpoints', timestamp: '2026-07-03T08:45:00', projectName: 'Mervi Platform', actorName: 'Vijay S.' },
  { id: 'act-2', type: 'deployment', title: 'Deployed to staging', description: 'v2.4.1 — Auth service with MFA flow', timestamp: '2026-07-03T07:30:00', projectName: 'Mervi Platform', actorName: 'CI/CD Bot' },
  { id: 'act-3', type: 'task', title: 'Completed task', description: 'Configure Redis caching for session store', timestamp: '2026-07-02T18:20:00', projectName: 'Infrastructure', actorName: 'Vijay S.' },
  { id: 'act-4', type: 'comment', title: 'Commented on PR #247', description: 'Suggested refactoring chart data transform logic', timestamp: '2026-07-02T16:50:00', projectName: 'Analytics Engine', actorName: 'Priya K.' },
  { id: 'act-5', type: 'review', title: 'Code review requested', description: 'Review Kafka consumer error handling', timestamp: '2026-07-02T15:10:00', projectName: 'Notification Service', actorName: 'Arjun M.' },
  { id: 'act-6', type: 'sprint', title: 'Sprint 14 started', description: '34 tasks, 89 story points, 2 weeks', timestamp: '2026-06-23T10:00:00', projectName: 'Mervi Platform', actorName: 'System' },
  { id: 'act-7', type: 'bug', title: 'Bug resolved', description: 'Fixed timezone offset in leave calendar exports', timestamp: '2026-07-02T14:30:00', projectName: 'HR Module', actorName: 'Vijay S.' },
  { id: 'act-8', type: 'mention', title: 'Mentioned in comment', description: '@vijay can you review the rate limiter config?', timestamp: '2026-07-02T12:00:00', projectName: 'API Gateway', actorName: 'Deepa R.' },
  { id: 'act-9', type: 'pr', title: 'Opened PR #249', description: 'Add exponential backoff to webhook retries', timestamp: '2026-07-02T11:15:00', projectName: 'Client Portal', actorName: 'Vijay S.' },
  { id: 'act-10', type: 'task', title: 'Task picked up', description: 'Implement password strength meter on registration', timestamp: '2026-07-02T09:00:00', projectName: 'Mervi Platform', actorName: 'Vijay S.' },
  { id: 'act-11', type: 'deployment', title: 'Production deploy', description: 'v2.3.8 — Notification service hotfix', timestamp: '2026-07-01T22:00:00', projectName: 'Notification Service', actorName: 'DevOps' },
  { id: 'act-12', type: 'review', title: 'Approved PR #243', description: 'WebSocket reconnection logic with heartbeat', timestamp: '2026-07-01T17:30:00', projectName: 'Notification Service', actorName: 'Vijay S.' },
];

// ── Project Health ────────────────────────────────────────────────

export const mockProjectHealth: ProjectHealthItem[] = [
  { id: 'proj-1', name: 'Mervi Platform v2', status: 'on-track', progress: 72, nextMilestone: 'Beta Release', dueDate: '2026-07-15', lead: 'Vijay S.', role: 'Tech Lead', recentActivity: '3 PRs merged today' },
  { id: 'proj-2', name: 'Client Portal', status: 'on-track', progress: 95, nextMilestone: 'Production Deploy', dueDate: '2026-07-05', lead: 'Priya K.', role: 'Frontend Lead', recentActivity: 'Final QA in progress' },
  { id: 'proj-3', name: 'Analytics Engine', status: 'at-risk', progress: 45, nextMilestone: 'Dashboard MVP', dueDate: '2026-07-10', lead: 'Arjun M.', role: 'Backend Lead', recentActivity: 'Kafka pipeline redesign' },
  { id: 'proj-4', name: 'Mobile App', status: 'behind', progress: 28, nextMilestone: 'Design Review', dueDate: '2026-07-08', lead: 'Deepa R.', role: 'Mobile Lead', recentActivity: 'Blocked on API contracts' },
];

// ── Notifications ─────────────────────────────────────────────────

export const mockNotifications = [
  { id: 'n1', type: 'mention' as const, title: 'Mentioned in PR #247', message: 'Priya mentioned you in a code review comment', read: false, createdAt: '2026-07-03T08:30:00', actionUrl: '/development/pull-requests', actorName: 'Priya K.' },
  { id: 'n2', type: 'assignment' as const, title: 'New task assigned', message: 'Fix Razorpay webhook signature validation', read: false, createdAt: '2026-07-03T07:00:00', actionUrl: '/tasks', actorName: 'Arjun M.' },
  { id: 'n3', type: 'deployment' as const, title: 'Deployment successful', message: 'v2.4.1 deployed to staging successfully', read: true, createdAt: '2026-07-03T07:30:00', actorName: 'CI/CD' },
  { id: 'n4', type: 'meeting' as const, title: 'Meeting in 15 minutes', message: 'Daily Standup starts at 9:30 AM', read: true, createdAt: '2026-07-03T09:15:00', actorName: 'Calendar' },
  { id: 'n5', type: 'approval' as const, title: 'Leave approved', message: 'Your leave request for July 14-15 has been approved', read: true, createdAt: '2026-07-02T14:00:00', actorName: 'HR System' },
];

// ── Full Workspace Tasks ──────────────────────────────────────────

export const mockWorkspaceTasks: WorkspaceTask[] = [
  {
    id: 'wt-1', key: 'MVP-201', title: 'Implement JWT refresh token rotation', description: 'Add automatic token rotation on refresh to prevent token reuse attacks.',
    status: 'IN_PROGRESS', priority: 'HIGH', type: 'STORY', projectName: 'Mervi Platform', projectId: 'proj-1',
    epicName: 'Authentication System', sprintName: 'Sprint 14', sprintId: 'sprint-14', dueDate: '2026-07-03',
    storyPoints: 5, progress: 60, labels: ['security', 'auth'], attachmentCount: 2, commentCount: 4, timeLogged: 240,
    assignee: { name: 'Vijay S.' }, reporter: { name: 'Arjun M.' }, createdAt: '2026-06-25T10:00:00', updatedAt: '2026-07-03T08:00:00',
  },
  {
    id: 'wt-2', key: 'CP-45', title: 'Fix Razorpay webhook signature validation', description: 'Webhook payloads are failing HMAC verification after Razorpay API update.',
    status: 'TODO', priority: 'CRITICAL', type: 'BUG', projectName: 'Client Portal', projectId: 'proj-2',
    epicName: 'Payment Integration', sprintName: 'Sprint 14', sprintId: 'sprint-14', dueDate: '2026-07-03',
    storyPoints: 3, progress: 0, labels: ['bug', 'payments', 'urgent'], attachmentCount: 1, commentCount: 6, timeLogged: 0,
    assignee: { name: 'Vijay S.' }, reporter: { name: 'Priya K.' }, createdAt: '2026-07-02T14:00:00', updatedAt: '2026-07-03T07:00:00',
  },
  {
    id: 'wt-3', key: 'MVP-205', title: 'Write unit tests for auth middleware', description: 'Cover JWT validation, role-based access, and edge cases.',
    status: 'TODO', priority: 'MEDIUM', type: 'TASK', projectName: 'Mervi Platform', projectId: 'proj-1',
    epicName: 'Authentication System', sprintName: 'Sprint 14', sprintId: 'sprint-14', dueDate: '2026-07-04',
    storyPoints: 3, progress: 0, labels: ['testing'], attachmentCount: 0, commentCount: 1, timeLogged: 0,
    assignee: { name: 'Vijay S.' }, reporter: { name: 'Vijay S.' }, createdAt: '2026-06-28T10:00:00', updatedAt: '2026-06-28T10:00:00',
  },
  {
    id: 'wt-4', key: 'AE-89', title: 'Review PR #247 — Dashboard analytics', description: 'Review Recharts integration and data transformation layer.',
    status: 'REVIEW', priority: 'HIGH', type: 'TASK', projectName: 'Analytics Engine', projectId: 'proj-3',
    epicName: 'Dashboard Widget Engine', sprintName: 'Sprint 14', sprintId: 'sprint-14', dueDate: '2026-07-03',
    storyPoints: 2, progress: 80, labels: ['review', 'frontend'], attachmentCount: 0, commentCount: 8, timeLogged: 45,
    assignee: { name: 'Vijay S.' }, reporter: { name: 'Priya K.' }, createdAt: '2026-07-01T10:00:00', updatedAt: '2026-07-03T08:30:00',
  },
  {
    id: 'wt-5', key: 'MVP-210', title: 'Update API documentation for v2 endpoints', description: 'Swagger/OpenAPI spec update for all new auth and employee endpoints.',
    status: 'BACKLOG', priority: 'LOW', type: 'CHORE', projectName: 'Mervi Platform', projectId: 'proj-1',
    labels: ['docs'], attachmentCount: 0, commentCount: 0, timeLogged: 0,
    assignee: { name: 'Vijay S.' }, reporter: { name: 'Arjun M.' }, createdAt: '2026-06-20T10:00:00', updatedAt: '2026-06-20T10:00:00',
  },
  {
    id: 'wt-6', key: 'MVP-198', title: 'Add password strength meter to registration', description: 'Implement zxcvbn-based password strength indicator with real-time feedback.',
    status: 'IN_PROGRESS', priority: 'MEDIUM', type: 'STORY', projectName: 'Mervi Platform', projectId: 'proj-1',
    epicName: 'Authentication System', sprintName: 'Sprint 14', sprintId: 'sprint-14', dueDate: '2026-07-05',
    storyPoints: 3, progress: 40, labels: ['frontend', 'ux'], attachmentCount: 1, commentCount: 2, timeLogged: 90,
    assignee: { name: 'Vijay S.' }, reporter: { name: 'Deepa R.' }, createdAt: '2026-06-26T10:00:00', updatedAt: '2026-07-02T16:00:00',
  },
  {
    id: 'wt-7', key: 'NS-34', title: 'Implement WebSocket reconnection heartbeat', description: 'Add ping/pong mechanism to detect stale WebSocket connections.',
    status: 'DONE', priority: 'HIGH', type: 'STORY', projectName: 'Notification Service', projectId: 'proj-5',
    epicName: 'Notification Hub', sprintName: 'Sprint 14', sprintId: 'sprint-14',
    storyPoints: 5, progress: 100, labels: ['backend', 'websocket'], attachmentCount: 0, commentCount: 3, timeLogged: 360,
    assignee: { name: 'Vijay S.' }, reporter: { name: 'Arjun M.' }, createdAt: '2026-06-24T10:00:00', updatedAt: '2026-07-01T17:00:00',
  },
  {
    id: 'wt-8', key: 'CP-48', title: 'Build invoice PDF export component', description: 'React component that renders invoice data as downloadable PDF.',
    status: 'TESTING', priority: 'MEDIUM', type: 'STORY', projectName: 'Client Portal', projectId: 'proj-2',
    epicName: 'Payment Integration', sprintName: 'Sprint 14', sprintId: 'sprint-14', dueDate: '2026-07-04',
    storyPoints: 5, progress: 90, labels: ['frontend', 'pdf'], attachmentCount: 3, commentCount: 5, timeLogged: 480,
    assignee: { name: 'Vijay S.' }, reporter: { name: 'Priya K.' }, createdAt: '2026-06-25T10:00:00', updatedAt: '2026-07-03T06:00:00',
  },
  {
    id: 'wt-9', key: 'MA-12', title: 'Design login screen for mobile app', description: 'Create Figma-aligned login screen with biometric auth option.',
    status: 'TODO', priority: 'HIGH', type: 'STORY', projectName: 'Mobile App', projectId: 'proj-4',
    epicName: 'Mobile Auth', dueDate: '2026-07-06',
    storyPoints: 5, progress: 0, labels: ['mobile', 'design'], attachmentCount: 2, commentCount: 1, timeLogged: 0,
    assignee: { name: 'Vijay S.' }, reporter: { name: 'Deepa R.' }, createdAt: '2026-07-01T10:00:00', updatedAt: '2026-07-01T10:00:00',
  },
  {
    id: 'wt-10', key: 'MVP-215', title: 'Configure rate limiting on API gateway', description: 'Redis-backed sliding window rate limiter for public endpoints.',
    status: 'IN_PROGRESS', priority: 'HIGH', type: 'TASK', projectName: 'Mervi Platform', projectId: 'proj-1',
    epicName: 'Infrastructure', sprintName: 'Sprint 14', sprintId: 'sprint-14', dueDate: '2026-07-05',
    storyPoints: 5, progress: 30, labels: ['backend', 'security', 'infra'], attachmentCount: 0, commentCount: 2, timeLogged: 120,
    assignee: { name: 'Vijay S.' }, reporter: { name: 'Arjun M.' }, createdAt: '2026-06-27T10:00:00', updatedAt: '2026-07-02T18:00:00',
  },
  {
    id: 'wt-11', key: 'AE-92', title: 'Build real-time analytics WebSocket feed', description: 'Stream Kafka aggregation updates to MD portal dashboards via WebSocket.',
    status: 'BACKLOG', priority: 'MEDIUM', type: 'SPIKE', projectName: 'Analytics Engine', projectId: 'proj-3',
    epicName: 'Dashboard Widget Engine', labels: ['backend', 'research'], attachmentCount: 0, commentCount: 0, timeLogged: 0,
    assignee: { name: 'Vijay S.' }, reporter: { name: 'Arjun M.' }, createdAt: '2026-06-30T10:00:00', updatedAt: '2026-06-30T10:00:00',
  },
  {
    id: 'wt-12', key: 'MVP-220', title: 'Set up E2E test suite with Playwright', description: 'Configure Playwright for critical user flows: login, MFA, task CRUD.',
    status: 'TODO', priority: 'MEDIUM', type: 'TASK', projectName: 'Mervi Platform', projectId: 'proj-1',
    epicName: 'Quality Assurance', dueDate: '2026-07-08',
    storyPoints: 8, progress: 0, labels: ['testing', 'e2e'], attachmentCount: 0, commentCount: 0, timeLogged: 0,
    assignee: { name: 'Vijay S.' }, reporter: { name: 'Vijay S.' }, createdAt: '2026-07-01T10:00:00', updatedAt: '2026-07-01T10:00:00',
  },
];

// ── Calendar Events ───────────────────────────────────────────────

export const mockCalendarEvents: CalendarEvent[] = [
  { id: 'ce-1', title: 'Daily Standup', startTime: '2026-07-03T09:30:00', endTime: '2026-07-03T09:45:00', type: 'meeting', color: 'blue', isRecurring: true, attendees: 8 },
  { id: 'ce-2', title: 'Sprint 14 Review', startTime: '2026-07-03T14:00:00', endTime: '2026-07-03T15:00:00', type: 'meeting', color: 'purple', attendees: 12, projectName: 'Mervi Platform' },
  { id: 'ce-3', title: '1:1 with Arjun', startTime: '2026-07-03T16:00:00', endTime: '2026-07-03T16:30:00', type: 'meeting', color: 'teal', attendees: 2 },
  { id: 'ce-4', title: 'Sprint 15 Planning', startTime: '2026-07-07T10:00:00', endTime: '2026-07-07T12:00:00', type: 'sprint', color: 'indigo', attendees: 6, projectName: 'Mervi Platform' },
  { id: 'ce-5', title: 'Client Portal Deploy', startTime: '2026-07-05T18:00:00', endTime: '2026-07-05T19:00:00', type: 'deployment', color: 'green', projectName: 'Client Portal' },
  { id: 'ce-6', title: 'Priya K. — Birthday 🎂', startTime: '2026-07-06T00:00:00', endTime: '2026-07-06T23:59:59', type: 'birthday', color: 'pink', allDay: true },
  { id: 'ce-7', title: 'Leave — Vijay S.', startTime: '2026-07-14T00:00:00', endTime: '2026-07-15T23:59:59', type: 'leave', color: 'amber', allDay: true },
  { id: 'ce-8', title: 'Quarterly Performance Review', startTime: '2026-07-10T11:00:00', endTime: '2026-07-10T12:00:00', type: 'review', color: 'orange', attendees: 2 },
  { id: 'ce-9', title: 'MVP-201 Due', startTime: '2026-07-03T23:59:59', endTime: '2026-07-03T23:59:59', type: 'deadline', color: 'red', projectName: 'Mervi Platform' },
  { id: 'ce-10', title: 'React 19 Workshop', startTime: '2026-07-08T14:00:00', endTime: '2026-07-08T16:00:00', type: 'training', color: 'cyan', attendees: 15 },
  { id: 'ce-11', title: 'Gym Session', startTime: '2026-07-03T07:00:00', endTime: '2026-07-03T08:00:00', type: 'personal', color: 'slate', isRecurring: true },
  { id: 'ce-12', title: 'Sprint 14 Retro', startTime: '2026-07-04T15:00:00', endTime: '2026-07-04T16:00:00', type: 'sprint', color: 'indigo', attendees: 6, projectName: 'Mervi Platform' },
  { id: 'ce-13', title: 'Architecture Review', startTime: '2026-07-03T11:00:00', endTime: '2026-07-03T12:00:00', type: 'meeting', color: 'blue', hasConflict: false, attendees: 4, projectName: 'Analytics Engine' },
  { id: 'ce-14', title: 'Design System Audit', startTime: '2026-07-09T10:00:00', endTime: '2026-07-09T11:30:00', type: 'meeting', color: 'purple', attendees: 3 },
  { id: 'ce-15', title: 'Daily Standup', startTime: '2026-07-04T09:30:00', endTime: '2026-07-04T09:45:00', type: 'meeting', color: 'blue', isRecurring: true, attendees: 8 },
  { id: 'ce-16', title: 'Daily Standup', startTime: '2026-07-07T09:30:00', endTime: '2026-07-07T09:45:00', type: 'meeting', color: 'blue', isRecurring: true, attendees: 8 },
  { id: 'ce-17', title: 'Daily Standup', startTime: '2026-07-08T09:30:00', endTime: '2026-07-08T09:45:00', type: 'meeting', color: 'blue', isRecurring: true, attendees: 8 },
  { id: 'ce-18', title: 'Daily Standup', startTime: '2026-07-09T09:30:00', endTime: '2026-07-09T09:45:00', type: 'meeting', color: 'blue', isRecurring: true, attendees: 8 },
  { id: 'ce-19', title: 'Daily Standup', startTime: '2026-07-10T09:30:00', endTime: '2026-07-10T09:45:00', type: 'meeting', color: 'blue', isRecurring: true, attendees: 8 },
  { id: 'ce-20', title: 'Analytics Engine — Dashboard MVP Deadline', startTime: '2026-07-10T23:59:59', endTime: '2026-07-10T23:59:59', type: 'deadline', color: 'red', projectName: 'Analytics Engine' },
];

// ── Full Meetings ─────────────────────────────────────────────────

export const mockMeetings: Meeting[] = [
  {
    id: 'fm-1', title: 'Daily Standup', description: 'Quick sync on blockers and daily goals.',
    organizer: 'Arjun M.', participants: [
      { id: 'p1', name: 'Vijay S.', status: 'accepted' }, { id: 'p2', name: 'Priya K.', status: 'accepted' },
      { id: 'p3', name: 'Arjun M.', status: 'accepted' }, { id: 'p4', name: 'Deepa R.', status: 'accepted' },
      { id: 'p5', name: 'Karthik N.', status: 'accepted' }, { id: 'p6', name: 'Meera S.', status: 'tentative' },
    ],
    startTime: '2026-07-03T09:30:00', endTime: '2026-07-03T09:45:00', type: 'standup', status: 'in-progress',
    projectName: 'Mervi Platform', location: 'Google Meet', meetingLink: 'https://meet.google.com/abc-defg-hij',
    isRecurring: true, recurrencePattern: 'Every weekday at 9:30 AM',
    agenda: [
      { id: 'a1', title: 'Yesterday\'s progress', completed: true },
      { id: 'a2', title: 'Today\'s plan', completed: false },
      { id: 'a3', title: 'Blockers & dependencies', completed: false },
    ],
    actionItems: [], notes: '', attachments: [],
  },
  {
    id: 'fm-2', title: 'Sprint 14 Review', description: 'Demo completed work from Sprint 14 to stakeholders.',
    organizer: 'Arjun M.', participants: [
      { id: 'p1', name: 'Vijay S.', status: 'accepted' }, { id: 'p2', name: 'Priya K.', status: 'accepted' },
      { id: 'p3', name: 'Arjun M.', status: 'accepted' }, { id: 'p4', name: 'Deepa R.', status: 'accepted' },
      { id: 'p7', name: 'Hari V.', role: 'MD', status: 'accepted' }, { id: 'p8', name: 'Ravi K.', role: 'CTO', status: 'accepted' },
    ],
    startTime: '2026-07-03T14:00:00', endTime: '2026-07-03T15:00:00', type: 'review', status: 'scheduled',
    projectName: 'Mervi Platform', sprintName: 'Sprint 14', location: 'Conference Room A',
    agenda: [
      { id: 'a4', title: 'JWT token rotation demo', duration: 10, presenter: 'Vijay S.', completed: false },
      { id: 'a5', title: 'Client portal invoice flow', duration: 15, presenter: 'Priya K.', completed: false },
      { id: 'a6', title: 'Analytics dashboard widgets', duration: 10, presenter: 'Arjun M.', completed: false },
      { id: 'a7', title: 'Q&A and feedback', duration: 15, completed: false },
    ],
    actionItems: [
      { id: 'ai1', title: 'Prepare demo environment', assignee: 'Vijay S.', dueDate: '2026-07-03', completed: false },
    ],
    notes: '', attachments: ['Sprint 14 Burndown.pdf'],
  },
  {
    id: 'fm-3', title: '1:1 with Arjun', description: 'Weekly sync on career growth and project alignment.',
    organizer: 'Arjun M.', participants: [
      { id: 'p1', name: 'Vijay S.', status: 'accepted' }, { id: 'p3', name: 'Arjun M.', status: 'accepted' },
    ],
    startTime: '2026-07-03T16:00:00', endTime: '2026-07-03T16:30:00', type: 'one-on-one', status: 'scheduled',
    isRecurring: true, recurrencePattern: 'Every Thursday at 4:00 PM',
    agenda: [
      { id: 'a8', title: 'Weekly highlights', completed: false },
      { id: 'a9', title: 'Career development check-in', completed: false },
      { id: 'a10', title: 'Sprint 15 scope discussion', completed: false },
    ],
    actionItems: [], notes: '', attachments: [],
  },
  {
    id: 'fm-4', title: 'Sprint 14 Retrospective', description: 'Reflect on what went well and what to improve.',
    organizer: 'Arjun M.', participants: [
      { id: 'p1', name: 'Vijay S.', status: 'accepted' }, { id: 'p2', name: 'Priya K.', status: 'accepted' },
      { id: 'p3', name: 'Arjun M.', status: 'accepted' }, { id: 'p4', name: 'Deepa R.', status: 'declined' },
    ],
    startTime: '2026-07-04T15:00:00', endTime: '2026-07-04T16:00:00', type: 'retro', status: 'scheduled',
    projectName: 'Mervi Platform', sprintName: 'Sprint 14',
    agenda: [
      { id: 'a11', title: 'What went well?', completed: false },
      { id: 'a12', title: 'What could be improved?', completed: false },
      { id: 'a13', title: 'Action items for Sprint 15', completed: false },
    ],
    actionItems: [], notes: '', attachments: [],
  },
  {
    id: 'fm-5', title: 'Sprint 15 Planning', description: 'Plan stories and capacity for the next sprint.',
    organizer: 'Arjun M.', participants: [
      { id: 'p1', name: 'Vijay S.', status: 'accepted' }, { id: 'p2', name: 'Priya K.', status: 'accepted' },
      { id: 'p3', name: 'Arjun M.', status: 'accepted' }, { id: 'p4', name: 'Deepa R.', status: 'tentative' },
      { id: 'p5', name: 'Karthik N.', status: 'accepted' },
    ],
    startTime: '2026-07-07T10:00:00', endTime: '2026-07-07T12:00:00', type: 'planning', status: 'scheduled',
    projectName: 'Mervi Platform', sprintName: 'Sprint 15',
    agenda: [
      { id: 'a14', title: 'Review backlog priorities', duration: 20, completed: false },
      { id: 'a15', title: 'Capacity estimation', duration: 15, completed: false },
      { id: 'a16', title: 'Story assignment', duration: 40, completed: false },
      { id: 'a17', title: 'Sprint goal alignment', duration: 15, completed: false },
    ],
    actionItems: [], notes: '', attachments: [],
  },
  {
    id: 'fm-6', title: 'Architecture Review — Analytics Pipeline', description: 'Review the Kafka-to-MongoDB aggregation pipeline architecture.',
    organizer: 'Arjun M.', participants: [
      { id: 'p1', name: 'Vijay S.', status: 'accepted' }, { id: 'p3', name: 'Arjun M.', status: 'accepted' },
      { id: 'p5', name: 'Karthik N.', status: 'accepted' },
    ],
    startTime: '2026-06-30T11:00:00', endTime: '2026-06-30T12:00:00', type: 'review', status: 'completed',
    projectName: 'Analytics Engine',
    agenda: [
      { id: 'a18', title: 'Current pipeline overview', duration: 15, presenter: 'Arjun M.', completed: true },
      { id: 'a19', title: 'Performance bottlenecks', duration: 20, presenter: 'Karthik N.', completed: true },
      { id: 'a20', title: 'Proposed improvements', duration: 20, presenter: 'Vijay S.', completed: true },
    ],
    actionItems: [
      { id: 'ai2', title: 'Benchmark current throughput', assignee: 'Karthik N.', dueDate: '2026-07-05', completed: false },
      { id: 'ai3', title: 'Draft new pipeline design doc', assignee: 'Arjun M.', dueDate: '2026-07-07', completed: false },
    ],
    notes: '## Key Decisions\n- Move to Change Data Capture (CDC) for real-time sync\n- Add Redis caching layer for hot aggregates\n- Target 500ms p99 latency for dashboard queries',
    hasRecording: true, hasTranscript: true, attachments: ['Pipeline Architecture v2.pdf', 'Benchmark Results.xlsx'],
  },
  {
    id: 'fm-7', title: 'Client Demo — Invoice Module', description: 'Demo the new invoice generation feature to the client.',
    organizer: 'Priya K.', participants: [
      { id: 'p1', name: 'Vijay S.', status: 'accepted' }, { id: 'p2', name: 'Priya K.', status: 'accepted' },
      { id: 'p9', name: 'Client Rep', role: 'Client', status: 'accepted' },
    ],
    startTime: '2026-06-28T15:00:00', endTime: '2026-06-28T16:00:00', type: 'demo', status: 'completed',
    projectName: 'Client Portal',
    agenda: [
      { id: 'a21', title: 'Invoice creation flow', duration: 20, presenter: 'Priya K.', completed: true },
      { id: 'a22', title: 'PDF export demo', duration: 15, presenter: 'Vijay S.', completed: true },
      { id: 'a23', title: 'Client feedback', duration: 20, completed: true },
    ],
    actionItems: [
      { id: 'ai4', title: 'Add GST field to invoice template', assignee: 'Priya K.', dueDate: '2026-07-05', completed: true },
      { id: 'ai5', title: 'Support multi-currency display', assignee: 'Vijay S.', dueDate: '2026-07-10', completed: false },
    ],
    notes: '## Client Feedback\n- Loved the clean invoice design\n- Requested multi-currency support\n- Asked about recurring invoice automation',
    hasRecording: true, attachments: ['Invoice Template v3.pdf'],
  },
  {
    id: 'fm-8', title: 'Weekly Design Sync', description: 'Cancelled due to public holiday.',
    organizer: 'Deepa R.', participants: [
      { id: 'p1', name: 'Vijay S.', status: 'accepted' }, { id: 'p4', name: 'Deepa R.', status: 'accepted' },
    ],
    startTime: '2026-07-01T10:00:00', endTime: '2026-07-01T10:30:00', type: 'general', status: 'cancelled',
    isRecurring: true, recurrencePattern: 'Every Tuesday at 10:00 AM',
    agenda: [], actionItems: [], notes: '', attachments: [],
  },
];

// ── Time Entries ──────────────────────────────────────────────────

export const mockTimeEntries: TimeEntry[] = [
  { id: 'te-1', taskId: 'wt-1', taskTitle: 'JWT refresh token rotation', projectName: 'Mervi Platform', date: '2026-07-03', duration: 120, description: 'Implemented rotation logic and wrote integration tests', startTime: '09:00', endTime: '11:00' },
  { id: 'te-2', taskId: 'wt-4', taskTitle: 'Review PR #247', projectName: 'Analytics Engine', date: '2026-07-03', duration: 45, description: 'Code review and left feedback comments', startTime: '11:15', endTime: '12:00' },
  { id: 'te-3', taskId: 'wt-8', taskTitle: 'Invoice PDF export', projectName: 'Client Portal', date: '2026-07-03', duration: 90, description: 'Fixed PDF rendering edge cases', startTime: '13:00', endTime: '14:30' },
  { id: 'te-4', taskId: 'wt-1', taskTitle: 'JWT refresh token rotation', projectName: 'Mervi Platform', date: '2026-07-02', duration: 180, description: 'Database schema changes and migration script', startTime: '09:00', endTime: '12:00' },
  { id: 'te-5', taskId: 'wt-10', taskTitle: 'Rate limiting config', projectName: 'Mervi Platform', date: '2026-07-02', duration: 120, description: 'Redis sliding window implementation', startTime: '13:30', endTime: '15:30' },
  { id: 'te-6', taskId: 'wt-6', taskTitle: 'Password strength meter', projectName: 'Mervi Platform', date: '2026-07-02', duration: 90, description: 'Integrated zxcvbn library and built UI component', startTime: '16:00', endTime: '17:30' },
  { id: 'te-7', taskId: 'wt-7', taskTitle: 'WebSocket heartbeat', projectName: 'Notification Service', date: '2026-07-01', duration: 240, description: 'Ping/pong implementation and test suite', startTime: '09:00', endTime: '13:00' },
  { id: 'te-8', taskId: 'wt-8', taskTitle: 'Invoice PDF export', projectName: 'Client Portal', date: '2026-07-01', duration: 180, description: 'PDF layout and Puppeteer rendering setup', startTime: '14:00', endTime: '17:00' },
];

// ── Personal Goals ────────────────────────────────────────────────

export const mockPersonalGoals: PersonalGoal[] = [
  { id: 'g-1', title: 'Close 20 story points', period: 'weekly', progress: 15, target: 20, unit: 'points', dueDate: '2026-07-07', status: 'on-track' },
  { id: 'g-2', title: 'Complete 5 code reviews', period: 'weekly', progress: 3, target: 5, unit: 'reviews', dueDate: '2026-07-07', status: 'on-track' },
  { id: 'g-3', title: 'Ship authentication module', period: 'monthly', progress: 72, target: 100, unit: '%', dueDate: '2026-07-31', status: 'on-track' },
  { id: 'g-4', title: 'Obtain AWS Solutions Architect cert', period: 'quarterly', progress: 40, target: 100, unit: '%', dueDate: '2026-09-30', status: 'at-risk' },
  { id: 'g-5', title: 'Contribute to 3 open source projects', period: 'quarterly', progress: 1, target: 3, unit: 'projects', dueDate: '2026-09-30', status: 'on-track' },
];

// ── Blockers ──────────────────────────────────────────────────────

export const mockBlockers: Blocker[] = [
  {
    id: 'b-1', taskId: 'wt-9', taskTitle: 'Design login screen for mobile app',
    reason: 'Waiting for finalized API contract from backend team. The auth endpoints spec is not signed off yet.',
    owner: 'Arjun M.', eta: '2026-07-05', dependencies: ['MVP-201', 'MVP-205'], createdAt: '2026-07-01T10:00:00', severity: 'high',
  },
  {
    id: 'b-2', taskId: 'wt-2', taskTitle: 'Fix Razorpay webhook signature validation',
    reason: 'Need updated API keys from Razorpay dashboard. Operations team access pending.',
    owner: 'Priya K.', eta: '2026-07-04', dependencies: [], createdAt: '2026-07-02T14:00:00', severity: 'critical',
  },
];

// ── Performance Metrics ───────────────────────────────────────────

export const mockPerformanceMetrics: PerformanceMetric[] = [
  { label: 'Tasks Completed', value: 23, change: 15, target: 30 },
  { label: 'Story Points', value: 42, change: 8, target: 55 },
  { label: 'Bugs Closed', value: 7, change: -10, target: 10 },
  { label: 'Code Reviews', value: 12, change: 25, target: 15 },
  { label: 'Productivity Score', value: 87, change: 5 },
];

export const mockPerformanceChart: PerformanceChartPoint[] = [
  { week: 'W22', tasksCompleted: 8, storyPoints: 18, bugsFixed: 2, codeReviews: 4 },
  { week: 'W23', tasksCompleted: 12, storyPoints: 24, bugsFixed: 3, codeReviews: 6 },
  { week: 'W24', tasksCompleted: 10, storyPoints: 20, bugsFixed: 4, codeReviews: 5 },
  { week: 'W25', tasksCompleted: 15, storyPoints: 32, bugsFixed: 2, codeReviews: 7 },
  { week: 'W26', tasksCompleted: 11, storyPoints: 22, bugsFixed: 5, codeReviews: 3 },
  { week: 'W27', tasksCompleted: 23, storyPoints: 42, bugsFixed: 7, codeReviews: 12 },
];

// ── AI Insights ───────────────────────────────────────────────────

export const mockAIInsights: AIInsight[] = [
  { id: 'ai-1', type: 'warning', title: 'High priority task overdue', message: 'MVP-201 (JWT refresh token rotation) was due today and is only 60% complete. Consider pair programming to accelerate.', priority: 'high', actionLabel: 'View Task', actionUrl: '/tasks' },
  { id: 'ai-2', type: 'warning', title: 'Sprint at risk', message: 'Sprint 14 has 4 days remaining with 11 tasks incomplete. Current velocity suggests 68% completion probability.', priority: 'high', actionLabel: 'View Sprint', actionUrl: '/agile/board' },
  { id: 'ai-3', type: 'info', title: 'Meeting conflict detected', message: 'Architecture Review (11:00 AM) overlaps with your focus time block. Consider rescheduling.', priority: 'medium', actionLabel: 'View Calendar', actionUrl: '/workspace/calendar' },
  { id: 'ai-4', type: 'suggestion', title: 'Review pending since yesterday', message: 'PR #247 has been in review for 2 days. Completing it will unblock the analytics dashboard feature.', priority: 'medium', actionLabel: 'Open PR', actionUrl: '/development/pull-requests' },
  { id: 'ai-5', type: 'success', title: 'Great week for code reviews', message: 'You completed 12 code reviews this sprint — 25% above your weekly average. Keep it up!', priority: 'low' },
];
