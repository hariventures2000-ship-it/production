// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — QA Center Page
// Complete tabbed view supporting Coverage reports, Bug tracking, Test automation & Regression
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { 
  Bug, TestTube, CheckCircle2, AlertTriangle, Search, Filter,
  Play, RefreshCw, Cpu, Layers, ClipboardCheck, ArrowUpRight, BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

// ── Mock Data for QA Center ────────────────────────────────────────

const testSuites = [
  { id: 1, name: "Auth E2E Web Suite", status: "passed", time: "4m 12s", lastRun: "1h ago", project: "Mervi Platform", rate: 100 },
  { id: 2, name: "Payment Gateway Integration", status: "failed", time: "1m 30s", lastRun: "2h ago", project: "Client Portal", rate: 82 },
  { id: 3, name: "Dashboard Widgets Unit", status: "passed", time: "45s", lastRun: "3h ago", project: "Analytics Engine", rate: 100 },
];

const mockBugs = [
  { id: "BUG-042", title: "CSRF token mismatch on Firefox browser forms", severity: "Critical", status: "Open", owner: "Arjun M." },
  { id: "BUG-038", title: "PDF invoice generation failure for amounts > ₹1,00,000", severity: "Critical", status: "Triaged", owner: "Vijay S." },
  { id: "BUG-040", title: "Notification sound plays multiple times on parallel tabs", severity: "Minor", status: "Fixed", owner: "Sneha P." }
];

const coverageDetails = [
  { name: "Statement Coverage", value: 94.2, color: "bg-emerald-500" },
  { name: "Branch Coverage", value: 89.5, color: "bg-blue-500" },
  { name: "Function Coverage", value: 92.0, color: "bg-purple-500" },
  { name: "Line Coverage", value: 95.8, color: "bg-indigo-500" }
];

const regressionChecklist = [
  { id: "reg-1", task: "Multi-tenant partition security validation", checked: true },
  { id: "reg-2", task: "Payment gateway integration sanity check", checked: false },
  { id: "reg-3", task: "Keyboard focus state & WCAG AA verification", checked: true },
  { id: "reg-4", task: "Kafka event broker replication test", checked: false }
];

export default function QACenterPage() {
  const [activeTab, setActiveTab] = useState<string>("suites");
  const [executingSuite, setExecutingSuite] = useState<number | null>(null);
  const [regressionState, setRegressionState] = useState(regressionChecklist);

  const handleRunSuite = (id: number, name: string) => {
    setExecutingSuite(id);
    toast.info(`Triggered run for: ${name}`);
    setTimeout(() => {
      setExecutingSuite(null);
      toast.success(`Suite "${name}" completed successfully. All tests passed.`);
    }, 2000);
  };

  const handleToggleChecklist = (id: string) => {
    setRegressionState(prev => prev.map(item => {
      if (item.id === id) {
        const nextChecked = !item.checked;
        toast.info(`${nextChecked ? "Checked" : "Unchecked"} regression item: ${item.task}`);
        return { ...item, checked: nextChecked };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">QA Center</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Track test coverage matrices, file bugs, trigger automated suites, and verify regression checklists.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => toast.info("Report bugs through the Bug Reports page link.")}>
            <Bug className="w-4 h-4 mr-2" />
            File Bug Report
          </Button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--foreground)]">94.2%</p>
              <p className="text-xs text-[var(--foreground-muted)]">Global Code Coverage</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--foreground)]">{mockBugs.filter(b => b.status !== "Fixed").length} Open</p>
              <p className="text-xs text-[var(--foreground-muted)]">Active Bug Defects</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <TestTube className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--foreground)]">458</p>
              <p className="text-xs text-[var(--foreground-muted)]">Tests Completed Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs list container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b border-[var(--border)] bg-[var(--background-secondary)]/50 px-4 pt-1 rounded-xl shrink-0 overflow-x-auto">
          <TabsList className="h-10 bg-transparent flex justify-start gap-4 p-0">
            <TabsTrigger value="suites" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Test Suites & Coverage</TabsTrigger>
            <TabsTrigger value="bugs" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Bugs & Issues</TabsTrigger>
            <TabsTrigger value="automation" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Automation Logs</TabsTrigger>
            <TabsTrigger value="regression" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Regression Checklist</TabsTrigger>
          </TabsList>
        </div>

        {/* 1. TEST SUITES & COVERAGE */}
        <TabsContent value="suites" className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 m-0 focus:outline-none">
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tracked Test Suites</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-[var(--border)] text-xs">
              {testSuites.map((suite) => (
                <div key={suite.id} className="p-4 flex items-center justify-between hover:bg-[var(--background-secondary)]/40 transition-colors">
                  <div className="flex items-center gap-3">
                    {suite.status === "passed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{suite.name}</p>
                      <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">{suite.project} · Accuracy: {suite.rate}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{suite.time}</p>
                      <p className="text-[10px] text-[var(--foreground-muted)]">Run {suite.lastRun}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-[10px]"
                      onClick={() => handleRunSuite(suite.id, suite.name)}
                      disabled={executingSuite === suite.id}
                    >
                      {executingSuite === suite.id ? <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Play className="w-3.5 h-3.5 mr-1 text-[var(--color-primary)]" />}
                      Execute
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Coverage Matrices</CardTitle>
              <CardDescription>Statements, branches, and functional path coverage indices.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {coverageDetails.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[var(--foreground-secondary)]">{item.name}</span>
                    <span className="font-bold text-[var(--foreground)]">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-1.5" indicatorClassName={item.color} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. BUGS & ISSUES */}
        <TabsContent value="bugs" className="space-y-4 m-0 focus:outline-none text-xs">
          <Card className="shadow-xs">
            <CardContent className="p-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--background-secondary)] border-b border-[var(--border)] text-[var(--foreground-muted)] font-semibold">
                    <th className="p-3">Bug ID</th>
                    <th className="p-3">Summary</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {mockBugs.map((bug) => (
                    <tr key={bug.id} className="hover:bg-[var(--background-secondary)]/20">
                      <td className="p-3 font-mono font-semibold text-[var(--color-primary)]">{bug.id}</td>
                      <td className="p-3 text-[var(--foreground)] font-semibold">{bug.title}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={cn("text-[9px] border-none font-bold", bug.severity === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700')}>{bug.severity}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary" className="text-[9px] font-semibold">{bug.status}</Badge>
                      </td>
                      <td className="p-3 text-right text-[var(--foreground-secondary)]">{bug.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. AUTOMATION LOGS */}
        <TabsContent value="automation" className="space-y-4 m-0 focus:outline-none text-xs">
          <Card className="shadow-xs bg-[var(--card-bg)] border border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-base">CI Automation Cron Schedules</CardTitle>
              <CardDescription>Scheduled integration, stress, and smoke testing triggers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Nightly E2E Integration Suite", cron: "0 2 * * * (Every night at 2:00 AM)", target: "mervi-platform" },
                { name: "Staging Release Build Sanity", cron: "Webhook triggered on Staging branch push", target: "client-portal" }
              ].map((cron, idx) => (
                <div key={idx} className="p-3.5 border border-[var(--border)] rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-xs text-[var(--foreground)]">{cron.name}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)] mt-1">Schedule: {cron.cron} · Target: {cron.target}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[var(--color-primary)]" onClick={() => toast.success(`Triggered manual execution of ${cron.name}`)}>
                    Run Now
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. REGRESSION CHECKLIST */}
        <TabsContent value="regression" className="space-y-4 m-0 focus:outline-none text-xs">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Staging Release Regression Checklist</CardTitle>
              <CardDescription>Sanity verification criteria required before deploying staging builds into production clusters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {regressionState.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => handleToggleChecklist(item.id)}
                  className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-xl bg-[var(--card-bg)] hover:bg-[var(--background-secondary)]/30 cursor-pointer transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                    item.checked ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white" : "border-[var(--border)]"
                  )}>
                    {item.checked && <CheckIcon className="w-3 h-3" />}
                  </div>
                  <span className={cn("text-xs font-semibold", item.checked ? "line-through text-[var(--foreground-muted)]" : "text-[var(--foreground)]")}>
                    {item.task}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Simple Helper CheckIcon ────────────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}
