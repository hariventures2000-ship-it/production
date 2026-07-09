"use client";

import { useState } from "react";
import {
  Bug, Search, Filter, Plus, AlertTriangle, AlertCircle,
  Info, CheckCircle2, Clock, Circle, User, Calendar,
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

// ── Component ────────────────────────────────────────────────────────

export default function BugReportsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const filteredBugs = bugs.filter((bug) => {
    const matchesSearch = bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ? true :
      activeTab === "open" ? bug.status === "OPEN" || bug.status === "IN_PROGRESS" :
      activeTab === "resolved" ? bug.status === "RESOLVED" || bug.status === "CLOSED" :
      activeTab === "critical" ? bug.severity === "CRITICAL" :
      true;
    return matchesSearch && matchesTab;
  });

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

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
            <Input
              placeholder="Search bugs..."
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

      {/* Bug List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {filteredBugs.map((bug) => {
              const severityConf = SEVERITY[bug.severity as keyof typeof SEVERITY];
              const SeverityIcon = severityConf.icon;
              const statusConf = BUG_STATUS[bug.status as keyof typeof BUG_STATUS];

              return (
                <div key={bug.id} className="flex items-start gap-4 p-4 hover:bg-[var(--background-secondary)] transition-colors group">
                  <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", severityConf.dot)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-[var(--foreground-muted)]">{bug.id}</span>
                      <Badge variant="secondary" className={cn("text-[10px]", severityConf.color)}>
                        <SeverityIcon className="w-3 h-3 mr-0.5" />
                        {severityConf.label}
                      </Badge>
                      <Badge variant="secondary" className={cn("text-[10px]", statusConf.color)}>
                        {statusConf.label}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-medium text-[var(--foreground)] mt-1 group-hover:text-[var(--color-primary)] transition-colors cursor-pointer">
                      {bug.title}
                    </h3>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-1 line-clamp-1">{bug.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-[var(--foreground-muted)] flex-wrap">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {bug.reporter}
                      </div>
                      <span>{bug.project}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(bug.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="text-[10px] bg-[var(--color-primary)] text-white">
                        {bug.assigneeInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-[var(--foreground-muted)] hidden sm:block">{bug.assignee}</span>
                  </div>
                </div>
              );
            })}
            {filteredBugs.length === 0 && (
              <div className="p-12 text-center">
                <Bug className="w-8 h-8 text-[var(--foreground-muted)] mx-auto mb-3" />
                <p className="text-sm font-medium text-[var(--foreground)]">No bugs found</p>
                <p className="text-xs text-[var(--foreground-secondary)] mt-1">Great news — or try adjusting your filters!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
