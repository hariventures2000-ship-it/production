"use client";

import { useState } from "react";
import {
  GitPullRequest, GitMerge, Search, Filter, MessageSquare,
  CheckCircle2, XCircle, Clock, CircleDot, Plus, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";

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
    author: "Vijay S.", authorInitials: "VS", repo: "mervi-platform",
    sourceBranch: "security/csrf-protection", targetBranch: "develop",
    status: "MERGED", ciStatus: "passing", reviewCount: 3, commentCount: 8,
    additions: 215, deletions: 12, filesChanged: 5,
    createdAt: "2026-07-01T10:00:00", mergedAt: "2026-07-03T08:45:00", labels: ["security"],
  },
  {
    id: "pr-244", number: 244, title: "Fix Kafka consumer error handling in notification-service",
    author: "Arjun M.", authorInitials: "AM", repo: "mervi-platform",
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
    author: "Sneha P.", authorInitials: "SP", repo: "mervi-platform",
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

// ── Component ────────────────────────────────────────────────────────

export default function PullRequestsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPRs = pullRequests.filter((pr) => {
    const matchesSearch = pr.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ? true :
      activeTab === "mine" ? pr.author === "Vijay S." :
      activeTab === "review" ? pr.status === "OPEN" && pr.reviewCount === 0 :
      activeTab === "merged" ? pr.status === "MERGED" :
      true;
    return matchesSearch && matchesTab;
  });

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
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
        <Button>
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

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="mine">My PRs</TabsTrigger>
            <TabsTrigger value="review">Needs Review</TabsTrigger>
            <TabsTrigger value="merged">Merged</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
            <Input
              placeholder="Search pull requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PR List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {filteredPRs.map((pr) => {
              const statusConf = PR_STATUS[pr.status as keyof typeof PR_STATUS];
              const StatusIcon = statusConf.icon;
              const ciConf = CI_STATUS[pr.ciStatus as keyof typeof CI_STATUS];

              return (
                <div key={pr.id} className="flex items-start gap-4 p-4 hover:bg-[var(--background-secondary)] transition-colors group">
                  <StatusIcon className={cn("w-5 h-5 mt-0.5 shrink-0", statusConf.iconColor)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <h3 className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors cursor-pointer">
                        {pr.title}
                      </h3>
                      {pr.labels.map((label) => (
                        <Badge key={label} variant="secondary" className="text-[9px] px-1.5 py-0">
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
                          <AvatarFallback className="text-[8px] bg-[var(--color-primary)] text-white">{pr.authorInitials}</AvatarFallback>
                        </Avatar>
                        {pr.author}
                      </div>
                      <span>{timeAgo(pr.createdAt)}</span>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {pr.commentCount}
                      </div>
                      <span className="text-emerald-600 dark:text-emerald-400">+{pr.additions}</span>
                      <span className="text-red-600 dark:text-red-400">-{pr.deletions}</span>
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
            {filteredPRs.length === 0 && (
              <div className="p-12 text-center">
                <GitPullRequest className="w-8 h-8 text-[var(--foreground-muted)] mx-auto mb-3" />
                <p className="text-sm font-medium text-[var(--foreground)]">No pull requests found</p>
                <p className="text-xs text-[var(--foreground-secondary)] mt-1">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
