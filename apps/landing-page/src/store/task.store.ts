import { create } from 'zustand';
import { apiClient } from '@/lib/api-client';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  projectId: string | { _id: string; name: string };
  assigneeId?: string | { _id: string; firstName: string; lastName: string };
  status: string;
  priority: string;
  type: string;
  storyPoints: number;
  dueDate?: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: string) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<Task[]>('/tasks');
      const data = response.data;
      set({ tasks: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string | string[] } } };
      set({ error: err.response?.data?.message?.toString() || 'Failed to fetch tasks', isLoading: false });
    }
  },

  updateTaskStatus: async (taskId: string, newStatus: string) => {
    // Optimistic update
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) => 
        t._id === taskId ? { ...t, status: newStatus } : t
      )
    }));

    try {
      await apiClient.patch(`/tasks/${taskId}/status`, { status: newStatus });
    } catch {
      // Revert on failure
      set({ tasks: previousTasks, error: 'Failed to update task status' });
    }
  },

  createTask: async (data: Partial<Task>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<Task>('/tasks', data);
      const newTask = response.data;
      set((state) => ({ 
        tasks: [...state.tasks, newTask], 
        isLoading: false 
      }));
    } catch {
      set({ error: 'Failed to create task', isLoading: false });
      throw new Error('Failed to create task');
    }
  }
}));
