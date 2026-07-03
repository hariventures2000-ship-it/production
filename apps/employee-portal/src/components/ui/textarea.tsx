import * as React from "react";
import { cn } from "@/lib/cn";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--foreground)]",
        "placeholder:text-[var(--input-placeholder)]",
        "focus:outline-none focus:border-[var(--input-focus-border)] focus:ring-2 focus:ring-[var(--input-focus-ring)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-150 resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
