// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Mock Data
// Production-realistic sample data for all modules.
// Used when NEXT_PUBLIC_USE_MOCK !== 'false'.
// ═══════════════════════════════════════════════════════════════════

import type {
  Project, ProjectMember, ProjectPhase, Milestone, Task,
  Invoice, Payment, BillingStats, Document as MerviDocument, SupportTicket,
  Meeting, Notification, ActivityEntry, CalendarEvent,
  ApprovalItem, InfraOverview, UserProfile, SecuritySettings,
  NotificationPreferences, KBArticle, UserSession,
} from './types';

// ── Team Members ──────────────────────────────────────────────────

export const mockTeamMembers: ProjectMember[] = [
  { id: 'pm-1', firstName: 'Arjun', lastName: 'Mehta', email: 'arjun@hariventures.com', role: 'Project Manager', avatar: undefined, department: 'Management' },
  { id: 'dev-1', firstName: 'Priya', lastName: 'Sharma', email: 'priya@hariventures.com', role: 'Senior Developer', avatar: undefined, department: 'Engineering' },
  { id: 'dev-2', firstName: 'Karthik', lastName: 'Rajan', email: 'karthik@hariventures.com', role: 'Full Stack Developer', avatar: undefined, department: 'Engineering' },
  { id: 'des-1', firstName: 'Neha', lastName: 'Gupta', email: 'neha@hariventures.com', role: 'UI/UX Designer', avatar: undefined, department: 'Design' },
  { id: 'qa-1', firstName: 'Rohan', lastName: 'Iyer', email: 'rohan@hariventures.com', role: 'QA Engineer', avatar: undefined, department: 'Quality' },
  { id: 'devops-1', firstName: 'Vikas', lastName: 'Nair', email: 'vikas@hariventures.com', role: 'DevOps Engineer', avatar: undefined, department: 'Infrastructure' },
];

// ── User Session ──────────────────────────────────────────────────

export const mockUserSession: UserSession = {
  id: 'client-001',
  email: 'client@techcorp.com',
  firstName: 'Rajesh',
  lastName: 'Kumar',
  role: 'CLIENT',
  tenantId: '6676aa9ae9a701309909dcda',
  organizationName: 'TechCorp Industries',
  mfaEnabled: true,
};

// ── Projects ──────────────────────────────────────────────────────

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'TechCorp Enterprise Portal',
    description: 'Complete enterprise resource management platform with HR, Finance, and Operations modules.',
    status: 'DEVELOPMENT',
    health: 'ON_TRACK',
    priority: 'HIGH',
    currentPhase: 'Frontend Development',
    completionPercentage: 62,
    startDate: '2025-11-01',
    estimatedEndDate: '2026-08-30',
    contractValue: 2450000,
    currency: 'INR',
    projectManager: mockTeamMembers[0],
    teamMembers: mockTeamMembers,
    tags: ['Enterprise', 'Web App', 'Next.js'],
    createdAt: '2025-10-15',
    updatedAt: '2026-07-01',
  },
  {
    id: 'proj-2',
    name: 'TechCorp Mobile App',
    description: 'Cross-platform mobile application for employee self-service and task management.',
    status: 'DESIGN',
    health: 'AT_RISK',
    priority: 'MEDIUM',
    currentPhase: 'UI Design',
    completionPercentage: 28,
    startDate: '2026-03-01',
    estimatedEndDate: '2026-12-15',
    contractValue: 1850000,
    currency: 'INR',
    projectManager: mockTeamMembers[0],
    teamMembers: [mockTeamMembers[0], mockTeamMembers[3], mockTeamMembers[1]],
    tags: ['Mobile', 'React Native', 'iOS', 'Android'],
    createdAt: '2026-02-20',
    updatedAt: '2026-06-28',
  },
];

// ── Project Phases ────────────────────────────────────────────────

export const mockProjectPhases: ProjectPhase[] = [
  { id: 'phase-1', name: 'Requirement Analysis', status: 'COMPLETED', order: 1, owner: mockTeamMembers[0], startDate: '2025-11-01', endDate: '2025-11-30', completionPercentage: 100, dependencies: [], documents: ['SRS', 'BRD'], approvalStatus: 'APPROVED', comments: [] },
  { id: 'phase-2', name: 'UI/UX Design', status: 'COMPLETED', order: 2, owner: mockTeamMembers[3], startDate: '2025-12-01', endDate: '2026-01-15', completionPercentage: 100, dependencies: ['phase-1'], documents: ['Wireframes', 'Mockups', 'Design System'], approvalStatus: 'APPROVED', comments: [] },
  { id: 'phase-3', name: 'Frontend Development', status: 'IN_PROGRESS', order: 3, owner: mockTeamMembers[1], startDate: '2026-01-16', endDate: '2026-05-30', completionPercentage: 78, dependencies: ['phase-2'], documents: ['Component Library'], approvalStatus: 'PENDING', comments: [] },
  { id: 'phase-4', name: 'Backend Development', status: 'IN_PROGRESS', order: 4, owner: mockTeamMembers[2], startDate: '2026-02-01', endDate: '2026-06-15', completionPercentage: 65, dependencies: ['phase-1'], documents: ['API Docs'], approvalStatus: 'NOT_REQUIRED', comments: [] },
  { id: 'phase-5', name: 'Integration Testing', status: 'NOT_STARTED', order: 5, owner: mockTeamMembers[4], startDate: '2026-06-16', endDate: '2026-07-31', completionPercentage: 0, dependencies: ['phase-3', 'phase-4'], documents: [], approvalStatus: 'NOT_REQUIRED', comments: [] },
  { id: 'phase-6', name: 'UAT & Deployment', status: 'NOT_STARTED', order: 6, owner: mockTeamMembers[5], startDate: '2026-08-01', endDate: '2026-08-30', completionPercentage: 0, dependencies: ['phase-5'], documents: [], approvalStatus: 'NOT_REQUIRED', comments: [] },
  { id: 'phase-7', name: 'Maintenance & Support', status: 'NOT_STARTED', order: 7, owner: mockTeamMembers[0], startDate: '2026-09-01', endDate: '2027-08-31', completionPercentage: 0, dependencies: ['phase-6'], documents: [], approvalStatus: 'NOT_REQUIRED', comments: [] },
];

// ── Milestones ────────────────────────────────────────────────────

export const mockMilestones: Milestone[] = [
  { id: 'ms-1', projectId: 'proj-1', title: 'Project Kick-off & Requirements Sign-off', description: 'Complete requirements gathering, stakeholder interviews, and SRS document approval.', order: 1, status: 'PAID', completionPercentage: 100, dueDate: '2025-11-30', completedDate: '2025-11-28', amount: 245000, currency: 'INR', deliverables: [{ id: 'd1', title: 'Software Requirements Specification', description: 'Detailed SRS document', status: 'ACCEPTED', type: 'Document', attachments: [] }, { id: 'd2', title: 'Business Requirements Document', description: 'BRD with stakeholder sign-off', status: 'ACCEPTED', type: 'Document', attachments: [] }], approvalHistory: [{ id: 'a1', action: 'SUBMITTED', actor: 'Arjun Mehta', timestamp: '2025-11-26' }, { id: 'a2', action: 'APPROVED', actor: 'Rajesh Kumar', comment: 'Looks comprehensive', timestamp: '2025-11-28' }], paymentStatus: 'PAID', invoiceId: 'inv-1' },
  { id: 'ms-2', projectId: 'proj-1', title: 'UI/UX Design Completion', description: 'Complete wireframes, high-fidelity mockups, design system, and interactive prototypes.', order: 2, status: 'PAID', completionPercentage: 100, dueDate: '2026-01-15', completedDate: '2026-01-14', amount: 367500, currency: 'INR', deliverables: [{ id: 'd3', title: 'High-Fidelity Mockups', description: 'Complete UI designs for all modules', status: 'ACCEPTED', type: 'Design', attachments: [] }], approvalHistory: [{ id: 'a3', action: 'SUBMITTED', actor: 'Neha Gupta', timestamp: '2026-01-12' }, { id: 'a4', action: 'APPROVED', actor: 'Rajesh Kumar', timestamp: '2026-01-14' }], paymentStatus: 'PAID', invoiceId: 'inv-2' },
  { id: 'ms-3', projectId: 'proj-1', title: 'Frontend Module — Phase 1', description: 'Core UI components, authentication, dashboard, and navigation completed.', order: 3, status: 'AWAITING_APPROVAL', completionPercentage: 100, dueDate: '2026-04-30', completedDate: '2026-04-28', amount: 490000, currency: 'INR', deliverables: [{ id: 'd4', title: 'Authentication Module', description: 'Login, MFA, password reset flows', status: 'COMPLETED', type: 'Feature', attachments: [] }, { id: 'd5', title: 'Dashboard & Navigation', description: 'Main dashboard with sidebar navigation', status: 'COMPLETED', type: 'Feature', attachments: [] }], approvalHistory: [{ id: 'a5', action: 'SUBMITTED', actor: 'Priya Sharma', timestamp: '2026-04-28' }], paymentStatus: 'LOCKED' },
  { id: 'ms-4', projectId: 'proj-1', title: 'Backend API — Core Services', description: 'User management, authentication, project CRUD, and milestone management APIs.', order: 4, status: 'IN_PROGRESS', completionPercentage: 65, dueDate: '2026-06-15', amount: 490000, currency: 'INR', deliverables: [{ id: 'd6', title: 'REST API Endpoints', description: 'All core service endpoints', status: 'IN_PROGRESS', type: 'Feature', attachments: [] }], approvalHistory: [], paymentStatus: 'LOCKED' },
  { id: 'ms-5', projectId: 'proj-1', title: 'Integration & Testing', description: 'End-to-end integration testing, performance testing, and security audit.', order: 5, status: 'PENDING', completionPercentage: 0, dueDate: '2026-07-31', amount: 367500, currency: 'INR', deliverables: [], approvalHistory: [], paymentStatus: 'LOCKED' },
  { id: 'ms-6', projectId: 'proj-1', title: 'UAT, Deployment & Go-Live', description: 'User acceptance testing, staging deployment, production go-live.', order: 6, status: 'PENDING', completionPercentage: 0, dueDate: '2026-08-30', amount: 490000, currency: 'INR', deliverables: [], approvalHistory: [], paymentStatus: 'LOCKED' },
];

// ── Tasks ─────────────────────────────────────────────────────────

export const mockTasks: Task[] = [
  { id: 'task-1', projectId: 'proj-1', title: 'Implement authentication flow', description: 'Build login, MFA verification, and password reset pages', status: 'DONE', priority: 'HIGH', type: 'FEATURE', assignee: mockTeamMembers[1], tags: ['auth', 'security'], dueDate: '2026-03-15', attachmentCount: 2, commentCount: 5, createdAt: '2026-02-01', updatedAt: '2026-03-14' },
  { id: 'task-2', projectId: 'proj-1', title: 'Build dashboard components', description: 'Create stat cards, activity timeline, and quick action widgets', status: 'DONE', priority: 'HIGH', type: 'FEATURE', assignee: mockTeamMembers[1], tags: ['dashboard', 'ui'], dueDate: '2026-04-01', attachmentCount: 0, commentCount: 3, createdAt: '2026-03-01', updatedAt: '2026-03-30' },
  { id: 'task-3', projectId: 'proj-1', title: 'Design responsive sidebar navigation', description: 'Collapsible sidebar with grouped navigation sections', status: 'REVIEW', priority: 'MEDIUM', type: 'FEATURE', assignee: mockTeamMembers[3], tags: ['navigation', 'responsive'], dueDate: '2026-04-15', attachmentCount: 3, commentCount: 8, createdAt: '2026-03-10', updatedAt: '2026-04-12' },
  { id: 'task-4', projectId: 'proj-1', title: 'Implement Razorpay integration', description: 'Payment checkout flow with verification callback', status: 'IN_PROGRESS', priority: 'HIGH', type: 'FEATURE', assignee: mockTeamMembers[2], tags: ['payments', 'razorpay'], dueDate: '2026-05-15', attachmentCount: 1, commentCount: 4, createdAt: '2026-04-01', updatedAt: '2026-05-10' },
  { id: 'task-5', projectId: 'proj-1', title: 'Build document management system', description: 'Folder structure, upload, preview, version history', status: 'IN_PROGRESS', priority: 'MEDIUM', type: 'FEATURE', assignee: mockTeamMembers[1], tags: ['documents', 'files'], dueDate: '2026-05-30', attachmentCount: 0, commentCount: 2, createdAt: '2026-04-15', updatedAt: '2026-05-08' },
  { id: 'task-6', projectId: 'proj-1', title: 'Fix date picker timezone bug', description: 'Calendar dates off by one day in IST timezone', status: 'TODO', priority: 'HIGH', type: 'BUG', assignee: mockTeamMembers[1], tags: ['bug', 'calendar'], dueDate: '2026-06-01', attachmentCount: 0, commentCount: 1, createdAt: '2026-05-20', updatedAt: '2026-05-20' },
  { id: 'task-7', projectId: 'proj-1', title: 'API endpoint documentation', description: 'Swagger/OpenAPI documentation for all endpoints', status: 'BACKLOG', priority: 'LOW', type: 'CHORE', assignee: mockTeamMembers[2], tags: ['docs', 'api'], attachmentCount: 0, commentCount: 0, createdAt: '2026-05-01', updatedAt: '2026-05-01' },
  { id: 'task-8', projectId: 'proj-1', title: 'Implement real-time notifications', description: 'WebSocket integration for live notification updates', status: 'BACKLOG', priority: 'MEDIUM', type: 'FEATURE', assignee: undefined, tags: ['notifications', 'websocket'], attachmentCount: 0, commentCount: 0, createdAt: '2026-05-15', updatedAt: '2026-05-15' },
  { id: 'task-9', projectId: 'proj-1', title: 'Performance audit and optimization', description: 'Lighthouse audit, bundle analysis, lazy loading implementation', status: 'BACKLOG', priority: 'MEDIUM', type: 'SPIKE', tags: ['performance'], attachmentCount: 0, commentCount: 0, createdAt: '2026-05-20', updatedAt: '2026-05-20' },
  { id: 'task-10', projectId: 'proj-1', title: 'Add dark mode support', description: 'Theme toggle with system preference detection', status: 'TESTING', priority: 'LOW', type: 'FEATURE', assignee: mockTeamMembers[3], tags: ['theme', 'ui'], dueDate: '2026-06-10', attachmentCount: 0, commentCount: 2, createdAt: '2026-05-25', updatedAt: '2026-06-08' },
];

// ── Invoices ──────────────────────────────────────────────────────

export const mockInvoices: Invoice[] = [
  { id: 'inv-1', invoiceNumber: 'INV-2025-001', milestoneId: 'ms-1', milestoneTitle: 'Project Kick-off & Requirements Sign-off', projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal', amount: 207627, taxAmount: 37373, totalAmount: 245000, currency: 'INR', status: 'PAID', issuedDate: '2025-11-29', dueDate: '2025-12-14', paidDate: '2025-12-10', gstDetails: { cgst: 18686, sgst: 18687, igst: 0, gstNumber: '29AABCT1234F1Z5' }, lineItems: [{ description: 'Requirements Analysis & Documentation', quantity: 1, rate: 207627, amount: 207627 }] },
  { id: 'inv-2', invoiceNumber: 'INV-2026-001', milestoneId: 'ms-2', milestoneTitle: 'UI/UX Design Completion', projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal', amount: 311441, taxAmount: 56059, totalAmount: 367500, currency: 'INR', status: 'PAID', issuedDate: '2026-01-15', dueDate: '2026-01-30', paidDate: '2026-01-28', gstDetails: { cgst: 28029, sgst: 28030, igst: 0, gstNumber: '29AABCT1234F1Z5' }, lineItems: [{ description: 'UI/UX Design — Wireframes, Mockups, Prototypes', quantity: 1, rate: 311441, amount: 311441 }] },
  { id: 'inv-3', invoiceNumber: 'INV-2026-002', milestoneId: 'ms-3', milestoneTitle: 'Frontend Module — Phase 1', projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal', amount: 415254, taxAmount: 74746, totalAmount: 490000, currency: 'INR', status: 'PENDING', issuedDate: '2026-04-30', dueDate: '2026-05-15', gstDetails: { cgst: 37373, sgst: 37373, igst: 0, gstNumber: '29AABCT1234F1Z5' }, lineItems: [{ description: 'Frontend Development — Auth, Dashboard, Navigation', quantity: 1, rate: 415254, amount: 415254 }] },
];

export const mockPayments: Payment[] = [
  { id: 'pay-1', paymentNumber: 'PAY-2025-001', invoiceId: 'inv-1', invoiceNumber: 'INV-2025-001', amount: 245000, currency: 'INR', status: 'SUCCESS', method: 'Razorpay — UPI', razorpayPaymentId: 'pay_K1234567890', razorpayOrderId: 'order_K1234567890', paidAt: '2025-12-10' },
  { id: 'pay-2', paymentNumber: 'PAY-2026-001', invoiceId: 'inv-2', invoiceNumber: 'INV-2026-001', amount: 367500, currency: 'INR', status: 'SUCCESS', method: 'Razorpay — Net Banking', razorpayPaymentId: 'pay_K2345678901', razorpayOrderId: 'order_K2345678901', paidAt: '2026-01-28' },
];

export const mockBillingStats: BillingStats = {
  totalContractValue: 2450000,
  totalPaid: 612500,
  pendingAmount: 490000,
  upcomingDue: 857500,
  overdueAmount: 0,
  currency: 'INR',
};

// ── Documents ─────────────────────────────────────────────────────

export const mockDocuments: MerviDocument[] = [
  { id: 'doc-1', projectId: 'proj-1', name: 'Software Requirements Specification v2.1', type: 'SRS', folder: 'SRS', sizeBytes: 2457600, mimeType: 'application/pdf', version: 3, uploadedBy: 'Arjun Mehta', uploadedAt: '2025-11-25', approvalStatus: 'APPROVED', commentCount: 4, downloadUrl: '/api/v1/documents/doc-1/download' },
  { id: 'doc-2', projectId: 'proj-1', name: 'Non-Disclosure Agreement', type: 'NDA', folder: 'NDA', sizeBytes: 524288, mimeType: 'application/pdf', version: 1, uploadedBy: 'Arjun Mehta', uploadedAt: '2025-10-20', approvalStatus: 'APPROVED', commentCount: 0, downloadUrl: '/api/v1/documents/doc-2/download' },
  { id: 'doc-3', projectId: 'proj-1', name: 'Project Proposal — Enterprise Portal', type: 'PROPOSAL', folder: 'Proposal', sizeBytes: 1843200, mimeType: 'application/pdf', version: 2, uploadedBy: 'Arjun Mehta', uploadedAt: '2025-10-15', approvalStatus: 'APPROVED', commentCount: 2, downloadUrl: '/api/v1/documents/doc-3/download' },
  { id: 'doc-4', projectId: 'proj-1', name: 'Cost Quotation — Final', type: 'QUOTATION', folder: 'Quotation', sizeBytes: 409600, mimeType: 'application/pdf', version: 1, uploadedBy: 'Arjun Mehta', uploadedAt: '2025-10-18', approvalStatus: 'APPROVED', commentCount: 1, downloadUrl: '/api/v1/documents/doc-4/download' },
  { id: 'doc-5', projectId: 'proj-1', name: 'Master Services Agreement', type: 'AGREEMENT', folder: 'Agreement', sizeBytes: 1024000, mimeType: 'application/pdf', version: 1, uploadedBy: 'Arjun Mehta', uploadedAt: '2025-10-22', approvalStatus: 'APPROVED', commentCount: 3, downloadUrl: '/api/v1/documents/doc-5/download' },
  { id: 'doc-6', projectId: 'proj-1', name: 'Dashboard Mockups — High Fidelity', type: 'UI_DESIGN', folder: 'UI', sizeBytes: 8192000, mimeType: 'application/pdf', version: 4, uploadedBy: 'Neha Gupta', uploadedAt: '2026-01-10', approvalStatus: 'APPROVED', commentCount: 12, downloadUrl: '/api/v1/documents/doc-6/download' },
  { id: 'doc-7', projectId: 'proj-1', name: 'API Documentation — v1.0', type: 'API_DOCS', folder: 'API', sizeBytes: 3072000, mimeType: 'application/pdf', version: 2, uploadedBy: 'Karthik Rajan', uploadedAt: '2026-04-20', approvalStatus: 'PENDING', commentCount: 1, downloadUrl: '/api/v1/documents/doc-7/download' },
  { id: 'doc-8', projectId: 'proj-1', name: 'System Architecture Diagram', type: 'ARCHITECTURE', folder: 'Architecture', sizeBytes: 2048000, mimeType: 'image/png', version: 2, uploadedBy: 'Priya Sharma', uploadedAt: '2026-02-15', approvalStatus: 'APPROVED', commentCount: 5, downloadUrl: '/api/v1/documents/doc-8/download' },
];

// ── Support Tickets ───────────────────────────────────────────────

export const mockTickets: SupportTicket[] = [
  { id: 'tkt-1', ticketNumber: 'TKT-2026-042', subject: 'Dashboard loading slowly on mobile', description: 'The dashboard page takes over 5 seconds to load on mobile devices. Expected under 2 seconds.', type: 'BUG_REPORT', status: 'IN_PROGRESS', priority: 'HIGH', projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal', assignedTo: 'Priya Sharma', createdAt: '2026-06-28', updatedAt: '2026-06-30', lastResponseAt: '2026-06-30', messageCount: 4, attachments: [] },
  { id: 'tkt-2', ticketNumber: 'TKT-2026-041', subject: 'Add export to CSV for reports', description: 'Would be helpful to export project reports as CSV files for sharing with our finance team.', type: 'FEATURE_REQUEST', status: 'OPEN', priority: 'MEDIUM', projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal', createdAt: '2026-06-25', updatedAt: '2026-06-25', messageCount: 1, attachments: [] },
  { id: 'tkt-3', ticketNumber: 'TKT-2026-038', subject: 'Invoice PDF missing GST breakdown', description: 'Downloaded invoice PDF does not show CGST/SGST split. Needed for tax filing.', type: 'BUG_REPORT', status: 'RESOLVED', priority: 'HIGH', projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal', assignedTo: 'Karthik Rajan', createdAt: '2026-06-15', updatedAt: '2026-06-20', lastResponseAt: '2026-06-20', messageCount: 6, attachments: [] },
];

// ── Meetings ──────────────────────────────────────────────────────

export const mockMeetings: Meeting[] = [
  { id: 'meet-1', title: 'Sprint Review — Sprint 14', description: 'Demo of completed features and sprint retrospective.', status: 'SCHEDULED', startTime: '2026-07-04T10:00:00+05:30', endTime: '2026-07-04T11:00:00+05:30', meetingUrl: 'https://meet.google.com/abc-defg-hij', agenda: ['Sprint demo', 'Feedback collection', 'Next sprint planning preview'], participants: [mockTeamMembers[0], mockTeamMembers[1], mockTeamMembers[3]], projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal' },
  { id: 'meet-2', title: 'Milestone 3 Review & Approval', description: 'Client review of Frontend Module Phase 1 deliverables for approval.', status: 'SCHEDULED', startTime: '2026-07-07T14:00:00+05:30', endTime: '2026-07-07T15:30:00+05:30', meetingUrl: 'https://meet.google.com/klm-nopq-rst', agenda: ['Deliverables walkthrough', 'Q&A', 'Approval decision'], participants: [mockTeamMembers[0], mockTeamMembers[1]], projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal' },
  { id: 'meet-3', title: 'Weekly Sync — Mobile App', description: 'Regular weekly sync on mobile app design progress.', status: 'COMPLETED', startTime: '2026-06-27T11:00:00+05:30', endTime: '2026-06-27T11:30:00+05:30', agenda: ['Design progress update', 'Blockers'], participants: [mockTeamMembers[0], mockTeamMembers[3]], notes: 'Design iteration 3 approved. Moving to component library next week.', projectId: 'proj-2', projectName: 'TechCorp Mobile App' },
];

// ── Notifications ─────────────────────────────────────────────────

export const mockNotifications: Notification[] = [
  { id: 'notif-1', type: 'APPROVAL_REQUESTED', title: 'Milestone approval needed', message: 'Frontend Module — Phase 1 is awaiting your approval.', read: false, archived: false, actionUrl: '/dashboard/milestones', projectId: 'proj-1', createdAt: '2026-07-01T09:00:00+05:30' },
  { id: 'notif-2', type: 'PAYMENT_DUE', title: 'Invoice payment due', message: 'INV-2026-002 for ₹4,90,000 is due on Jul 15, 2026.', read: false, archived: false, actionUrl: '/dashboard/billing', projectId: 'proj-1', createdAt: '2026-07-01T08:00:00+05:30' },
  { id: 'notif-3', type: 'MEETING_SCHEDULED', title: 'Sprint Review scheduled', message: 'Sprint 14 review on Jul 4, 2026 at 10:00 AM.', read: false, archived: false, actionUrl: '/dashboard/meetings', projectId: 'proj-1', createdAt: '2026-06-30T16:00:00+05:30' },
  { id: 'notif-4', type: 'DOCUMENT_UPLOADED', title: 'New document uploaded', message: 'API Documentation v1.0 has been uploaded for your review.', read: true, archived: false, actionUrl: '/dashboard/documents', projectId: 'proj-1', createdAt: '2026-06-28T14:30:00+05:30' },
  { id: 'notif-5', type: 'TICKET_UPDATE', title: 'Ticket update', message: 'TKT-2026-042 has been assigned to Priya Sharma.', read: true, archived: false, actionUrl: '/dashboard/tickets', projectId: 'proj-1', createdAt: '2026-06-28T10:00:00+05:30' },
  { id: 'notif-6', type: 'MILESTONE_COMPLETED', title: 'Milestone completed', message: 'UI/UX Design Completion milestone has been marked as complete.', read: true, archived: false, actionUrl: '/dashboard/milestones', projectId: 'proj-1', createdAt: '2026-01-14T17:00:00+05:30' },
];

// ── Activity ──────────────────────────────────────────────────────

export const mockActivity: ActivityEntry[] = [
  { id: 'act-1', type: 'MILESTONE', title: 'Milestone submitted for approval', description: 'Frontend Module — Phase 1 has been submitted for your review and approval.', actor: 'Priya Sharma', projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal', createdAt: '2026-07-01T09:00:00+05:30' },
  { id: 'act-2', type: 'UPLOAD', title: 'Document uploaded', description: 'API Documentation v1.0 uploaded to the API folder.', actor: 'Karthik Rajan', projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal', createdAt: '2026-06-28T14:30:00+05:30' },
  { id: 'act-3', type: 'STATUS_CHANGE', title: 'Task status changed', description: 'Implement Razorpay integration moved to In Progress.', actor: 'Karthik Rajan', projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal', createdAt: '2026-06-27T11:15:00+05:30' },
  { id: 'act-4', type: 'COMMENT', title: 'Comment on design review', description: 'Added feedback on the dashboard mockup — suggested reducing whitespace in the stats section.', actor: 'Rajesh Kumar', projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal', createdAt: '2026-06-25T16:45:00+05:30' },
  { id: 'act-5', type: 'PAYMENT', title: 'Payment received', description: 'Payment of ₹3,67,500 received for UI/UX Design Completion milestone.', actor: 'System', projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal', createdAt: '2026-01-28T12:00:00+05:30' },
  { id: 'act-6', type: 'APPROVAL', title: 'Milestone approved', description: 'UI/UX Design Completion milestone approved by client.', actor: 'Rajesh Kumar', projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal', createdAt: '2026-01-14T17:00:00+05:30' },
  { id: 'act-7', type: 'MEETING', title: 'Meeting completed', description: 'Weekly Sync — Mobile App completed. Notes have been added.', actor: 'Arjun Mehta', projectId: 'proj-2', projectName: 'TechCorp Mobile App', createdAt: '2026-06-27T11:30:00+05:30' },
  { id: 'act-8', type: 'TICKET', title: 'Support ticket created', description: 'New bug report: Dashboard loading slowly on mobile.', actor: 'Rajesh Kumar', projectId: 'proj-1', projectName: 'TechCorp Enterprise Portal', createdAt: '2026-06-28T09:00:00+05:30' },
];

// ── Approvals ─────────────────────────────────────────────────────

export const mockApprovals: ApprovalItem[] = [
  { id: 'appr-1', type: 'MILESTONE', title: 'Frontend Module — Phase 1', description: 'Authentication module, dashboard, and navigation system completed. Ready for client review.', submittedBy: mockTeamMembers[1], submittedAt: '2026-04-28', status: 'PENDING', priority: 'URGENT', relatedProjectId: 'proj-1', relatedProjectName: 'TechCorp Enterprise Portal', history: [{ id: 'ah-1', action: 'SUBMITTED', actor: 'Priya Sharma', timestamp: '2026-04-28' }] },
  { id: 'appr-2', type: 'DOCUMENT', title: 'API Documentation v1.0', description: 'REST API documentation covering all core service endpoints.', submittedBy: mockTeamMembers[2], submittedAt: '2026-04-20', status: 'PENDING', priority: 'NORMAL', relatedProjectId: 'proj-1', relatedProjectName: 'TechCorp Enterprise Portal', history: [{ id: 'ah-2', action: 'SUBMITTED', actor: 'Karthik Rajan', timestamp: '2026-04-20' }] },
];

// ── Calendar Events ───────────────────────────────────────────────

export const mockCalendarEvents: CalendarEvent[] = [
  { id: 'cal-1', title: 'Sprint 14 Review', type: 'MEETING', startDate: '2026-07-04T10:00:00+05:30', endDate: '2026-07-04T11:00:00+05:30', allDay: false, color: '#3B82F6', projectId: 'proj-1', relatedId: 'meet-1' },
  { id: 'cal-2', title: 'Milestone 3 Review', type: 'MEETING', startDate: '2026-07-07T14:00:00+05:30', endDate: '2026-07-07T15:30:00+05:30', allDay: false, color: '#3B82F6', projectId: 'proj-1', relatedId: 'meet-2' },
  { id: 'cal-3', title: 'Invoice INV-2026-002 Due', type: 'PAYMENT', startDate: '2026-07-15', allDay: true, color: '#F59E0B', projectId: 'proj-1', relatedId: 'inv-3' },
  { id: 'cal-4', title: 'Integration Testing Starts', type: 'MILESTONE', startDate: '2026-06-16', allDay: true, color: '#10B981', projectId: 'proj-1', relatedId: 'ms-5' },
  { id: 'cal-5', title: 'Backend API Deadline', type: 'DEADLINE', startDate: '2026-06-15', allDay: true, color: '#EF4444', projectId: 'proj-1' },
];

// ── Infrastructure ────────────────────────────────────────────────

export const mockInfrastructure: InfraOverview = {
  domains: [
    { id: 'dom-1', name: 'techcorp.in', registrar: 'GoDaddy', expiryDate: '2027-03-15', autoRenew: true, status: 'ACTIVE', dnsProvider: 'Cloudflare' },
    { id: 'dom-2', name: 'techcorp.com', registrar: 'Namecheap', expiryDate: '2026-09-22', autoRenew: true, status: 'ACTIVE', dnsProvider: 'Cloudflare' },
  ],
  hosting: [
    { id: 'host-1', provider: 'AWS', plan: 'EC2 t3.large', status: 'ACTIVE', uptimePercent: 99.97, region: 'ap-south-1 (Mumbai)', resources: { cpu: '2 vCPU', ram: '8 GB', storage: '100 GB SSD' }, expiryDate: '2027-01-01' },
  ],
  ssl: [
    { id: 'ssl-1', domain: '*.techcorp.in', issuer: "Let's Encrypt", expiryDate: '2026-09-28', autoRenew: true, status: 'ACTIVE', type: 'DV' },
    { id: 'ssl-2', domain: 'techcorp.com', issuer: 'DigiCert', expiryDate: '2027-01-15', autoRenew: true, status: 'ACTIVE', type: 'OV' },
  ],
  cdn: { provider: 'Cloudflare', status: 'ACTIVE', bandwidthUsed: '45.2 GB', cacheHitRatio: 94.3, regions: ['Asia', 'Europe', 'North America'] },
  storage: { usedBytes: 8589934592, totalBytes: 53687091200, fileCount: 1247, backupStatus: 'ACTIVE', lastBackup: '2026-07-01T02:00:00+05:30' },
  mail: { provider: 'Google Workspace', domain: 'techcorp.in', mailboxCount: 25, storageUsedBytes: 32212254720, storageTotalBytes: 107374182400, plan: 'Business Standard' },
  apiKeys: [
    { id: 'key-1', name: 'Production API Key', keyMasked: 'sk_live_****7890', lastUsed: '2026-07-01T08:30:00+05:30', expiryDate: '2027-01-01', status: 'ACTIVE', permissions: ['read', 'write'] },
    { id: 'key-2', name: 'Webhook Secret', keyMasked: 'whsec_****3456', lastUsed: '2026-06-30T23:45:00+05:30', status: 'ACTIVE', permissions: ['webhook'] },
  ],
  monitors: [
    { id: 'mon-1', name: 'Portal — Production', url: 'https://portal.techcorp.in', status: 'UP', uptimePercent: 99.95, responseTimeMs: 142, lastChecked: '2026-07-02T03:45:00+05:30', alertCount: 0 },
    { id: 'mon-2', name: 'API — Production', url: 'https://api.techcorp.in', status: 'UP', uptimePercent: 99.98, responseTimeMs: 89, lastChecked: '2026-07-02T03:45:00+05:30', alertCount: 0 },
    { id: 'mon-3', name: 'CDN Health', url: 'https://cdn.techcorp.in', status: 'UP', uptimePercent: 99.99, responseTimeMs: 23, lastChecked: '2026-07-02T03:45:00+05:30', alertCount: 0 },
  ],
};

// ── Profile & Settings ────────────────────────────────────────────

export const mockUserProfile: UserProfile = {
  id: 'client-001',
  firstName: 'Rajesh',
  lastName: 'Kumar',
  email: 'client@techcorp.com',
  phone: '+91 98765 43210',
  organizationName: 'TechCorp Industries',
  timezone: 'Asia/Kolkata',
  language: 'en',
};

export const mockSecuritySettings: SecuritySettings = {
  mfaEnabled: true,
  lastPasswordChange: '2026-05-15',
  activeSessions: [
    { id: 'sess-1', device: 'Windows 11', browser: 'Chrome 126', ip: '103.xx.xx.xx', location: 'Bangalore, India', lastActive: '2026-07-02T03:30:00+05:30', current: true },
    { id: 'sess-2', device: 'iPhone 15', browser: 'Safari 17', ip: '103.xx.xx.xx', location: 'Bangalore, India', lastActive: '2026-07-01T18:00:00+05:30', current: false },
  ],
};

export const mockNotificationPrefs: NotificationPreferences = {
  email: { approvals: true, payments: true, meetings: true, updates: true, tickets: true },
  push: { approvals: true, payments: true, meetings: true, updates: false, tickets: true },
};

// ── Knowledge Base ────────────────────────────────────────────────

export const mockKBArticles: KBArticle[] = [
  { id: 'kb-1', title: 'How to approve a milestone', summary: 'Step-by-step guide on reviewing and approving project milestones.', category: 'Getting Started', url: '#' },
  { id: 'kb-2', title: 'Understanding your invoice', summary: 'Breakdown of invoice components, GST details, and payment options.', category: 'Billing', url: '#' },
  { id: 'kb-3', title: 'How to create a support ticket', summary: 'Guide to creating and tracking support tickets for bug reports and feature requests.', category: 'Support', url: '#' },
  { id: 'kb-4', title: 'Managing notification preferences', summary: 'Configure which notifications you receive via email and push.', category: 'Account', url: '#' },
];
