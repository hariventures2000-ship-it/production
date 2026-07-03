"use client";

import { useAuthStore } from "@/store/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import { PRIORITY_CONFIG } from "@/lib/constants";
import {
  mockSprintSummary,
  mockTodayTasks,
  mockUpcomingMeetings,
  mockRecentActivities,
  mockProjectHealth,
} from "@/lib/mock-data/workspace.mock";
import {
  CheckCircle2, Circle, Clock, GitPullRequest, Rocket, MessageSquare,
  AlertTriangle, TrendingUp, Timer, CalendarDays, ChevronRight,
  Plus, Zap, ArrowUpRight, Play, Users, Target, BarChart3,
} from "lucide-react";
import Link from "next/link";

// ── Stat Card ─────────────────────────────────────────────────────

function StatCard({
  title, value, change, icon: Icon, color,
}: {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
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

// ── Activity Icon ─────────────────────────────────────────────────

const activityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  commit: CheckCircle2,
  pr: GitPullRequest,
  task: CheckCircle2,
  deployment: Rocket,
  review: MessageSquare,
  comment: MessageSquare,
  sprint: Target,
};

// ── Page ──────────────────────────────────────────────────────────

export default function WorkspaceDashboard() {
  const { user } = useAuthStore();
  const firstName = user?.firstName || "there";

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Here&apos;s what&apos;s happening across your projects today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/tasks"><Plus className="w-4 h-4 mr-1" />New Task</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/productivity"><Timer className="w-4 h-4 mr-1" />Start Timer</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Tasks" value={mockTodayTasks.length} change={12} icon={CheckCircle2} color="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" />
        <StatCard title="Pending Reviews" value={3} icon={GitPullRequest} color="bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400" />
        <StatCard title="Time Logged" value="5h 23m" change={8} icon={Timer} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" />
        <StatCard title="Sprint Progress" value={`${mockSprintSummary.progress}%`} icon={BarChart3} color="bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Tasks + Sprint */}
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
                  <Link href="/tasks">View All<ChevronRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {mockTodayTasks.map((task) => {
                  const priorityConf = PRIORITY_CONFIG[task.priority];
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

          {/* Project Health */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Project Health</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/projects">All Projects<ChevronRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProjectHealth.map((project) => {
                  const statusConfig = {
                    "on-track": { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500", label: "On Track" },
                    "at-risk": { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500", label: "At Risk" },
                    behind: { color: "text-red-600 dark:text-red-400", bg: "bg-red-500", label: "Behind" },
                  }[project.status];
                  return (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", statusConfig.bg)} />
                          <span className="text-sm font-medium text-[var(--foreground)]">{project.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn("text-xs font-medium", statusConfig.color)}>
                            {statusConfig.label}
                          </span>
                          <span className="text-xs text-[var(--foreground-muted)]">{project.progress}%</span>
                        </div>
                      </div>
                      <Progress
                        value={project.progress}
                        className="h-1.5"
                        indicatorClassName={cn(
                          project.status === "on-track" && "bg-emerald-500",
                          project.status === "at-risk" && "bg-amber-500",
                          project.status === "behind" && "bg-red-500"
                        )}
                      />
                      <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
                        <span>Next: {project.nextMilestone}</span>
                        <span>Due {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right — Meetings + Activity */}
        <div className="space-y-6">
          {/* Upcoming Meetings */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Meetings</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/workspace/meetings"><CalendarDays className="w-3.5 h-3.5 mr-1" />Calendar</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUpcomingMeetings.map((meeting) => {
                  const config = meetingTypeConfig[meeting.type] || meetingTypeConfig.general;
                  const startTime = new Date(meeting.startTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
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

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {mockRecentActivities.slice(0, 5).map((activity) => {
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
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "New Task", icon: Plus, href: "/tasks", color: "text-blue-500" },
                  { label: "Start Timer", icon: Timer, href: "/productivity", color: "text-emerald-500" },
                  { label: "New Doc", icon: Zap, href: "/documentation/new", color: "text-purple-500" },
                  { label: "AI Assistant", icon: ArrowUpRight, href: "/ai", color: "text-amber-500" },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--background-secondary)] transition-all text-center"
                  >
                    <action.icon className={cn("w-5 h-5", action.color)} />
                    <span className="text-xs font-medium text-[var(--foreground)]">{action.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
