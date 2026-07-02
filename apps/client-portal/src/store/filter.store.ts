import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type FilterValue = string | number | boolean | string[] | { from?: string; to?: string };

export interface FilterState {
  [key: string]: FilterValue;
}

export interface SavedView {
  id: string;
  name: string;
  filters: FilterState;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

interface FilterStoreState {
  savedViews: Record<string, SavedView[]>; // moduleId -> SavedView[]
  hiddenColumns: Record<string, string[]>; // moduleId -> array of hidden column keys

  saveView: (moduleId: string, view: SavedView) => void;
  removeView: (moduleId: string, viewId: string) => void;
  toggleColumn: (moduleId: string, columnKey: string) => void;
}

export const useFilterStore = create<FilterStoreState>()(
  persist(
    (set) => ({
      savedViews: {},
      hiddenColumns: {},

      saveView: (moduleId, view) =>
        set((state) => ({
          savedViews: {
            ...state.savedViews,
            [moduleId]: [...(state.savedViews[moduleId] || []), view],
          },
        })),

      removeView: (moduleId, viewId) =>
        set((state) => ({
          savedViews: {
            ...state.savedViews,
            [moduleId]: (state.savedViews[moduleId] || []).filter((v) => v.id !== viewId),
          },
        })),

      toggleColumn: (moduleId, columnKey) =>
        set((state) => {
          const currentHidden = state.hiddenColumns[moduleId] || [];
          const isHidden = currentHidden.includes(columnKey);
          return {
            hiddenColumns: {
              ...state.hiddenColumns,
              [moduleId]: isHidden
                ? currentHidden.filter((k) => k !== columnKey)
                : [...currentHidden, columnKey],
            },
          };
        }),
    }),
    {
      name: 'mervi-enterprise-filters',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
