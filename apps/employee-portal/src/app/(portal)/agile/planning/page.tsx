"use client";

import { useState } from "react";
import {
  Target, ChevronDown, ChevronRight, Clock, Users,
  Zap, Plus, CalendarDays, BarChart3, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import { useEnterpriseFilter } from "@/hooks/use-enterprise-filter";
import { EnterpriseFilterBar } from "@/components/ui/enterprise-filter-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { FilterFieldConfig } from "@/types/filter.types";
import { Pagination } from "@/components/ui/pagination";
import { useFilterStore } from "@/store/filter.store";
import { useMemo } from "react";

// ── Mock Data ────────────────────────────────────────────────────────

const epics = [
  {
    id: "epic-1",
    key: "MVP-10",
    name: "Authentication System",
    description: "Complete auth flows including JWT, MFA, CSRF, and session management.",
    color: "bg-blue-500",
    colorLight: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    status: "IN_PROGRESS",
    progress: 72,
    totalPoints: 34,
    completedPoints: 24,
    totalTasks: 12,
    completedTasks: 9,
    startDate: "2026-06-01",
    endDate: "2026-07-15",
    owner: "Vijay S.",
  },
  {
    id: "epic-2",
    key: "MVP-11",
    name: "Dashboard Widget Engine",
    description: "Build reusable widget framework for customizable dashboards.",
    color: "bg-purple-500",
    colorLight: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    status: "IN_PROGRESS",
    progress: 45,
    totalPoints: 21,
    completedPoints: 10,
    totalTasks: 8,
    completedTasks: 4,
    startDate: "2026-06-15",
    endDate: "2026-08-01",
    owner: "Priya K.",
  },
  {
    id: "epic-3",
    key: "MVP-12",
    name: "Notification Hub",
    description: "Real-time notifications via WebSocket and email templating.",
    color: "bg-amber-500",
    colorLight: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    status: "COMPLETED",
    progress: 100,
    totalPoints: 18,
    completedPoints: 18,
    totalTasks: 6,
    completedTasks: 6,
    startDate: "2026-05-01",
    endDate: "2026-06-10",
    owner: "Arjun M.",
  },
  {
    id: "epic-4",
    key: "MVP-13",
    name: "Client Portal Integration",
    description: "Invoice management, support tickets, and project milestone tracking.",
    color: "bg-teal-500",
    colorLight: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    status: "PLANNING",
    progress: 10,
    totalPoints: 40,
    completedPoints: 4,
    totalTasks: 15,
    completedTasks: 1,
    startDate: "2026-07-15",
    endDate: "2026-09-01",
    owner: "Vijay S.",
  },
];

const nextSprint = {
  name: "Sprint 15",
  goal: "Complete client portal onboarding and invoice PDF generation.",
  startDate: "2026-07-07",
  endDate: "2026-07-21",
  capacity: 42,
  planned: 28,
  members: 4,
};

const unplannedItems = [
  { id: "u-1", key: "MVP-150", title: "Add password strength meter to registration", points: 2, priority: "MEDIUM" },
  { id: "u-2", key: "MVP-155", title: "Implement webhook retry with exponential backoff", points: 5, priority: "HIGH" },
  { id: "u-3", key: "MVP-158", title: "Create reusable data table component", points: 3, priority: "LOW" },
  { id: "u-4", key: "MVP-160", title: "Set up E2E test suite with Playwright", points: 8, priority: "HIGH" },
  { id: "u-5", key: "MVP-162", title: "Design system token audit and cleanup", points: 3, priority: "MEDIUM" },
];

const EPIC_STATUS = {
  PLANNING: { label: "Planning", color: "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900" },
  COMPLETED: { label: "Completed", color: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900" },
} as const;

const PRIORITY_DOT = {
  HIGH: "bg-orange-500",
  MEDIUM: "bg-yellow-500",
  LOW: "bg-blue-500",
} as const;

// ── Component ────────────────────────────────────────────────────────

export default function AgilePlanningPage() {
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set(["epic-1"]));

  const toggleEpic = (id: string) => {
    setExpandedEpics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const fieldsConfig: FilterFieldConfig[] = useMemo(() => [
    { key: "status", label: "Status", type: "select", options: [
      { value: "all", label: "All Statuses" },
      { value: "PLANNING", label: "Planning" },
      { value: "IN_PROGRESS", label: "In Progress" },
      { value: "COMPLETED", label: "Completed" },
    ]},
    { key: "owner", label: "Owner", type: "select", options: [
      { value: "all", label: "All Owners" },
      { value: "Vijay S.", label: "Vijay S." },
      { value: "Priya K.", label: "Priya K." },
      { value: "Arjun M.", label: "Arjun M." },
    ]}
  ], []);

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
    applyView
  } = useEnterpriseFilter({
    moduleId: "agile-planning-epics",
    defaultState: { search: "", filters: {}, sort: null, visibleColumns: {}, currentPage: 1, itemsPerPage: 5 },
    data: epics,
    searchFields: ["key", "name", "description", "owner"],
  });

  const handlePageChange = (page: number) => {
    useFilterStore.getState().updateState("agile-planning-epics", { currentPage: page });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Planning</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Long-term roadmap, epic tracking, and sprint capacity planning.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Epic
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        {/* Left: Epic Roadmap */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--foreground-muted)]" />
            Epic Roadmap
          </h2>

          <EnterpriseFilterBar
            moduleId="agile-planning-epics"
            fieldsConfig={fieldsConfig}
            state={state}
            onSearchChange={setSearch}
            onFilterChange={setFilter}
            onRemoveFilter={removeFilter}
            onClearAll={clearAll}
            onApplyView={applyView}
            onSaveView={saveView}
            sortOptions={[
              { value: "progress", label: "Progress" },
              { value: "startDate", label: "Start Date" },
              { value: "endDate", label: "End Date" },
            ]}
            onSortSelect={setSort}
            filteredData={filteredData}
          >
            {fieldsConfig.map((field) => (
              <FilterDropdown
                key={field.key}
                label={field.label}
                value={(state.filters[field.key] as any)?.value || "all"}
                options={field.options || []}
                onChange={(val) => setFilter(field.key, { type: "select", value: val })}
              />
            ))}
          </EnterpriseFilterBar>

          {paginatedData.map((epic: any) => {
            const expanded = expandedEpics.has(epic.id);
            const statusConf = EPIC_STATUS[epic.status as keyof typeof EPIC_STATUS];

            return (
              <Card key={epic.id} className="overflow-hidden">
                <button
                  className="w-full text-left p-4 flex items-start gap-4 hover:bg-[var(--background-secondary)] transition-colors cursor-pointer"
                  onClick={() => toggleEpic(epic.id)}
                >
                  <div className={cn("w-1.5 h-16 rounded-full shrink-0 mt-1", epic.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-[var(--foreground-muted)]">{epic.key}</span>
                      <Badge variant="secondary" className={cn("text-[10px]", statusConf.color)}>
                        {statusConf.label}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">{epic.name}</h3>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-1 line-clamp-1">{epic.description}</p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[var(--foreground-muted)]">{epic.progress}% complete</span>
                        <span className="text-xs text-[var(--foreground-muted)]">
                          {epic.completedPoints}/{epic.totalPoints} pts
                        </span>
                      </div>
                      <Progress value={epic.progress} className="h-1.5" />
                    </div>
                  </div>
                  <div className="shrink-0 mt-1">
                    {expanded ? (
                      <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                    )}
                  </div>
                </button>

                {expanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-[var(--border)] bg-[var(--background-secondary)]">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] font-semibold">Tasks</p>
                        <p className="text-lg font-bold text-[var(--foreground)]">
                          {epic.completedTasks}<span className="text-sm font-normal text-[var(--foreground-muted)]">/{epic.totalTasks}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] font-semibold">Story Points</p>
                        <p className="text-lg font-bold text-[var(--foreground)]">
                          {epic.completedPoints}<span className="text-sm font-normal text-[var(--foreground-muted)]">/{epic.totalPoints}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] font-semibold">Timeline</p>
                        <p className="text-xs font-medium text-[var(--foreground)]">
                          {new Date(epic.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(epic.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] font-semibold">Owner</p>
                        <p className="text-xs font-medium text-[var(--foreground)]">{epic.owner}</p>
                      </div>
                    </div>

                    {/* Visual Timeline Bar */}
                    <div className="relative h-8 rounded-lg bg-[var(--background)] border border-[var(--border)] overflow-hidden">
                      <div
                        className={cn("absolute top-0 left-0 h-full rounded-lg opacity-20", epic.color)}
                        style={{ width: `${epic.progress}%` }}
                      />
                      <div
                        className={cn("absolute top-0 left-0 h-full rounded-lg", epic.color)}
                        style={{ width: `${epic.progress}%`, opacity: 0.6 }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-semibold text-[var(--foreground)]">
                          {epic.progress}% — {epic.status === "COMPLETED" ? "Done!" : `${epic.totalTasks - epic.completedTasks} tasks remaining`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
          
          {paginatedData.length === 0 && (
            <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-xl text-[var(--foreground-secondary)] text-sm">
              No epics found matching the criteria.
            </div>
          )}

          <Pagination
            currentPage={state.currentPage}
            totalItems={totalItems}
            itemsPerPage={state.itemsPerPage}
            onPageChange={handlePageChange}
            itemName="epics"
          />
        </div>

        {/* Right: Sprint Planning + Unplanned */}
        <div className="space-y-6">
          {/* Next Sprint Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--color-primary)]" />
                {nextSprint.name}
              </CardTitle>
              <CardDescription>{nextSprint.goal}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-xs text-[var(--foreground-secondary)]">
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {new Date(nextSprint.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(nextSprint.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {nextSprint.members} members
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[var(--foreground-secondary)]">Capacity</span>
                  <span className="font-medium text-[var(--foreground)]">
                    {nextSprint.planned} / {nextSprint.capacity} pts
                  </span>
                </div>
                <div className="relative h-3 rounded-full bg-[var(--background-secondary)] border border-[var(--border)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                    style={{ width: `${(nextSprint.planned / nextSprint.capacity) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-[var(--foreground-muted)] mt-1">
                  {nextSprint.capacity - nextSprint.planned} points remaining capacity
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-[var(--foreground)]">{nextSprint.planned}</p>
                  <p className="text-[10px] text-[var(--foreground-muted)]">Planned</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--foreground)]">{nextSprint.capacity}</p>
                  <p className="text-[10px] text-[var(--foreground-muted)]">Capacity</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-500">{Math.round((nextSprint.planned / nextSprint.capacity) * 100)}%</p>
                  <p className="text-[10px] text-[var(--foreground-muted)]">Utilization</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unplanned Backlog */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[var(--foreground-muted)]" />
                Unplanned Items
              </CardTitle>
              <CardDescription>{unplannedItems.length} items in the backlog awaiting sprint assignment.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border)]">
                {unplannedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--background-secondary)] transition-colors">
                    <div className={cn("w-2 h-2 rounded-full shrink-0", PRIORITY_DOT[item.priority as keyof typeof PRIORITY_DOT])} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-[var(--foreground-muted)]">{item.key}</p>
                      <p className="text-sm text-[var(--foreground)] truncate">{item.title}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      <Zap className="w-3 h-3 mr-0.5" />
                      {item.points}
                    </Badge>
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
