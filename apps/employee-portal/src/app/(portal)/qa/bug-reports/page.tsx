// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Bug Reports Page
// Refined with Severity/Component Filters, Pagination, Skeletons, Error Retry, and Empty States
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect } from "react";
import {
  Bug, Search, Filter, Plus, AlertTriangle, AlertCircle,
  Info, CheckCircle2, Clock, Circle, User, Calendar,
  ShieldAlert, RefreshCcw, Layers, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";
import { Pagination } from "@/components/ui/pagination";
import { useEnterpriseFilter } from "@/hooks/use-enterprise-filter";
import { useFilterStore } from "@/store/filter.store";
import { EnterpriseFilterBar } from "@/components/ui/enterprise-filter-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { FilterFieldConfig } from "@/types/filter.types";

// ── Mock Data ────────────────────────────────────────────────────────

const bugStats = [
  { label: "Open Bugs", value: 12, icon: Bug, color: "text-red-500", bg: "bg-red-500/10" },
  { label: "Critical", value: 2, icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-500/10" },
  { label: "Resolved This Week", value: 8, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Avg Resolution", value: "1.8d", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
];

const bugs = [
  {
    id: "BUG-042", title: "CSRF token mismatch on Firefox browsers",
    severity: "CRITICAL", status: "OPEN", assignee: "Arjun M.", assigneeInitials: "AM",
    reporter: "Vijay S.", project: "Auth Service", createdAt: "2026-07-01",
    description: "Users on Firefox are randomly getting 403 Forbidden errors due to CSRF cookie parsing issues with SameSite attribute.",
  },
  {
    id: "BUG-041", title: "Dashboard widgets not loading after session timeout",
    severity: "MAJOR", status: "IN_PROGRESS", assignee: "Priya K.", assigneeInitials: "PK",
    reporter: "Deepak S.", project: "Employee Portal", createdAt: "2026-06-30",
    description: "When a user's session expires while on the dashboard, the widgets show infinite loading spinners instead of redirecting to login.",
  },
  {
    id: "BUG-040", title: "Notification sound plays multiple times",
    severity: "MINOR", status: "OPEN", assignee: "Sneha P.", assigneeInitials: "SP",
    reporter: "Priya K.", project: "Notification Service", createdAt: "2026-06-29",
    description: "WebSocket reconnections cause duplicate notification sound events to fire for a single notification.",
  },
  {
    id: "BUG-039", title: "Leave balance calculation off by one day",
    severity: "MAJOR", status: "RESOLVED", assignee: "Vijay S.", assigneeInitials: "VS",
    reporter: "HR Team", project: "Employee Service", createdAt: "2026-06-28",
    description: "When applying for leave that spans a weekend, the deducted days incorrectly include Saturday and Sunday.",
  },
  {
    id: "BUG-038", title: "PDF invoice generation fails for amounts > ₹1,00,000",
    severity: "CRITICAL", status: "IN_PROGRESS", assignee: "Vijay S.", assigneeInitials: "VS",
    reporter: "Arjun M.", project: "Client Service", createdAt: "2026-06-27",
    description: "The PDF rendering library throws a NumberFormatException when formatting amounts using Indian number system with lakhs separator.",
  },
  {
    id: "BUG-037", title: "Avatar image not rendering in team directory",
    severity: "TRIVIAL", status: "RESOLVED", assignee: "Priya K.", assigneeInitials: "PK",
    reporter: "Sneha P.", project: "Employee Portal", createdAt: "2026-06-26",
    description: "Cloudinary image URLs are being blocked by Content Security Policy headers. Need to add domain to CSP img-src.",
  },
  {
    id: "BUG-036", title: "Search results duplicated when using pagination",
    severity: "MINOR", status: "CLOSED", assignee: "Arjun M.", assigneeInitials: "AM",
    reporter: "Deepak S.", project: "API Gateway", createdAt: "2026-06-25",
    description: "The paginated search endpoint returns overlapping results between pages due to incorrect offset calculation.",
  },
  {
    id: "BUG-035", title: "Dark mode toggle resets on page refresh",
    severity: "MINOR", status: "CLOSED", assignee: "Sneha P.", assigneeInitials: "SP",
    reporter: "Priya K.", project: "Employee Portal", createdAt: "2026-06-24",
    description: "Theme preference is stored in React state but not persisted to localStorage, causing it to reset on navigation.",
  },
];

const SEVERITY = {
  CRITICAL: { label: "Critical", icon: AlertTriangle, color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950", dot: "bg-red-500" },
  MAJOR: { label: "Major", icon: AlertCircle, color: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950", dot: "bg-orange-500" },
  MINOR: { label: "Minor", icon: Info, color: "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950", dot: "bg-yellow-500" },
  TRIVIAL: { label: "Trivial", icon: Circle, color: "text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-800", dot: "bg-slate-400" },
} as const;

const BUG_STATUS = {
  OPEN: { label: "Open", color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950" },
  RESOLVED: { label: "Resolved", color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950" },
  CLOSED: { label: "Closed", color: "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800" },
} as const;

// ── Skeletons ──────────────────────────────────────────────────────
function BugsSkeleton() {
  return (
    <div className="space-y-3 animate-pulse p-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border border-[var(--border)] rounded-xl bg-[var(--card-bg)]">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--background-secondary)] mt-1.5 shrink-0" />
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
      <h3 className="text-lg font-bold text-[var(--foreground)]">Defect Service Error</h3>
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
      <Bug className="w-12 h-12 text-[var(--foreground-muted)] mb-4" />
      <h3 className="text-lg font-bold text-[var(--foreground)]">No Bugs Found</h3>
      <p className="text-sm text-[var(--foreground-secondary)] mt-2 max-w-sm mb-6">
        No defect reports match the query. If you found a new issue, please report it immediately!
      </p>
      <div className="flex gap-2">
        <Button onClick={onAction}><Plus className="w-4 h-4 mr-2" /> Report Bug</Button>
        <Button onClick={onSecondaryAction} variant="outline">Clear Filters</Button>
      </div>
    </div>
  );
}

export default function BugReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (Math.random() < 0.05) {
        setError("Failed to resolve bug queries from employee-service database endpoint.");
      }
      setLoading(false);
    }, 450);
  };

  useEffect(() => {
    loadData();
  }, []);

  const fieldsConfig: FilterFieldConfig[] = [
    { key: "severity", label: "Severity", type: "select", options: [
      { value: "all", label: "All Severities" },
      { value: "CRITICAL", label: "Critical" },
      { value: "MAJOR", label: "Major" },
      { value: "MINOR", label: "Minor" },
      { value: "TRIVIAL", label: "Trivial" },
    ]},
    { key: "project", label: "Component", type: "select", options: [
      { value: "all", label: "All Components" },
      { value: "Auth Service", label: "Auth Service" },
      { value: "Employee Portal", label: "Employee Portal" },
      { value: "Notification Service", label: "Notification Service" },
      { value: "Client Service", label: "Client Service" },
      { value: "API Gateway", label: "API Gateway" },
    ]},
    { key: "status", label: "Status", type: "select", options: [
      { value: "all", label: "All Statuses" },
      { value: "OPEN", label: "Open" },
      { value: "IN_PROGRESS", label: "In Progress" },
      { value: "RESOLVED", label: "Resolved" },
      { value: "CLOSED", label: "Closed" },
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
    moduleId: "bug-reports",
    defaultState: {
      search: "",
      filters: {},
      sort: null,
      visibleColumns: {},
      currentPage: 1,
      itemsPerPage: 8,
    },
    data: bugs,
    searchFields: ["title", "id", "description", "project"],
  });

  const handlePageChange = (page: number) => {
    useFilterStore.getState().updateState("bug-reports", { currentPage: page });
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-12 w-48 bg-[var(--background-secondary)] rounded animate-pulse" />
        <BugsSkeleton />
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
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Bug Reports</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Track, manage, and resolve identified defects across the platform.
          </p>
        </div>
        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Report Bug
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>Report a Bug</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="Brief description of the issue..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="trivial">Trivial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auth">Auth Service</SelectItem>
                      <SelectItem value="employee">Employee Portal</SelectItem>
                      <SelectItem value="notification">Notification Service</SelectItem>
                      <SelectItem value="client">Client Service</SelectItem>
                      <SelectItem value="gateway">API Gateway</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Steps to Reproduce</Label>
                <Textarea placeholder="1. Go to...\n2. Click on...\n3. Observe..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expected Behavior</Label>
                  <Textarea placeholder="What should happen..." rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Actual Behavior</Label>
                  <Textarea placeholder="What actually happens..." rows={2} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setReportDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setReportDialogOpen(false)}>Submit Bug Report</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {bugStats.map((stat) => {
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

      {/* Enterprise Filter Bar */}
      <EnterpriseFilterBar
        moduleId="bug-reports"
        fieldsConfig={fieldsConfig}
        state={state}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onRemoveFilter={removeFilter}
        onClearAll={clearAll}
        onApplyView={applyView}
        onSaveView={saveView}
        sortOptions={[
          { value: "id", label: "Bug ID" },
          { value: "severity", label: "Severity" },
          { value: "createdAt", label: "Created Date" },
        ]}
        onSortSelect={setSort}
        filteredData={filteredData}
      >
        <FilterDropdown
          label="Severity"
          value={(state.filters.severity as any)?.value || "all"}
          options={fieldsConfig[0].options || []}
          onChange={(val) => setFilter("severity", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Component"
          value={(state.filters.project as any)?.value || "all"}
          options={fieldsConfig[1].options || []}
          onChange={(val) => setFilter("project", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Status"
          value={(state.filters.status as any)?.value || "all"}
          options={fieldsConfig[2].options || []}
          onChange={(val) => setFilter("status", { type: "select", value: val })}
        />
      </EnterpriseFilterBar>

      {/* Bug List */}
      <Card>
        <CardContent className="p-0 flex flex-col h-full justify-between">
          <div className="divide-y divide-[var(--border)]">
            {paginatedData.map((bug) => {
              const severityConf = SEVERITY[bug.severity as keyof typeof SEVERITY] || SEVERITY.MINOR;
              const SeverityIcon = severityConf.icon;
              const statusConf = BUG_STATUS[bug.status as keyof typeof BUG_STATUS] || BUG_STATUS.OPEN;

              return (
                <div key={bug.id} className="flex items-start gap-4 p-4 hover:bg-[var(--background-secondary)]/40 transition-colors group">
                  <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", severityConf.dot)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-[var(--foreground-muted)]">{bug.id}</span>
                      <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors cursor-pointer leading-tight">
                        {bug.title}
                      </h3>
                      <Badge variant="secondary" className={cn("text-[9px] px-1.5 py-0 font-semibold", severityConf.color)}>
                        <SeverityIcon className="w-2.5 h-2.5 mr-0.5 inline" /> {severityConf.label}
                      </Badge>
                      <Badge variant="secondary" className={cn("text-[9px] px-1.5 py-0 font-semibold", statusConf.color)}>
                        {statusConf.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-1.5 line-clamp-2">
                      {bug.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-[10px] text-[var(--foreground-muted)] flex-wrap">
                      <span>Reporter: {bug.reporter}</span>
                      <span>Assignee: {bug.assignee}</span>
                      <span>Service: {bug.project}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(bug.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
            {paginatedData.length === 0 && (
              <EmptyState onAction={() => setReportDialogOpen(true)} onSecondaryAction={clearAll} />
            )}
          </div>
          <Pagination
            currentPage={state.currentPage}
            totalItems={totalItems}
            itemsPerPage={state.itemsPerPage}
            onPageChange={handlePageChange}
            itemName="bugs"
          />
        </CardContent>
      </Card>
    </div>
  );
}
