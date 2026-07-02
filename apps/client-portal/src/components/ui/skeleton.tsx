import { cn } from '@/lib/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] bg-[var(--skeleton)]',
        'bg-gradient-to-r from-[var(--skeleton)] via-[var(--skeleton-shimmer)] to-[var(--skeleton)]',
        'bg-[length:200%_100%] animate-[skeleton-shimmer_1.5s_ease-in-out_infinite]',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
