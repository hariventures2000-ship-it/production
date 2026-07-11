// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Deploy Center Page
// Complete Upgrade with Pipeline Details Sheet, Log Console Emulator, and Rollback Controls
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Rocket, Server, Radio, ArrowUpRight, Activity,
  AlertTriangle, RefreshCcw, Search, Filter, Layers, ShieldAlert,
  ChevronRight, X, Terminal, Cpu, Clock, History, Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { Pagination } from "@/components/ui/pagination";
import { useEnterpriseFilter } from "@/hooks/use-enterprise-filter";
import { useFilterStore } from "@/store/filter.store";
import { EnterpriseFilterBar } from "@/components/ui/enterprise-filter-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { FilterFieldConfig } from "@/types/filter.types";

const MOCK_DEPLOYMENTS_FULL = [
  { id: "dep-1", app: "client-portal", version: "v2.4.1", env: "Production", status: "success", time: "2 hours ago", user: "Arjun M.", commit: "f2c3b4d", logs: [
    "[INFO] Initializing production build environment...",
    "[INFO] Fetching node_modules cache: hit",
    "[INFO] Compiling Next.js client-portal modules...",
    "[WARN] Compiled client-portal with 3 minor CSS warnings.",
    "[INFO] Creating production artifacts optimization...",
    "[INFO] Uploading artifacts to Kubernetes registry: success",
    "[INFO] Deploying ingress controllers & rolling update: success",
    "[INFO] Deployment client-portal v2.4.1 successfully completed."
  ], envVars: { NODE_ENV: "production", PORT: "3000", GATEWAY_URL: "https://api.mervi.internal" } },
  { id: "dep-2", app: "mervi-platform", version: "v1.12.0", env: "Staging", status: "success", time: "5 hours ago", user: "CI/CD", commit: "a1b2c3d", logs: [
    "[INFO] Running lint checks on codebase...",
    "[INFO] Running unit test assertions...",
    "[INFO] Build finished. Triggering pipeline runner...",
    "[INFO] Deployment v1.12.0 to Staging successfully completed."
  ], envVars: { NODE_ENV: "staging", DB_POOL_SIZE: "20" } },
  { id: "dep-3", app: "auth-service", version: "v3.0.1", env: "Production", status: "failed", time: "1 day ago", user: "Vijay S.", commit: "9c8b7a6", logs: [
    "[INFO] Initializing production deployment for auth-service...",
    "[INFO] Pulling Docker image: registry.mervi.internal/auth-service:v3.0.1...",
    "[INFO] Starting container instance...",
    "[ERROR] WebServerStartFailedException: Port 8081 already in use.",
    "[INFO] Shutting down connection pools...",
    "[ERROR] Deployment rolled back to v3.0.0 due to application crash."
  ], envVars: { NODE_ENV: "production", PORT: "8081", JWT_EXPIRY: "3600" } }
];

export default function DeploymentCenterPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepId, setSelectedDepId] = useState<string | null>(null);
  const [rollbackLoading, setRollbackLoading] = useState(false);

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
    data: MOCK_DEPLOYMENTS_FULL,
    searchFields: ["app", "version"],
  });

  const selectedDep = useMemo(() => {
    return MOCK_DEPLOYMENTS_FULL.find(d => d.id === selectedDepId) || null;
  }, [selectedDepId]);

  const handlePageChange = (page: number) => {
    useFilterStore.getState().updateState("deployments", { currentPage: page });
  };

  const handleRollback = (app: string, prevVersion: string) => {
    setRollbackLoading(true);
    toast.info(`Initiating Rollback for ${app} to previous stable version...`);
    setTimeout(() => {
      setRollbackLoading(false);
      setSelectedDepId(null);
      toast.success(`Rollback completed successfully! deployed ${app} v3.0.0 stable.`);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-12 w-48 bg-[var(--background-secondary)] rounded animate-pulse" />
        <div className="h-40 bg-[var(--background-secondary)] rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Deployment Center</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Track active system releases, pipelines, and trigger production rollback tasks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast.info("IT infrastructure environments list loaded.")}>
            <Radio className="w-4 h-4 mr-2" />
            Environments
          </Button>
          <Button onClick={() => toast.info("New deployments are triggered through Jenkins webhook pipeline.")}>
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
        <Card className="col-span-1 lg:col-span-2 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">Recent Deployments</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-full justify-between">
            <div className="divide-y divide-[var(--border)]">
              {paginatedData.map(dep => (
                <div 
                  key={dep.id} 
                  onClick={() => setSelectedDepId(dep.id)}
                  className="p-4 flex items-center justify-between hover:bg-[var(--background-secondary)]/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      dep.status === "success" ? "bg-emerald-500" : "bg-red-500"
                    )} />
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors">{dep.app}</p>
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
                <div className="py-12 text-center text-xs text-[var(--foreground-muted)]">No deployments found matching the criteria.</div>
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

        <Card className="h-fit shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium text-[var(--foreground)]">All Systems Operational</span>
              </div>
            </div>
            
            <div className="space-y-3 text-xs">
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

      {/* Slide-out Pipeline Detail Drawer */}
      <Sheet open={selectedDepId !== null} onOpenChange={(open) => { if (!open) setSelectedDepId(null); }}>
        <SheetContent className="sm:max-w-[620px] p-0 flex flex-col h-full bg-[var(--card-bg)] border-l border-[var(--border)] shadow-2xl">
          {selectedDep && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-[var(--border)] bg-[var(--background-secondary)]/50 flex items-start justify-between shrink-0">
                <div className="space-y-1.5 pr-8 text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-[9px] border-none font-semibold uppercase", selectedDep.status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
                      {selectedDep.status}
                    </Badge>
                    <Badge variant="outline" className="text-[9px] border-none font-mono font-semibold bg-blue-50 text-blue-700">
                      Version: {selectedDep.version}
                    </Badge>
                  </div>
                  <SheetTitle className="text-xl font-bold text-[var(--foreground)] mt-2">
                    {selectedDep.app}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-[var(--foreground-secondary)] mt-1">
                    Release deployed by {selectedDep.user} ({selectedDep.time}) · Commit: <code className="font-mono bg-[var(--background-secondary)] px-1 rounded">{selectedDep.commit}</code>
                  </SheetDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  onClick={() => setSelectedDepId(null)}
                  className="rounded-full text-[var(--foreground-muted)] hover:text-[var(--foreground)] shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="logs" className="flex-1 flex flex-col min-h-0">
                <div className="px-6 border-b border-[var(--border)] bg-[var(--background-secondary)]/30 shrink-0">
                  <TabsList className="flex gap-2 justify-start h-11 bg-transparent p-0 border-b-0">
                    <TabsTrigger value="logs" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Pipeline Logs</TabsTrigger>
                    <TabsTrigger value="env" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Environment</TabsTrigger>
                    {selectedDep.status === "failed" && (
                      <TabsTrigger value="rollback" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Rollback Actions</TabsTrigger>
                    )}
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 text-xs">
                  {/* LOGS TAB */}
                  <TabsContent value="logs" className="space-y-4 m-0 focus:outline-none flex flex-col h-full min-h-0">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-1.5">
                      <Terminal className="w-4 h-4" /> Pipeline Logs Console
                    </h4>
                    <pre className="flex-1 min-h-[300px] p-4 bg-slate-950 text-slate-100 rounded-xl font-mono text-[10px] overflow-y-auto border border-slate-900 leading-relaxed shadow-inner">
                      {selectedDep.logs.join("\n")}
                    </pre>
                  </TabsContent>

                  {/* ENVIRONMENT VARIABLES TAB */}
                  <TabsContent value="env" className="space-y-4 m-0 focus:outline-none">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" /> Deployment Env Variables
                    </h4>
                    <div className="border border-[var(--border)] rounded-xl overflow-hidden divide-y divide-[var(--border)] bg-[var(--card-bg)] shadow-xs">
                      {Object.entries(selectedDep.envVars).map(([key, val]) => (
                        <div key={key} className="flex justify-between p-3">
                          <code className="font-semibold font-mono text-xs">{key}</code>
                          <code className="font-mono text-xs text-[var(--foreground-secondary)]">{val}</code>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* ROLLBACK ACTIONS TAB */}
                  <TabsContent value="rollback" className="space-y-4 m-0 focus:outline-none">
                    <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/20 dark:bg-red-950/10 space-y-3">
                      <div className="flex gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-xs text-[var(--foreground)]">Deploy Rollback Action Required</h4>
                          <p className="text-[10px] text-[var(--foreground-secondary)] mt-1 leading-relaxed">
                            This deployment failed health checks due to a container crash. Rolling back will revert the cluster to the last stable release configuration (**v3.0.0**).
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => handleRollback(selectedDep.app, selectedDep.version)}
                        disabled={rollbackLoading}
                      >
                        {rollbackLoading ? <RefreshCcw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <History className="w-3.5 h-3.5 mr-1.5" />}
                        Trigger Production Rollback
                      </Button>
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
