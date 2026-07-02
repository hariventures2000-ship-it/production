// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Notification Store
// ═══════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import type { Notification } from '@/lib/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archive: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read && !n.archived).length,
    }),

  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read && !n.archived).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  archive: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, archived: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read && !n.archived).length,
      };
    }),
}));
