// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Filter Dropdown (Single Select)
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FilterDropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export function FilterDropdown({
  label,
  value,
  options = [],
  onChange,
}: FilterDropdownProps) {
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

  const activeOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className="relative inline-block text-left w-full sm:w-auto">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center justify-between w-full sm:w-auto min-w-[140px] px-3 py-1.5 text-xs font-semibold rounded-lg border bg-[var(--card-bg)] hover:bg-[var(--background-secondary)]/50 transition-colors focus:outline-none cursor-pointer",
          value && value !== 'all'
            ? "border-[var(--color-primary)] text-[var(--color-primary)]" 
            : "border-[var(--border)] text-[var(--foreground-secondary)]"
        )}
      >
        <span className="truncate mr-2">
          {label}: {activeOption ? activeOption.label : "All"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-56 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 overflow-hidden text-left py-1">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="w-full px-3 py-1.5 text-xs text-left transition-colors flex items-center justify-between text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]/50 hover:text-[var(--foreground)]"
              >
                <span className={cn("font-medium", isSelected && "text-[var(--color-primary)] font-semibold")}>
                  {opt.label}
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[var(--color-primary)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
