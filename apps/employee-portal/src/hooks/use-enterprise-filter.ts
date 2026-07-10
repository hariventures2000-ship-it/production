// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Enterprise Filtering Hook
// Centralized filtering, searching, sorting, and pagination logic
// ═══════════════════════════════════════════════════════════════════

import { useMemo, useEffect, useCallback, useRef } from 'react';
import { useFilterStore } from '../store/filter.store';
import type { FilterState, FilterValue, SavedView } from '../types/filter.types';

export function resolveValue(item: unknown, key: string): unknown {
  if (!item || typeof item !== 'object') return undefined;
  const obj = item as Record<string, unknown>;
  if (key.includes('.')) {
    return key.split('.').reduce((acc: any, part) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
  }
  if (obj[key] !== undefined) return obj[key];
  
  // Custom schema mappings for Mervi data entities
  if (key === 'assignee' && obj.assigneeName !== undefined) return obj.assigneeName;
  if (key === 'assignee') {
    const assignee = obj.assignee;
    if (assignee && typeof assignee === 'object' && 'name' in assignee) {
      return (assignee as Record<string, unknown>).name;
    }
  }
  if (key === 'lead') {
    const lead = obj.lead;
    if (lead && typeof lead === 'object' && 'name' in lead) {
      return (lead as Record<string, unknown>).name;
    }
  }
  if (key === 'project' && obj.projectName !== undefined) return obj.projectName;
  if (key === 'project' && obj.repo !== undefined) return obj.repo;
  if (key === 'component' && obj.project !== undefined) return obj.project;
  
  return undefined;
}

function checkDateRange(itemDateStr: string | undefined | null, val: { start?: string; end?: string; preset?: string }) {
  if (!itemDateStr) return false;
  const itemDate = new Date(itemDateStr);
  if (isNaN(itemDate.getTime())) return false;

  let start = val.start ? new Date(val.start) : null;
  let end = val.end ? new Date(val.end) : null;

  if (val.preset) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (val.preset === 'today') {
      start = today;
      end = tomorrow;
    } else if (val.preset === 'yesterday') {
      start = new Date(today);
      start.setDate(today.getDate() - 1);
      end = today;
    } else if (val.preset === '7days') {
      start = new Date(today);
      start.setDate(today.getDate() - 7);
      end = tomorrow;
    } else if (val.preset === '30days') {
      start = new Date(today);
      start.setDate(today.getDate() - 30);
      end = tomorrow;
    } else if (val.preset === 'this-month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    } else if (val.preset === 'last-month') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 1);
    }
  }

  if (start && itemDate < start) return false;
  if (end && itemDate >= end) return false;
  return true;
}

export function useEnterpriseFilter<T>({
  moduleId,
  defaultState,
  data,
  searchFields = ['title', 'name', 'description'],
  customFilter,
}: {
  moduleId: string;
  defaultState: FilterState;
  data: T[];
  searchFields?: string[];
  customFilter?: (item: T, filters: Record<string, FilterValue>) => boolean;
}) {
  const initializeModule = useFilterStore((state) => state.initializeModule);
  const updateState = useFilterStore((state) => state.updateState);
  const setSearchAction = useFilterStore((state) => state.setSearch);
  const setFilterAction = useFilterStore((state) => state.setFilter);
  const removeFilterAction = useFilterStore((state) => state.removeFilter);
  const clearAllAction = useFilterStore((state) => state.clearAll);
  const saveViewAction = useFilterStore((state) => state.saveView);

  const defaultStateRef = useRef(defaultState);
  
  // Initialize module state on mount
  useEffect(() => {
    initializeModule(moduleId, defaultStateRef.current);
  }, [moduleId, initializeModule]);

  // Fallback to default state if not initialized in store yet
  const stateFromStore = useFilterStore((state) => state.moduleStates[moduleId]);
  const state: FilterState = stateFromStore || defaultState;

  // ── Centralized Filtering Logic ─────────────────────────────────
  const searchFieldsKey = searchFields.join(',');
  const filteredData = useMemo(() => {
    let result = [...data];
    const fields = searchFieldsKey.split(',');

    // 1. Text Search
    if (state.search.trim()) {
      const query = state.search.toLowerCase();
      result = result.filter((item: T) => {
        return fields.some((field) => {
          const val = resolveValue(item, field);
          if (typeof val === 'string') {
            return val.toLowerCase().includes(query);
          }
          return false;
        });
      });
    }

    // 2. Custom Filter Override
    if (customFilter) {
      result = result.filter((item) => customFilter(item, state.filters));
    } else {
      // 3. Generic Attribute Filters
      Object.entries(state.filters).forEach(([key, filterVal]) => {
        if (!filterVal) return;

        result = result.filter((item: T) => {
          const itemVal = resolveValue(item, key);

          if (filterVal.type === 'select') {
            if (filterVal.value === 'all') return true;
            if (typeof itemVal === 'string') {
              return itemVal.toLowerCase().includes(filterVal.value.toLowerCase());
            }
            return itemVal === filterVal.value;
          }

          if (filterVal.type === 'multi-select') {
            if (filterVal.values.length === 0) return true;
            if (Array.isArray(itemVal)) {
              return itemVal.some((v) => filterVal.values.includes(String(v)));
            }
            return filterVal.values.includes(String(itemVal));
          }

          if (filterVal.type === 'date-range') {
            return checkDateRange(typeof itemVal === 'string' ? itemVal : null, filterVal);
          }

          if (filterVal.type === 'numeric-range') {
            const num = Number(itemVal);
            if (isNaN(num)) return false;
            if (filterVal.min !== undefined && num < filterVal.min) return false;
            if (filterVal.max !== undefined && num > filterVal.max) return false;
            return true;
          }

          if (filterVal.type === 'boolean') {
            return !!itemVal === filterVal.value;
          }

          return true;
        });
      });
    }

    // 4. Client-side Sorting
    if (state.sort) {
      const { field, direction } = state.sort;
      result.sort((a: T, b: T) => {
        const valA = resolveValue(a, field);
        const valB = resolveValue(b, field);

        // Specific Priority weight checks
        if (field === 'priority') {
          const weight: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          const wA = weight[String(valA).toUpperCase()] || 0;
          const wB = weight[String(valB).toUpperCase()] || 0;
          return direction === 'asc' ? wA - wB : wB - wA;
        }

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return direction === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        return direction === 'asc' 
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
    }

    return result;
  }, [data, state.search, state.filters, state.sort, searchFieldsKey, customFilter]);

  // 5. Pagination Split
  const paginatedData = useMemo(() => {
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, state.currentPage, state.itemsPerPage]);

  // Actions Wrapper
  const setSearch = useCallback((query: string) => {
    setSearchAction(moduleId, query);
    if (query.trim().length > 2) {
      useFilterStore.getState().addToHistory(moduleId, query.trim());
    }
  }, [moduleId, setSearchAction]);

  const setFilter = useCallback((key: string, value: FilterValue) => {
    setFilterAction(moduleId, key, value);
  }, [moduleId, setFilterAction]);

  const removeFilter = useCallback((key: string) => {
    removeFilterAction(moduleId, key);
  }, [moduleId, removeFilterAction]);

  const clearFilters = useCallback(() => {
    updateState(moduleId, { filters: {}, currentPage: 1 });
  }, [moduleId, updateState]);

  const clearAll = useCallback(() => {
    clearAllAction(moduleId, defaultStateRef.current);
  }, [moduleId, clearAllAction]);

  const setSort = useCallback((field: string) => {
    const currentSort = state.sort;
    if (currentSort && currentSort.field === field) {
      if (currentSort.direction === 'desc') {
        updateState(moduleId, { sort: null });
      } else {
        updateState(moduleId, { sort: { field, direction: 'desc' } });
      }
    } else {
      updateState(moduleId, { sort: { field, direction: 'asc' } });
    }
  }, [moduleId, state.sort, updateState]);

  const setVisibleColumns = useCallback((columns: Record<string, boolean>) => {
    updateState(moduleId, { visibleColumns: columns });
  }, [moduleId, updateState]);

  const saveView = useCallback((name: string) => {
    const view: SavedView = {
      id: `view-${Date.now()}`,
      name,
      module: moduleId,
      state: {
        search: state.search,
        filters: state.filters,
        sort: state.sort,
        visibleColumns: state.visibleColumns,
        itemsPerPage: state.itemsPerPage,
      }
    };
    saveViewAction(view);
  }, [moduleId, state.search, state.filters, state.sort, state.visibleColumns, state.itemsPerPage, saveViewAction]);

  const applyView = useCallback((view: SavedView) => {
    updateState(moduleId, {
      ...view.state,
      currentPage: 1
    });
  }, [moduleId, updateState]);

  return {
    state,
    filteredData,
    paginatedData,
    totalItems: filteredData.length,
    setSearch,
    setFilter,
    removeFilter,
    clearFilters,
    clearAll,
    setSort,
    setVisibleColumns,
    saveView,
    applyView
  };
}
