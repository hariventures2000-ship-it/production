import { create } from 'zustand';
import { apiClient } from '@/lib/api-client';

export interface Project {
  _id: string;
  name: string;
  description?: string;
  clientId: string;
  teamLeadId?: string;
  department: string;
  status: string;
  priority: string;
  startDate: string;
  estimatedEndDate: string;
  budget: number;
  actualCost: number;
  completionPercentage: number;
}

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<Project[]>('/projects');
      // The NestJS controller might return the array directly, or wrapped in { data: [] }
      // Our apiClient helper usually unwraps if using the `get<T>` wrapper, 
      // but if we use `apiClient.get()`, it returns AxiosResponse.
      const data = response.data;
      set({ projects: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string | string[] } } };
      set({ error: err.response?.data?.message?.toString() || 'Failed to fetch projects', isLoading: false });
    }
  },

  createProject: async (data: Partial<Project>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<Project>('/projects', data);
      const newProject = response.data;
      set((state) => ({ 
        projects: [...state.projects, newProject], 
        isLoading: false 
      }));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string | string[] } } };
      const msg = err.response?.data?.message;
      set({ 
        error: Array.isArray(msg) ? msg.join(', ') : (msg || 'Failed to create project'), 
        isLoading: false 
      });
      throw error;
    }
  },
}));
