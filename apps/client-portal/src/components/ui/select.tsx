import * as React from 'react';
import { cn } from '@/lib/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && <label htmlFor={selectId} className="block text-xs font-medium text-[var(--foreground-secondary)]">{label}</label>}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-[var(--radius-lg)] border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--foreground)] transition-colors appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-1 focus:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus:ring-danger',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
