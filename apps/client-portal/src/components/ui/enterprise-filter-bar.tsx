"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, ChevronDown, Check, CalendarIcon, Download, EyeOff, Save, SlidersHorizontal, ArrowDownAZ, ArrowUpZA, Eye } from "lucide-react";
import { format } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { useFilterStore, SavedView } from "@/store/filter.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/lib/cn";

export interface FilterDefinition {
  id: string;
  label: string;
  type: 'select' | 'multi-select' | 'date-range';
  options?: { label: string; value: string }[];
}

interface EnterpriseFilterBarProps {
  moduleId: string;
  filters: FilterDefinition[];
  columns?: { id: string; label: string }[];
  onExport?: () => void;
  searchPlaceholder?: string;
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// ── MultiSelect Component ──
const MultiSelectDropdown = ({ filter, activeValue, onChange }: { filter: FilterDefinition, activeValue: string[], onChange: (val: string[]) => void }) => {
  const [open, setOpen] = useState(false);

  const toggleOption = (val: string) => {
    if (activeValue.includes(val)) onChange(activeValue.filter(v => v !== val));
    else onChange([...activeValue, val]);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed flex gap-2">
          {filter.label}
          {activeValue.length > 0 && (
            <span className="ml-1 rounded-sm bg-primary/20 px-1 font-normal text-primary">{activeValue.length}</span>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={4} className="z-[100] w-48 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card-bg)] shadow-xl overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
          <div className="max-h-60 overflow-y-auto p-1">
            {filter.options?.map(opt => (
              <div key={opt.value} onClick={() => toggleOption(opt.value)} className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--background-secondary)] cursor-pointer">
                <div className={cn("flex h-4 w-4 items-center justify-center rounded border", activeValue.includes(opt.value) ? "bg-primary border-primary text-primary-foreground" : "border-[var(--border)]")}>
                  {activeValue.includes(opt.value) && <Check className="h-3 w-3" />}
                </div>
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
          {activeValue.length > 0 && (
            <div className="p-1 border-t border-[var(--border)]">
              <Button variant="ghost" size="sm" className="w-full text-xs h-6" onClick={() => { onChange([]); setOpen(false); }}>Clear selection</Button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// ── DateRange Component ──
const DateRangeDropdown = ({ filter, activeValue, onChange }: { filter: FilterDefinition, activeValue: { from?: string; to?: string }, onChange: (val: any) => void }) => {
  const [open, setOpen] = useState(false);

  const selectedRange: DateRange | undefined = {
    from: activeValue.from ? new Date(activeValue.from) : undefined,
    to: activeValue.to ? new Date(activeValue.to) : undefined,
  };

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) { onChange(null); return; }
    onChange({
      from: range.from ? range.from.toISOString() : undefined,
      to: range.to ? range.to.toISOString() : undefined,
    });
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed flex gap-2">
          <CalendarIcon className="h-3.5 w-3.5 mr-1" />
          {activeValue.from ? (
            activeValue.to ? (
              `${format(new Date(activeValue.from), "LLL dd, y")} - ${format(new Date(activeValue.to), "LLL dd, y")}`
            ) : (
              format(new Date(activeValue.from), "LLL dd, y")
            )
          ) : (
            filter.label
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={4} className="z-[100] rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card-bg)] shadow-xl p-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={handleSelect}
            className="font-sans text-sm"
          />
          {activeValue.from && (
            <div className="p-1 border-t border-[var(--border)] mt-2">
              <Button variant="ghost" size="sm" className="w-full text-xs h-6" onClick={() => { onChange(null); setOpen(false); }}>Clear dates</Button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// ── Main Component ──
export function EnterpriseFilterBar({ moduleId, filters, columns = [], onExport, searchPlaceholder = "Search..." }: EnterpriseFilterBarProps) {
  const { filters: urlFilters, setFilter, clearFilters } = useUrlFilters();
  const { hiddenColumns, toggleColumn, saveView } = useFilterStore();
  
  const [searchValue, setSearchValue] = useState((urlFilters.search as string) || "");
  const [columnsOpen, setColumnsOpen] = useState(false);
  const columnsRef = useRef<HTMLDivElement>(null);
  useClickOutside(columnsRef, () => setColumnsOpen(false));

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter("search", searchValue || null);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, setFilter]);

  const activeFilterCount = Object.keys(urlFilters).filter(k => k !== "search" && k !== "page" && k !== "sort").length;
  const isSorted = !!urlFilters.sort;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[var(--card-bg)] border border-[var(--border)] p-2 rounded-[var(--radius-lg)] shadow-sm">
        
        {/* Left Side: Search & Primary Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--foreground-muted)]" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9 h-8 text-sm"
            />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <div className="h-4 w-px bg-[var(--border)] mx-1" />
            
            {/* Render Desktop Dropdowns */}
            {filters.slice(0, 4).map(f => {
              if (f.type === 'multi-select') {
                const val = urlFilters[f.id] ? (Array.isArray(urlFilters[f.id]) ? urlFilters[f.id] as string[] : [urlFilters[f.id] as string]) : [];
                return <MultiSelectDropdown key={f.id} filter={f} activeValue={val} onChange={(v) => setFilter(f.id, v.length ? v : null)} />;
              }
              if (f.type === 'date-range') {
                const val = (urlFilters[f.id] as {from?: string, to?: string}) || {};
                return <DateRangeDropdown key={f.id} filter={f} activeValue={val} onChange={(v) => setFilter(f.id, v)} />;
              }
              return null;
            })}
          </div>

          {/* Mobile Filter Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="sm:hidden h-8 shrink-0 flex gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                {activeFilterCount > 0 && <span className="bg-primary text-primary-foreground text-[10px] px-1.5 rounded-sm">{activeFilterCount}</span>}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
                {filters.map(f => (
                  <div key={f.id} className="space-y-2">
                    <label className="text-sm font-medium">{f.label}</label>
                    {f.type === 'multi-select' && (
                      <div className="flex flex-col gap-1">
                        {f.options?.map(opt => {
                          const val = urlFilters[f.id] ? (Array.isArray(urlFilters[f.id]) ? urlFilters[f.id] as string[] : [urlFilters[f.id] as string]) : [];
                          const isSelected = val.includes(opt.value);
                          return (
                            <div key={opt.value} className="flex items-center gap-2 p-2 hover:bg-[var(--background-secondary)] rounded-md cursor-pointer" onClick={() => {
                              if (isSelected) setFilter(f.id, val.filter(v => v !== opt.value));
                              else setFilter(f.id, [...val, opt.value]);
                            }}>
                              <div className={cn("flex h-4 w-4 items-center justify-center rounded border", isSelected ? "bg-primary border-primary text-primary-foreground" : "border-[var(--border)]")}>
                                {isSelected && <Check className="h-3 w-3" />}
                              </div>
                              <span className="text-sm">{opt.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Right Side: Tools */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon-sm" title="Save View" onClick={() => saveView(moduleId, { id: Date.now().toString(), name: 'New View', filters: urlFilters })}>
            <Save className="h-4 w-4 text-[var(--foreground-secondary)]" />
          </Button>

          {columns.length > 0 && (
            <Popover.Root open={columnsOpen} onOpenChange={setColumnsOpen}>
              <Popover.Trigger asChild>
                <Button variant="ghost" size="icon-sm" title="View Columns">
                  <EyeOff className="h-4 w-4 text-[var(--foreground-secondary)]" />
                </Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content align="end" sideOffset={4} className="z-[100] w-48 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card-bg)] shadow-xl overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                  <div className="p-2 border-b border-[var(--border)] text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                    Toggle Columns
                  </div>
                  <div className="max-h-60 overflow-y-auto p-1">
                    {columns.map(col => {
                      const isHidden = (hiddenColumns[moduleId] || []).includes(col.id);
                      return (
                        <div key={col.id} onClick={() => toggleColumn(moduleId, col.id)} className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--background-secondary)] cursor-pointer">
                          <div className={cn("flex h-4 w-4 items-center justify-center rounded border", !isHidden ? "bg-primary border-primary text-primary-foreground" : "border-[var(--border)]")}>
                            {!isHidden && <Check className="h-3 w-3" />}
                          </div>
                          <span>{col.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          )}

          {onExport && (
            <Button variant="ghost" size="icon-sm" title="Export" onClick={onExport}>
              <Download className="h-4 w-4 text-[var(--foreground-secondary)]" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {(activeFilterCount > 0 || searchValue) && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs text-[var(--foreground-muted)] font-medium">Active Filters:</span>
          
          {searchValue && (
            <div className="flex items-center gap-1.5 bg-[var(--background-secondary)] border border-[var(--border)] rounded-full px-2.5 py-1 text-xs text-[var(--foreground)]">
              <span>Search: <span className="font-semibold">{searchValue}</span></span>
              <button onClick={() => { setSearchValue(""); setFilter("search", null); }} className="text-[var(--foreground-muted)] hover:text-danger ml-1">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {Object.entries(urlFilters).map(([key, value]) => {
            if (key === "search" || key === "page" || key === "sort") return null;
            const filterDef = filters.find(f => f.id === key);
            if (!filterDef) return null;

            let displayValue = String(value);
            if (Array.isArray(value)) {
              displayValue = value.map(v => filterDef.options?.find(o => o.value === v)?.label || v).join(', ');
            } else if (typeof value === 'object' && ('from' in value || 'to' in value)) {
              displayValue = `${value.from ? format(new Date(value.from), 'MMM d') : ''} - ${value.to ? format(new Date(value.to), 'MMM d') : ''}`;
            }

            return (
              <div key={key} className="flex items-center gap-1.5 bg-[var(--background-secondary)] border border-[var(--border)] rounded-full px-2.5 py-1 text-xs text-[var(--foreground)]">
                <span>{filterDef.label}: <span className="font-semibold">{displayValue}</span></span>
                <button onClick={() => setFilter(key, null)} className="text-[var(--foreground-muted)] hover:text-danger ml-1">
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}

          <button onClick={() => { setSearchValue(""); clearFilters(); }} className="text-xs text-primary hover:text-primary/80 font-medium ml-2">
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
