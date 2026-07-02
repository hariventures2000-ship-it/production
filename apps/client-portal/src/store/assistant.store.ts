import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AIMessage } from '@/lib/types';

interface AssistantState {
  isOpen: boolean;
  messages: AIMessage[];
  setIsOpen: (isOpen: boolean) => void;
  addMessage: (msg: AIMessage) => void;
  setMessages: (msgs: AIMessage[]) => void;
  clearMessages: () => void;
}

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set) => ({
      isOpen: false,
      messages: [
        { 
          id: '1', 
          role: 'assistant', 
          content: 'Hello! I am your AI assistant. How can I help you with your project today?', 
          timestamp: new Date().toISOString() 
        }
      ],
      setIsOpen: (isOpen) => set({ isOpen }),
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      setMessages: (messages) => set({ messages }),
      clearMessages: () => set({ 
        messages: [
          { 
            id: '1', 
            role: 'assistant', 
            content: 'Hello! I am your AI assistant. How can I help you with your project today?', 
            timestamp: new Date().toISOString() 
          }
        ] 
      }),
    }),
    {
      name: 'mervi-assistant-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ messages: state.messages }),
    }
  )
);
