import { cn } from '@/lib/cn';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function PageHeader({ title, description, actions, icon: Icon, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] bg-primary/10 text-primary">
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
        <div>
          <h1 className="text-lg font-semibold text-[var(--foreground)] tracking-tight">{title}</h1>
          {description && <p className="text-sm text-[var(--foreground-secondary)] mt-0.5">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 mt-3 sm:mt-0">{actions}</div>}
    </div>
  );
}
