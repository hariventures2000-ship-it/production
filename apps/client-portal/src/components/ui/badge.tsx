import * as React from 'react';
import { cn } from '@/lib/cn';

const badgeVariants: Record<string, string> = {
  default: 'bg-[var(--background-tertiary)] text-[var(--foreground-secondary)] border-[var(--border)]',
  primary: 'bg-primary-50 text-primary border-primary/20',
  success: 'bg-success-light text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  warning: 'bg-warning-light text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  danger: 'bg-danger-light text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800',
  info: 'bg-info-light text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors select-none',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
