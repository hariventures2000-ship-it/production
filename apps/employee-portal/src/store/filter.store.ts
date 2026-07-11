// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Filtering Zustand Store
// ═══════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FilterState, SavedView, FilterValue } from '../types/filter.types';

interface FilterStore {
  moduleStates: Record<string, FilterState>;
  savedViews: SavedView[];
  searchHistory: Record<string, string[]>;

  initializeModule: (moduleId: string, defaultState: FilterState) => void;
  updateState: (moduleId: string, newState: Partial<FilterState>) => void;
  setSearch: (moduleId: string, query: string) => void;
  setFilter: (moduleId: string, key: string, value: FilterValue) => void;
  removeFilter: (moduleId: string, key: string) => void;
  clearAll: (moduleId: string, defaultState: FilterState) => void;
  
  saveView: (view: SavedView) => void;
  deleteView: (viewId: string) => void;
  
  addToHistory: (moduleId: string, query: string) => void;
  clearHistory: (moduleId: string) => void;
}

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      moduleStates: {},
      savedViews: [
        {
          id: 'v-1',
          name: "Critical Bugs",
          module: "bug-reports",
          state: {
            search: "",
            filters: {
              severity: { type: 'select', value: 'CRITICAL' }
            } as Record<string, FilterValue>,
            sort: null,
            visibleColumns: {},
            itemsPerPage: 8
          },
          isSystem: true
        },
        {
          id: 'v-2',
          name: "Blocked Tasks",
          module: "tasks",
          state: {
            search: "",
            filters: {
              blocked: { type: 'boolean', value: true }
            } as Record<string, FilterValue>,
            sort: null,
            visibleColumns: {},
            itemsPerPage: 8
          },
          isSystem: true
        }
      ],
      searchHistory: {},

      initializeModule: (moduleId, defaultState) =>
        set((state) => {
          if (state.moduleStates[moduleId]) return {};
          return {
            moduleStates: {
              ...state.moduleStates,
              [moduleId]: defaultState
            }
          };
        }),

      updateState: (moduleId, newState) =>
        set((state) => {
          const current = state.moduleStates[moduleId] || {
            search: '',
            filters: {},
            sort: null,
            visibleColumns: {},
            currentPage: 1,
            itemsPerPage: 10
          };
          return {
            moduleStates: {
              ...state.moduleStates,
              [moduleId]: {
                ...current,
                ...newState
              }
            }
          };
        }),

      setSearch: (moduleId, query) =>
        set((state) => {
          const current = state.moduleStates[moduleId];
          if (!current) return {};
          return {
            moduleStates: {
              ...state.moduleStates,
              [moduleId]: { ...current, search: query, currentPage: 1 }
            }
          };
        }),

      setFilter: (moduleId, key, value) =>
        set((state) => {
          const current = state.moduleStates[moduleId];
          if (!current) return {};
          return {
            moduleStates: {
              ...state.moduleStates,
              [moduleId]: {
                ...current,
                filters: {
                  ...current.filters,
                  [key]: value
                },
                currentPage: 1
              }
            }
          };
        }),

      removeFilter: (moduleId, key) =>
        set((state) => {
          const current = state.moduleStates[moduleId];
          if (!current) return {};
          const newFilters = { ...current.filters };
          delete newFilters[key];
          return {
            moduleStates: {
              ...state.moduleStates,
              [moduleId]: {
                ...current,
                filters: newFilters,
                currentPage: 1
              }
            }
          };
        }),

      clearAll: (moduleId, defaultState) =>
        set((state) => ({
          moduleStates: {
            ...state.moduleStates,
            [moduleId]: {
              ...defaultState,
              visibleColumns: state.moduleStates[moduleId]?.visibleColumns || defaultState.visibleColumns
            }
          }
        })),

      saveView: (view) =>
        set((state) => ({
          savedViews: [...state.savedViews.filter(v => v.id !== view.id), view]
        })),

      deleteView: (viewId) =>
        set((state) => ({
          savedViews: state.savedViews.filter((v) => v.id !== viewId)
        })),

      addToHistory: (moduleId, query) =>
        set((state) => {
          const history = state.searchHistory[moduleId] || [];
          if (history.includes(query)) return {};
          const newHistory = [query, ...history.slice(0, 4)];
          return {
            searchHistory: {
              ...state.searchHistory,
              [moduleId]: newHistory
            }
          };
        }),

      clearHistory: (moduleId) =>
        set((state) => ({
          searchHistory: {
            ...state.searchHistory,
            [moduleId]: []
          }
        }))
    }),
    {
      name: 'mervi-enterprise-filter',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        moduleStates: state.moduleStates,
        savedViews: state.savedViews,
        searchHistory: state.searchHistory
      })
    }
  )
);
