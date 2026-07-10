// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Sort Dropdown Component
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpDown, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SortDropdownProps {
  options: { value: string; label: string }[];
  currentSort: { field: string; direction: 'asc' | 'desc' } | null;
  onSelect: (field: string) => void;
}

export function SortDropdown({
  options = [],
  currentSort,
  onSelect,
}: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = options.find((opt) => opt.value === currentSort?.field);

  return (
    <div ref={containerRef} className="relative inline-block text-left w-full sm:w-auto">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center justify-between w-full sm:w-auto px-3 py-1.5 text-xs font-semibold rounded-lg border bg-[var(--card-bg)] hover:bg-[var(--background-secondary)]/50 transition-colors focus:outline-none cursor-pointer",
          currentSort 
            ? "border-[var(--color-primary)] text-[var(--color-primary)]" 
            : "border-[var(--border)] text-[var(--foreground-secondary)]"
        )}
      >
        <ArrowUpDown className="w-3.5 h-3.5 mr-2 opacity-60 shrink-0" />
        <span className="truncate mr-2 flex-1 text-left">
          Sort: {activeOption ? `${activeOption.label} (${currentSort?.direction.toUpperCase()})` : "Default"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-52 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 overflow-hidden text-left py-1">
          {options.map((opt) => {
            const isSelected = opt.value === currentSort?.field;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onSelect(opt.value);
                  setOpen(false);
                }}
                className="w-full px-3 py-1.5 text-xs text-left transition-colors flex items-center justify-between text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]/50 hover:text-[var(--foreground)]"
              >
                <span className={cn("font-medium", isSelected && "text-[var(--color-primary)] font-semibold")}>
                  {opt.label}
                </span>
                {isSelected && (
                  currentSort?.direction === 'asc' 
                    ? <ArrowUp className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    : <ArrowDown className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
