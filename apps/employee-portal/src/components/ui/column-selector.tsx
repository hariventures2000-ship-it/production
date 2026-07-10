// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Column Visibility Selector Dropdown
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import { Columns, ChevronDown, Check } from 'lucide-react';
import { Checkbox } from './checkbox';

interface ColumnSelectorProps {
  columns: { key: string; label: string }[];
  visibleColumns: Record<string, boolean>;
  onChange: (columns: Record<string, boolean>) => void;
}

export function ColumnSelector({
  columns = [],
  visibleColumns = {},
  onChange,
}: ColumnSelectorProps) {
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

  const toggleColumn = (key: string) => {
    const isVisible = visibleColumns[key] !== false; // default to true if undefined
    onChange({
      ...visibleColumns,
      [key]: !isVisible,
    });
  };

  const visibleCount = columns.filter((col) => visibleColumns[col.key] !== false).length;

  return (
    <div ref={containerRef} className="relative inline-block text-left w-full sm:w-auto">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-between w-full sm:w-auto px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]/50 transition-colors focus:outline-none cursor-pointer"
      >
        <Columns className="w-3.5 h-3.5 mr-2 opacity-60 shrink-0" />
        <span className="truncate mr-2 flex-1 text-left">
          Columns ({visibleCount}/{columns.length})
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-56 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 overflow-hidden text-left py-1">
          <div className="px-3 py-1 bg-[var(--background-secondary)]/30 border-b border-[var(--border)] mb-1">
            <span className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">Show/Hide Columns</span>
          </div>
          {columns.map((col) => {
            const isChecked = visibleColumns[col.key] !== false;
            return (
              <label
                key={col.key}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--background-secondary)]/50 cursor-pointer text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggleColumn(col.key)}
                  className="w-3.5 h-3.5 border-[var(--border)] data-[state=checked]:bg-[var(--color-primary)]"
                />
                <span className="truncate select-none font-medium">{col.label}</span>
                {isChecked && <Check className="w-3.5 h-3.5 text-[var(--color-primary)] ml-auto" />}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
