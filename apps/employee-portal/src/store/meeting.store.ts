// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Meeting Store
// Meeting filters and active meeting detail
// ═══════════════════════════════════════════════════════════════════

import { create } from 'zustand';

export type MeetingFilter = 'upcoming' | 'past' | 'cancelled' | 'recurring' | 'invitations';

interface MeetingStoreState {
  activeFilter: MeetingFilter;
  selectedMeetingId: string | null;
  searchQuery: string;

  // Actions
  setActiveFilter: (filter: MeetingFilter) => void;
  setSelectedMeetingId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useMeetingStore = create<MeetingStoreState>((set) => ({
  activeFilter: 'upcoming',
  selectedMeetingId: null,
  searchQuery: '',

  setActiveFilter: (activeFilter) => set({ activeFilter }),
  setSelectedMeetingId: (selectedMeetingId) => set({ selectedMeetingId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
