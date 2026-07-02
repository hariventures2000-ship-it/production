import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-tertiary)] mb-4">
        <Icon className="h-6 w-6 text-[var(--foreground-muted)]" />
      </div>
      <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="text-xs text-[var(--foreground-secondary)] mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-4">{actionLabel}</Button>
      )}
    </div>
  );
}
