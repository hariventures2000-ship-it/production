// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Tasks Page
// Refined with Filters, Pagination, Loading Shimmers, Error Retry, and Empty States
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle2, Circle, Clock, MoreHorizontal, Plus, 
  Search, Filter, Calendar as CalendarIcon, CheckSquare,
  AlertTriangle, RefreshCcw, User, Tag, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";
import { mockTodayTasks } from "@/lib/mock-data/workspace.mock";
import { PRIORITY_CONFIG } from "@/lib/constants";
import { Pagination } from "@/components/ui/pagination";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

import { useEnterpriseFilter } from "@/hooks/use-enterprise-filter";
import { useFilterStore } from "@/store/filter.store";
import { EnterpriseFilterBar } from "@/components/ui/enterprise-filter-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { FilterFieldConfig } from "@/types/filter.types";

// ── Skeletons ──────────────────────────────────────────────────────
function TasksSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border border-[var(--border)] rounded-xl animate-pulse bg-[var(--card-bg)]">
          <div className="w-5 h-5 rounded-full bg-[var(--background-secondary)]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[var(--background-secondary)] rounded w-2/5" />
            <div className="h-3 bg-[var(--background-secondary)] rounded w-1/5" />
          </div>
          <div className="w-16 h-5 rounded bg-[var(--background-secondary)]" />
        </div>
      ))}
    </div>
  );
}

// ── Error View ─────────────────────────────────────────────────────
function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="p-8 text-center border border-[var(--border)] rounded-xl bg-[var(--card-bg)] flex flex-col items-center justify-center max-w-md mx-auto my-12 shadow-sm">
      <AlertTriangle className="w-12 h-12 text-[var(--color-danger)] mb-4 animate-bounce" />
      <h3 className="text-lg font-bold text-[var(--foreground)]">Connection Failure</h3>
      <p className="text-sm text-[var(--foreground-secondary)] mt-2 mb-6">{message}</p>
      <div className="flex gap-2">
        <Button onClick={onRetry} variant="default" className="h-9 px-4">
          <RefreshCcw className="w-4 h-4 mr-2" /> Retry Connection
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline" className="h-9 px-4">
          Refresh Page
        </Button>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────
function EmptyState({ onAction, onSecondaryAction }: { onAction: () => void, onSecondaryAction: () => void }) {
  return (
    <div className="p-12 text-center border border-dashed border-[var(--border)] rounded-xl bg-[var(--card-bg)] flex flex-col items-center justify-center">
      <CheckSquare className="w-12 h-12 text-[var(--foreground-muted)] mb-4" />
      <h3 className="text-lg font-bold text-[var(--foreground)]">No Tasks Found</h3>
      <p className="text-sm text-[var(--foreground-secondary)] mt-2 max-w-sm mb-6">
        There are no tasks that match your active filters or search criteria. Get started by adding a new task!
      </p>
      <div className="flex gap-2">
        <Button onClick={onAction}><Plus className="w-4 h-4 mr-2" /> Create New Task</Button>
        <Button onClick={onSecondaryAction} variant="outline">Clear All Filters</Button>
      </div>
    </div>
  );
}

export default function MyTasksPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      // Simulate random occasional mock error (5% chance) or normal loading
      if (Math.random() < 0.05) {
        setError("Failed to fetch task entities from employee-service database cluster.");
      }
      setLoading(false);
    }, 450);
  };

  useEffect(() => {
    loadData();
  }, []);

  const baseTasks: any[] = [
    ...mockTodayTasks, 
    { id: 'task-6', title: 'Prepare Q3 OKRs presentation', priority: 'MEDIUM', status: 'DONE', projectName: 'Management', dueDate: '2026-07-01', epicName: 'OKRs Planning', assigneeName: 'Vijay S.' },
    { id: 'task-7', title: 'Onboard new UI designer', priority: 'HIGH', status: 'DONE', projectName: 'HR', dueDate: '2026-07-02', epicName: 'Team Expansion', assigneeName: 'Priya K.' },
    { id: 'task-8', title: 'Code review for PR-247', priority: 'HIGH', status: 'TODO', projectName: 'Mervi', dueDate: '2026-07-05', epicName: 'Analytics Dashboard', assigneeName: 'Vijay S.' },
    { id: 'task-9', title: 'Write unit tests for Auth Token Rotator', priority: 'MEDIUM', status: 'TODO', projectName: 'Auth', dueDate: '2026-07-08', epicName: 'Security Hardening', assigneeName: 'Deepak S.' },
    { id: 'task-10', title: 'Setup CI environment variables', priority: 'LOW', status: 'TODO', projectName: 'DevOps', dueDate: '2026-07-12', epicName: 'CI/CD Pipelines', assigneeName: 'Arjun M.' },
    { id: 'task-11', title: 'Draft API guidelines v2', priority: 'MEDIUM', status: 'TODO', projectName: 'Mervi', dueDate: '2026-07-15', epicName: 'Architecture Standard', assigneeName: 'Sneha P.' },
  ];

  const fieldsConfig: FilterFieldConfig[] = [
    { key: "priority", label: "Priority", type: "select", options: [
      { value: "all", label: "All Priorities" },
      { value: "CRITICAL", label: "Critical" },
      { value: "HIGH", label: "High" },
      { value: "MEDIUM", label: "Medium" },
      { value: "LOW", label: "Low" },
    ]},
    { key: "epicName", label: "Epic", type: "select", options: [
      { value: "all", label: "All Epics" },
      { value: "OKRs", label: "OKRs Planning" },
      { value: "Security", label: "Security Hardening" },
      { value: "Analytics", label: "Analytics Dashboard" },
      { value: "CI/CD", label: "CI/CD Pipelines" },
    ]},
    { key: "assigneeName", label: "Assignee", type: "select", options: [
      { value: "all", label: "All Assignees" },
      { value: "Vijay", label: "Vijay S." },
      { value: "Priya", label: "Priya K." },
      { value: "Arjun", label: "Arjun M." },
      { value: "Deepak", label: "Deepak S." },
    ]},
    { key: "status", label: "Status", type: "select", options: [
      { value: "all", label: "All Statuses" },
      { value: "TODO", label: "To Do" },
      { value: "IN_PROGRESS", label: "In Progress" },
      { value: "DONE", label: "Completed" },
    ]}
  ];

  const {
    state,
    filteredData,
    paginatedData,
    totalItems,
    setSearch,
    setFilter,
    removeFilter,
    clearAll,
    setSort,
    saveView,
    applyView,
  } = useEnterpriseFilter({
    moduleId: "tasks",
    defaultState: {
      search: "",
      filters: {},
      sort: null,
      visibleColumns: {},
      currentPage: 1,
      itemsPerPage: 8,
    },
    data: baseTasks,
    searchFields: ["title", "projectName", "epicName", "assigneeName"],
  });

  const handlePageChange = (page: number) => {
    useFilterStore.getState().updateState("tasks", { currentPage: page });
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-12 w-48 bg-[var(--background-secondary)] rounded animate-pulse" />
        <TasksSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">My Tasks</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Manage your personal to-dos and assigned project tasks.
          </p>
        </div>
        <Button onClick={() => alert("Add task feature integration is available via backend form.")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Enterprise Filter Bar */}
      <EnterpriseFilterBar
        moduleId="tasks"
        fieldsConfig={fieldsConfig}
        state={state}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onRemoveFilter={removeFilter}
        onClearAll={clearAll}
        onApplyView={applyView}
        onSaveView={saveView}
        sortOptions={[
          { value: "title", label: "Alphabetical" },
          { value: "priority", label: "Priority" },
          { value: "dueDate", label: "Due Date" },
        ]}
        onSortSelect={setSort}
        filteredData={filteredData}
      >
        <FilterDropdown
          label="Priority"
          value={(state.filters.priority as any)?.value || "all"}
          options={fieldsConfig[0].options || []}
          onChange={(val) => setFilter("priority", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Epic"
          value={(state.filters.epicName as any)?.value || "all"}
          options={fieldsConfig[1].options || []}
          onChange={(val) => setFilter("epicName", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Assignee"
          value={(state.filters.assigneeName as any)?.value || "all"}
          options={fieldsConfig[2].options || []}
          onChange={(val) => setFilter("assigneeName", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Status"
          value={(state.filters.status as any)?.value || "all"}
          options={fieldsConfig[3].options || []}
          onChange={(val) => setFilter("status", { type: "select", value: val })}
        />
      </EnterpriseFilterBar>

      {/* Tasks Table/List Card */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {paginatedData.map((task) => {
              const priorityConf = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.LOW;
              const isCompleted = task.status === "DONE";

              return (
                <div 
                  key={task.id}
                  className="flex items-center gap-4 p-4 hover:bg-[var(--background-secondary)]/40 transition-colors group border-b border-[var(--border)] last:border-b-0"
                >
                  <button className="text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors shrink-0">
                    {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-semibold transition-colors", isCompleted ? "text-[var(--foreground-muted)] line-through" : "text-[var(--foreground)]")}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--foreground-secondary)] flex-wrap">
                      <span className="font-medium text-[var(--foreground-muted)]">{task.projectName}</span>
                      {task.epicName && (
                        <>
                          <span className="text-[var(--foreground-muted)]">•</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[var(--foreground-muted)]">{task.epicName}</span>
                        </>
                      )}
                      {task.assigneeName && (
                        <>
                          <span className="text-[var(--foreground-muted)]">•</span>
                          <span className="text-[10px] text-[var(--foreground-muted)] flex items-center gap-1">
                            <User className="w-3 h-3" /> {task.assigneeName}
                          </span>
                        </>
                      )}
                      {task.dueDate && (
                        <>
                          <span className="text-[var(--foreground-muted)]">•</span>
                          <div className="flex items-center gap-1 text-[var(--foreground-muted)]">
                            <CalendarIcon className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className={cn("text-[10px] shrink-0 hidden sm:inline-flex", priorityConf.color)}>
                    {priorityConf.label}
                  </Badge>
                  <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
            {paginatedData.length === 0 && (
              <EmptyState onAction={() => alert("Creating task...")} onSecondaryAction={clearAll} />
            )}
          </div>
          <Pagination
            currentPage={state.currentPage}
            totalItems={totalItems}
            itemsPerPage={state.itemsPerPage}
            onPageChange={handlePageChange}
            itemName="tasks"
          />
        </CardContent>
      </Card>
    </div>
  );
}
