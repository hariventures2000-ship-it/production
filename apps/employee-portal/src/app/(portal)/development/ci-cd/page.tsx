"use client";

import { useState } from "react";
import {
  Container, CheckCircle2, XCircle, Loader2, Clock, GitBranch,
  Play, RotateCcw, Search, Filter, Zap, Timer, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";

// ── Mock Data ────────────────────────────────────────────────────────

const pipelineStats = [
  { label: "Success Rate", value: "94%", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Avg Build Time", value: "3m 42s", icon: Timer, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Deploys Today", value: "5", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Failed This Week", value: "2", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
];

const pipelines = [
  {
    id: "run-501", pipeline: "mervi-platform / Build & Test", trigger: "push",
    branch: "feature/dashboard-charts", status: "running", progress: 72,
    duration: "2m 18s", startedAt: "2026-07-03T16:45:00", author: "Priya K.",
    steps: [
      { name: "Checkout", status: "done" },
      { name: "Install Deps", status: "done" },
      { name: "Lint", status: "done" },
      { name: "Unit Tests", status: "running" },
      { name: "Build", status: "pending" },
      { name: "Deploy Preview", status: "pending" },
    ],
  },
  {
    id: "run-500", pipeline: "mervi-platform / Build & Test", trigger: "pr",
    branch: "fix/kafka-consumer-retry", status: "failed", progress: 100,
    duration: "4m 51s", startedAt: "2026-07-03T15:30:00", author: "Arjun M.",
    steps: [
      { name: "Checkout", status: "done" },
      { name: "Install Deps", status: "done" },
      { name: "Lint", status: "done" },
      { name: "Unit Tests", status: "failed" },
      { name: "Build", status: "skipped" },
      { name: "Deploy Preview", status: "skipped" },
    ],
  },
  {
    id: "run-499", pipeline: "mervi-platform / Build & Test", trigger: "push",
    branch: "develop", status: "success", progress: 100,
    duration: "3m 22s", startedAt: "2026-07-03T11:15:00", author: "Vijay S.",
    steps: [],
  },
  {
    id: "run-498", pipeline: "notification-service / Build", trigger: "push",
    branch: "main", status: "success", progress: 100,
    duration: "2m 08s", startedAt: "2026-07-03T09:00:00", author: "Vijay S.",
    steps: [],
  },
  {
    id: "run-497", pipeline: "mervi-platform / Deploy Staging", trigger: "manual",
    branch: "develop", status: "success", progress: 100,
    duration: "5m 45s", startedAt: "2026-07-02T18:30:00", author: "Vijay S.",
    steps: [],
  },
  {
    id: "run-496", pipeline: "auth-service / Build & Test", trigger: "push",
    branch: "security/csrf-protection", status: "success", progress: 100,
    duration: "3m 10s", startedAt: "2026-07-02T16:00:00", author: "Vijay S.",
    steps: [],
  },
];

const RUN_STATUS = {
  success: { label: "Success", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950", iconColor: "text-emerald-500" },
  failed: { label: "Failed", icon: XCircle, color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950", iconColor: "text-red-500" },
  running: { label: "Running", icon: Loader2, color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950", iconColor: "text-blue-500" },
} as const;

const TRIGGER_LABEL = {
  push: "Push",
  pr: "Pull Request",
  manual: "Manual",
} as const;

const STEP_STATUS = {
  done: { icon: CheckCircle2, color: "text-emerald-500" },
  running: { icon: Loader2, color: "text-blue-500 animate-spin" },
  failed: { icon: XCircle, color: "text-red-500" },
  pending: { icon: Clock, color: "text-[var(--foreground-muted)]" },
  skipped: { icon: Clock, color: "text-[var(--foreground-muted)] opacity-40" },
} as const;

// ── Component ────────────────────────────────────────────────────────

export default function CICDPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activePipelines = pipelines.filter((p) => p.status === "running");
  const filteredPipelines = pipelines.filter((p) => {
    const matchesSearch = p.pipeline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.branch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ? true :
      activeTab === "running" ? p.status === "running" :
      activeTab === "failed" ? p.status === "failed" :
      activeTab === "success" ? p.status === "success" :
      true;
    return matchesSearch && matchesTab;
  });

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">CI/CD Pipelines</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Monitor builds, tests, and deployment pipelines across services.
          </p>
        </div>
        <Button>
          <Play className="w-4 h-4 mr-2" />
          Trigger Build
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {pipelineStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", stat.bg)}>
                  <Icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--foreground)]">{stat.value}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Builds */}
      {activePipelines.length > 0 && (
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              Active Builds ({activePipelines.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activePipelines.map((p) => (
              <div key={p.id} className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">{p.pipeline}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[var(--foreground-muted)]">
                      <GitBranch className="w-3 h-3" />
                      <span className="font-mono">{p.branch}</span>
                      <span>·</span>
                      <span>{p.author}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-blue-500">{p.progress}%</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">{p.duration}</p>
                  </div>
                </div>
                <Progress value={p.progress} className="h-1.5 mb-3" />
                {p.steps.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    {p.steps.map((step, i) => {
                      const stepConf = STEP_STATUS[step.status as keyof typeof STEP_STATUS];
                      const StepIcon = stepConf.icon;
                      return (
                        <div key={i} className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-[var(--background-secondary)] border border-[var(--border)]">
                          <StepIcon className={cn("w-3 h-3", stepConf.color)} />
                          <span className="text-[var(--foreground-secondary)]">{step.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All Runs</TabsTrigger>
            <TabsTrigger value="running">Running</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
            <TabsTrigger value="success">Success</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
          <Input
            placeholder="Search pipelines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Pipeline Runs */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {filteredPipelines.map((p) => {
              const statusConf = RUN_STATUS[p.status as keyof typeof RUN_STATUS];
              const StatusIcon = statusConf.icon;
              return (
                <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-[var(--background-secondary)] transition-colors group">
                  <StatusIcon className={cn("w-5 h-5 shrink-0", statusConf.iconColor, p.status === "running" && "animate-spin")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors cursor-pointer">
                      {p.pipeline}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--foreground-muted)]">
                      <div className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3" />
                        <span className="font-mono">{p.branch}</span>
                      </div>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{TRIGGER_LABEL[p.trigger as keyof typeof TRIGGER_LABEL]}</Badge>
                      <span>{p.author}</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-xs text-[var(--foreground-secondary)]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {p.duration}
                    </div>
                    <span>{timeAgo(p.startedAt)}</span>
                  </div>
                  <Badge variant="secondary" className={cn("text-[10px] shrink-0", statusConf.color)}>
                    {statusConf.label}
                  </Badge>
                  {p.status === "failed" && (
                    <Button variant="ghost" size="icon-sm" className="shrink-0" title="Retry">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              );
            })}
            {filteredPipelines.length === 0 && (
              <div className="p-12 text-center">
                <Container className="w-8 h-8 text-[var(--foreground-muted)] mx-auto mb-3" />
                <p className="text-sm font-medium text-[var(--foreground)]">No pipeline runs found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
