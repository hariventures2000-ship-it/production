"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { Toaster } from "sonner";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className:
              "bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border)] shadow-lg",
          }}
          richColors
          closeButton
        />
      </ThemeProvider>
    </QueryProvider>
  );
}
