// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Pull Requests Page
// Refined with Repository/Author Filters, Pagination, Skeletons, Error Retry, and Empty States
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  GitPullRequest, GitMerge, Search, Filter, MessageSquare,
  CheckCircle2, XCircle, Clock, CircleDot, Plus, Eye,
  AlertTriangle, RefreshCcw, ShieldAlert, Layers, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/cn";
import { Pagination } from "@/components/ui/pagination";
import { useEnterpriseFilter } from "@/hooks/use-enterprise-filter";
import { useFilterStore } from "@/store/filter.store";
import { EnterpriseFilterBar } from "@/components/ui/enterprise-filter-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { FilterFieldConfig } from "@/types/filter.types";

// ── Mock Data ────────────────────────────────────────────────────────

const pullRequests = [
  {
    id: "pr-247", number: 247, title: "Add dashboard analytics with Recharts integration",
    author: "Priya K.", authorInitials: "PK", repo: "mervi-platform",
    sourceBranch: "feature/dashboard-charts", targetBranch: "develop",
    status: "OPEN", ciStatus: "passing", reviewCount: 2, commentCount: 5,
    additions: 482, deletions: 31, filesChanged: 8,
    createdAt: "2026-07-02T14:30:00", labels: ["frontend", "enhancement"],
  },
  {
    id: "pr-245", number: 245, title: "Add CSRF protection to auth endpoints",
    author: "Vijay S.", authorInitials: "VS", repo: "auth-service",
    sourceBranch: "security/csrf-protection", targetBranch: "develop",
    status: "MERGED", ciStatus: "passing", reviewCount: 3, commentCount: 8,
    additions: 215, deletions: 12, filesChanged: 5,
    createdAt: "2026-07-01T10:00:00", mergedAt: "2026-07-03T08:45:00", labels: ["security"],
  },
  {
    id: "pr-244", number: 244, title: "Fix Kafka consumer error handling in notification-service",
    author: "Arjun M.", authorInitials: "AM", repo: "notification-service",
    sourceBranch: "fix/kafka-consumer-retry", targetBranch: "develop",
    status: "OPEN", ciStatus: "failing", reviewCount: 1, commentCount: 3,
    additions: 98, deletions: 45, filesChanged: 3,
    createdAt: "2026-07-01T16:20:00", labels: ["bug", "backend"],
  },
  {
    id: "pr-243", number: 243, title: "Implement rate limiting middleware with Redis",
    author: "Vijay S.", authorInitials: "VS", repo: "mervi-platform",
    sourceBranch: "feature/rate-limiter", targetBranch: "develop",
    status: "MERGED", ciStatus: "passing", reviewCount: 2, commentCount: 4,
    additions: 340, deletions: 15, filesChanged: 6,
    createdAt: "2026-06-28T09:15:00", mergedAt: "2026-07-01T11:30:00", labels: ["security", "backend"],
  },
  {
    id: "pr-242", number: 242, title: "Update employee onboarding form validation",
    author: "Sneha P.", authorInitials: "SP", repo: "employee-portal",
    sourceBranch: "fix/onboarding-validation", targetBranch: "develop",
    status: "CLOSED", ciStatus: "passing", reviewCount: 1, commentCount: 2,
    additions: 45, deletions: 30, filesChanged: 2,
    createdAt: "2026-06-27T14:00:00", labels: ["frontend"],
  },
  {
    id: "pr-241", number: 241, title: "Add WebSocket reconnection with backoff strategy",
    author: "Deepak S.", authorInitials: "DS", repo: "notification-service",
    sourceBranch: "feature/ws-reconnect", targetBranch: "main",
    status: "OPEN", ciStatus: "passing", reviewCount: 0, commentCount: 1,
    additions: 167, deletions: 22, filesChanged: 4,
    createdAt: "2026-06-26T11:00:00", labels: ["enhancement", "backend"],
  },
  {
    id: "pr-240", number: 240, title: "Configure Redis connection pool timeouts",
    author: "Arjun M.", authorInitials: "AM", repo: "mervi-platform",
    sourceBranch: "fix/redis-timeouts", targetBranch: "develop",
    status: "MERGED", ciStatus: "passing", reviewCount: 2, commentCount: 3,
    additions: 15, deletions: 5, filesChanged: 1,
    createdAt: "2026-06-25T10:00:00", mergedAt: "2026-06-25T14:20:00", labels: ["backend", "performance"],
  },
  {
    id: "pr-239", number: 239, title: "Implement basic RBAC checks in route middleware",
    author: "Vijay S.", authorInitials: "VS", repo: "auth-service",
    sourceBranch: "feature/rbac-checks", targetBranch: "develop",
    status: "OPEN", ciStatus: "passing", reviewCount: 1, commentCount: 6,
    additions: 190, deletions: 12, filesChanged: 4,
    createdAt: "2026-06-24T15:30:00", labels: ["security", "backend"],
  },
  {
    id: "pr-238", number: 238, title: "Add loading skeletons to task list views",
    author: "Priya K.", authorInitials: "PK", repo: "employee-portal",
    sourceBranch: "feature/task-skeletons", targetBranch: "develop",
    status: "OPEN", ciStatus: "pending", reviewCount: 0, commentCount: 0,
    additions: 78, deletions: 2, filesChanged: 2,
    createdAt: "2026-07-02T16:10:00", labels: ["frontend"],
  }
];

const PR_STATUS = {
  OPEN: { label: "Open", icon: CircleDot, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950", iconColor: "text-emerald-500" },
  MERGED: { label: "Merged", icon: GitMerge, color: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950", iconColor: "text-purple-500" },
  CLOSED: { label: "Closed", icon: XCircle, color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950", iconColor: "text-red-500" },
} as const;

const CI_STATUS = {
  passing: { label: "Passing", color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950" },
  failing: { label: "Failing", color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950" },
  pending: { label: "Pending", color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950" },
} as const;

const prStats = [
  { label: "Open PRs", value: pullRequests.filter((p) => p.status === "OPEN").length, icon: CircleDot, color: "text-emerald-500" },
  { label: "Avg Review Time", value: "4.2h", icon: Clock, color: "text-blue-500" },
  { label: "Merge Rate", value: "92%", icon: GitMerge, color: "text-purple-500" },
  { label: "Reviews Given", value: "12", icon: Eye, color: "text-amber-500" },
];

// ── Skeletons ──────────────────────────────────────────────────────
function PRsSkeleton() {
  return (
    <div className="space-y-3 animate-pulse p-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border border-[var(--border)] rounded-xl bg-[var(--card-bg)]">
          <div className="w-5 h-5 rounded-full bg-[var(--background-secondary)] shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[var(--background-secondary)] rounded w-3/5" />
            <div className="h-3 bg-[var(--background-secondary)] rounded w-1/4" />
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
      <ShieldAlert className="w-12 h-12 text-[var(--color-danger)] mb-4 animate-bounce" />
      <h3 className="text-lg font-bold text-[var(--foreground)]">Git Service Offline</h3>
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
      <GitPullRequest className="w-12 h-12 text-[var(--foreground-muted)] mb-4" />
      <h3 className="text-lg font-bold text-[var(--foreground)]">No Pull Requests</h3>
      <p className="text-sm text-[var(--foreground-secondary)] mt-2 max-w-sm mb-6">
        No PR branches or review code threads match your filter query. Create a PR to start.
      </p>
      <div className="flex gap-2">
        <Button onClick={onAction}><Plus className="w-4 h-4 mr-2" /> Open Pull Request</Button>
        <Button onClick={onSecondaryAction} variant="outline">Reset Filters</Button>
      </div>
    </div>
  );
}

export default function PullRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const loadData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (Math.random() < 0.05) {
        setError("Failed to fetch repository pull request metadata from GitHub enterprise proxy.");
      }
      setLoading(false);
    }, 450);
  };

  useEffect(() => {
    loadData();
  }, []);

  const tabFilteredPRs = useMemo(() => {
    return pullRequests.filter((pr) => {
      if (activeTab === "all") return true;
      if (activeTab === "mine") return pr.author === "Vijay S.";
      if (activeTab === "review") return pr.status === "OPEN" && pr.reviewCount === 0;
      if (activeTab === "merged") return pr.status === "MERGED";
      return true;
    });
  }, [activeTab]);

  const fieldsConfig: FilterFieldConfig[] = [
    { key: "repo", label: "Repository", type: "select", options: [
      { value: "all", label: "All Repositories" },
      { value: "mervi-platform", label: "mervi-platform" },
      { value: "notification-service", label: "notification-service" },
      { value: "auth-service", label: "auth-service" },
      { value: "employee-portal", label: "employee-portal" },
    ]},
    { key: "author", label: "Author", type: "select", options: [
      { value: "all", label: "All Authors" },
      { value: "Priya K.", label: "Priya K." },
      { value: "Vijay S.", label: "Vijay S." },
      { value: "Arjun M.", label: "Arjun M." },
      { value: "Sneha P.", label: "Sneha P." },
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
    moduleId: "pull-requests",
    defaultState: {
      search: "",
      filters: {},
      sort: null,
      visibleColumns: {},
      currentPage: 1,
      itemsPerPage: 8,
    },
    data: tabFilteredPRs,
    searchFields: ["title", "id", "repo"],
  });

  const handlePageChange = (page: number) => {
    useFilterStore.getState().updateState("pull-requests", { currentPage: page });
  };

  // When tab changes, reset page via store manually to keep it responsive to tab changes
  useEffect(() => {
    useFilterStore.getState().updateState("pull-requests", { currentPage: 1 });
  }, [activeTab]);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  const handleClearFilters = () => {
    setActiveTab("all");
    clearAll();
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-12 w-48 bg-[var(--background-secondary)] rounded animate-pulse" />
        <PRsSkeleton />
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
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Pull Requests</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Review, approve, and merge code changes across repositories.
          </p>
        </div>
        <Button onClick={() => alert("Creating a PR is available via git terminal upstream hook.")}>
          <Plus className="w-4 h-4 mr-2" />
          New PR
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {prStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={cn("w-5 h-5 shrink-0", stat.color)} />
                <div>
                  <p className="text-lg font-bold text-[var(--foreground)]">{stat.value}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All PRs</TabsTrigger>
          <TabsTrigger value="mine">Created by Me</TabsTrigger>
          <TabsTrigger value="review">Needs Review</TabsTrigger>
          <TabsTrigger value="merged">Merged</TabsTrigger>
        </TabsList>
      </Tabs>

      <EnterpriseFilterBar
        moduleId="pull-requests"
        fieldsConfig={fieldsConfig}
        state={state}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onRemoveFilter={removeFilter}
        onClearAll={handleClearFilters}
        onApplyView={applyView}
        onSaveView={saveView}
        sortOptions={[
          { value: "createdAt", label: "Date Created" },
          { value: "status", label: "Status" },
          { value: "additions", label: "Additions" },
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
      {/* PR List */}
      <Card>
        <CardContent className="p-0 flex flex-col h-full justify-between">
          <div className="divide-y divide-[var(--border)]">
            {paginatedData.map((pr) => {
              const statusConf = PR_STATUS[pr.status as keyof typeof PR_STATUS];
              const StatusIcon = statusConf.icon;
              const ciConf = CI_STATUS[pr.ciStatus as keyof typeof CI_STATUS];

              return (
                <div key={pr.id} className="flex items-start gap-4 p-4 hover:bg-[var(--background-secondary)]/40 transition-colors group border-b border-[var(--border)] last:border-b-0">
                  <StatusIcon className={cn("w-5 h-5 mt-0.5 shrink-0", statusConf.iconColor)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors cursor-pointer">
                        {pr.title}
                      </h3>
                      {pr.labels.map((label) => (
                        <Badge key={label} variant="secondary" className="text-[9px] px-1.5 py-0 font-normal">
                          {label}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--foreground-secondary)] flex-wrap">
                      <span className="font-mono text-[var(--foreground-muted)]">#{pr.number}</span>
                      <span>{pr.repo}</span>
                      <span className="font-mono text-[10px] bg-[var(--background-secondary)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                        {pr.sourceBranch}
                      </span>
                      <span className="text-[var(--foreground-muted)]">→</span>
                      <span className="font-mono text-[10px] bg-[var(--background-secondary)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                        {pr.targetBranch}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[var(--foreground-muted)]">
                      <div className="flex items-center gap-1">
                        <Avatar className="w-4 h-4">
                          <AvatarFallback className="text-[8px] bg-[var(--color-primary)] text-white font-bold">{pr.authorInitials}</AvatarFallback>
                        </Avatar>
                        {pr.author}
                      </div>
                      <span>{timeAgo(pr.createdAt)}</span>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {pr.commentCount}
                      </div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">+{pr.additions}</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">-{pr.deletions}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className={cn("text-[10px]", ciConf.color)}>
                      CI: {ciConf.label}
                    </Badge>
                    <Badge variant="secondary" className={cn("text-[10px]", statusConf.color)}>
                      {statusConf.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
            {paginatedData.length === 0 && (
              <EmptyState onAction={() => alert("Creating PR...")} onSecondaryAction={handleClearFilters} />
            )}
          </div>
          <Pagination
            currentPage={state.currentPage}
            totalItems={totalItems}
            itemsPerPage={state.itemsPerPage}
            onPageChange={handlePageChange}
            itemName="pull requests"
          />
        </CardContent>
      </Card>
    </div>
  );
}
