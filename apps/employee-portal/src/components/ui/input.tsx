import * as React from "react";
import { cn } from "@/lib/cn";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--foreground)]",
        "placeholder:text-[var(--input-placeholder)]",
        "focus:outline-none focus:border-[var(--input-focus-border)] focus:ring-2 focus:ring-[var(--input-focus-ring)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-150",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
