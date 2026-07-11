"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import { PRIORITY_CONFIG, TASK_STATUS_CONFIG } from "@/lib/constants";
import { useWorkspaceStore } from "@/store/workspace.store";
import {
  mockWorkspaceTasks, mockSprintSummary, mockBlockers,
  mockTimeEntries, mockPersonalGoals, mockAIInsights,
} from "@/lib/mock-data/workspace.mock";
import type { WorkspaceTask, WorkspaceTaskStatus } from "@/lib/types/workspace.types";
import {
  Search, List, LayoutGrid, GanttChart,
  Target, Play, Pause, Square, Timer, TrendingUp,
  Sparkles, MessageSquare, Paperclip, Zap,
  AlertCircle,
} from "lucide-react";
import { useEnterpriseFilter } from "@/hooks/use-enterprise-filter";
import { useFilterStore } from "@/store/filter.store";
import { EnterpriseFilterBar } from "@/components/ui/enterprise-filter-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { FilterFieldConfig } from "@/types/filter.types";

// ── Task Row ──────────────────────────────────────────────────────

function TaskRow({ task }: { task: WorkspaceTask }) {
  const priorityConf = PRIORITY_CONFIG[task.priority];
  const statusConf = TASK_STATUS_CONFIG[task.status as keyof typeof TASK_STATUS_CONFIG];

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors group cursor-pointer border-b border-[var(--border)] last:border-b-0">
      {/* Priority dot */}
      <div className={cn("w-2 h-2 rounded-full shrink-0", priorityConf.dot)} />

      {/* Key */}
      <span className="text-xs font-mono text-[var(--foreground-muted)] w-[72px] shrink-0">{task.key}</span>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--foreground)] truncate group-hover:text-[var(--color-primary)] transition-colors">{task.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-[var(--foreground-muted)]">{task.projectName}</span>
          {task.epicName && (
            <>
              <span className="text-[10px] text-[var(--foreground-muted)]">·</span>
              <span className="text-[10px] text-[var(--foreground-muted)]">{task.epicName}</span>
            </>
          )}
        </div>
      </div>

      {/* Labels */}
      <div className="hidden lg:flex items-center gap-1.5 shrink-0">
        {task.labels.slice(0, 2).map((label) => (
          <Badge key={label} variant="secondary" className="text-[9px] h-4 px-1.5">{label}</Badge>
        ))}
      </div>

      {/* Meta icons */}
      <div className="hidden sm:flex items-center gap-3 text-[var(--foreground-muted)] shrink-0">
        {task.commentCount > 0 && (
          <span className="flex items-center gap-0.5 text-[10px]">
            <MessageSquare className="w-3 h-3" />{task.commentCount}
          </span>
        )}
        {task.attachmentCount > 0 && (
          <span className="flex items-center gap-0.5 text-[10px]">
            <Paperclip className="w-3 h-3" />{task.attachmentCount}
          </span>
        )}
        {task.storyPoints && (
          <Badge variant="secondary" className="text-[9px] h-4 px-1.5">
            <Zap className="w-2.5 h-2.5 mr-0.5" />{task.storyPoints}
          </Badge>
        )}
      </div>

      {/* Status */}
      <Badge variant="secondary" className={cn("text-[10px] shrink-0", statusConf?.color)}>
        {statusConf?.label || task.status}
      </Badge>

      {/* Due */}
      {task.dueDate && (
        <span className="text-[10px] text-[var(--foreground-muted)] w-14 text-right shrink-0 hidden md:block">
          {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      )}
    </div>
  );
}

// ── Kanban Column ─────────────────────────────────────────────────

function KanbanColumn({ status, tasks }: { status: WorkspaceTaskStatus; tasks: WorkspaceTask[] }) {
  const conf = TASK_STATUS_CONFIG[status as keyof typeof TASK_STATUS_CONFIG];
  return (
    <div className="min-w-[280px] flex-1">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={cn("text-xs font-semibold", conf?.color?.split(" ")[0])}>{conf?.label || status}</span>
        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{tasks.length}</Badge>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => {
          const priorityConf = PRIORITY_CONFIG[task.priority];
          return (
            <div key={task.id} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--border-hover)] transition-colors cursor-pointer">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-mono text-[var(--foreground-muted)]">{task.key}</span>
                <Badge variant="secondary" className={cn("text-[9px] h-4", priorityConf.color)}>{priorityConf.label}</Badge>
              </div>
              <p className="text-sm text-[var(--foreground)] line-clamp-2">{task.title}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-[var(--foreground-muted)]">{task.projectName}</span>
                <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                  {task.storyPoints && (
                    <span className="text-[10px] flex items-center gap-0.5"><Zap className="w-2.5 h-2.5" />{task.storyPoints}</span>
                  )}
                  {task.commentCount > 0 && (
                    <span className="text-[10px] flex items-center gap-0.5"><MessageSquare className="w-2.5 h-2.5" />{task.commentCount}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Time Tracker Widget ───────────────────────────────────────────

function TimeTrackerWidget() {
  const { timerState, timerTaskTitle, timerStartedAt, timerElapsed, startTimer, pauseTimer, resumeTimer, stopTimer } = useWorkspaceStore();
  const [runningElapsed, setRunningElapsed] = useState(0);

  useEffect(() => {
    if (timerState !== "running") return;

    const update = () => {
      const elapsed = timerStartedAt ? Math.floor((Date.now() - timerStartedAt) / 1000) : 0;
      setRunningElapsed(elapsed);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timerState, timerStartedAt]);

  const displayTime = timerState === "running" ? timerElapsed + runningElapsed : timerElapsed;

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Timer className="w-4 h-4 text-[var(--foreground-muted)]" />
          Time Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className={cn("text-3xl font-mono font-bold", timerState === "running" ? "text-[var(--color-primary)]" : "text-[var(--foreground)]")}>
            {formatTime(displayTime)}
          </p>
          {timerTaskTitle && (
            <p className="text-xs text-[var(--foreground-muted)] mt-1 truncate">{timerTaskTitle}</p>
          )}
          <div className="flex items-center justify-center gap-2 mt-4">
            {timerState === "idle" && (
              <Button size="sm" onClick={() => startTimer("wt-1", "JWT refresh token rotation")}>
                <Play className="w-3.5 h-3.5 mr-1" />Start
              </Button>
            )}
            {timerState === "running" && (
              <>
                <Button variant="outline" size="sm" onClick={pauseTimer}>
                  <Pause className="w-3.5 h-3.5 mr-1" />Pause
                </Button>
                <Button variant="destructive" size="sm" onClick={stopTimer}>
                  <Square className="w-3.5 h-3.5 mr-1" />Stop
                </Button>
              </>
            )}
            {timerState === "paused" && (
              <>
                <Button size="sm" onClick={resumeTimer}>
                  <Play className="w-3.5 h-3.5 mr-1" />Resume
                </Button>
                <Button variant="destructive" size="sm" onClick={stopTimer}>
                  <Square className="w-3.5 h-3.5 mr-1" />Stop
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Today's log */}
        <Separator className="my-4" />
        <p className="text-xs font-semibold text-[var(--foreground)] mb-2">Today&apos;s Log</p>
        <div className="space-y-2">
          {mockTimeEntries.filter(e => e.date === '2026-07-03').map((entry) => (
            <div key={entry.id} className="flex items-center justify-between text-xs">
              <div className="min-w-0 flex-1">
                <p className="text-[var(--foreground)] truncate">{entry.taskTitle}</p>
                <p className="text-[10px] text-[var(--foreground-muted)]">{entry.startTime} — {entry.endTime}</p>
              </div>
              <span className="text-[var(--foreground-secondary)] font-medium shrink-0 ml-2">
                {Math.floor(entry.duration / 60)}h {entry.duration % 60}m
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────

export default function MyWorkPage() {
  const { myWorkView, setMyWorkView } = useWorkspaceStore();

  const fieldsConfig: FilterFieldConfig[] = [
    { key: "status", label: "Status", type: "select", options: [
      { value: "all", label: "All Statuses" },
      { value: "BACKLOG", label: "Backlog" },
      { value: "TODO", label: "To Do" },
      { value: "IN_PROGRESS", label: "In Progress" },
      { value: "REVIEW", label: "Review" },
      { value: "TESTING", label: "Testing" },
      { value: "DONE", label: "Completed" },
    ]},
    { key: "priority", label: "Priority", type: "select", options: [
      { value: "all", label: "All Priorities" },
      { value: "CRITICAL", label: "Critical" },
      { value: "HIGH", label: "High" },
      { value: "MEDIUM", label: "Medium" },
      { value: "LOW", label: "Low" },
    ]}
  ];

  const {
    state,
    filteredData: filteredTasks,
    setSearch,
    setFilter,
    removeFilter,
    clearAll,
    setSort,
    saveView,
    applyView,
  } = useEnterpriseFilter({
    moduleId: "my-work",
    defaultState: {
      search: "",
      filters: {},
      sort: null,
      visibleColumns: {},
      currentPage: 1,
      itemsPerPage: 100,
    },
    data: mockWorkspaceTasks,
    searchFields: ["title", "key", "projectName", "epicName"],
  });

  const statusFilter = (state.filters.status as any)?.value || "all";
  const setStatusFilter = (val: string) => {
    if (val === "all") removeFilter("status");
    else setFilter("status", { type: "select", value: val });
  };

  const kanbanStatuses: WorkspaceTaskStatus[] = ["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "TESTING", "DONE"];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">My Work</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Everything assigned to you across all projects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
            {([
              { key: "list" as const, icon: List, label: "List" },
              { key: "kanban" as const, icon: LayoutGrid, label: "Kanban" },
              { key: "timeline" as const, icon: GanttChart, label: "Timeline" },
            ]).map((v) => (
              <button
                key={v.key}
                onClick={() => setMyWorkView(v.key)}
                className={cn(
                  "p-1.5 transition-colors cursor-pointer",
                  myWorkView === v.key
                    ? "bg-[var(--background-secondary)] text-[var(--foreground)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                )}
                aria-label={v.label}
              >
                <v.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise Filter Bar */}
      <EnterpriseFilterBar
        moduleId="my-work"
        fieldsConfig={fieldsConfig}
        state={state}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onRemoveFilter={removeFilter}
        onClearAll={clearAll}
        onApplyView={applyView}
        onSaveView={saveView}
        sortOptions={[
          { value: "key", label: "Task ID" },
          { value: "title", label: "Alphabetical" },
          { value: "priority", label: "Priority" },
          { value: "dueDate", label: "Due Date" },
        ]}
        onSortSelect={setSort}
        filteredData={filteredTasks}
      >
        <FilterDropdown
          label="Status"
          value={(state.filters.status as any)?.value || "all"}
          options={fieldsConfig[0].options || []}
          onChange={(val) => setFilter("status", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Priority"
          value={(state.filters.priority as any)?.value || "all"}
          options={fieldsConfig[1].options || []}
          onChange={(val) => setFilter("priority", { type: "select", value: val })}
        />
      </EnterpriseFilterBar>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        {/* Main content */}
        <div className="space-y-6">
          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: "all", label: "All", count: mockWorkspaceTasks.length },
              { key: "IN_PROGRESS", label: "In Progress", count: mockWorkspaceTasks.filter(t => t.status === "IN_PROGRESS").length },
              { key: "TODO", label: "To Do", count: mockWorkspaceTasks.filter(t => t.status === "TODO").length },
              { key: "REVIEW", label: "In Review", count: mockWorkspaceTasks.filter(t => t.status === "REVIEW").length },
              { key: "DONE", label: "Done", count: mockWorkspaceTasks.filter(t => t.status === "DONE").length },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                  statusFilter === f.key
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                )}
              >
                {f.label} <span className="ml-1 opacity-70">{f.count}</span>
              </button>
            ))}
          </div>

          {/* Task views */}
          {myWorkView === "list" && (
            <Card>
              <CardContent className="p-0">
                {/* Header row */}
                <div className="flex items-center gap-3 px-3 py-2 border-b border-[var(--border)] text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                  <span className="w-2" />
                  <span className="w-[72px]">Key</span>
                  <span className="flex-1">Title</span>
                  <span className="hidden lg:block w-24">Labels</span>
                  <span className="hidden sm:block w-20">Meta</span>
                  <span className="w-20">Status</span>
                  <span className="hidden md:block w-14 text-right">Due</span>
                </div>
                <div>
                  {filteredTasks.map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                  {filteredTasks.length === 0 && (
                    <div className="py-12 text-center text-sm text-[var(--foreground-muted)]">
                      No tasks found matching your filters.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {myWorkView === "kanban" && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {kanbanStatuses.map((status) => (
                <KanbanColumn key={status} status={status} tasks={filteredTasks.filter(t => t.status === status)} />
              ))}
            </div>
          )}

          {myWorkView === "timeline" && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {filteredTasks
                    .filter(t => t.dueDate)
                    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                    .map((task) => {
                      const priorityConf = PRIORITY_CONFIG[task.priority];
                      const statusConf = TASK_STATUS_CONFIG[task.status as keyof typeof TASK_STATUS_CONFIG];
                      return (
                        <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                          <div className="text-center w-14 shrink-0">
                            <p className="text-lg font-bold text-[var(--foreground)]">
                              {new Date(task.dueDate!).getDate()}
                            </p>
                            <p className="text-[10px] text-[var(--foreground-muted)]">
                              {new Date(task.dueDate!).toLocaleDateString("en-US", { month: "short" })}
                            </p>
                          </div>
                          <div className={cn("w-1 h-10 rounded-full shrink-0", priorityConf.dot)} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--foreground)] truncate">{task.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-[var(--foreground-muted)]">{task.key}</span>
                              <span className="text-[10px] text-[var(--foreground-muted)]">·</span>
                              <span className="text-[10px] text-[var(--foreground-muted)]">{task.projectName}</span>
                            </div>
                          </div>
                          <Badge variant="secondary" className={cn("text-[10px] shrink-0", statusConf?.color)}>
                            {statusConf?.label || task.status}
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Blockers */}
          {mockBlockers.length > 0 && (
            <Card className="border-red-200 dark:border-red-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  Blockers ({mockBlockers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockBlockers.map((blocker) => (
                    <div key={blocker.id} className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--foreground)]">{blocker.taskTitle}</p>
                          <p className="text-xs text-[var(--foreground-secondary)] mt-1">{blocker.reason}</p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--foreground-muted)]">
                            <span>Owner: <span className="font-medium text-[var(--foreground-secondary)]">{blocker.owner}</span></span>
                            {blocker.eta && <span>ETA: {new Date(blocker.eta).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
                            <Badge variant="secondary" className={cn("text-[9px] h-4", blocker.severity === 'critical' ? 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900' : 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900')}>
                              {blocker.severity}
                            </Badge>
                          </div>
                          {blocker.dependencies.length > 0 && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <span className="text-[10px] text-[var(--foreground-muted)]">Deps:</span>
                              {blocker.dependencies.map((d) => (
                                <Badge key={d} variant="secondary" className="text-[9px] h-4 px-1.5">{d}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6 xl:sticky xl:top-[76px] h-fit">
          {/* Current Sprint */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--color-primary)]" />
                Current Sprint
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{mockSprintSummary.name}</p>
                {mockSprintSummary.goal && (
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">{mockSprintSummary.goal}</p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[var(--foreground-secondary)]">Progress</span>
                  <span className="font-medium text-[var(--foreground)]">{mockSprintSummary.progress}%</span>
                </div>
                <Progress value={mockSprintSummary.progress} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-[var(--foreground)]">{mockSprintSummary.velocity || 42}</p>
                  <p className="text-[10px] text-[var(--foreground-muted)]">Velocity</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--foreground)]">{mockSprintSummary.capacity || 55}</p>
                  <p className="text-[10px] text-[var(--foreground-muted)]">Capacity</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-500">{mockSprintSummary.totalTasks - mockSprintSummary.completedTasks}</p>
                  <p className="text-[10px] text-[var(--foreground-muted)]">Remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Tracker */}
          <TimeTrackerWidget />

          {/* Personal Goals */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--foreground-muted)]" />
                Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPersonalGoals.slice(0, 4).map((goal) => {
                  const pct = Math.round((goal.progress / goal.target) * 100);
                  return (
                    <div key={goal.id}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-[var(--foreground)] truncate flex-1">{goal.title}</p>
                        <span className="text-[10px] text-[var(--foreground-muted)] shrink-0 ml-2">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1.5" indicatorClassName={
                        goal.status === "completed" ? "bg-emerald-500" :
                        goal.status === "at-risk" ? "bg-amber-500" :
                        goal.status === "overdue" ? "bg-red-500" : undefined
                      } />
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="secondary" className="text-[9px] h-4 px-1.5 capitalize">{goal.period}</Badge>
                        <span className="text-[10px] text-[var(--foreground-muted)]">
                          {goal.progress}/{goal.target} {goal.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockAIInsights.filter(i => i.type === 'suggestion' || i.type === 'warning').slice(0, 3).map((insight) => (
                  <div key={insight.id} className="p-2.5 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)]">
                    <p className="text-xs text-[var(--foreground)]">{insight.title}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5 leading-relaxed">{insight.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
