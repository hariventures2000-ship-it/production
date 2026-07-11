"use client";

import {
  Radio, CheckCircle2, AlertTriangle, XCircle, ArrowRight,
  RotateCcw, Clock, Server, Activity, Globe, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";

// ── Mock Data ────────────────────────────────────────────────────────

const environments = [
  {
    id: "dev", name: "Development", url: "dev.mervi.internal",
    health: "healthy", version: "v2.5.0-dev.48", uptime: 99.2,
    lastDeploy: "2026-07-03T16:45:00", deployedBy: "CI/CD Bot",
    services: 10, healthyServices: 10,
  },
  {
    id: "staging", name: "Staging", url: "staging.mervi.internal",
    health: "healthy", version: "v2.4.1", uptime: 99.8,
    lastDeploy: "2026-07-03T07:30:00", deployedBy: "Vijay S.",
    services: 10, healthyServices: 10,
  },
  {
    id: "uat", name: "UAT", url: "uat.mervi.internal",
    health: "degraded", version: "v2.4.0", uptime: 97.5,
    lastDeploy: "2026-06-30T14:00:00", deployedBy: "Vijay S.",
    services: 10, healthyServices: 8,
  },
  {
    id: "production", name: "Production", url: "api.hariventure.com",
    health: "healthy", version: "v2.3.2", uptime: 99.95,
    lastDeploy: "2026-06-25T02:00:00", deployedBy: "Release Pipeline",
    services: 10, healthyServices: 10,
  },
];

const serviceHealth = [
  { name: "API Gateway", dev: "healthy", staging: "healthy", uat: "healthy", production: "healthy", port: 8080 },
  { name: "Auth Service", dev: "healthy", staging: "healthy", uat: "healthy", production: "healthy", port: 8081 },
  { name: "User Service", dev: "healthy", staging: "healthy", uat: "healthy", production: "healthy", port: 8082 },
  { name: "Tenant Service", dev: "healthy", staging: "healthy", uat: "healthy", production: "healthy", port: 8083 },
  { name: "HR Service", dev: "healthy", staging: "healthy", uat: "degraded", production: "healthy", port: 8086 },
  { name: "Employee Service", dev: "healthy", staging: "healthy", uat: "healthy", production: "healthy", port: 8088 },
  { name: "Client Service", dev: "healthy", staging: "healthy", uat: "down", production: "healthy", port: 8089 },
  { name: "Notification Service", dev: "healthy", staging: "healthy", uat: "healthy", production: "healthy", port: 8090 },
  { name: "Analytics Service", dev: "healthy", staging: "healthy", uat: "healthy", production: "healthy", port: 8091 },
  { name: "AI Service", dev: "healthy", staging: "healthy", uat: "healthy", production: "healthy", port: 8092 },
];

const HEALTH_STATUS = {
  healthy: { label: "Healthy", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500", badge: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950" },
  degraded: { label: "Degraded", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500", badge: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950" },
  down: { label: "Down", icon: XCircle, color: "text-red-500", bg: "bg-red-500", badge: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950" },
} as const;

const ENV_COLORS = {
  dev: "border-blue-500/30",
  staging: "border-amber-500/30",
  uat: "border-purple-500/30",
  production: "border-emerald-500/30",
} as const;

// ── Helper Utilities ──────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── Component ────────────────────────────────────────────────────────

export default function EnvironmentsPage() {

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Environments</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Manage and monitor development, staging, UAT, and production environments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Rollback
          </Button>
          <Button>
            <ArrowRight className="w-4 h-4 mr-2" />
            Promote to Staging
          </Button>
        </div>
      </div>

      {/* Environment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {environments.map((env) => {
          const healthConf = HEALTH_STATUS[env.health as keyof typeof HEALTH_STATUS];
          const HealthIcon = healthConf.icon;
          return (
            <Card key={env.id} className={cn("border-l-4", ENV_COLORS[env.id as keyof typeof ENV_COLORS])}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-[var(--foreground)]">{env.name}</h3>
                      <Badge variant="secondary" className={cn("text-[10px]", healthConf.badge)}>
                        <HealthIcon className="w-3 h-3 mr-1" />
                        {healthConf.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                      <Globe className="w-3 h-3" />
                      {env.url}
                    </div>
                  </div>
                  <div className={cn("w-3 h-3 rounded-full animate-pulse", healthConf.bg)} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] font-semibold mb-0.5">Version</p>
                    <p className="text-sm font-mono font-medium text-[var(--foreground)]">{env.version}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] font-semibold mb-0.5">Uptime</p>
                    <p className="text-sm font-bold text-[var(--foreground)]">{env.uptime}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] font-semibold mb-0.5">Last Deploy</p>
                    <p className="text-xs text-[var(--foreground-secondary)]">{timeAgo(env.lastDeploy)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] font-semibold mb-0.5">Deployed By</p>
                    <p className="text-xs text-[var(--foreground-secondary)]">{env.deployedBy}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[var(--foreground-muted)]">Services</span>
                    <span className="font-medium text-[var(--foreground)]">{env.healthyServices}/{env.services} healthy</span>
                  </div>
                  <Progress value={(env.healthyServices / env.services) * 100} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Service Health Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--foreground-muted)]" />
            Service Health Matrix
          </CardTitle>
          <CardDescription>Real-time health status of each microservice across all environments.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                  <th className="text-left p-3 font-medium text-[var(--foreground-secondary)]">Service</th>
                  <th className="text-center p-3 font-medium text-[var(--foreground-secondary)]">Port</th>
                  <th className="text-center p-3 font-medium text-[var(--foreground-secondary)]">Dev</th>
                  <th className="text-center p-3 font-medium text-[var(--foreground-secondary)]">Staging</th>
                  <th className="text-center p-3 font-medium text-[var(--foreground-secondary)]">UAT</th>
                  <th className="text-center p-3 font-medium text-[var(--foreground-secondary)]">Production</th>
                </tr>
              </thead>
              <tbody>
                {serviceHealth.map((svc) => (
                  <tr key={svc.name} className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Server className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                        <span className="font-medium text-[var(--foreground)]">{svc.name}</span>
                      </div>
                    </td>
                    <td className="text-center p-3">
                      <span className="text-xs font-mono text-[var(--foreground-muted)]">{svc.port}</span>
                    </td>
                    {(["dev", "staging", "uat", "production"] as const).map((env) => {
                      const status = svc[env] as keyof typeof HEALTH_STATUS;
                      const conf = HEALTH_STATUS[status];
                      return (
                        <td key={env} className="text-center p-3">
                          <div className="flex items-center justify-center">
                            <div className={cn("w-2.5 h-2.5 rounded-full", conf.bg)} title={conf.label} />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
