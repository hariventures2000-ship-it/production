"use client";

import { useState } from "react";
import { Rocket, Server, Radio, ArrowUpRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/cn";

const DEPLOYMENTS = [
  { id: 1, app: "client-portal", version: "v2.4.1", env: "Production", status: "success", time: "2h ago", user: "Arjun M." },
  { id: 2, app: "mervi-platform", version: "v1.12.0", env: "Staging", status: "success", time: "5h ago", user: "CI/CD" },
  { id: 3, app: "auth-service", version: "v3.0.1", env: "Production", status: "failed", time: "1d ago", user: "Vijay S." },
];

export default function DeploymentCenterPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
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
          <Button>
            <Rocket className="w-4 h-4 mr-2" />
            New Release
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Deployments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {DEPLOYMENTS.map(dep => (
                <div key={dep.id} className="p-4 flex items-center justify-between hover:bg-[var(--background-secondary)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      dep.status === "success" ? "bg-emerald-500" : "bg-red-500"
                    )} />
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{dep.app}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-[10px] h-4 px-1">{dep.version}</Badge>
                        <span className="text-xs text-[var(--foreground-muted)]">deployed by {dep.user}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={cn(
                      "font-medium",
                      dep.env === "Production" ? "text-purple-600 border-purple-200 bg-purple-50" : "text-blue-600 border-blue-200 bg-blue-50"
                    )}>
                      {dep.env}
                    </Badge>
                    <span className="text-xs text-[var(--foreground-muted)] min-w-[50px] text-right">{dep.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
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
