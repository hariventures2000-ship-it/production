// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Filtering Types
// ═══════════════════════════════════════════════════════════════════

export type FilterValue = 
  | { type: 'select'; value: string }
  | { type: 'multi-select'; values: string[] }
  | { type: 'date-range'; start?: string; end?: string; preset?: string }
  | { type: 'numeric-range'; min?: number; max?: number }
  | { type: 'boolean'; value: boolean };

export interface FilterState {
  search: string;
  filters: Record<string, FilterValue>;
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  } | null;
  visibleColumns: Record<string, boolean>;
  currentPage: number;
  itemsPerPage: number;
}

export interface SavedView {
  id: string;
  name: string;
  module: string;
  state: Omit<FilterState, 'currentPage'>;
  isSystem?: boolean;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterFieldConfig {
  key: string;
  label: string;
  type: 'select' | 'multi-select' | 'date-range' | 'numeric-range' | 'boolean';
  options?: FilterOption[];
  placeholder?: string;
}

export function getSelectFilterValue(filter: FilterValue | undefined): string {
  return filter && 'value' in filter && typeof filter.value !== 'undefined' ? String(filter.value) : 'all';
}
