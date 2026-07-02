import * as React from 'react';
import { cn } from '@/lib/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && <label htmlFor={textareaId} className="block text-xs font-medium text-[var(--foreground-secondary)]">{label}</label>}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'flex min-h-[80px] w-full rounded-[var(--radius-lg)] border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-1 focus:border-primary resize-y',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus:ring-danger',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
