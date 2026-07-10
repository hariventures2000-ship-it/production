// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — AI Copilot Store
// Persists AI conversation history and panel display state
// ═══════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AIStore {
  isOpen: boolean;
  isMinimized: boolean;
  messages: AIMessage[];
  unreadCount: number;

  setIsOpen: (isOpen: boolean) => void;
  setIsMinimized: (isMinimized: boolean) => void;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearHistory: () => void;
  incrementUnread: () => void;
  resetUnread: () => void;
}

export const useAIStore = create<AIStore>()(
  persist(
    (set) => ({
      isOpen: false,
      isMinimized: false,
      messages: [
        {
          id: 'initial',
          role: 'assistant',
          content: "Hi! I'm your Mervi AI Copilot. Ask me anything about your tasks, today's meetings, sprint progress, pull requests, or code deployments.",
          timestamp: Date.now(),
        }
      ],
      unreadCount: 0,

      setIsOpen: (isOpen) => set((state) => ({ 
        isOpen, 
        unreadCount: isOpen ? 0 : state.unreadCount 
      })),

      setIsMinimized: (isMinimized) => set({ isMinimized }),

      addMessage: (role, content) => set((state) => {
        const newMsg: AIMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          role,
          content,
          timestamp: Date.now(),
        };
        return {
          messages: [...state.messages, newMsg],
          unreadCount: (!state.isOpen && role === 'assistant') ? state.unreadCount + 1 : state.unreadCount
        };
      }),

      clearHistory: () => set({
        messages: [
          {
            id: 'initial',
            role: 'assistant',
            content: "Hi! I'm your Mervi AI Copilot. Ask me anything about your tasks, today's meetings, sprint progress, pull requests, or code deployments.",
            timestamp: Date.now(),
          }
        ]
      }),

      incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
      resetUnread: () => set({ unreadCount: 0 }),
    }),
    {
      name: 'mervi-ai-copilot',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messages: state.messages,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
