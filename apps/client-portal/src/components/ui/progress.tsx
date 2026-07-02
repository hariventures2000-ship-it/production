import * as React from 'react';
import { cn } from '@/lib/cn';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md';
  color?: string;
}

function Progress({ value, max = 100, size = 'md', color, className, ...props }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-[var(--background-tertiary)]', size === 'sm' ? 'h-1.5' : 'h-2', className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} {...props}>
      <div
        className={cn('h-full rounded-full transition-all duration-500 ease-out', color || 'bg-primary')}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export { Progress };
