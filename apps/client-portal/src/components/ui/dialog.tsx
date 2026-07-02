import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-in', className)} {...props} />
  )
);
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-xl animate-scale-in',
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--ring)] cursor-pointer">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props} />
);

const DialogTitle = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={cn('text-base font-semibold text-[var(--foreground)]', className)} {...props} />
  )
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Description>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn('text-sm text-[var(--foreground-secondary)]', className)} {...props} />
  )
);
DialogDescription.displayName = 'DialogDescription';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex justify-end gap-2 mt-6', className)} {...props} />
);

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogPortal, DialogOverlay };
