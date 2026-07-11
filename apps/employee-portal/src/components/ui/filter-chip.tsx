// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Active Filter Chip Component
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { X } from 'lucide-react';

interface FilterChipProps {
  label: string;
  valueLabel: string;
  onRemove: () => void;
}

export function FilterChip({
  label,
  valueLabel,
  onRemove,
}: FilterChipProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-[var(--color-primary)] border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30 transition-all select-none animate-fade-in">
      <span className="opacity-75">{label}:</span>
      <span>{valueLabel}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="rounded-full p-0.5 hover:bg-blue-200/50 dark:hover:bg-blue-900/50 text-[var(--color-primary)]/70 hover:text-[var(--color-primary)] cursor-pointer"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}
