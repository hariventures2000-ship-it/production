import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/cn';

const Avatar = React.forwardRef<React.ComponentRef<typeof AvatarPrimitive.Root>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & { size?: 'sm' | 'md' | 'lg' }>(
  ({ className, size = 'md', ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full',
        size === 'sm' && 'h-7 w-7',
        size === 'md' && 'h-9 w-9',
        size === 'lg' && 'h-11 w-11',
        className
      )}
      {...props}
    />
  )
);
Avatar.displayName = 'Avatar';

const AvatarImage = React.forwardRef<React.ComponentRef<typeof AvatarPrimitive.Image>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
  )
);
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = React.forwardRef<React.ComponentRef<typeof AvatarPrimitive.Fallback>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn('flex h-full w-full items-center justify-center rounded-full bg-[var(--background-tertiary)] text-[var(--foreground-secondary)] text-xs font-semibold', className)}
      {...props}
    />
  )
);
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
