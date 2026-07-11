// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Projects Page
// Refined with Health Details Drawer (Timeline, Members, Risks, Releases, Dependencies)
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  FolderKanban, Plus, Search, Filter, MoreHorizontal, 
  Users, CheckCircle2, AlertTriangle, XCircle, Clock,
  AlertCircle, RefreshCcw, Activity, ShieldAlert, ChevronRight, X,
  Calendar, Shield, Cpu, Tag, GitPullRequest, Info, CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";
import { mockProjects } from "@/lib/mock-data/projects.mock";
import { Pagination } from "@/components/ui/pagination";
import type { ProjectStatus, ProjectHealth } from "@/lib/types/projects.types";
import { useEnterpriseFilter } from "@/hooks/use-enterprise-filter";
import { useFilterStore } from "@/store/filter.store";
import { EnterpriseFilterBar } from "@/components/ui/enterprise-filter-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { FilterFieldConfig } from "@/types/filter.types";
import { toast } from "sonner";

const statusConfig: Record<ProjectStatus, { label: string; icon: any; color: string }> = {
  ACTIVE: { label: "Active", icon: Clock, color: "text-blue-500 bg-blue-500/10" },
  COMPLETED: { label: "Completed", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" },
  ON_HOLD: { label: "On Hold", icon: AlertTriangle, color: "text-amber-500 bg-amber-500/10" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "text-red-500 bg-red-500/10" },
  PLANNING: { label: "Planning", icon: FolderKanban, color: "text-purple-500 bg-purple-500/10" },
};

const healthConfig: Record<ProjectHealth, { label: string; color: string; bg: string }> = {
  ON_TRACK: { label: "On Track", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-505" },
  AT_RISK: { label: "At Risk", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-550" },
  BEHIND: { label: "Behind", color: "text-red-600 dark:text-red-400", bg: "bg-red-500" },
};

// ── Skeletons ──────────────────────────────────────────────────────
function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border)] h-[260px] p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-[var(--background-secondary)] rounded w-1/4" />
            <div className="h-4 bg-[var(--background-secondary)] rounded w-1/6" />
          </div>
          <div className="h-6 bg-[var(--background-secondary)] rounded w-2/3" />
          <div className="h-10 bg-[var(--background-secondary)] rounded w-full" />
          <div className="h-2 bg-[var(--background-secondary)] rounded w-full mt-auto" />
        </div>
      ))}
    </div>
  );
}

// ── Error View ─────────────────────────────────────────────────────
function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="p-8 text-center border border-[var(--border)] rounded-xl bg-[var(--card-bg)] flex flex-col items-center justify-center max-w-md mx-auto my-12 shadow-sm">
      <ShieldAlert className="w-12 h-12 text-[var(--color-danger)] mb-4 animate-bounce" />
      <h3 className="text-lg font-bold text-[var(--foreground)]">Data Fetch Error</h3>
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
      <FolderKanban className="w-12 h-12 text-[var(--foreground-muted)] mb-4" />
      <h3 className="text-lg font-bold text-[var(--foreground)]">No Projects Found</h3>
      <p className="text-sm text-[var(--foreground-secondary)] mt-2 max-w-sm mb-6">
        No active projects match your query parameters. Try modifying filters or create a project thread.
      </p>
      <div className="flex gap-2">
        <Button onClick={onAction}><Plus className="w-4 h-4 mr-2" /> Create New Project</Button>
        <Button onClick={onSecondaryAction} variant="outline">Clear All Filters</Button>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    loadData();
  }, []);

  const fieldsConfig: FilterFieldConfig[] = [
    { key: "status", label: "Status", type: "select", options: [
      { value: "all", label: "All Statuses" },
      { value: "ACTIVE", label: "Active" },
      { value: "PLANNING", label: "Planning" },
      { value: "ON_HOLD", label: "On Hold" },
      { value: "COMPLETED", label: "Completed" },
    ]},
    { key: "health", label: "Health", type: "select", options: [
      { value: "all", label: "All Healths" },
      { value: "ON_TRACK", label: "On Track" },
      { value: "AT_RISK", label: "At Risk" },
      { value: "BEHIND", label: "Behind" },
    ]},
    { key: "lead.name", label: "Project Manager", type: "select", options: [
      { value: "all", label: "All PMs" },
      { value: "Vijay S.", label: "Vijay S." },
      { value: "Priya K.", label: "Priya K." },
      { value: "Arjun M.", label: "Arjun M." },
      { value: "Deepak S.", label: "Deepak S." },
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
    moduleId: "projects",
    defaultState: {
      search: "",
      filters: {},
      sort: null,
      visibleColumns: {},
      currentPage: 1,
      itemsPerPage: 6,
    },
    data: mockProjects,
    searchFields: ["name", "key"],
  });

  const selectedProject = useMemo(() => {
    return mockProjects.find(p => p.id === selectedProjectId) || null;
  }, [selectedProjectId]);

  const handlePageChange = (page: number) => {
    useFilterStore.getState().updateState("projects", { currentPage: page });
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-12 w-48 bg-[var(--background-secondary)] rounded animate-pulse" />
        <ProjectsSkeleton />
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
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Projects</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Manage and track all organizational projects and initiatives.
          </p>
        </div>
        <Button onClick={() => toast.info("New project allocation requires Super Admin console authorization.")}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Enterprise Filter Bar */}
      <EnterpriseFilterBar
        moduleId="projects"
        fieldsConfig={fieldsConfig}
        state={state}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onRemoveFilter={removeFilter}
        onClearAll={clearAll}
        onApplyView={applyView}
        onSaveView={saveView}
        sortOptions={[
          { value: "key", label: "Project Key" },
          { value: "name", label: "Project Name" },
          { value: "health", label: "Health Status" },
        ]}
        onSortSelect={setSort}
        filteredData={filteredData}
      >
        <FilterDropdown
          label="Status"
          value={(state.filters.status as any)?.value || "all"}
          options={fieldsConfig[0].options || []}
          onChange={(val) => setFilter("status", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Health"
          value={(state.filters.health as any)?.value || "all"}
          options={fieldsConfig[1].options || []}
          onChange={(val) => setFilter("health", { type: "select", value: val })}
        />
        <FilterDropdown
          label="PM"
          value={(state.filters["lead.name"] as any)?.value || "all"}
          options={fieldsConfig[2].options || []}
          onChange={(val) => setFilter("lead.name", { type: "select", value: val })}
        />
      </EnterpriseFilterBar>

      {/* Projects Grid */}
      {paginatedData.length === 0 ? (
        <EmptyState onAction={() => {}} onSecondaryAction={clearAll} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedData.map((project) => {
            const StatusIcon = statusConfig[project.status].icon;
            const health = healthConfig[project.health];
            
            return (
              <div 
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className="group flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-xs hover:shadow-md hover:border-[var(--color-primary)] transition-all overflow-hidden cursor-pointer"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-[var(--border)] flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--background-secondary)] text-[var(--foreground-secondary)]">
                          {project.key}
                        </span>
                        <div className={cn("flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full", statusConfig[project.status].color)}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[project.status].label}
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-[var(--foreground)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                        {project.name}
                      </h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      className="shrink-0 -mr-2 -mt-2"
                      onClick={(e) => { e.stopPropagation(); toast.info(`Options triggered for ${project.key}`); }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-[var(--foreground-secondary)] mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-[10px] font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-center space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--foreground)]">Progress</span>
                      <span className="font-semibold text-[var(--foreground)]">{project.progress}%</span>
                    </div>
                    <Progress 
                      value={project.progress} 
                      className="h-1.5 bg-[var(--background-tertiary)]" 
                      indicatorClassName={health.bg}
                    />
                    <div className="flex items-center justify-between text-[10px] mt-1">
                      <span className={health.color}>{health.label}</span>
                      <span className="text-[var(--foreground-muted)]">
                        {project.stats.completedTasks} / {project.stats.totalTasks} tasks
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-[var(--background-secondary)] border-t border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <Avatar className="w-7 h-7 border-2 border-[var(--background-secondary)] z-10">
                        <AvatarImage src={project.lead.avatar} />
                        <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700 font-bold">{project.lead.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {project.team.slice(0, 2).map((member, i) => (
                        <Avatar key={member.userId} className={cn("w-7 h-7 border-2 border-[var(--background-secondary)] -ml-2", `z-[${9-i}]`)}>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-[10px] bg-gray-200 text-gray-700 font-bold">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      ))}
                      {project.team.length > 2 && (
                        <div className="w-7 h-7 rounded-full bg-[var(--background)] border-2 border-[var(--background-secondary)] flex items-center justify-center text-[10px] font-semibold text-[var(--foreground-muted)] -ml-2 z-0">
                          +{project.team.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)] font-medium">
                    Due {new Date(project.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {paginatedData.length > 0 && (
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl py-1 px-4 mt-6">
          <Pagination
            currentPage={state.currentPage}
            totalItems={totalItems}
            itemsPerPage={state.itemsPerPage}
            onPageChange={handlePageChange}
            itemName="projects"
          />
        </div>
      )}

      {/* Project Details Drawer (Sheet) */}
      <Sheet open={selectedProjectId !== null} onOpenChange={(open) => { if (!open) setSelectedProjectId(null); }}>
        <SheetContent className="sm:max-w-[620px] p-0 flex flex-col h-full bg-[var(--card-bg)] border-l border-[var(--border)] shadow-2xl">
          {selectedProject && (
            <>
              {/* Drawer Header */}
              <div className="p-6 border-b border-[var(--border)] bg-[var(--background-secondary)]/50 flex items-start justify-between shrink-0">
                <div className="space-y-1.5 pr-8">
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-[9px] border-none font-semibold uppercase", statusConfig[selectedProject.status].color)}>
                      {selectedProject.status}
                    </Badge>
                    <Badge variant="outline" className={cn("text-[9px] font-semibold bg-blue-50 border-none text-blue-700")}>
                      {selectedProject.key}
                    </Badge>
                  </div>
                  <SheetTitle className="text-xl font-bold text-[var(--foreground)] mt-2">
                    {selectedProject.name}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-[var(--foreground-secondary)] leading-relaxed mt-1">
                    {selectedProject.description}
                  </SheetDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  onClick={() => setSelectedProjectId(null)}
                  className="rounded-full text-[var(--foreground-muted)] hover:text-[var(--foreground)] shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Drawer Details (Tabs) */}
              <Tabs defaultValue="health" className="flex-1 flex flex-col min-h-0">
                <div className="px-6 border-b border-[var(--border)] bg-[var(--background-secondary)]/30 shrink-0">
                  <TabsList className="flex gap-2 justify-start h-11 bg-transparent p-0 border-b-0">
                    <TabsTrigger value="health" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Health</TabsTrigger>
                    <TabsTrigger value="timeline" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Timeline</TabsTrigger>
                    <TabsTrigger value="members" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Members</TabsTrigger>
                    <TabsTrigger value="risks" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Risks & Deps</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 text-xs">
                  {/* HEALTH TAB */}
                  <TabsContent value="health" className="space-y-5 m-0 focus:outline-none">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-[var(--background-secondary)]/50 border border-[var(--border)]">
                        <p className="text-[10px] text-[var(--foreground-muted)] uppercase font-semibold">Project Health</p>
                        <p className={cn("text-base font-bold mt-1.5", healthConfig[selectedProject.health].color)}>
                          {healthConfig[selectedProject.health].label}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--background-secondary)]/50 border border-[var(--border)]">
                        <p className="text-[10px] text-[var(--foreground-muted)] uppercase font-semibold">Tasks Completed</p>
                        <p className="text-base font-bold mt-1.5 text-[var(--foreground)]">
                          {selectedProject.stats.completedTasks} / {selectedProject.stats.totalTasks}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)]">Progress Track</h4>
                      <Progress value={selectedProject.progress} className="h-2" indicatorClassName={healthConfig[selectedProject.health].bg} />
                      <p className="text-[10px] text-[var(--foreground-muted)]">Target Delivery: {new Date(selectedProject.targetDate).toLocaleDateString()}</p>
                    </div>

                    <div className="p-4 rounded-xl border border-[var(--border)] space-y-2">
                      <h4 className="text-xs font-bold text-[var(--foreground)]">Recent Releases</h4>
                      <div className="divide-y divide-[var(--border)]">
                        <div className="py-2 flex items-center justify-between">
                          <span className="font-semibold font-mono">v1.2.0-beta</span>
                          <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700">Released</Badge>
                        </div>
                        <div className="py-2 flex items-center justify-between">
                          <span className="font-semibold font-mono">v1.1.0</span>
                          <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700">Released</Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TIMELINE TAB */}
                  <TabsContent value="timeline" className="space-y-4 m-0 focus:outline-none">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)]">Project Milestones</h4>
                    <div className="relative border-l border-[var(--border)] pl-4 ml-2 space-y-6 pt-2">
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--card-bg)] shadow-xs" />
                        <p className="text-[10px] text-[var(--foreground-muted)] font-semibold">Jan 15, 2026</p>
                        <p className="text-xs font-semibold text-[var(--foreground)] mt-0.5">Project Kickoff & Requirements Alignment</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[var(--card-bg)] shadow-xs animate-pulse" />
                        <p className="text-[10px] text-[var(--foreground-muted)] font-semibold">Mar 30, 2026 (In Progress)</p>
                        <p className="text-xs font-semibold text-[var(--foreground)] mt-0.5">Core Services API Rollout & Integration</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-[var(--card-bg)] shadow-xs" />
                        <p className="text-[10px] text-[var(--foreground-muted)] font-semibold">Aug 30, 2026 (Upcoming)</p>
                        <p className="text-xs font-semibold text-[var(--foreground)] mt-0.5">Security Audit Review & GA Release Deployment</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* MEMBERS TAB */}
                  <TabsContent value="members" className="space-y-4 m-0 focus:outline-none">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)]">Project Team</h4>
                    <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card-bg)]">
                      {/* Lead */}
                      <div className="flex items-center gap-3 p-3 hover:bg-[var(--background-secondary)]/50 transition-colors">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700 font-bold">PM</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[var(--foreground)]">{selectedProject.lead.name}</p>
                          <p className="text-[10px] text-[var(--foreground-muted)]">Project Manager</p>
                        </div>
                        <Badge variant="outline" className="text-[9px] border-none bg-blue-50 text-blue-700">Lead</Badge>
                      </div>

                      {/* Team */}
                      {selectedProject.team.map(member => (
                        <div key={member.userId} className="flex items-center gap-3 p-3 hover:bg-[var(--background-secondary)]/50 transition-colors">
                          <Avatar className="w-8 h-8 shrink-0">
                            <AvatarFallback className="text-[10px] bg-slate-100 text-slate-700 font-bold">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[var(--foreground)]">{member.name}</p>
                            <p className="text-[10px] text-[var(--foreground-muted)]">Developer</p>
                          </div>
                          <Badge variant="outline" className="text-[9px] border-none bg-slate-50 text-slate-500">Member</Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* RISKS & DEPENDENCIES TAB */}
                  <TabsContent value="risks" className="space-y-6 m-0 focus:outline-none">
                    {/* Risks Section */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)]">Identified Project Risks</h4>
                      <div className="p-3 border border-red-200 dark:border-red-900/30 rounded-xl bg-red-50/20 dark:bg-red-950/10 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-xs text-[var(--foreground)]">Staffing Shortage & Deliverables Latency</p>
                          <p className="text-[10px] text-[var(--foreground-secondary)] mt-0.5 leading-relaxed">
                            Mitigation Plan: Resource load balancing from other portal services scheduled next week.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dependencies Section */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)]">Module Dependencies</h4>
                      <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card-bg)] shadow-xs">
                        <div className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-2">
                            <Cpu className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                            <span className="font-semibold">auth-service v3.0.1</span>
                          </div>
                          <Badge variant="outline" className="text-[9px] bg-amber-50 text-amber-700">Vulnerable</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-2">
                            <Cpu className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                            <span className="font-semibold">client-portal v2.4.0</span>
                          </div>
                          <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700">Healthy</Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
