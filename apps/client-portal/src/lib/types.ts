// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Domain Types
// Backend-agnostic. Targets NestJS + Prisma + PostgreSQL.
// ═══════════════════════════════════════════════════════════════════

// ── Auth ──────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  requiresMfa: boolean;
  tempToken?: string;
}

export interface MfaVerifyResponse {
  user: UserSession;
}

export interface UserSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'CLIENT';
  tenantId: string;
  organizationName: string;
  mfaEnabled: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// ── Project ───────────────────────────────────────────────────────

export type ProjectStatus =
  | 'PLANNING'
  | 'DESIGN'
  | 'DEVELOPMENT'
  | 'TESTING'
  | 'DEPLOYMENT'
  | 'MAINTENANCE'
  | 'COMPLETED'
  | 'ON_HOLD';

export type ProjectHealth = 'ON_TRACK' | 'AT_RISK' | 'DELAYED';

export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  health: ProjectHealth;
  priority: ProjectPriority;
  currentPhase: string;
  completionPercentage: number;
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  contractValue: number;
  currency: string;
  projectManager: ProjectMember;
  teamMembers: ProjectMember[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  department: string;
}

export interface ProjectPhase {
  id: string;
  name: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  order: number;
  owner: ProjectMember;
  startDate: string;
  endDate: string;
  completionPercentage: number;
  dependencies: string[];
  documents: string[];
  approvalStatus: ApprovalStatus;
  comments: Comment[];
}

// ── Milestone ─────────────────────────────────────────────────────

export type MilestoneStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'IN_QA'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'INVOICE_SENT'
  | 'PAID'
  | 'REJECTED';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  order: number;
  status: MilestoneStatus;
  completionPercentage: number;
  dueDate: string;
  completedDate?: string;
  amount: number;
  currency: string;
  deliverables: Deliverable[];
  approvalHistory: ApprovalEntry[];
  paymentStatus: 'LOCKED' | 'UNLOCKED' | 'INVOICED' | 'PAID';
  invoiceId?: string;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ACCEPTED';
  type: string;
  attachments: Attachment[];
}

// ── Task ──────────────────────────────────────────────────────────

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'TESTING' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskType = 'FEATURE' | 'BUG' | 'CHORE' | 'SPIKE' | 'STORY';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  assignee?: ProjectMember;
  tags: string[];
  dueDate?: string;
  estimatedHours?: number;
  attachmentCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

// ── Approval ──────────────────────────────────────────────────────

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED' | 'NOT_REQUIRED';

export type ApprovalItemType = 'MILESTONE' | 'DOCUMENT' | 'DESIGN' | 'DELIVERABLE';

export interface ApprovalEntry {
  id: string;
  action: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED' | 'SUBMITTED';
  actor: string;
  comment?: string;
  timestamp: string;
}

export interface ApprovalItem {
  id: string;
  type: ApprovalItemType;
  title: string;
  description: string;
  submittedBy: ProjectMember;
  submittedAt: string;
  status: ApprovalStatus;
  priority: 'NORMAL' | 'URGENT';
  relatedProjectId: string;
  relatedProjectName: string;
  history: ApprovalEntry[];
}

// ── Billing ───────────────────────────────────────────────────────

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface BillingStats {
  totalContractValue: number;
  totalPaid: number;
  pendingAmount: number;
  upcomingDue: number;
  overdueAmount: number;
  currency: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  milestoneId: string;
  milestoneTitle: string;
  projectId: string;
  projectName: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  gstDetails: {
    cgst: number;
    sgst: number;
    igst: number;
    gstNumber: string;
  };
  lineItems: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED';
  method: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  paidAt: string;
  receiptUrl?: string;
}

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

export interface PaymentVerification {
  success: boolean;
  paymentId: string;
  message: string;
}

// ── Documents ─────────────────────────────────────────────────────

export type DocumentType =
  | 'PROPOSAL'
  | 'QUOTATION'
  | 'AGREEMENT'
  | 'NDA'
  | 'SRS'
  | 'UI_DESIGN'
  | 'API_DOCS'
  | 'ARCHITECTURE'
  | 'DEPLOYMENT'
  | 'INVOICE'
  | 'CERTIFICATE'
  | 'OTHER';

export interface Document {
  id: string;
  projectId: string;
  name: string;
  type: DocumentType;
  folder: string;
  sizeBytes: number;
  mimeType: string;
  version: number;
  uploadedBy: string;
  uploadedAt: string;
  approvalStatus: ApprovalStatus;
  commentCount: number;
  downloadUrl: string;
}

export interface DocumentVersion {
  id: string;
  version: number;
  uploadedBy: string;
  uploadedAt: string;
  sizeBytes: number;
  changeNote: string;
}

// ── Support ───────────────────────────────────────────────────────

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'AWAITING_CLIENT' | 'RESOLVED' | 'CLOSED';
export type TicketType = 'BUG_REPORT' | 'FEATURE_REQUEST' | 'GENERAL' | 'BILLING';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  type: TicketType;
  status: TicketStatus;
  priority: TaskPriority;
  projectId?: string;
  projectName?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  lastResponseAt?: string;
  messageCount: number;
  attachments: Attachment[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  sender: 'CLIENT' | 'SUPPORT';
  senderName: string;
  senderAvatar?: string;
  content: string;
  attachments: Attachment[];
  createdAt: string;
}

export interface KBArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  url: string;
}

// ── Meetings ──────────────────────────────────────────────────────

export type MeetingStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Meeting {
  id: string;
  title: string;
  description: string;
  status: MeetingStatus;
  startTime: string;
  endTime: string;
  meetingUrl?: string;
  agenda: string[];
  participants: ProjectMember[];
  notes?: string;
  recordingUrl?: string;
  projectId: string;
  projectName: string;
}

// ── Infrastructure ────────────────────────────────────────────────

export type InfraStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'INACTIVE';

export interface InfraOverview {
  domains: InfraDomain[];
  hosting: InfraHosting[];
  ssl: InfraSSL[];
  cdn: InfraCDN | null;
  storage: InfraStorage;
  mail: InfraMail;
  apiKeys: InfraAPIKey[];
  monitors: InfraMonitor[];
}

export interface InfraDomain {
  id: string;
  name: string;
  registrar: string;
  expiryDate: string;
  autoRenew: boolean;
  status: InfraStatus;
  dnsProvider: string;
}

export interface InfraHosting {
  id: string;
  provider: string;
  plan: string;
  status: InfraStatus;
  uptimePercent: number;
  region: string;
  resources: { cpu: string; ram: string; storage: string };
  expiryDate: string;
}

export interface InfraSSL {
  id: string;
  domain: string;
  issuer: string;
  expiryDate: string;
  autoRenew: boolean;
  status: InfraStatus;
  type: 'DV' | 'OV' | 'EV';
}

export interface InfraCDN {
  provider: string;
  status: InfraStatus;
  bandwidthUsed: string;
  cacheHitRatio: number;
  regions: string[];
}

export interface InfraStorage {
  usedBytes: number;
  totalBytes: number;
  fileCount: number;
  backupStatus: 'ACTIVE' | 'FAILED' | 'PENDING';
  lastBackup: string;
}

export interface InfraMail {
  provider: string;
  domain: string;
  mailboxCount: number;
  storageUsedBytes: number;
  storageTotalBytes: number;
  plan: string;
}

export interface InfraAPIKey {
  id: string;
  name: string;
  keyMasked: string;
  lastUsed: string;
  expiryDate?: string;
  status: InfraStatus;
  permissions: string[];
}

export interface InfraMonitor {
  id: string;
  name: string;
  url: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  uptimePercent: number;
  responseTimeMs: number;
  lastChecked: string;
  alertCount: number;
}

// ── Notifications ─────────────────────────────────────────────────

export type NotificationType =
  | 'APPROVAL_REQUESTED'
  | 'APPROVAL_COMPLETED'
  | 'PAYMENT_DUE'
  | 'PAYMENT_RECEIVED'
  | 'DOCUMENT_UPLOADED'
  | 'MILESTONE_COMPLETED'
  | 'MEETING_SCHEDULED'
  | 'TICKET_UPDATE'
  | 'PROJECT_UPDATE'
  | 'SYSTEM';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  archived: boolean;
  actionUrl?: string;
  projectId?: string;
  createdAt: string;
}

// ── Activity ──────────────────────────────────────────────────────

export type ActivityType =
  | 'APPROVAL'
  | 'UPLOAD'
  | 'PAYMENT'
  | 'MEETING'
  | 'UPDATE'
  | 'COMMENT'
  | 'STATUS_CHANGE'
  | 'MILESTONE'
  | 'TICKET';

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  actor: string;
  actorAvatar?: string;
  projectId?: string;
  projectName?: string;
  metadata?: Record<string, string>;
  createdAt: string;
}

// ── Calendar ──────────────────────────────────────────────────────

export type CalendarEventType = 'MEETING' | 'DEADLINE' | 'MILESTONE' | 'PAYMENT';

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  color: string;
  description?: string;
  projectId?: string;
  relatedId?: string;
}

// ── Profile & Settings ────────────────────────────────────────────

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  organizationName: string;
  organizationLogo?: string;
  timezone: string;
  language: string;
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  lastPasswordChange: string;
  activeSessions: SessionInfo[];
}

export interface SessionInfo {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface NotificationPreferences {
  email: {
    approvals: boolean;
    payments: boolean;
    meetings: boolean;
    updates: boolean;
    tickets: boolean;
  };
  push: {
    approvals: boolean;
    payments: boolean;
    meetings: boolean;
    updates: boolean;
    tickets: boolean;
  };
}

// ── AI ────────────────────────────────────────────────────────────

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: string;
}

export interface AIQueryResponse {
  answer: string;
  sources: string[];
}

// ── Shared ────────────────────────────────────────────────────────

export interface Attachment {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  url: string;
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  resolved?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ServiceResult<T> {
  data: T;
  error?: string;
}
