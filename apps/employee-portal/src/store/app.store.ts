// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — App Store
// Global UI state: sidebar, command palette, theme preferences
// ═══════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;

  // Command Palette
  commandPaletteOpen: boolean;

  // Search
  globalSearchOpen: boolean;
  globalSearchQuery: string;

  // Pinned & Favorites
  pinnedProjectIds: string[];
  bookmarkedIds: string[];

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setGlobalSearchOpen: (open: boolean) => void;
  setGlobalSearchQuery: (query: string) => void;
  togglePinnedProject: (id: string) => void;
  toggleBookmark: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      commandPaletteOpen: false,
      globalSearchOpen: false,
      globalSearchQuery: '',
      pinnedProjectIds: [],
      bookmarkedIds: [],

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (sidebarCollapsed) =>
        set({ sidebarCollapsed }),

      setMobileSidebarOpen: (mobileSidebarOpen) =>
        set({ mobileSidebarOpen }),

      setCommandPaletteOpen: (commandPaletteOpen) =>
        set({ commandPaletteOpen }),

      setGlobalSearchOpen: (globalSearchOpen) =>
        set({ globalSearchOpen }),

      setGlobalSearchQuery: (globalSearchQuery) =>
        set({ globalSearchQuery }),

      togglePinnedProject: (id) =>
        set((state) => ({
          pinnedProjectIds: state.pinnedProjectIds.includes(id)
            ? state.pinnedProjectIds.filter((p) => p !== id)
            : [...state.pinnedProjectIds, id],
        })),

      toggleBookmark: (id) =>
        set((state) => ({
          bookmarkedIds: state.bookmarkedIds.includes(id)
            ? state.bookmarkedIds.filter((b) => b !== id)
            : [...state.bookmarkedIds, id],
        })),
    }),
    {
      name: 'mervi-employee-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        pinnedProjectIds: state.pinnedProjectIds,
        bookmarkedIds: state.bookmarkedIds,
      }),
    }
  )
);
