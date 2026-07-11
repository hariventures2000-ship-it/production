// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Filter Drawer (Mobile Responsive Component)
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './sheet';
import { Button } from './button';
import { Filter } from 'lucide-react';

interface FilterDrawerProps {
  children: React.ReactNode;
}

export function FilterDrawer({ children }: FilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="sm:hidden flex items-center gap-1.5 cursor-pointer">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-6 overflow-y-auto bg-[var(--card-bg)] border-[var(--border)]">
        <SheetTitle className="text-sm font-bold uppercase tracking-wider mb-4 text-[var(--foreground)]">Refine Filters</SheetTitle>
        <div className="flex flex-col gap-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
