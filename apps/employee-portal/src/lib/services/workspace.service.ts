// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Workspace Service
// Dashboard and My Work data fetching
// ═══════════════════════════════════════════════════════════════════

import { get } from '@/lib/api-client';
import { USE_MOCK, delay } from '@/lib/constants';
import {
  mockSprintSummary, mockTodayTasks, mockWorkspaceTasks,
  mockRecentActivities, mockProjectHealth, mockPerformanceMetrics,
  mockPerformanceChart, mockAIInsights, mockBlockers,
  mockPersonalGoals, mockTimeEntries,
} from '@/lib/mock-data/workspace.mock';
import type {
  SprintSummary, TaskSummaryItem, WorkspaceTask,
  RecentActivity, ProjectHealthItem, PerformanceMetric,
  PerformanceChartPoint, AIInsight, Blocker, PersonalGoal, TimeEntry,
} from '@/lib/types/workspace.types';

export const workspaceService = {
  async getDashboard(): Promise<{
    sprint: SprintSummary;
    todayTasks: TaskSummaryItem[];
    activities: RecentActivity[];
    projectHealth: ProjectHealthItem[];
    performance: PerformanceMetric[];
    performanceChart: PerformanceChartPoint[];
    insights: AIInsight[];
  }> {
    if (USE_MOCK) {
      await delay(400);
      return {
        sprint: mockSprintSummary,
        todayTasks: mockTodayTasks,
        activities: mockRecentActivities,
        projectHealth: mockProjectHealth,
        performance: mockPerformanceMetrics,
        performanceChart: mockPerformanceChart,
        insights: mockAIInsights,
      };
    }
    return get('/employee/workspace/dashboard');
  },

  async getMyTasks(): Promise<WorkspaceTask[]> {
    if (USE_MOCK) {
      await delay(300);
      return mockWorkspaceTasks;
    }
    return get('/employee/workspace/my-tasks');
  },

  async getBlockers(): Promise<Blocker[]> {
    if (USE_MOCK) {
      await delay(200);
      return mockBlockers;
    }
    return get('/employee/workspace/blockers');
  },

  async getGoals(): Promise<PersonalGoal[]> {
    if (USE_MOCK) {
      await delay(200);
      return mockPersonalGoals;
    }
    return get('/employee/workspace/goals');
  },

  async getTimeEntries(startDate?: string, endDate?: string): Promise<TimeEntry[]> {
    if (USE_MOCK) {
      await delay(200);
      return mockTimeEntries;
    }
    return get('/employee/workspace/time-entries', { startDate, endDate });
  },

  async getActivities(): Promise<RecentActivity[]> {
    if (USE_MOCK) {
      await delay(200);
      return mockRecentActivities;
    }
    return get('/employee/workspace/activities');
  },
};
