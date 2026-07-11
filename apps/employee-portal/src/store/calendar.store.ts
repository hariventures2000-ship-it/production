// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Calendar Store
// Calendar view state and event filters
// ═══════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

interface CalendarStoreState {
  view: CalendarView;
  selectedDate: string; // ISO date string
  eventTypeFilter: string[];

  // Actions
  setView: (view: CalendarView) => void;
  setSelectedDate: (date: string) => void;
  goToToday: () => void;
  setEventTypeFilter: (filters: string[]) => void;
}

export const useCalendarStore = create<CalendarStoreState>()(
  persist(
    (set) => ({
      view: 'month',
      selectedDate: new Date().toISOString().split('T')[0],
      eventTypeFilter: [],

      setView: (view) => set({ view }),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      goToToday: () => set({ selectedDate: new Date().toISOString().split('T')[0] }),
      setEventTypeFilter: (eventTypeFilter) => set({ eventTypeFilter }),
    }),
    {
      name: 'mervi-calendar',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        view: state.view,
      }),
    }
  )
);
