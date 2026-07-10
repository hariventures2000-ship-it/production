"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import { PRIORITY_CONFIG } from "@/lib/constants";
import { Pagination } from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { useEnterpriseFilter } from "@/hooks/use-enterprise-filter";
import { useFilterStore } from "@/store/filter.store";
import { EnterpriseFilterBar } from "@/components/ui/enterprise-filter-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { FilterFieldConfig } from "@/types/filter.types";
import {
  mockSprintSummary, mockTodayTasks, mockUpcomingMeetings,
  mockRecentActivities, mockProjectHealth, mockPerformanceMetrics,
  mockPerformanceChart, mockAIInsights,
} from "@/lib/mock-data/workspace.mock";
import {
  CheckCircle2, Circle, Clock, GitPullRequest, Rocket, MessageSquare,
  AlertTriangle, TrendingUp, Timer, CalendarDays, ChevronRight,
  Plus, Zap, Play, Users, Target, BarChart3,
  AlertCircle, Sparkles, Bug, Lightbulb, Info, ShieldCheck,
  Activity, Video, FileText,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

// ── Stat Card ─────────────────────────────────────────────────────

function StatCard({
  title, value, change, icon: Icon, color, subtitle,
}: {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subtitle?: string;
}) {
  return (
    <Card className="card-interactive">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[var(--foreground-secondary)]">{title}</p>
            <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-1.5">
                <TrendingUp className={cn("w-3.5 h-3.5", change >= 0 ? "text-emerald-500" : "text-red-500 rotate-180")} />
                <span className={cn("text-xs font-medium", change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                  {change >= 0 ? "+" : ""}{change}%
                </span>
                <span className="text-xs text-[var(--foreground-muted)]">vs last sprint</span>
              </div>
            )}
            {subtitle && !change && (
              <p className="text-xs text-[var(--foreground-muted)] mt-1.5">{subtitle}</p>
            )}
          </div>
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Meeting Type Config ───────────────────────────────────────────

const meetingTypeConfig: Record<string, { color: string; label: string }> = {
  standup: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300", label: "Standup" },
  planning: { color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300", label: "Planning" },
  review: { color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300", label: "Review" },
  retro: { color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300", label: "Retro" },
  "one-on-one": { color: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300", label: "1:1" },
  general: { color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", label: "Meeting" },
};

// ── Activity Icons ────────────────────────────────────────────────

const activityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  commit: CheckCircle2, pr: GitPullRequest, task: CheckCircle2,
  deployment: Rocket, review: MessageSquare, comment: MessageSquare,
  sprint: Target, bug: Bug, mention: Activity,
};

// ── AI Insight Icons ──────────────────────────────────────────────

const insightConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; border: string; bg: string; iconColor: string }> = {
  warning: { icon: AlertTriangle, border: "border-amber-200 dark:border-amber-800", bg: "bg-amber-50 dark:bg-amber-950/30", iconColor: "text-amber-500" },
  suggestion: { icon: Lightbulb, border: "border-blue-200 dark:border-blue-800", bg: "bg-blue-50 dark:bg-blue-950/30", iconColor: "text-blue-500" },
  info: { icon: Info, border: "border-slate-200 dark:border-slate-700", bg: "bg-slate-50 dark:bg-slate-900/30", iconColor: "text-slate-500" },
  success: { icon: ShieldCheck, border: "border-emerald-200 dark:border-emerald-800", bg: "bg-emerald-50 dark:bg-emerald-950/30", iconColor: "text-emerald-500" },
};

// ── Page ──────────────────────────────────────────────────────────

export default function WorkspaceDashboard() {
  const { user } = useAuthStore();
  const firstName = user?.firstName || "there";
  const router = useRouter();
  const { startTimer, stopTimer, timerState } = useWorkspaceStore();
  const [activityPage, setActivityPage] = useState(1);

  const {
    state: filterState,
    filteredData: filteredTasks,
    setSearch,
    setFilter,
    removeFilter,
    clearAll: clearAllFilters,
    applyView,
    saveView,
  } = useEnterpriseFilter({
    moduleId: "dashboard",
    defaultState: {
      search: "",
      filters: {},
      sort: null,
      visibleColumns: {},
      currentPage: 1,
      itemsPerPage: 100,
    },
    data: mockTodayTasks,
    searchFields: ["title", "projectName"],
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "t":
            e.preventDefault();
            if (timerState === "running") {
              stopTimer();
            } else {
              startTimer("wt-1", "JWT refresh token rotation");
            }
            break;
          case "k":
            e.preventDefault();
            router.push("/tasks");
            break;
          case "m":
            e.preventDefault();
            router.push("/workspace/meetings");
            break;
          case "s":
            e.preventDefault();
            router.push("/agile/board");
            break;
          case "b":
            e.preventDefault();
            router.push("/qa/bug-reports");
            break;
          case "d":
            e.preventDefault();
            router.push("/documentation");
            break;
          case "u":
            e.preventDefault();
            router.push("/agile/backlog");
            break;
          case "p":
            e.preventDefault();
            router.push("/development/pull-requests");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, timerState, startTimer, stopTimer]);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  const blockedCount = 2;
  const pendingReviews = 3;

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* ── Welcome Banner ─────────────────────────────────────── */}
      <div className="rounded-xl border border-[var(--card-border)] bg-gradient-to-r from-[var(--color-primary-50)] via-[var(--card-bg)] to-[var(--card-bg)] dark:from-blue-950/20 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
              {greeting}, {firstName} 👋
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-[var(--foreground-secondary)]">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                {mockSprintSummary.name}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                Platform Engineering
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                Mervi Platform v2
              </span>
            </div>
            {/* AI Summary */}
            <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-[var(--background-secondary)]/60 border border-[var(--border)]">
              <Sparkles className="w-4 h-4 text-[var(--color-primary)] mt-0.5 shrink-0" />
              <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">
                You have <span className="font-semibold text-[var(--foreground)]">{filteredTasks.length} tasks</span> due today.{" "}
                <span className="font-semibold text-[var(--foreground)]">{pendingReviews} PR reviews</span> are pending.{" "}
                Sprint completion is <span className="font-semibold text-[var(--color-primary)]">{mockSprintSummary.progress}%</span>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild>
              <Link href="/tasks"><Plus className="w-4 h-4 mr-1" />New Task</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/productivity"><Timer className="w-4 h-4 mr-1" />Start Timer</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Enterprise Filter Bar */}
      <EnterpriseFilterBar
        moduleId="dashboard"
        fieldsConfig={[
          { key: "projectName", label: "Project", type: "select", options: [
            { value: "all", label: "All Projects" },
            { value: "Mervi Portal", label: "Mervi Portal" },
            { value: "Core API", label: "Core API" },
            { value: "Security Auth", label: "Security Auth" },
          ]},
          { key: "priority", label: "Priority", type: "select", options: [
            { value: "all", label: "All Priorities" },
            { value: "CRITICAL", label: "Critical" },
            { value: "HIGH", label: "High" },
            { value: "MEDIUM", label: "Medium" },
            { value: "LOW", label: "Low" },
          ]},
          { key: "status", label: "Status", type: "select", options: [
            { value: "all", label: "All Statuses" },
            { value: "TODO", label: "To Do" },
            { value: "IN_PROGRESS", label: "In Progress" },
            { value: "DONE", label: "Completed" },
          ]}
        ]}
        state={filterState}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onRemoveFilter={removeFilter}
        onClearAll={clearAllFilters}
        onApplyView={applyView}
        onSaveView={saveView}
        filteredData={filteredTasks}
      >
        <FilterDropdown
          label="Project"
          value={(filterState.filters.projectName as any)?.value || "all"}
          options={[
            { value: "all", label: "All Projects" },
            { value: "Mervi Portal", label: "Mervi Portal" },
            { value: "Core API", label: "Core API" },
            { value: "Security Auth", label: "Security Auth" },
          ]}
          onChange={(val) => setFilter("projectName", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Priority"
          value={(filterState.filters.priority as any)?.value || "all"}
          options={[
            { value: "all", label: "All Priorities" },
            { value: "CRITICAL", label: "Critical" },
            { value: "HIGH", label: "High" },
            { value: "MEDIUM", label: "Medium" },
            { value: "LOW", label: "Low" },
          ]}
          onChange={(val) => setFilter("priority", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Status"
          value={(filterState.filters.status as any)?.value || "all"}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "TODO", label: "To Do" },
            { value: "IN_PROGRESS", label: "In Progress" },
            { value: "DONE", label: "Completed" },
          ]}
          onChange={(val) => setFilter("status", { type: "select", value: val })}
        />
      </EnterpriseFilterBar>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Tasks Today" value={filteredTasks.length} icon={CheckCircle2} color="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" subtitle="3 in progress" />
        <StatCard title="Meetings" value={mockUpcomingMeetings.length} icon={Video} color="bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400" subtitle="1 live now" />
        <StatCard title="Hours Logged" value="5h 23m" icon={Timer} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" change={8} />
        <StatCard title="Sprint" value={`${mockSprintSummary.progress}%`} icon={BarChart3} color="bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400" subtitle={`${mockSprintSummary.daysRemaining}d left`} />
        <StatCard title="Blocked" value={blockedCount} icon={AlertCircle} color="bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400" subtitle="Needs attention" />
        <StatCard title="Reviews" value={pendingReviews} icon={GitPullRequest} color="bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400" subtitle="PR reviews" />
      </div>

      {/* ── Main Content Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Tasks + Sprint + Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Sprint */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Active Sprint</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/agile/board">View Board<ChevronRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-[var(--foreground)]">{mockSprintSummary.name}</p>
                  <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                    {mockSprintSummary.completedTasks}/{mockSprintSummary.totalTasks} tasks · {mockSprintSummary.daysRemaining} days remaining
                  </p>
                </div>
                <span className="text-2xl font-bold text-[var(--color-primary)]">{mockSprintSummary.progress}%</span>
              </div>
              <Progress value={mockSprintSummary.progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Today&apos;s Tasks</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/workspace/my-work">View All<ChevronRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {filteredTasks.map((task: any) => {
                  const priorityConf = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.LOW;
                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors group cursor-pointer"
                    >
                      <Circle className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[var(--color-primary)] transition-colors shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--foreground)] truncate">{task.title}</p>
                        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{task.projectName}</p>
                      </div>
                      <Badge variant="secondary" className={cn("text-[10px] shrink-0", priorityConf.color)}>
                        {priorityConf.label}
                      </Badge>
                      {task.dueDate && (
                        <span className="text-xs text-[var(--foreground-muted)] hidden sm:block shrink-0">
                          {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Active Projects */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Active Projects</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/projects">All Projects<ChevronRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mockProjectHealth.map((project) => {
                  const statusConfig = {
                    "on-track": { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500", label: "On Track", indicator: "bg-emerald-500" },
                    "at-risk": { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500", label: "At Risk", indicator: "bg-amber-500" },
                    behind: { color: "text-red-600 dark:text-red-400", bg: "bg-red-500", label: "Behind", indicator: "bg-red-500" },
                  }[project.status];
                  return (
                    <div key={project.id} className="p-4 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={cn("w-2 h-2 rounded-full shrink-0", statusConfig.bg)} />
                          <span className="text-sm font-medium text-[var(--foreground)] truncate">{project.name}</span>
                        </div>
                        <span className={cn("text-[10px] font-medium shrink-0", statusConfig.color)}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-1.5 mb-2" indicatorClassName={statusConfig.indicator} />
                      <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
                        <span>{project.lead || "—"}</span>
                        <span>Due {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                      {project.recentActivity && (
                        <p className="text-[10px] text-[var(--foreground-muted)] mt-1.5 truncate">{project.recentActivity}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* My Performance */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">My Performance</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/reports">Details<ChevronRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Metric cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {mockPerformanceMetrics.map((metric) => (
                  <div key={metric.label} className="text-center p-3 rounded-lg bg-[var(--background-secondary)]">
                    <p className="text-xl font-bold text-[var(--foreground)]">{metric.value}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">{metric.label}</p>
                    {metric.change !== undefined && (
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        <TrendingUp className={cn("w-3 h-3", metric.change >= 0 ? "text-emerald-500" : "text-red-500 rotate-180")} />
                        <span className={cn("text-[10px] font-medium", metric.change >= 0 ? "text-emerald-500" : "text-red-500")}>
                          {metric.change >= 0 ? "+" : ""}{metric.change}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockPerformanceChart} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} className="fill-[var(--foreground-muted)]" />
                    <YAxis tick={{ fontSize: 11 }} className="fill-[var(--foreground-muted)]" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Area type="monotone" dataKey="storyPoints" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} name="Story Points" />
                    <Area type="monotone" dataKey="tasksCompleted" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} name="Tasks" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right — Meetings + AI + Activity + Quick Actions */}
        <div className="space-y-6 lg:sticky lg:top-[76px] h-fit">
          {/* Upcoming Meetings */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Meetings</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/workspace/calendar"><CalendarDays className="w-3.5 h-3.5 mr-1" />Calendar</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUpcomingMeetings.map((meeting) => {
                  const config = meetingTypeConfig[meeting.type] || meetingTypeConfig.general;
                  const startTime = new Date(meeting.startTime).toLocaleTimeString("en-US", {
                    hour: "numeric", minute: "2-digit", hour12: true,
                  });
                  return (
                    <div
                      key={meeting.id}
                      className={cn(
                        "p-3 rounded-lg border transition-colors",
                        meeting.isOngoing
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-50)] dark:bg-blue-950/20"
                          : "border-[var(--border)] hover:border-[var(--border-hover)]"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-[var(--foreground)] truncate">{meeting.title}</p>
                            {meeting.isOngoing && (
                              <Badge className="text-[10px] h-4 bg-emerald-500 text-white">Live</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="secondary" className={cn("text-[10px]", config.color)}>
                              {config.label}
                            </Badge>
                            <span className="text-xs text-[var(--foreground-muted)]">{startTime}</span>
                            <span className="text-xs text-[var(--foreground-muted)]">
                              <Users className="w-3 h-3 inline mr-0.5" />{meeting.attendees}
                            </span>
                          </div>
                        </div>
                        {meeting.isOngoing && (
                          <Button size="sm" className="shrink-0 h-8">
                            <Play className="w-3.5 h-3.5 mr-1" />Join
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockAIInsights.slice(0, 4).map((insight) => {
                  const conf = insightConfig[insight.type] || insightConfig.info;
                  const Icon = conf.icon;
                  return (
                    <div key={insight.id} className={cn("p-3 rounded-lg border", conf.border, conf.bg)}>
                      <div className="flex items-start gap-2">
                        <Icon className={cn("w-4 h-4 shrink-0 mt-0.5", conf.iconColor)} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-[var(--foreground)]">{insight.title}</p>
                          <p className="text-[11px] text-[var(--foreground-secondary)] mt-0.5 leading-relaxed">{insight.message}</p>
                          {insight.actionLabel && (
                            <Link href={insight.actionUrl || "#"} className="text-[10px] font-medium text-[var(--color-primary)] mt-1.5 inline-block hover:underline">
                              {insight.actionLabel} →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full justify-between">
              <div className="space-y-1 mb-4">
                {mockRecentActivities.slice((activityPage - 1) * 12, activityPage * 12).map((activity) => {
                  const Icon = activityIcons[activity.type] || Circle;
                  return (
                    <div key={activity.id} className="flex gap-3 p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                      <div className="w-7 h-7 rounded-full bg-[var(--background-tertiary)] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-[var(--foreground-secondary)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-[var(--foreground)]">{activity.title}</p>
                        <p className="text-xs text-[var(--foreground-muted)] truncate mt-0.5">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-[var(--foreground-muted)]">{activity.actorName}</span>
                          {activity.projectName && (
                            <>
                              <span className="text-[10px] text-[var(--foreground-muted)]">·</span>
                              <span className="text-[10px] text-[var(--foreground-muted)]">{activity.projectName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Pagination
                currentPage={activityPage}
                totalItems={mockRecentActivities.length}
                itemsPerPage={12}
                onPageChange={setActivityPage}
                itemName="activities"
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <TooltipProvider delayDuration={100}>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Start Timer", shortcut: "Alt+T", icon: Timer, color: "text-emerald-500", desc: "Toggle work session timer", action: () => { if (timerState === 'running') stopTimer(); else startTimer('wt-1', 'JWT refresh token rotation'); } },
                    { label: "My Tasks", shortcut: "Alt+K", icon: CheckCircle2, color: "text-blue-500", desc: "View assigned tasks", href: "/tasks" },
                    { label: "Join Meeting", shortcut: "Alt+M", icon: Video, color: "text-purple-500", desc: "Join ongoing sync", href: "/workspace/meetings" },
                    { label: "Continue Sprint", shortcut: "Alt+S", icon: Target, color: "text-indigo-500", desc: "Go to active sprint board", href: "/agile/board" },
                    { label: "Create Bug", shortcut: "Alt+B", icon: Bug, color: "text-red-500", desc: "File a new defect report", href: "/qa/bug-reports" },
                    { label: "Create Document", shortcut: "Alt+D", icon: FileText, color: "text-amber-500", desc: "Write a wiki page or SOP", href: "/documentation" },
                    { label: "Create User Story", shortcut: "Alt+U", icon: Target, color: "text-teal-500", desc: "Add to product backlog", href: "/agile/backlog" },
                    { label: "Open Pull Requests", shortcut: "Alt+P", icon: GitPullRequest, color: "text-rose-500", desc: "View and review PRs", href: "/development/pull-requests" },
                  ].map((action) => {
                    const cardContent = (
                      <button
                        key={action.label}
                        onClick={() => {
                          if (action.action) action.action();
                          else if (action.href) router.push(action.href);
                        }}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--color-primary)] hover:bg-[var(--background-secondary)] transition-all text-center w-full group cursor-pointer focus:outline-none"
                      >
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          transition={{ duration: 0.15 }}
                          className={cn("w-10 h-10 rounded-lg bg-[var(--background-secondary)] flex items-center justify-center group-hover:bg-[var(--card-bg)] transition-colors")}
                        >
                          <action.icon className={cn("w-5 h-5", action.color)} />
                        </motion.div>
                        <span className="text-[10px] font-semibold text-[var(--foreground)]">{action.label}</span>
                      </button>
                    );

                    return (
                      <Tooltip key={action.label}>
                        <TooltipTrigger asChild>
                          {cardContent}
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[200px] text-xs">
                          <p className="font-semibold text-xs">{action.label}</p>
                          <p className="text-[10px] text-[var(--foreground-muted)]">{action.desc}</p>
                          <div className="mt-1">
                            <span className="text-[9px] px-1 py-0.5 rounded bg-[var(--background-secondary)] text-[var(--foreground-muted)] border border-[var(--border)]">{action.shortcut}</span>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
