// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Deploy Center Page
// Refined with App/Env/Status Filters, Pagination, Skeletons, Error Retry, and Empty States
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect } from "react";
import { 
  Rocket, Server, Radio, ArrowUpRight, Activity,
  AlertTriangle, RefreshCcw, Search, Filter, Layers, ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Pagination } from "@/components/ui/pagination";
import { useEnterpriseFilter } from "@/hooks/use-enterprise-filter";
import { useFilterStore } from "@/store/filter.store";
import { EnterpriseFilterBar } from "@/components/ui/enterprise-filter-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { FilterFieldConfig } from "@/types/filter.types";

const DEPLOYMENTS = [
  { id: 1, app: "client-portal", version: "v2.4.1", env: "Production", status: "success", time: "2h ago", user: "Arjun M." },
  { id: 2, app: "mervi-platform", version: "v1.12.0", env: "Staging", status: "success", time: "5h ago", user: "CI/CD" },
  { id: 3, app: "auth-service", version: "v3.0.1", env: "Production", status: "failed", time: "1d ago", user: "Vijay S." },
  { id: 4, app: "user-service", version: "v2.1.0", env: "Production", status: "success", time: "2d ago", user: "Arjun M." },
  { id: 5, app: "tenant-service", version: "v1.5.0", env: "Production", status: "success", time: "3d ago", user: "CI/CD" },
  { id: 6, app: "hr-service", version: "v2.0.2", env: "Production", status: "success", time: "4d ago", user: "HR Team" },
  { id: 7, app: "notification-service", version: "v1.8.4", env: "Staging", status: "success", time: "5d ago", user: "Deepak S." },
  { id: 8, app: "analytics-service", version: "v1.2.1", env: "Production", status: "success", time: "6d ago", user: "Priya K." },
  { id: 9, app: "ai-service", version: "v1.0.0", env: "Staging", status: "success", time: "1w ago", user: "Vijay S." },
  { id: 10, app: "client-service", version: "v2.0.0", env: "Production", status: "failed", time: "1w ago", user: "Arjun M." }
];

// ── Skeletons ──────────────────────────────────────────────────────
function DeploymentsSkeleton() {
  return (
    <div className="space-y-3 animate-pulse p-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex justify-between items-center p-4 border border-[var(--border)] rounded-xl bg-[var(--card-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--background-secondary)]" />
            <div className="space-y-2">
              <div className="h-4 bg-[var(--background-secondary)] rounded w-28" />
              <div className="h-3 bg-[var(--background-secondary)] rounded w-20" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-5 rounded bg-[var(--background-secondary)]" />
            <div className="w-12 h-3 rounded bg-[var(--background-secondary)]" />
          </div>
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
      <h3 className="text-lg font-bold text-[var(--foreground)]">Deploy Service Offline</h3>
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
      <Rocket className="w-12 h-12 text-[var(--foreground-muted)] mb-4" />
      <h3 className="text-lg font-bold text-[var(--foreground)]">No Deployments Found</h3>
      <p className="text-sm text-[var(--foreground-secondary)] mt-2 max-w-sm mb-6">
        No releases match the environment or status filter tags. Create a release to trigger deployment.
      </p>
      <div className="flex gap-2">
        <Button onClick={onAction}><Rocket className="w-4 h-4 mr-2" /> Deploy New Release</Button>
        <Button onClick={onSecondaryAction} variant="outline">Reset Filters</Button>
      </div>
    </div>
  );
}

export default function DeploymentCenterPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (Math.random() < 0.05) {
        setError("Failed to fetch release matrices from deploy-service cluster.");
      }
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    loadData();
  }, []);

  const fieldsConfig: FilterFieldConfig[] = [
    { key: "env", label: "Environment", type: "select", options: [
      { value: "all", label: "All Environments" },
      { value: "Production", label: "Production" },
      { value: "Staging", label: "Staging" },
    ]},
    { key: "status", label: "Status", type: "select", options: [
      { value: "all", label: "All Statuses" },
      { value: "success", label: "Success" },
      { value: "failed", label: "Failed" },
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
    moduleId: "deployments",
    defaultState: {
      search: "",
      filters: {},
      sort: null,
      visibleColumns: {},
      currentPage: 1,
      itemsPerPage: 8,
    },
    data: DEPLOYMENTS,
    searchFields: ["app", "version"],
  });

  const handlePageChange = (page: number) => {
    useFilterStore.getState().updateState("deployments", { currentPage: page });
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-12 w-48 bg-[var(--background-secondary)] rounded animate-pulse" />
        <DeploymentsSkeleton />
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
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Deployment Center</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Manage releases and monitor deployment health.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/deployment/environments"><Radio className="w-4 h-4 mr-2" />Environments</Link>
          </Button>
          <Button onClick={() => alert("Creating a release is handled through Jenkins pipeline webhook.")}>
            <Rocket className="w-4 h-4 mr-2" />
            New Release
          </Button>
        </div>
      </div>

      {/* Enterprise Filter Bar */}
      <EnterpriseFilterBar
        moduleId="deployments"
        fieldsConfig={fieldsConfig}
        state={state}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onRemoveFilter={removeFilter}
        onClearAll={clearAll}
        onApplyView={applyView}
        onSaveView={saveView}
        sortOptions={[
          { value: "app", label: "App Name" },
          { value: "time", label: "Time" },
        ]}
        onSortSelect={setSort}
        filteredData={filteredData}
      >
        <FilterDropdown
          label="Environment"
          value={(state.filters.env as any)?.value || "all"}
          options={fieldsConfig[0].options || []}
          onChange={(val) => setFilter("env", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Status"
          value={(state.filters.status as any)?.value || "all"}
          options={fieldsConfig[1].options || []}
          onChange={(val) => setFilter("status", { type: "select", value: val })}
        />
      </EnterpriseFilterBar>

      {/* Deploy Center Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Deployments</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-full justify-between">
            <div className="divide-y divide-[var(--border)]">
              {paginatedData.map(dep => (
                <div key={dep.id} className="p-4 flex items-center justify-between hover:bg-[var(--background-secondary)]/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      dep.status === "success" ? "bg-emerald-500" : "bg-red-500"
                    )} />
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{dep.app}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-[10px] h-4 px-1">{dep.version}</Badge>
                        <span className="text-[10px] text-[var(--foreground-muted)]">deployed by {dep.user}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={cn(
                      "font-semibold text-[10px]",
                      dep.env === "Production" ? "text-purple-600 border-purple-200 bg-purple-50" : "text-blue-600 border-blue-200 bg-blue-50"
                    )}>
                      {dep.env}
                    </Badge>
                    <span className="text-[10px] text-[var(--foreground-muted)] min-w-[50px] text-right">{dep.time}</span>
                  </div>
                </div>
              ))}
              {paginatedData.length === 0 && (
                <EmptyState onAction={() => alert("Deploying release...")} onSecondaryAction={clearAll} />
              )}
            </div>
            <Pagination
              currentPage={state.currentPage}
              totalItems={totalItems}
              itemsPerPage={state.itemsPerPage}
              onPageChange={handlePageChange}
              itemName="deployments"
            />
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">All Systems Operational</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { name: "API Gateway", status: "Operational", color: "bg-emerald-500" },
                { name: "Auth Service", status: "Operational", color: "bg-emerald-500" },
                { name: "Database Cluster", status: "Degraded", color: "bg-amber-500" },
                { name: "Storage Service", status: "Operational", color: "bg-emerald-500" },
              ].map(service => (
                <div key={service.name} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--foreground-secondary)]">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--foreground-muted)]">{service.status}</span>
                    <div className={cn("w-1.5 h-1.5 rounded-full", service.color)} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
