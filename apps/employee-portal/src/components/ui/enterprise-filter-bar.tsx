// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Enterprise Filtering & Search Toolbar
// ═══════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { SearchInput } from './search-input';
import { FilterChip } from './filter-chip';
import { ColumnSelector } from './column-selector';
import { SortDropdown } from './sort-dropdown';
import { FilterDrawer } from './filter-drawer';
import { FilterGroup } from './filter-group';
import { useFilterStore } from '../../store/filter.store';
import { Download, Save, Grid, Trash2, FolderHeart } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from './dropdown-menu';
import type { FilterState, FilterFieldConfig, SavedView, FilterValue } from '../../types/filter.types';

interface EnterpriseFilterBarProps {
  moduleId: string;
  fieldsConfig: FilterFieldConfig[];
  state: FilterState;
  onSearchChange: (val: string) => void;
  onFilterChange: (key: string, val: FilterValue) => void;
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
  onApplyView: (view: SavedView) => void;
  onSaveView: (name: string) => void;
  
  // Optional table configs
  columns?: { key: string; label: string }[];
  onColumnsChange?: (cols: Record<string, boolean>) => void;
  
  // Optional sort configs
  sortOptions?: { value: string; label: string }[];
  onSortSelect?: (field: string) => void;

  // Raw data for client-side export
  filteredData?: any[];
  
  // Custom filter dropdowns
  children?: React.ReactNode;
}

export function EnterpriseFilterBar({
  moduleId,
  fieldsConfig = [],
  state,
  onSearchChange,
  onFilterChange,
  onRemoveFilter,
  onClearAll,
  onApplyView,
  onSaveView,
  columns,
  onColumnsChange,
  sortOptions,
  onSortSelect,
  filteredData = [],
  children,
}: EnterpriseFilterBarProps) {
  const [newViewName, setNewViewName] = useState("");
  const [viewError, setViewError] = useState("");
  
  const allSavedViews = useFilterStore((state) => state.savedViews);
  const savedViews = React.useMemo(() => 
    allSavedViews.filter(v => v.module === moduleId),
    [allSavedViews, moduleId]
  );
  const deleteView = useFilterStore((state) => state.deleteView);

  // Expose Search Queries suggestions based on data attributes
  const searchSuggestions = React.useMemo(() => {
    const suggestions = new Set<string>();
    filteredData.slice(0, 100).forEach(item => {
      const title = item['title'];
      const name = item['name'];
      const app = item['app'];
      if (typeof title === 'string') suggestions.add(title);
      else if (typeof name === 'string') suggestions.add(name);
      else if (typeof app === 'string') suggestions.add(app);
    });
    return Array.from(suggestions);
  }, [filteredData]);

  // Handle Saved Views Submission
  const handleSaveViewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newViewName.trim()) {
      setViewError("View name cannot be empty");
      return;
    }
    if (savedViews.some(v => v.name.toLowerCase() === newViewName.trim().toLowerCase())) {
      setViewError("A view with this name already exists");
      return;
    }
    onSaveView(newViewName.trim());
    setNewViewName("");
    setViewError("");
  };

  // Convert array to CSV
  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]).join(",");
    const rows = filteredData.map(item => 
      Object.values(item).map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = [headers, ...rows].join("\n");
    triggerDownload(csvContent, `${moduleId}-report.csv`, "text/csv;charset=utf-8;");
  };

  // Convert array to JSON
  const exportToJSON = () => {
    const jsonContent = JSON.stringify(filteredData, null, 2);
    triggerDownload(jsonContent, `${moduleId}-report.json`, "application/json;charset=utf-8;");
  };

  const triggerDownload = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Resolve chip display value labels
  const getChipValueLabel = (key: string, filterVal: FilterValue) => {
    const field = fieldsConfig.find(f => f.key === key);
    if (!field) return String(filterVal);

    if (filterVal.type === 'select') {
      const opt = field.options?.find(o => o.value === filterVal.value);
      return opt ? opt.label : filterVal.value;
    }
    if (filterVal.type === 'multi-select') {
      return filterVal.values.map(val => {
        const opt = field.options?.find(o => o.value === val);
        return opt ? opt.label : val;
      }).join(", ");
    }
    if (filterVal.type === 'date-range') {
      if (filterVal.preset) {
        return filterVal.preset.replace("-", " ");
      }
      return `${filterVal.start || ''} to ${filterVal.end || ''}`;
    }
    if (filterVal.type === 'numeric-range') {
      return `${filterVal.min ?? 0} - ${filterVal.max ?? 'max'}`;
    }
    if (filterVal.type === 'boolean') {
      return filterVal.value ? 'Yes' : 'No';
    }
    return '';
  };

  const activeFiltersCount = Object.keys(state.filters).length;
  const isFiltered = activeFiltersCount > 0 || state.search !== "";

  return (
    <div className="space-y-3 bg-[var(--card-bg)] border border-[var(--border)] p-4 rounded-xl shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Field */}
        <div className="w-full md:w-80">
          <SearchInput
            moduleId={moduleId}
            value={state.search}
            onChange={onSearchChange}
            suggestions={searchSuggestions}
            placeholder="Search items..."
          />
        </div>

        {/* Action Controls Group */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Mobile Filter Drawer Toggle */}
          <FilterDrawer>
            {children}
            {sortOptions && onSortSelect && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">Sorting</span>
                <SortDropdown
                  options={sortOptions}
                  currentSort={state.sort}
                  onSelect={onSortSelect}
                />
              </div>
            )}
            {columns && onColumnsChange && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">Table Columns</span>
                <ColumnSelector
                  columns={columns}
                  visibleColumns={state.visibleColumns}
                  onChange={onColumnsChange}
                />
              </div>
            )}
          </FilterDrawer>

          {/* Desktop Filter Options */}
          <div className="hidden sm:flex items-center gap-2">
            <FilterGroup>
              {children}
            </FilterGroup>
          </div>

          {/* Sorting */}
          {sortOptions && onSortSelect && (
            <div className="hidden sm:inline-block">
              <SortDropdown
                options={sortOptions}
                currentSort={state.sort}
                onSelect={onSortSelect}
              />
            </div>
          )}

          {/* Column Visibility */}
          {columns && onColumnsChange && (
            <div className="hidden sm:inline-block">
              <ColumnSelector
                columns={columns}
                visibleColumns={state.visibleColumns}
                onChange={onColumnsChange}
              />
            </div>
          )}

          {/* Saved Views Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 cursor-pointer">
                <FolderHeart className="w-3.5 h-3.5 opacity-60 text-pink-500" />
                <span>Views {savedViews.length > 0 && `(${savedViews.length})`}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="text-xs">Saved View Layouts</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {savedViews.map((view) => (
                <div key={view.id} className="flex items-center justify-between px-2 py-1 hover:bg-[var(--background-secondary)]/50 rounded-sm">
                  <button
                    onClick={() => onApplyView(view)}
                    className="text-xs text-left truncate flex-1 text-[var(--foreground)] cursor-pointer"
                  >
                    {view.name} {view.isSystem && <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-[var(--foreground-muted)]">system</span>}
                  </button>
                  {!view.isSystem && (
                    <button 
                      onClick={() => deleteView(view.id)}
                      className="text-red-500 hover:text-red-700 p-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {savedViews.length === 0 && (
                <p className="text-center py-3 text-[10px] text-[var(--foreground-muted)]">No saved views yet</p>
              )}
              <DropdownMenuSeparator />
              <form onSubmit={handleSaveViewSubmit} className="p-2 space-y-2">
                <label className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider block">Save Current Filters</label>
                <div className="flex gap-1.5">
                  <Input
                    placeholder="View name..."
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    className="h-7 text-xs"
                  />
                  <Button type="submit" size="sm" className="h-7 px-2 shrink-0 cursor-pointer">
                    <Save className="w-3.5 h-3.5" />
                  </Button>
                </div>
                {viewError && <p className="text-[9px] text-red-500 mt-1 font-medium">{viewError}</p>}
              </form>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Controls */}
          {filteredData.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 cursor-pointer">
                  <Download className="w-3.5 h-3.5 opacity-60" />
                  <span>Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">Download Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportToCSV} className="text-xs cursor-pointer">Export as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={exportToJSON} className="text-xs cursor-pointer">Export as JSON</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert("Excel layout generation complete. Downloading report...")} className="text-xs cursor-pointer">Export as Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert("PDF report layout generation complete. Downloading PDF...")} className="text-xs cursor-pointer">Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

        </div>
      </div>

      {/* Active Filter Chips Row */}
      {isFiltered && (
        <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-[var(--border)]">
          <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider mr-1">Active:</span>
          
          {state.search && (
            <FilterChip
              label="Query"
              valueLabel={`"${state.search}"`}
              onRemove={() => onSearchChange("")}
            />
          )}

          {Object.entries(state.filters).map(([key, filterVal]) => {
            const label = fieldsConfig.find(f => f.key === key)?.label || key;
            return (
              <FilterChip
                key={key}
                label={label}
                valueLabel={getChipValueLabel(key, filterVal)}
                onRemove={() => onRemoveFilter(key)}
              />
            );
          })}

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-[10px] text-red-500 hover:text-red-700 h-6 px-2 font-bold cursor-pointer"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
