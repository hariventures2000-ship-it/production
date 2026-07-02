import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/cn';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<React.ComponentRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn('inline-flex items-center gap-1 border-b border-[var(--border)] w-full', className)}
      {...props}
    />
  )
);
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef<React.ComponentRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap px-3 py-2.5 text-sm font-medium text-[var(--foreground-secondary)] transition-colors border-b-2 border-transparent -mb-px cursor-pointer select-none',
        'hover:text-[var(--foreground)]',
        'data-[state=active]:text-[var(--foreground)] data-[state=active]:border-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
        className
      )}
      {...props}
    />
  )
);
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<React.ComponentRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn('mt-4 focus-visible:outline-none animate-fade-in', className)}
      {...props}
    />
  )
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
