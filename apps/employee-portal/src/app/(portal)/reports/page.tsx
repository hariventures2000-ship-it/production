// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Reports & Analytics Page
// Enhanced with Active Sprint/Project selectors, KPI tiles, and Dropdown Exports
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import {
  CheckCircle2, GitPullRequest, Rocket, Clock, TrendingUp,
  Award, Users, BarChart3, Download, Calendar, Filter, FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";
import {
  PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { toast } from "sonner";

// ── Mock Data ────────────────────────────────────────────────────────

const summaryStats = [
  { label: "Tasks Completed", value: "47", sublabel: "this week", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", change: "+12%" },
  { label: "Avg Cycle Time", value: "2.4d", sublabel: "per task", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10", change: "-8%" },
  { label: "PRs Merged", value: "23", sublabel: "this week", icon: GitPullRequest, color: "text-purple-500", bg: "bg-purple-500/10", change: "+5%" },
  { label: "Deployments", value: "8", sublabel: "this week", icon: Rocket, color: "text-amber-500", bg: "bg-amber-500/10", change: "+33%" },
];

const taskDistribution = [
  { name: "Done", value: 47, color: "#10b981" },
  { name: "In Progress", value: 12, color: "#3b82f6" },
  { name: "In Review", value: 8, color: "#8b5cf6" },
  { name: "To Do", value: 15, color: "#94a3b8" },
  { name: "Backlog", value: 22, color: "#d1d5db" },
];

const weeklyActivity = [
  { week: "Week 1", commits: 45, prs: 12, deploys: 3 },
  { week: "Week 2", commits: 62, prs: 18, deploys: 5 },
  { week: "Week 3", commits: 38, prs: 14, deploys: 2 },
  { week: "Week 4", commits: 71, prs: 23, deploys: 8 },
];

const leaderboard = [
  { rank: 1, name: "Vijay S.", role: "Lead Developer", tasks: 18, reviews: 12, points: 42, initials: "VS" },
  { rank: 2, name: "Arjun M.", role: "Senior Developer", tasks: 15, reviews: 8, points: 36, initials: "AM" },
  { rank: 3, name: "Priya K.", role: "UI/UX Designer", tasks: 12, reviews: 5, points: 28, initials: "PK" },
  { rank: 4, name: "Deepak S.", role: "QA Engineer", tasks: 10, reviews: 14, points: 24, initials: "DS" },
  { rank: 5, name: "Sneha P.", role: "Full Stack Dev", tasks: 8, reviews: 6, points: 20, initials: "SP" },
];

const RANK_STYLE = {
  1: "bg-amber-500 text-white",
  2: "bg-slate-400 text-white",
  3: "bg-orange-600 text-white",
} as Record<number, string>;

// ── Custom Tooltip ───────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-[var(--foreground)] mb-1.5">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[var(--foreground-secondary)]">{entry.name}:</span>
          <span className="font-medium text-[var(--foreground)]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg p-3 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
        <span className="font-medium text-[var(--foreground)]">{payload[0].name}: {payload[0].value}</span>
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────

export default function ReportsPage() {
  const totalTasks = taskDistribution.reduce((acc, d) => acc + d.value, 0);

  // Active filters state
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedSprint, setSelectedSprint] = useState("sprint-18");

  const handleExport = (format: string) => {
    toast.info(`Preparing ${format} export compilation for ${selectedSprint}...`);
    setTimeout(() => {
      toast.success(`Export successful! ${selectedSprint}_Metrics.${format.toLowerCase()} downloaded.`);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Organizational metrics, activity trends, and team performance analytics.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" /> Export Metrics
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("PDF")} className="text-xs">
                <FileText className="w-3.5 h-3.5 mr-2" /> PDF Report Document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("CSV")} className="text-xs">
                <FileText className="w-3.5 h-3.5 mr-2" /> CSV Spreadsheet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("Excel")} className="text-xs">
                <FileText className="w-3.5 h-3.5 mr-2" /> Excel Workbook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Select Filter Panel */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[var(--card-bg)] p-4 rounded-xl border border-[var(--border)] shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-secondary)] font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Active Context:</span>
        </div>
        <select 
          className="h-9 px-3 text-xs bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-[var(--foreground)]"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="all">All Projects</option>
          <option value="mervi">Mervi Platform v2</option>
          <option value="client">Client Portal</option>
          <option value="auth">Auth Service</option>
        </select>
        <select 
          className="h-9 px-3 text-xs bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-[var(--foreground)]"
          value={selectedSprint}
          onChange={(e) => setSelectedSprint(e.target.value)}
        >
          <option value="sprint-18">Active Sprint 18</option>
          <option value="sprint-17">Sprint 17 Summary</option>
          <option value="sprint-16">Sprint 16 Summary</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith("+");
          return (
            <Card key={stat.label} className="shadow-xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                    <Icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <Badge variant="secondary" className={cn("text-[9px] border-none", isPositive ? "text-emerald-700 bg-emerald-50" : "text-blue-700 bg-blue-50")}>
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</p>
                <p className="text-[10px] text-[var(--foreground-muted)] uppercase font-semibold mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-xs">
          <CardContent className="p-4 text-xs">
            <p className="text-[10px] text-[var(--foreground-muted)] uppercase font-semibold">Code Review SLA</p>
            <p className="text-lg font-bold text-[var(--foreground)] mt-1">2.8 Hours</p>
            <p className="text-[10px] text-emerald-600 font-medium mt-1">✓ Enforces standard SLA target (3h)</p>
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardContent className="p-4 text-xs">
            <p className="text-[10px] text-[var(--foreground-muted)] uppercase font-semibold">Defect Leakage Rate</p>
            <p className="text-lg font-bold text-[var(--foreground)] mt-1">1.2%</p>
            <p className="text-[10px] text-emerald-600 font-medium mt-1">✓ Under critical threshold limits (5%)</p>
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardContent className="p-4 text-xs">
            <p className="text-[10px] text-[var(--foreground-muted)] uppercase font-semibold">Release Success Rate</p>
            <p className="text-lg font-bold text-[var(--foreground)] mt-1">98.4%</p>
            <p className="text-[10px] text-emerald-600 font-medium mt-1">✓ High build stability indexes</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Weekly Activity */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">Weekly Activity</CardTitle>
            <CardDescription>Commits, pull requests, and deployments over the last 4 weeks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--foreground-muted)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--foreground-muted)" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="commits" name="Commits" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.06} />
                  <Area type="monotone" dataKey="prs" name="PRs" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.06} />
                  <Area type="monotone" dataKey="deploys" name="Deploys" stroke="#10b981" fill="#10b981" fillOpacity={0.06} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Task Distribution Pie */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">Task Distribution</CardTitle>
            <CardDescription>{totalTasks} total tasks across all statuses.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {taskDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {taskDistribution.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[var(--foreground-secondary)]">{d.name}</span>
                  </div>
                  <span className="font-semibold text-[var(--foreground)]">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Leaderboard */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Team Leaderboard
          </CardTitle>
          <CardDescription>Top contributors ranked by completed tasks, code reviews, and story points this sprint.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {leaderboard.map((member) => (
              <div key={member.rank} className="flex items-center gap-4 p-4 hover:bg-[var(--background-secondary)]/30 transition-colors text-xs">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  RANK_STYLE[member.rank] || "bg-[var(--background-secondary)] text-[var(--foreground-muted)]"
                )}>
                  {member.rank}
                </div>
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="text-xs bg-[var(--color-primary)] text-white font-bold">{member.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[var(--foreground)]">{member.name}</p>
                  <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">{member.role}</p>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-xs text-[var(--foreground-secondary)]">
                  <div className="text-center">
                    <p className="font-bold text-[var(--foreground)]">{member.tasks}</p>
                    <p>Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-[var(--foreground)]">{member.reviews}</p>
                    <p>Reviews</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-[var(--color-primary)]">{member.points}</p>
                    <p>Points</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
