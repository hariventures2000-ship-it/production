// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Multi-Select Checkbox Dropdown
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';
import { Checkbox } from './checkbox';
import { Input } from './input';
import { cn } from '@/lib/cn';

interface MultiSelectProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function MultiSelect({
  label,
  options = [],
  selectedValues = [],
  onChange,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
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

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleSelectAll = () => {
    const allFilteredValues = filteredOptions.map((o) => o.value);
    const newSelected = Array.from(new Set([...selectedValues, ...allFilteredValues]));
    onChange(newSelected);
  };

  const handleClear = () => {
    const allFilteredValues = filteredOptions.map((o) => o.value);
    onChange(selectedValues.filter((v) => !allFilteredValues.includes(v)));
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left w-full sm:w-auto">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center justify-between w-full sm:w-auto min-w-[140px] px-3 py-1.5 text-xs font-semibold rounded-lg border bg-[var(--card-bg)] hover:bg-[var(--background-secondary)]/50 transition-colors focus:outline-none cursor-pointer",
          selectedValues.length > 0 
            ? "border-[var(--color-primary)] text-[var(--color-primary)]" 
            : "border-[var(--border)] text-[var(--foreground-secondary)]"
        )}
      >
        <span className="truncate mr-2">
          {label} {selectedValues.length > 0 && `(${selectedValues.length})`}
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-64 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 overflow-hidden text-left flex flex-col">
          {/* Inner Search Box */}
          <div className="p-2 border-b border-[var(--border)] flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search options..."
              className="h-7 text-xs bg-transparent border-none focus-visible:ring-0 p-0"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-[var(--foreground-muted)]">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--background-secondary)]/30 border-b border-[var(--border)] text-[10px] font-bold">
            <button onClick={handleSelectAll} className="text-[var(--color-primary)] hover:underline">
              Select All
            </button>
            <button onClick={handleClear} className="text-[var(--foreground-muted)] hover:underline">
              Clear All
            </button>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto py-1">
            {filteredOptions.map((opt) => {
              const isChecked = selectedValues.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[var(--background-secondary)]/50 cursor-pointer text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleOption(opt.value)}
                    className="w-3.5 h-3.5 border-[var(--border)] data-[state=checked]:bg-[var(--color-primary)]"
                  />
                  <span className="truncate flex-1 select-none font-medium">{opt.label}</span>
                  {isChecked && <Check className="w-3.5 h-3.5 text-[var(--color-primary)] ml-auto" />}
                </label>
              );
            })}
            {filteredOptions.length === 0 && (
              <p className="text-center py-4 text-xs text-[var(--foreground-muted)]">No options found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
