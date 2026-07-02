import { cn } from '@/lib/cn';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: React.ReactNode;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, iconColor = 'text-primary', trend, className }: StatCardProps) {
  return (
    <div className={cn('rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-[var(--card-shadow)]', className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-[var(--foreground-secondary)]">{title}</p>
        {Icon && <Icon className={cn('h-4 w-4', iconColor)} />}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-[var(--foreground-muted)] mt-1">{subtitle}</p>}
        {trend && (
          <p className={cn('text-xs font-medium mt-1', trend.positive ? 'text-success' : 'text-danger')}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}
