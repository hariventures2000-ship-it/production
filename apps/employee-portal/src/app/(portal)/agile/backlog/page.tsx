// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Agile Backlog Page
// Refined with Filter Bar, Pagination, Loading Skeletons, Error Retry, and Empty States
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Plus, ChevronDown, ChevronRight, 
  AlertCircle, Bookmark, CheckCircle2,
  AlertTriangle, RefreshCcw, Tag, Layers, User, Zap, Clock,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { mockTasks, mockActiveSprint, mockEpics } from "@/lib/mock-data/agile.mock";
import { PRIORITY_CONFIG } from "@/lib/constants";
import { Pagination } from "@/components/ui/pagination";
import type { AgileTask, TaskStatus } from "@/lib/types/agile.types";
import { useEnterpriseFilter } from "@/hooks/use-enterprise-filter";
import { useFilterStore } from "@/store/filter.store";
import { EnterpriseFilterBar } from "@/components/ui/enterprise-filter-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { FilterFieldConfig, getSelectFilterValue } from "@/types/filter.types";

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  BACKLOG: { label: "Backlog", color: "text-slate-500 bg-slate-500/10" },
  TODO: { label: "To Do", color: "text-gray-500 bg-gray-500/10" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-500 bg-blue-500/10" },
  REVIEW: { label: "In Review", color: "text-purple-500 bg-purple-500/10" },
  TESTING: { label: "Testing", color: "text-amber-500 bg-amber-500/10" },
  DONE: { label: "Done", color: "text-emerald-500 bg-emerald-500/10" },
};

function TaskRow({ task }: { task: AgileTask }) {
  const epic = mockEpics.find(e => e.id === task.epicId);
  const prioConf = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.LOW;

  return (
    <TableRow className="group cursor-pointer">
      <TableCell className="w-[120px] font-mono text-xs text-[var(--foreground-secondary)] group-hover:text-[var(--color-primary)] transition-colors">
        {task.key}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {task.type === 'BUG' ? (
            <AlertCircle className="w-4 h-4 text-red-500" />
          ) : task.type === 'STORY' ? (
            <Bookmark className="w-4 h-4 text-emerald-500" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          )}
          <span className="font-semibold text-xs text-[var(--foreground)]">{task.title}</span>
        </div>
      </TableCell>
      <TableCell>
        {epic && (
          <Badge variant="outline" className={cn("text-[9px] h-5 border-none text-white whitespace-nowrap", epic.color)}>
            {epic.name}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold", statusConfig[task.status].color)}>
          {statusConfig[task.status].label}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <div className={cn("w-1.5 h-1.5 rounded-full", prioConf.dot)} />
          <span className="text-[10px] font-semibold text-[var(--foreground-secondary)]">{prioConf.label}</span>
        </div>
      </TableCell>
      <TableCell className="text-center">
        {task.storyPoints ? (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--background-secondary)] text-[10px] font-bold text-[var(--foreground)]">
            {task.storyPoints}
          </span>
        ) : (
          <span className="text-[var(--foreground-muted)] text-[10px]">-</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {task.assignee ? (
          <div className="flex justify-end">
            <Avatar className="w-6 h-6 animate-fade-in" title={task.assignee.name}>
              <AvatarImage src={task.assignee.avatar} />
              <AvatarFallback className="text-[9px] font-bold bg-blue-100 text-blue-700">{task.assignee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <span className="text-[10px] text-[var(--foreground-muted)]">Unassigned</span>
        )}
      </TableCell>
      <TableCell className="w-[50px]">
        <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

// ── Skeletons ──────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <div className="space-y-2 animate-pulse p-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-9 bg-[var(--background-secondary)] rounded-md w-full" />
      ))}
    </div>
  );
}

// ── Error View ─────────────────────────────────────────────────────
function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="p-8 text-center border border-[var(--border)] rounded-xl bg-[var(--card-bg)] flex flex-col items-center justify-center max-w-md mx-auto my-12 shadow-sm">
      <AlertTriangle className="w-12 h-12 text-[var(--color-danger)] mb-4 animate-bounce" />
      <h3 className="text-lg font-bold text-[var(--foreground)]">Query Error</h3>
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
    <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-xl bg-[var(--card-bg)] flex flex-col items-center justify-center">
      <AlertCircle className="w-10 h-10 text-[var(--foreground-muted)] mb-3" />
      <h4 className="text-sm font-bold text-[var(--foreground)]">No Stories Found</h4>
      <p className="text-xs text-[var(--foreground-secondary)] mt-1.5 max-w-sm mb-4">
        No active stories match the selected sprint filters or search criteria.
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={onAction}><Plus className="w-3.5 h-3.5 mr-1" /> Create Issue</Button>
        <Button size="sm" onClick={onSecondaryAction} variant="outline">Clear Filters</Button>
      </div>
    </div>
  );
}

export default function BacklogPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sprintExpanded, setSprintExpanded] = useState(true);
  const [backlogExpanded, setBacklogExpanded] = useState(true);

  // Pagination state
  const [backlogPage, setBacklogPage] = useState(1);
  const [sprintPage, setSprintPage] = useState(1);

  const loadData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (Math.random() < 0.05) {
        setError("Failed to fetch backlog tasks from user-service service layer.");
      }
      setLoading(false);
    }, 450);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const fieldsConfig: FilterFieldConfig[] = [
    { key: "status", label: "Status", type: "select", options: [
      { value: "all", label: "All Statuses" },
      { value: "BACKLOG", label: "Backlog" },
      { value: "TODO", label: "To Do" },
      { value: "IN_PROGRESS", label: "In Progress" },
      { value: "REVIEW", label: "Review" },
      { value: "TESTING", label: "Testing" },
      { value: "DONE", label: "Done" },
    ]},
    { key: "priority", label: "Priority", type: "select", options: [
      { value: "all", label: "All Priorities" },
      { value: "CRITICAL", label: "Critical" },
      { value: "HIGH", label: "High" },
      { value: "MEDIUM", label: "Medium" },
      { value: "LOW", label: "Low" },
    ]},
    { key: "epicId", label: "Epic", type: "select", options: [
      { value: "all", label: "All Epics" },
      ...mockEpics.map(epic => ({ value: epic.id, label: epic.name }))
    ]},
    { key: "assignee.name", label: "Assignee", type: "select", options: [
      { value: "all", label: "All Assignees" },
      { value: "Vijay S.", label: "Vijay S." },
      { value: "Priya K.", label: "Priya K." },
      { value: "Arjun M.", label: "Arjun M." },
      { value: "Sneha P.", label: "Sneha P." },
    ]}
  ];

  const {
    state,
    filteredData,
    setSearch,
    setFilter,
    removeFilter,
    clearAll,
    setSort,
    saveView,
    applyView,
  } = useEnterpriseFilter({
    moduleId: "agile-backlog",
    defaultState: {
      search: "",
      filters: {},
      sort: null,
      visibleColumns: {},
      currentPage: 1,
      itemsPerPage: 1000,
    },
    data: mockTasks,
    searchFields: ["title", "key", "description"],
  });

  const sprintTasks = useMemo(() => 
    filteredData.filter(t => t.sprintId === mockActiveSprint.id),
    [filteredData]
  );
  const backlogTasks = useMemo(() => 
    filteredData.filter(t => !t.sprintId || t.status === 'BACKLOG'),
    [filteredData]
  );

  // Reset pages on filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setBacklogPage(1);
      setSprintPage(1);
    }, 0);
    return () => clearTimeout(timer);
  }, [state.search, state.filters]);

  const itemsPerPage = 10;
  
  const paginatedSprintTasks = sprintTasks.slice(
    (sprintPage - 1) * itemsPerPage,
    sprintPage * itemsPerPage
  );

  const paginatedBacklogTasks = backlogTasks.slice(
    (backlogPage - 1) * itemsPerPage,
    backlogPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-12 w-48 bg-[var(--background-secondary)] rounded animate-pulse" />
        <Card className="p-4"><TableSkeleton /></Card>
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
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Backlog</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Plan sprints and prioritize the product backlog.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => alert("Creating issues is supported in Sprint Planning dashboard.")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Issue
          </Button>
        </div>
      </div>

      {/* Enterprise Filter Bar */}
      <EnterpriseFilterBar
        moduleId="agile-backlog"
        fieldsConfig={fieldsConfig}
        state={state}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onRemoveFilter={removeFilter}
        onClearAll={clearAll}
        onApplyView={applyView}
        onSaveView={saveView}
        sortOptions={[
          { value: "key", label: "Issue Key" },
          { value: "title", label: "Summary" },
        ]}
        onSortSelect={setSort}
        filteredData={filteredData}
      >
        <FilterDropdown
          label="Status"
          value={getSelectFilterValue(state.filters.status)}
          options={fieldsConfig[0].options || []}
          onChange={(val) => setFilter("status", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Priority"
          value={getSelectFilterValue(state.filters.priority)}
          options={fieldsConfig[1].options || []}
          onChange={(val) => setFilter("priority", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Epic"
          value={getSelectFilterValue(state.filters.epicId)}
          options={fieldsConfig[2].options || []}
          onChange={(val) => setFilter("epicId", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Assignee"
          value={getSelectFilterValue(state.filters["assignee.name"])}
          options={fieldsConfig[3].options || []}
          onChange={(val) => setFilter("assignee.name", { type: "select", value: val })}
        />
      </EnterpriseFilterBar>

      <div className="space-y-6">
        {/* Active Sprint Section */}
        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden shadow-xs flex flex-col h-full justify-between">
          <div 
            className="flex items-center justify-between p-4 bg-[var(--background-secondary)] cursor-pointer select-none"
            onClick={() => setSprintExpanded(!sprintExpanded)}
          >
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon-sm" className="h-6 w-6">
                {sprintExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
              <h2 className="text-lg font-bold text-[var(--foreground)]">{mockActiveSprint.name}</h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 font-semibold text-[10px]">
                Active Sprint
              </Badge>
              <span className="text-xs text-[var(--foreground-muted)] ml-2 font-medium">
                {sprintTasks.length} issues
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--foreground-muted)] font-medium">
                {new Date(mockActiveSprint.startDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(mockActiveSprint.endDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); alert("Completing sprint..."); }}>Complete Sprint</Button>
            </div>
          </div>

          {sprintExpanded && (
            <div className="flex flex-col h-full justify-between">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Epic</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-center">Points</TableHead>
                    <TableHead className="text-right">Assignee</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSprintTasks.map(task => <TaskRow key={task.id} task={task} />)}
                  {sprintTasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <EmptyState onAction={() => {}} onSecondaryAction={clearAll} />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {sprintTasks.length > itemsPerPage && (
                <Pagination
                  currentPage={sprintPage}
                  totalItems={sprintTasks.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setSprintPage}
                  itemName="stories"
                />
              )}
            </div>
          )}
        </div>

        {/* Backlog Section */}
        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden shadow-xs flex flex-col h-full justify-between">
          <div 
            className="flex items-center justify-between p-4 bg-[var(--background-secondary)] cursor-pointer select-none"
            onClick={() => setBacklogExpanded(!backlogExpanded)}
          >
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon-sm" className="h-6 w-6">
                {backlogExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
              <h2 className="text-lg font-bold text-[var(--foreground)]">Backlog</h2>
              <span className="text-xs text-[var(--foreground-muted)] ml-2 font-medium">
                {backlogTasks.length} issues
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); alert("Creating sprint..."); }}>Create Sprint</Button>
          </div>

          {backlogExpanded && (
            <div className="flex flex-col h-full justify-between">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Epic</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-center">Points</TableHead>
                    <TableHead className="text-right">Assignee</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBacklogTasks.map(task => <TaskRow key={task.id} task={task} />)}
                  {backlogTasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <EmptyState onAction={() => {}} onSecondaryAction={clearAll} />
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={8} className="p-0">
                      <Button variant="ghost" className="w-full rounded-none justify-start h-11 text-[var(--foreground-muted)] hover:text-[var(--foreground)] text-xs" onClick={() => alert("Creating backlog issue...")}>
                        <Plus className="w-3.5 h-3.5 mr-2" />
                        Create issue
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {backlogTasks.length > itemsPerPage && (
                <Pagination
                  currentPage={backlogPage}
                  totalItems={backlogTasks.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setBacklogPage}
                  itemName="stories"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
