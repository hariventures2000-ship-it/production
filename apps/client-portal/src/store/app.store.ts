// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — App Store
// UI state management
// ═══════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  sidebarCollapsed: boolean;
  selectedProjectId: string | null;
  commandPaletteOpen: boolean;
  notificationDrawerOpen: boolean;
  mobileSidebarOpen: boolean;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedProjectId: (id: string | null) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationDrawerOpen: (open: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      selectedProjectId: null,
      commandPaletteOpen: false,
      notificationDrawerOpen: false,
      mobileSidebarOpen: false,

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setSelectedProjectId: (id) => set({ selectedProjectId: id }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
    }),
    {
      name: 'mervi-client-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        selectedProjectId: state.selectedProjectId,
      }),
    },
  ),
);
