// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Date Range Picker Component
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import { CalendarDays, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Input } from './input';

interface DateRangePickerProps {
  label: string;
  value?: { start?: string; end?: string; preset?: string };
  onChange: (val: { start?: string; end?: string; preset?: string } | undefined) => void;
}

const presets = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
];

export function DateRangePicker({
  label,
  value,
  onChange,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [customStart, setCustomStart] = useState(value?.start || "");
  const [customEnd, setCustomEnd] = useState(value?.end || "");
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

  const handlePresetSelect = (preset: string) => {
    onChange({ preset });
    setCustomStart("");
    setCustomEnd("");
    setOpen(false);
  };

  const handleCustomApply = () => {
    if (customStart || customEnd) {
      onChange({
        start: customStart || undefined,
        end: customEnd || undefined,
      });
      setOpen(false);
    }
  };

  const handleClear = () => {
    onChange(undefined);
    setCustomStart("");
    setCustomEnd("");
    setOpen(false);
  };

  const getActiveLabel = () => {
    if (!value) return "Any Date";
    if (value.preset) {
      const activePreset = presets.find(p => p.value === value.preset);
      return activePreset ? activePreset.label : value.preset;
    }
    if (value.start && value.end) {
      return `${value.start} to ${value.end}`;
    }
    if (value.start) return `From ${value.start}`;
    if (value.end) return `Until ${value.end}`;
    return "Any Date";
  };

  const isFiltered = !!value;

  return (
    <div ref={containerRef} className="relative inline-block text-left w-full sm:w-auto">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center justify-between w-full sm:w-auto min-w-[140px] px-3 py-1.5 text-xs font-semibold rounded-lg border bg-[var(--card-bg)] hover:bg-[var(--background-secondary)]/50 transition-colors focus:outline-none cursor-pointer",
          isFiltered 
            ? "border-[var(--color-primary)] text-[var(--color-primary)]" 
            : "border-[var(--border)] text-[var(--foreground-secondary)]"
        )}
      >
        <CalendarDays className="w-3.5 h-3.5 mr-2 opacity-60 shrink-0" />
        <span className="truncate mr-2 flex-1 text-left">
          {label}: {getActiveLabel()}
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-64 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 overflow-hidden text-left p-3 flex flex-col gap-3">
          {/* Quick Presets */}
          <div className="grid grid-cols-2 gap-1.5">
            {presets.map(p => {
              const isSelected = value?.preset === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => handlePresetSelect(p.value)}
                  className={cn(
                    "px-2 py-1 text-[11px] rounded text-left transition-colors flex items-center justify-between font-medium",
                    isSelected 
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" 
                      : "text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]/50"
                  )}
                >
                  {p.label}
                  {isSelected && <Check className="w-3 h-3 text-[var(--color-primary)]" />}
                </button>
              );
            })}
          </div>

          <hr className="border-[var(--border)]" />

          {/* Custom Date Picker Fields */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">Custom Range</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] text-[var(--foreground-muted)]">Start Date</label>
                <Input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="h-7 text-[10px] px-1.5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-[var(--foreground-muted)]">End Date</label>
                <Input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="h-7 text-[10px] px-1.5"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]">
            {isFiltered ? (
              <button 
                onClick={handleClear}
                className="text-[10px] text-red-500 hover:text-red-700 font-semibold"
              >
                Clear
              </button>
            ) : <span />}
            <button
              onClick={handleCustomApply}
              disabled={!customStart && !customEnd}
              className="px-2.5 py-1 bg-[var(--color-primary)] text-white text-[10px] font-semibold rounded hover:bg-[var(--color-primary)]/90 disabled:opacity-50 cursor-pointer"
            >
              Apply Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
