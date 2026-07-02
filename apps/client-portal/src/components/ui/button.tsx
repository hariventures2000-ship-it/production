import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/cn';

const buttonVariants = {
  variant: {
    default: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
    secondary: 'bg-[var(--background-tertiary)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--border)] shadow-sm',
    ghost: 'hover:bg-[var(--background-tertiary)] text-[var(--foreground-secondary)]',
    destructive: 'bg-danger text-white hover:bg-red-600 shadow-sm',
    outline: 'border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--background-secondary)] shadow-sm',
    link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',
  },
  size: {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-9 px-4 text-sm gap-2',
    lg: 'h-11 px-6 text-sm gap-2',
    icon: 'h-9 w-9 p-0',
    'icon-sm': 'h-8 w-8 p-0',
  },
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-[var(--radius-lg)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
            <span>{children}</span>
          </>
        ) : children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button };
