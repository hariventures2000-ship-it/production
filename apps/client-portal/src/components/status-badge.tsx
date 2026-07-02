import { cn } from '@/lib/cn';
import type { ProjectHealth, MilestoneStatus, TicketStatus, InvoiceStatus, ApprovalStatus } from '@/lib/types';

type StatusVariant = ProjectHealth | MilestoneStatus | TicketStatus | InvoiceStatus | ApprovalStatus | string;

const statusConfig: Record<string, { label: string; dotColor: string; bgColor: string; textColor: string }> = {
  ON_TRACK: { label: 'On Track', dotColor: 'bg-success', bgColor: 'bg-success-light dark:bg-emerald-950', textColor: 'text-emerald-700 dark:text-emerald-400' },
  AT_RISK: { label: 'At Risk', dotColor: 'bg-warning', bgColor: 'bg-warning-light dark:bg-amber-950', textColor: 'text-amber-700 dark:text-amber-400' },
  DELAYED: { label: 'Delayed', dotColor: 'bg-danger', bgColor: 'bg-danger-light dark:bg-red-950', textColor: 'text-red-700 dark:text-red-400' },
  PENDING: { label: 'Pending', dotColor: 'bg-[var(--foreground-muted)]', bgColor: 'bg-[var(--background-tertiary)]', textColor: 'text-[var(--foreground-secondary)]' },
  IN_PROGRESS: { label: 'In Progress', dotColor: 'bg-info', bgColor: 'bg-info-light dark:bg-blue-950', textColor: 'text-blue-700 dark:text-blue-400' },
  IN_QA: { label: 'In QA', dotColor: 'bg-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-950', textColor: 'text-purple-700 dark:text-purple-400' },
  AWAITING_APPROVAL: { label: 'Awaiting Approval', dotColor: 'bg-warning', bgColor: 'bg-warning-light dark:bg-amber-950', textColor: 'text-amber-700 dark:text-amber-400' },
  APPROVED: { label: 'Approved', dotColor: 'bg-success', bgColor: 'bg-success-light dark:bg-emerald-950', textColor: 'text-emerald-700 dark:text-emerald-400' },
  REJECTED: { label: 'Rejected', dotColor: 'bg-danger', bgColor: 'bg-danger-light dark:bg-red-950', textColor: 'text-red-700 dark:text-red-400' },
  INVOICE_SENT: { label: 'Invoice Sent', dotColor: 'bg-info', bgColor: 'bg-info-light dark:bg-blue-950', textColor: 'text-blue-700 dark:text-blue-400' },
  PAID: { label: 'Paid', dotColor: 'bg-success', bgColor: 'bg-success-light dark:bg-emerald-950', textColor: 'text-emerald-700 dark:text-emerald-400' },
  OVERDUE: { label: 'Overdue', dotColor: 'bg-danger', bgColor: 'bg-danger-light dark:bg-red-950', textColor: 'text-red-700 dark:text-red-400' },
  OPEN: { label: 'Open', dotColor: 'bg-info', bgColor: 'bg-info-light dark:bg-blue-950', textColor: 'text-blue-700 dark:text-blue-400' },
  RESOLVED: { label: 'Resolved', dotColor: 'bg-success', bgColor: 'bg-success-light dark:bg-emerald-950', textColor: 'text-emerald-700 dark:text-emerald-400' },
  CLOSED: { label: 'Closed', dotColor: 'bg-[var(--foreground-muted)]', bgColor: 'bg-[var(--background-tertiary)]', textColor: 'text-[var(--foreground-secondary)]' },
  CHANGES_REQUESTED: { label: 'Changes Requested', dotColor: 'bg-warning', bgColor: 'bg-warning-light dark:bg-amber-950', textColor: 'text-amber-700 dark:text-amber-400' },
  COMPLETED: { label: 'Completed', dotColor: 'bg-success', bgColor: 'bg-success-light dark:bg-emerald-950', textColor: 'text-emerald-700 dark:text-emerald-400' },
  SCHEDULED: { label: 'Scheduled', dotColor: 'bg-info', bgColor: 'bg-info-light dark:bg-blue-950', textColor: 'text-blue-700 dark:text-blue-400' },
  CANCELLED: { label: 'Cancelled', dotColor: 'bg-[var(--foreground-muted)]', bgColor: 'bg-[var(--background-tertiary)]', textColor: 'text-[var(--foreground-secondary)]' },
  ACTIVE: { label: 'Active', dotColor: 'bg-success', bgColor: 'bg-success-light dark:bg-emerald-950', textColor: 'text-emerald-700 dark:text-emerald-400' },
  EXPIRING_SOON: { label: 'Expiring Soon', dotColor: 'bg-warning', bgColor: 'bg-warning-light dark:bg-amber-950', textColor: 'text-amber-700 dark:text-amber-400' },
  EXPIRED: { label: 'Expired', dotColor: 'bg-danger', bgColor: 'bg-danger-light dark:bg-red-950', textColor: 'text-red-700 dark:text-red-400' },
  UP: { label: 'Up', dotColor: 'bg-success', bgColor: 'bg-success-light dark:bg-emerald-950', textColor: 'text-emerald-700 dark:text-emerald-400' },
  DOWN: { label: 'Down', dotColor: 'bg-danger', bgColor: 'bg-danger-light dark:bg-red-950', textColor: 'text-red-700 dark:text-red-400' },
  DEGRADED: { label: 'Degraded', dotColor: 'bg-warning', bgColor: 'bg-warning-light dark:bg-amber-950', textColor: 'text-amber-700 dark:text-amber-400' },
};

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, label, className, showDot = true }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status.replace(/_/g, ' '), dotColor: 'bg-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-900', textColor: 'text-gray-600 dark:text-gray-400' };
  const displayLabel = label || config.label;

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold', config.bgColor, config.textColor, className)}>
      {showDot && <span className={cn('h-1.5 w-1.5 rounded-full', config.dotColor)} />}
      {displayLabel}
    </span>
  );
}
