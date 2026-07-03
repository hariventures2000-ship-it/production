// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Notification Store
// ═══════════════════════════════════════════════════════════════════

import { create } from 'zustand';

export type NotificationType =
  | 'mention'
  | 'assignment'
  | 'review'
  | 'deployment'
  | 'approval'
  | 'meeting'
  | 'leave'
  | 'announcement'
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actorName?: string;
  actorAvatar?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  panelOpen: boolean;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  panelOpen: false,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),

  addNotification: (notification) =>
    set((state) => {
      const notifications = [notification, ...state.notifications];
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    }),

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    }),

  setPanelOpen: (panelOpen) =>
    set({ panelOpen }),

  togglePanel: () =>
    set((state) => ({ panelOpen: !state.panelOpen })),
}));
