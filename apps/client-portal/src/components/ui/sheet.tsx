import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fade-in', className)} {...props} />
  )
);
SheetOverlay.displayName = 'SheetOverlay';

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: 'left' | 'right';
}

const SheetContent = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Content>, SheetContentProps>(
  ({ className, children, side = 'right', ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 flex flex-col bg-[var(--card-bg)] border-[var(--border)] shadow-xl transition-transform',
          side === 'right' && 'inset-y-0 right-0 w-full max-w-md border-l animate-slide-in-right',
          side === 'left' && 'inset-y-0 left-0 w-full max-w-md border-r animate-slide-in-left',
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--ring)]">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  )
);
SheetContent.displayName = 'SheetContent';

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 p-5 border-b border-[var(--border)]', className)} {...props} />
);

const SheetTitle = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={cn('text-base font-semibold text-[var(--foreground)]', className)} {...props} />
  )
);
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Description>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn('text-sm text-[var(--foreground-secondary)]', className)} {...props} />
  )
);
SheetDescription.displayName = 'SheetDescription';

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose };
