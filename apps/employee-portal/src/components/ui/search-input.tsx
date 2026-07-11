// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Search Input Component
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, Sparkles } from 'lucide-react';
import { Input } from './input';
import { useFilterStore } from '../../store/filter.store';

const EMPTY_ARRAY: string[] = [];

interface SearchInputProps {
  moduleId: string;
  value: string;
  onChange: (val: string) => void;
  suggestions?: string[];
  placeholder?: string;
}

export function SearchInput({
  moduleId,
  value,
  onChange,
  suggestions = [],
  placeholder = "Search...",
}: SearchInputProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const moduleSearchHistory = useFilterStore((state) => state.searchHistory[moduleId]);
  const history = moduleSearchHistory || EMPTY_ARRAY;
  const clearHistory = useFilterStore((state) => state.clearHistory);

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

  const filteredSuggestions = suggestions.filter((item) =>
    item.toLowerCase().includes(value.toLowerCase()) && item.toLowerCase() !== value.toLowerCase()
  ).slice(0, 5);

  const showHistory = value.trim() === "" && history.length > 0;
  const items = showHistory ? history : filteredSuggestions;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < items.length) {
        e.preventDefault();
        onChange(items[activeIndex]);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} className="bg-blue-100 text-blue-900 rounded-xs px-0.5">{part}</mark>
            : part
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-8 pr-8 h-8 text-xs bg-[var(--background-secondary)]/20 border-[var(--border)] focus:bg-[var(--card-bg)] transition-colors"
        />
        {value && (
          <button
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && items.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 overflow-hidden text-left max-h-60 overflow-y-auto">
          {showHistory && (
            <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--background-secondary)]/40 border-b border-[var(--border)]">
              <span className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" /> Recent Searches
              </span>
              <button 
                onClick={() => clearHistory(moduleId)}
                className="text-[9px] text-red-500 hover:text-red-700 font-semibold"
              >
                Clear
              </button>
            </div>
          )}

          {!showHistory && (
            <div className="px-3 py-1.5 bg-[var(--background-secondary)]/40 border-b border-[var(--border)]">
              <span className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" /> Search Suggestions
              </span>
            </div>
          )}

          <div className="py-1">
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item}
                  onClick={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-xs text-left transition-colors flex items-center gap-2 ${
                    isActive 
                      ? "bg-[var(--background-secondary)] text-[var(--foreground)]" 
                      : "text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]/60"
                  }`}
                >
                  {showHistory ? (
                    <Clock className="w-3.5 h-3.5 text-[var(--foreground-muted)] shrink-0" />
                  ) : (
                    <Search className="w-3.5 h-3.5 text-[var(--foreground-muted)] shrink-0" />
                  )}
                  <span className="truncate flex-1">
                    {showHistory ? item : highlightMatch(item, value)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
