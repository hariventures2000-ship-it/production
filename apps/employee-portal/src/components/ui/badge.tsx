import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-primary)] text-white",
        secondary:
          "border-transparent bg-[var(--badge-bg)] text-[var(--badge-text)]",
        destructive:
          "border-transparent bg-[var(--color-danger)] text-white",
        success:
          "border-transparent bg-[var(--color-success)] text-white",
        warning:
          "border-transparent bg-[var(--color-warning)] text-white",
        outline:
          "border-[var(--border)] text-[var(--foreground-secondary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
