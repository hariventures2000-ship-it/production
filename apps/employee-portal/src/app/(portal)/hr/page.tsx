"use client";

import { useState } from "react";
import {
  CalendarDays, Clock, Users, TreePalm, Thermometer,
  GraduationCap, Plus, ChevronRight, Circle, CheckCircle2,
  XCircle, Timer, Building2, Mail, Phone, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import { Pagination } from "@/components/ui/pagination";
import { useEnterpriseFilter } from "@/hooks/use-enterprise-filter";
import { useFilterStore } from "@/store/filter.store";
import { EnterpriseFilterBar } from "@/components/ui/enterprise-filter-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { FilterFieldConfig } from "@/types/filter.types";
import { useMemo } from "react";

// ── Mock Data ────────────────────────────────────────────────────────

const leaveBalances = [
  { type: "Casual Leave", used: 4, total: 12, color: "text-blue-500", bg: "bg-blue-500", icon: CalendarDays },
  { type: "Sick Leave", used: 2, total: 8, color: "text-amber-500", bg: "bg-amber-500", icon: Thermometer },
  { type: "Earned Leave", used: 5, total: 15, color: "text-emerald-500", bg: "bg-emerald-500", icon: TreePalm },
  { type: "Comp Off", used: 0, total: 3, color: "text-purple-500", bg: "bg-purple-500", icon: Clock },
];

const leaveHistory = [
  { id: "LR-001", type: "Casual Leave", from: "2026-07-14", to: "2026-07-15", days: 2, reason: "Personal work", status: "APPROVED", appliedOn: "2026-07-01" },
  { id: "LR-002", type: "Sick Leave", from: "2026-06-20", to: "2026-06-21", days: 2, reason: "Fever and cold", status: "APPROVED", appliedOn: "2026-06-19" },
  { id: "LR-003", type: "Earned Leave", from: "2026-08-10", to: "2026-08-14", days: 5, reason: "Family vacation", status: "PENDING", appliedOn: "2026-07-03" },
  { id: "LR-004", type: "Casual Leave", from: "2026-06-05", to: "2026-06-05", days: 1, reason: "Doctor appointment", status: "APPROVED", appliedOn: "2026-06-03" },
  { id: "LR-005", type: "Comp Off", from: "2026-05-15", to: "2026-05-15", days: 1, reason: "Worked on weekend for release", status: "REJECTED", appliedOn: "2026-05-12" },
];

const teamMembers = [
  { id: 1, name: "Arjun Mehta", role: "Senior Developer", department: "Engineering", email: "arjun@hariventures.com", status: "online", initials: "AM" },
  { id: 2, name: "Priya Krishnan", role: "UI/UX Designer", department: "Design", email: "priya@hariventures.com", status: "online", initials: "PK" },
  { id: 3, name: "Deepak Sharma", role: "QA Engineer", department: "Quality", email: "deepak@hariventures.com", status: "away", initials: "DS" },
  { id: 4, name: "Meera Nair", role: "Business Analyst", department: "Product", email: "meera@hariventures.com", status: "offline", initials: "MN" },
  { id: 5, name: "Rahul Gupta", role: "DevOps Engineer", department: "Infrastructure", email: "rahul@hariventures.com", status: "online", initials: "RG" },
  { id: 6, name: "Sneha Patil", role: "Full Stack Developer", department: "Engineering", email: "sneha@hariventures.com", status: "online", initials: "SP" },
];

const upcomingHolidays = [
  { name: "Independence Day", date: "2026-08-15", day: "Friday" },
  { name: "Ganesh Chaturthi", date: "2026-08-27", day: "Wednesday" },
  { name: "Mahatma Gandhi Jayanti", date: "2026-10-02", day: "Friday" },
  { name: "Diwali", date: "2026-11-08", day: "Sunday" },
];

const STATUS_STYLES = {
  APPROVED: { label: "Approved", color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950", icon: CheckCircle2 },
  PENDING: { label: "Pending", color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950", icon: Timer },
  REJECTED: { label: "Rejected", color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950", icon: XCircle },
} as const;

const STATUS_INDICATOR = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-slate-400",
} as const;

// ── Component ────────────────────────────────────────────────────────

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<"leaves" | "team" | "holidays">("leaves");
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  const activeData = useMemo(() => {
    if (activeTab === "leaves") return leaveHistory;
    if (activeTab === "team") return teamMembers;
    return upcomingHolidays;
  }, [activeTab]);

  const activeSearchFields = useMemo(() => {
    if (activeTab === "leaves") return ["type", "reason", "status"];
    if (activeTab === "team") return ["name", "role", "department", "email"];
    return ["name", "day"];
  }, [activeTab]);

  const fieldsConfig: FilterFieldConfig[] = useMemo(() => {
    if (activeTab === "leaves") return [
      { key: "type", label: "Leave Type", type: "select", options: [
        { value: "all", label: "All Types" },
        { value: "Casual Leave", label: "Casual Leave" },
        { value: "Sick Leave", label: "Sick Leave" },
        { value: "Earned Leave", label: "Earned Leave" },
        { value: "Comp Off", label: "Comp Off" },
      ]},
      { key: "status", label: "Status", type: "select", options: [
        { value: "all", label: "All Statuses" },
        { value: "APPROVED", label: "Approved" },
        { value: "PENDING", label: "Pending" },
        { value: "REJECTED", label: "Rejected" },
      ]}
    ];
    if (activeTab === "team") return [
      { key: "department", label: "Department", type: "select", options: [
        { value: "all", label: "All Departments" },
        { value: "Engineering", label: "Engineering" },
        { value: "Design", label: "Design" },
        { value: "Quality", label: "Quality" },
        { value: "Product", label: "Product" },
        { value: "Infrastructure", label: "Infrastructure" },
      ]}
    ];
    return []; 
  }, [activeTab]);

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
    moduleId: `hr-${activeTab}`,
    defaultState: {
      search: "",
      filters: {},
      sort: null,
      visibleColumns: {},
      currentPage: 1,
      itemsPerPage: 8,
    },
    data: activeData as any[],
    searchFields: activeSearchFields,
  });

  const handlePageChange = (page: number) => {
    useFilterStore.getState().updateState(`hr-${activeTab}`, { currentPage: page });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">HR Self-Service</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Leave management, team directory, and company holidays.
          </p>
        </div>
        <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Apply Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Leave Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="earned">Earned Leave</SelectItem>
                    <SelectItem value="compoff">Comp Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea placeholder="Describe the reason for leave..." rows={3} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setApplyDialogOpen(false)}>Submit Request</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveBalances.map((leave) => {
          const Icon = leave.icon;
          const remaining = leave.total - leave.used;
          const percentage = (leave.used / leave.total) * 100;
          return (
            <Card key={leave.type}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", leave.bg + "/10")}>
                    <Icon className={cn("w-5 h-5", leave.color)} />
                  </div>
                  <span className={cn("text-2xl font-bold", leave.color)}>{remaining}</span>
                </div>
                <p className="text-sm font-medium text-[var(--foreground)] mb-1">{leave.type}</p>
                <Progress value={percentage} className="h-1.5 mb-2" />
                <p className="text-xs text-[var(--foreground-muted)]">
                  {leave.used} used of {leave.total} days
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "leaves" | "team" | "holidays")}>
        <TabsList>
          <TabsTrigger value="leaves">Leave History</TabsTrigger>
          <TabsTrigger value="team">Team Directory</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
        </TabsList>
      </Tabs>

      <EnterpriseFilterBar
        moduleId={`hr-${activeTab}`}
        fieldsConfig={fieldsConfig}
        state={state}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onRemoveFilter={removeFilter}
        onClearAll={clearAll}
        onApplyView={applyView}
        onSaveView={saveView}
        sortOptions={activeTab === "leaves" ? [
          { value: "from", label: "Date" },
          { value: "status", label: "Status" },
        ] : activeTab === "team" ? [
          { value: "name", label: "Name" },
          { value: "department", label: "Department" },
        ] : [
          { value: "date", label: "Date" },
        ]}
        onSortSelect={setSort}
        filteredData={filteredData}
      >
        {activeTab === "leaves" && fieldsConfig.map((field) => (
          <FilterDropdown
            key={field.key}
            label={field.label}
            value={(state.filters[field.key] as any)?.value || "all"}
            options={field.options || []}
            onChange={(val) => setFilter(field.key, { type: "select", value: val })}
          />
        ))}
        {activeTab === "team" && fieldsConfig.map((field) => (
          <FilterDropdown
            key={field.key}
            label={field.label}
            value={(state.filters[field.key] as any)?.value || "all"}
            options={field.options || []}
            onChange={(val) => setFilter(field.key, { type: "select", value: val })}
          />
        ))}
      </EnterpriseFilterBar>

      {/* Leave History Tab */}
      {activeTab === "leaves" && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {paginatedData.map((leave: any) => {
                const statusConf = STATUS_STYLES[leave.status as keyof typeof STATUS_STYLES];
                const StatusIcon = statusConf.icon;
                return (
                  <div key={leave.id} className="flex items-center gap-4 p-4 hover:bg-[var(--background-secondary)] transition-colors">
                    <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
                      <span className="text-lg font-bold text-[var(--foreground)] leading-none">
                        {new Date(leave.from).getDate()}
                      </span>
                      <span className="text-[10px] uppercase text-[var(--foreground-muted)] font-medium">
                        {new Date(leave.from).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[var(--foreground)]">{leave.type}</p>
                        <Badge variant="secondary" className={cn("text-[10px]", statusConf.color)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConf.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                        {new Date(leave.from).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {leave.from !== leave.to && ` — ${new Date(leave.to).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                        {" · "}{leave.days} day{leave.days > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)] mt-0.5 truncate">{leave.reason}</p>
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-xs text-[var(--foreground-muted)]">Applied</p>
                      <p className="text-xs text-[var(--foreground-secondary)]">
                        {new Date(leave.appliedOn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                );
              })}
              {paginatedData.length === 0 && (
                <div className="p-8 text-center text-[var(--foreground-secondary)] text-sm">
                  No leaves found matching the criteria.
                </div>
              )}
            </div>
            <Pagination
              currentPage={state.currentPage}
              totalItems={totalItems}
              itemsPerPage={state.itemsPerPage}
              onPageChange={handlePageChange}
              itemName="leaves"
            />
          </CardContent>
        </Card>
      )}

      {/* Team Directory Tab */}
      {activeTab === "team" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedData.map((member: any) => (
              <Card key={member.id} className="hover:border-[var(--color-primary)] transition-colors group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-[var(--color-primary)] text-white text-sm font-semibold">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--card-bg)]",
                        STATUS_INDICATOR[member.status as keyof typeof STATUS_INDICATOR]
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs text-[var(--foreground-secondary)]">{member.role}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-[var(--foreground-muted)]">
                        <Building2 className="w-3 h-3" />
                        {member.department}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-[var(--foreground-muted)]">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {paginatedData.length === 0 && (
              <div className="col-span-full p-8 text-center border border-dashed border-[var(--border)] rounded-xl text-[var(--foreground-secondary)] text-sm">
                No team members found matching the criteria.
              </div>
            )}
          </div>
          <Pagination
            currentPage={state.currentPage}
            totalItems={totalItems}
            itemsPerPage={state.itemsPerPage}
            onPageChange={handlePageChange}
            itemName="team members"
          />
        </div>
      )}

      {/* Holidays Tab */}
      {activeTab === "holidays" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Company Holidays</CardTitle>
            <CardDescription>Public holidays and company-declared days off for 2026.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {paginatedData.map((holiday: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-[var(--background-secondary)] transition-colors">
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
                    <span className="text-lg font-bold text-[var(--color-primary)] leading-none">
                      {new Date(holiday.date).getDate()}
                    </span>
                    <span className="text-[10px] uppercase text-[var(--color-primary)] font-medium">
                      {new Date(holiday.date).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--foreground)]">{holiday.name}</p>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-0.5">
                      {holiday.day} · {new Date(holiday.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">Holiday</Badge>
                </div>
              ))}
              {paginatedData.length === 0 && (
                <div className="p-8 text-center text-[var(--foreground-secondary)] text-sm">
                  No holidays found matching the criteria.
                </div>
              )}
            </div>
            <Pagination
              currentPage={state.currentPage}
              totalItems={totalItems}
              itemsPerPage={state.itemsPerPage}
              onPageChange={handlePageChange}
              itemName="holidays"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
