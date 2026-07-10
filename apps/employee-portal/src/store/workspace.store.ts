// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Workspace Store
// My Work view preferences and time tracker state
// ═══════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type MyWorkView = 'list' | 'kanban' | 'timeline';
export type TimeTrackerState = 'idle' | 'running' | 'paused';

interface WorkspaceStoreState {
  // My Work
  myWorkView: MyWorkView;
  myWorkFilter: string;
  myWorkSearch: string;

  // Time Tracker
  timerState: TimeTrackerState;
  timerTaskId: string | null;
  timerTaskTitle: string | null;
  timerStartedAt: number | null;
  timerElapsed: number; // seconds

  // Actions
  setMyWorkView: (view: MyWorkView) => void;
  setMyWorkFilter: (filter: string) => void;
  setMyWorkSearch: (search: string) => void;
  startTimer: (taskId: string, taskTitle: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  tickTimer: () => void;
}

export const useWorkspaceStore = create<WorkspaceStoreState>()(
  persist(
    (set) => ({
      myWorkView: 'list',
      myWorkFilter: 'all',
      myWorkSearch: '',
      timerState: 'idle',
      timerTaskId: null,
      timerTaskTitle: null,
      timerStartedAt: null,
      timerElapsed: 0,

      setMyWorkView: (myWorkView) => set({ myWorkView }),
      setMyWorkFilter: (myWorkFilter) => set({ myWorkFilter }),
      setMyWorkSearch: (myWorkSearch) => set({ myWorkSearch }),

      startTimer: (taskId, taskTitle) =>
        set({
          timerState: 'running',
          timerTaskId: taskId,
          timerTaskTitle: taskTitle,
          timerStartedAt: Date.now(),
          timerElapsed: 0,
        }),

      pauseTimer: () =>
        set((state) => ({
          timerState: 'paused',
          timerElapsed: state.timerStartedAt
            ? state.timerElapsed + Math.floor((Date.now() - state.timerStartedAt) / 1000)
            : state.timerElapsed,
          timerStartedAt: null,
        })),

      resumeTimer: () =>
        set({ timerState: 'running', timerStartedAt: Date.now() }),

      stopTimer: () =>
        set({
          timerState: 'idle',
          timerTaskId: null,
          timerTaskTitle: null,
          timerStartedAt: null,
          timerElapsed: 0,
        }),

      tickTimer: () =>
        set((state) => {
          if (state.timerState !== 'running' || !state.timerStartedAt) return state;
          return state; // Tick computed on render from startedAt
        }),
    }),
    {
      name: 'mervi-workspace',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        myWorkView: state.myWorkView,
      }),
    }
  )
);
