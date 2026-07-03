"use client";

import { useState } from "react";
import { Bug, TestTube, CheckCircle2, AlertTriangle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const TEST_SUITES = [
  { id: 1, name: "Auth E2E Tests", status: "passed", time: "4m 12s", lastRun: "1h ago", project: "Mervi Platform" },
  { id: 2, name: "Payment Gateway Integration", status: "failed", time: "1m 30s", lastRun: "2h ago", project: "Client Portal" },
  { id: 3, name: "Dashboard Widgets Unit", status: "passed", time: "45s", lastRun: "3h ago", project: "Analytics Engine" },
];

export default function QACenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">QA Center</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Test suites, coverage reports, and QA metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/qa/bug-reports"><Bug className="w-4 h-4 mr-2" />Bug Reports</Link>
          </Button>
          <Button>
            <TestTube className="w-4 h-4 mr-2" />
            Run Test Suite
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">94.2%</p>
              <p className="text-sm text-[var(--foreground-secondary)]">Test Coverage</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Bug className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">12</p>
              <p className="text-sm text-[var(--foreground-secondary)]">Active Bugs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TestTube className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">458</p>
              <p className="text-sm text-[var(--foreground-secondary)]">Tests Executed Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
          <Input 
            placeholder="Search test suites..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 divide-y divide-[var(--border)]">
          {TEST_SUITES.map((suite) => (
            <div key={suite.id} className="p-4 flex items-center justify-between hover:bg-[var(--background-secondary)] transition-colors">
              <div className="flex items-center gap-3">
                {suite.status === "passed" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{suite.name}</p>
                  <p className="text-xs text-[var(--foreground-secondary)] mt-0.5">{suite.project}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-[var(--foreground)]">{suite.time}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{suite.lastRun}</p>
                </div>
                <Button variant="outline" size="sm">View Logs</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
