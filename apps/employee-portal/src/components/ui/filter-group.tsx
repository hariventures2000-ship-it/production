// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Filter Group Wrapper
// ═══════════════════════════════════════════════════════════════════

import React from 'react';

interface FilterGroupProps {
  children: React.ReactNode;
}

export function FilterGroup({ children }: FilterGroupProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {children}
    </div>
  );
}
