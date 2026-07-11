// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Meetings Page
// Refined with Project/Organizer Filters, Pagination, Skeletons, Error Retry, and Empty States
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import { useMeetingStore } from "@/store/meeting.store";
import { mockMeetings } from "@/lib/mock-data/workspace.mock";
import { meetingService } from "@/lib/services/meeting.service";
import type { Meeting, MeetingType, MeetingParticipant } from "@/lib/types/workspace.types";
import {
  Search, Video, CalendarDays, Clock, Users,
  Plus, Play, Sparkles, FileText, CheckSquare,
  Paperclip, CheckCircle2, Edit, Save, BookOpen,
  AlertTriangle, RefreshCcw, ShieldAlert, Layers, User
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { useEnterpriseFilter } from "@/hooks/use-enterprise-filter";
import { useFilterStore } from "@/store/filter.store";
import { EnterpriseFilterBar } from "@/components/ui/enterprise-filter-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { FilterFieldConfig, getSelectFilterValue } from "@/types/filter.types";

// ── Meeting Type Config ───────────────────────────────────────────

const meetingTypeConfig: Record<MeetingType, { label: string; color: string }> = {
  standup: { label: "Standup", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800" },
  planning: { label: "Planning", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800" },
  review: { label: "Review", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800" },
  retro: { label: "Retro", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800" },
  "one-on-one": { label: "1:1", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border border-teal-200 dark:border-teal-800" },
  general: { label: "General", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700" },
  workshop: { label: "Workshop", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 border border-pink-200 dark:border-pink-800" },
  demo: { label: "Demo", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800" },
  kickoff: { label: "Kickoff", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800" },
};

const statusConfig = {
  scheduled: { label: "Scheduled", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400" },
  "in-progress": { label: "Live Now", color: "bg-emerald-500 text-white animate-pulse" },
  completed: { label: "Completed", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400" },
  rescheduled: { label: "Rescheduled", color: "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400" },
};

// ── Skeletons ──────────────────────────────────────────────────────
function MeetingsSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] space-y-3">
          <div className="h-4 bg-[var(--background-secondary)] rounded w-1/3" />
          <div className="h-5 bg-[var(--background-secondary)] rounded w-2/3" />
          <div className="h-3 bg-[var(--background-secondary)] rounded w-1/4" />
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
      <h3 className="text-lg font-bold text-[var(--foreground)]">Meetings Hub Error</h3>
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
    <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-xl bg-[var(--card-bg)] flex flex-col items-center justify-center">
      <CalendarDays className="w-12 h-12 text-[var(--foreground-muted)] mb-4" />
      <h3 className="text-lg font-bold text-[var(--foreground)]">No Meetings Found</h3>
      <p className="text-xs text-[var(--foreground-secondary)] mt-2 max-w-sm mb-6">
        No team events match the selected project context or organizer. Schedule one today.
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={onAction}><Plus className="w-4 h-4 mr-2" /> Schedule Meeting</Button>
        <Button size="sm" onClick={onSecondaryAction} variant="outline">Clear Filters</Button>
      </div>
    </div>
  );
}

const baseMeetings: Meeting[] = [
  ...mockMeetings,
  {
    id: "meet-5",
    title: "Security Audit Alignment",
    type: "general" as const,
    startTime: "2026-07-05T11:00:00",
    endTime: "2026-07-05T12:00:00",
    status: "scheduled" as const,
    organizer: "Vijay S.",
    participants: [{ id: "p1", name: "Vijay S.", status: "accepted" as const }, { id: "p2", name: "Arjun M.", status: "accepted" as const }],
    projectName: "Auth Service",
    description: "Review penetration test reports.",
    agenda: [],
    actionItems: [],
    attachments: [],
    notes: ""
  },
  {
    id: "meet-6",
    title: "DevOps Pipeline Sync",
    type: "standup" as const,
    startTime: "2026-07-06T09:30:00",
    endTime: "2026-07-06T10:00:00",
    status: "scheduled" as const,
    organizer: "Arjun M.",
    participants: [{ id: "p3", name: "Arjun M.", status: "accepted" as const }, { id: "p4", name: "Vijay S.", status: "pending" as const }],
    projectName: "API Gateway",
    description: "Pipeline synchronization sync.",
    agenda: [],
    actionItems: [],
    attachments: [],
    notes: ""
  },
  {
    id: "meet-7",
    title: "Product Design Walkthrough",
    type: "workshop" as const,
    startTime: "2026-07-07T15:00:00",
    endTime: "2026-07-07T16:00:00",
    status: "scheduled" as const,
    organizer: "Priya K.",
    participants: [{ id: "p5", name: "Priya K.", status: "accepted" as const }, { id: "p6", name: "Sneha P.", status: "accepted" as const }],
    projectName: "Employee Portal",
    description: "Walkthrough of high-fidelity mockups.",
    agenda: [],
    actionItems: [],
    attachments: [],
    notes: ""
  }
];

export default function MeetingsPage() {
  const activeFilter = useMeetingStore(state => state.activeFilter);
  const setActiveFilter = useMeetingStore(state => state.setActiveFilter);
  const selectedMeetingId = useMeetingStore(state => state.selectedMeetingId);
  const setSelectedMeetingId = useMeetingStore(state => state.setSelectedMeetingId);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [meetingNotes, setMeetingNotes] = useState<string>("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (Math.random() < 0.05) {
        setError("Failed to resolve meeting sync coordinates from tenant-service database pool.");
      }
      setLoading(false);
    }, 450);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const fieldsConfig: FilterFieldConfig[] = [
    { key: "projectName", label: "Project", type: "select", options: [
      { value: "all", label: "All Projects" },
      { value: "Mervi Platform", label: "Mervi Platform" },
      { value: "Auth Service", label: "Auth Service" },
      { value: "Employee Portal", label: "Employee Portal" },
      { value: "API Gateway", label: "API Gateway" },
    ]},
    { key: "organizer", label: "Host", type: "select", options: [
      { value: "all", label: "All Hosts" },
      { value: "Vijay S.", label: "Vijay S." },
      { value: "Priya K.", label: "Priya K." },
      { value: "Arjun M.", label: "Arjun M." },
    ]}
  ];

  const {
    state,
    filteredData,
    setSearch,
    setFilter,
    removeFilter,
    clearAll,
    setSort,
    saveView,
    applyView,
  } = useEnterpriseFilter({
    moduleId: "meetings",
    defaultState: {
      search: "",
      filters: {},
      sort: null,
      visibleColumns: {},
      currentPage: 1,
      itemsPerPage: 6,
    },
    data: baseMeetings,
    searchFields: ["title", "projectName", "organizer", "description"],
  });

  const meetingsToRender = useMemo(() => {
    return filteredData.filter((m) => {
      if (activeFilter === "upcoming" && m.status !== "scheduled" && m.status !== "in-progress") return false;
      if (activeFilter === "past" && m.status !== "completed") return false;
      if (activeFilter === "cancelled" && m.status !== "cancelled") return false;
      if (activeFilter === "recurring" && !m.isRecurring) return false;
      return true;
    });
  }, [filteredData, activeFilter]);

  const handlePageChange = (page: number) => {
    useFilterStore.getState().updateState("meetings", { currentPage: page });
  };

  const itemsPerPage = 6;
  const totalItems = meetingsToRender.length;
  const paginatedMeetings = useMemo(() => {
    return meetingsToRender.slice(
      (state.currentPage - 1) * itemsPerPage,
      state.currentPage * itemsPerPage
    );
  }, [meetingsToRender, state.currentPage]);

  const selectedMeeting = useMemo(() => {
    return baseMeetings.find((m) => m.id === selectedMeetingId) || meetingsToRender[0] || null;
  }, [selectedMeetingId, meetingsToRender]);

  useEffect(() => {
    if (selectedMeeting) {
      setMeetingNotes(selectedMeeting.notes || "");
    }
  }, [selectedMeeting]);

  const handleSelectMeeting = (meeting: Meeting) => {
    setSelectedMeetingId(meeting.id);
    setAiSummary(null);
    setMeetingNotes(meeting.notes || "");
    setIsEditingNotes(false);
  };

  const handleFetchAISummary = async (meetingId: string) => {
    setLoadingAi(true);
    try {
      const summary = await meetingService.getAISummary(meetingId);
      setAiSummary(summary);
    } catch (e) {
      console.error("Failed to generate AI summary", e);
    } finally {
      setLoadingAi(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-12 w-48 bg-[var(--background-secondary)] rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          <MeetingsSkeleton />
          <div className="h-[400px] bg-[var(--card-bg)] border border-[var(--border)] rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Meetings</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Plan, organize, and summarize team meetings and reviews.
          </p>
        </div>
        <Button onClick={() => alert("Scheduling meeting is available via GCal sync API.")}>
          <Plus className="w-4 h-4 mr-2" />Schedule Meeting
        </Button>
      </div>

      <EnterpriseFilterBar
        moduleId="meetings"
        fieldsConfig={fieldsConfig}
        state={state}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onRemoveFilter={removeFilter}
        onClearAll={clearAll}
        onApplyView={applyView}
        onSaveView={saveView}
        sortOptions={[
          { value: "startTime", label: "Start Time" },
          { value: "title", label: "Alphabetical" },
        ]}
        onSortSelect={setSort}
        filteredData={meetingsToRender}
      >
        <FilterDropdown
          label="Project"
          value={(state.filters.projectName as any)?.value || "all"}
          options={fieldsConfig[0].options || []}
          onChange={(val) => setFilter("projectName", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Host"
          value={(state.filters.organizer as any)?.value || "all"}
          options={fieldsConfig[1].options || []}
          onChange={(val) => setFilter("organizer", { type: "select", value: val })}
        />
      </EnterpriseFilterBar>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-[var(--background-secondary)]">
            {[
              { key: "upcoming" as const, label: "Upcoming" },
              { key: "past" as const, label: "Past" },
              { key: "cancelled" as const, label: "Cancelled" },
              { key: "recurring" as const, label: "Recurring" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  "flex-1 text-center py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer",
                  activeFilter === tab.key
                    ? "bg-[var(--card-bg)] text-[var(--foreground)] shadow-xs font-bold"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 flex flex-col justify-between h-full">
            <div className="space-y-3">
              {paginatedMeetings.map((meeting) => {
                const config = meetingTypeConfig[meeting.type as MeetingType] || meetingTypeConfig.general;
                const statusConf = statusConfig[meeting.status as keyof typeof statusConfig];
                const dateStr = new Date(meeting.startTime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                const timeStr = new Date(meeting.startTime).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });

                const isSelected = selectedMeeting?.id === meeting.id;

                return (
                  <div
                    key={meeting.id}
                    onClick={() => handleSelectMeeting(meeting)}
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer text-left",
                      isSelected
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-50)]/40 dark:bg-blue-950/10 shadow-xs"
                        : "border-[var(--border)] hover:border-[var(--border-hover)] bg-[var(--card-bg)]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant="secondary" className={cn("text-[9px] font-semibold h-4 px-1.5", config.color)}>
                            {config.label}
                          </Badge>
                          <Badge variant="secondary" className={cn("text-[9px] font-semibold h-4 px-1.5", statusConf.color)}>
                            {statusConf.label}
                          </Badge>
                        </div>
                        <h3 className="text-sm font-semibold text-[var(--foreground)] mt-2 line-clamp-1">{meeting.title}</h3>
                        {meeting.projectName && (
                          <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">{meeting.projectName}</p>
                        )}
                      </div>
                    </div>

                    <Separator className="my-2.5 opacity-40" />

                    <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{timeStr}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{meeting.participants.length}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {paginatedMeetings.length === 0 && (
                <EmptyState onAction={() => alert("Scheduling meeting...")} onSecondaryAction={clearAll} />
              )}
            </div>

            {totalItems > itemsPerPage && (
              <Pagination
                currentPage={state.currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                itemName="meetings"
              />
            )}
          </div>
        </div>

        {/* Right Side: Meeting Detail Workspace */}
        <div className="lg:sticky lg:top-[76px] h-fit">
          {selectedMeeting ? (
            <Card className="min-h-[500px]">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={cn("text-xs font-semibold", meetingTypeConfig[selectedMeeting.type as MeetingType]?.color)}>
                        {meetingTypeConfig[selectedMeeting.type as MeetingType]?.label}
                      </Badge>
                      {selectedMeeting.isRecurring && (
                        <Badge variant="outline" className="text-[10px] font-medium text-[var(--foreground-muted)]">
                          Recurring
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold mt-2">{selectedMeeting.title}</CardTitle>
                    {selectedMeeting.description && (
                      <CardDescription className="mt-1 text-sm">{selectedMeeting.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {selectedMeeting.status === "in-progress" && (
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse">
                        <Play className="w-4 h-4 mr-1" /> Join Meeting
                      </Button>
                    )}
                    {selectedMeeting.meetingLink && selectedMeeting.status !== "in-progress" && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={selectedMeeting.meetingLink} target="_blank" rel="noopener noreferrer">
                          <Video className="w-4 h-4 mr-1" /> Google Meet
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 py-3 px-4 rounded-lg bg-[var(--background-secondary)]/50 border border-[var(--border)] text-xs text-[var(--foreground-secondary)]">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">Date & Time</p>
                    <p className="font-semibold text-[var(--foreground)] mt-1">
                      {new Date(selectedMeeting.startTime).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                    <p className="mt-0.5">
                      {new Date(selectedMeeting.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} — {new Date(selectedMeeting.endTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">Context</p>
                    <p className="font-semibold text-[var(--foreground)] mt-1">{selectedMeeting.projectName || "General Context"}</p>
                    {selectedMeeting.sprintName && <p className="mt-0.5">{selectedMeeting.sprintName}</p>}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">Organizer</p>
                    <p className="font-semibold text-[var(--foreground)] mt-1">{selectedMeeting.organizer}</p>
                    <p className="mt-0.5">{selectedMeeting.location || "Online"}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Separator />

                {/* Grid for Agenda and Attendees */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Agenda */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-[var(--foreground-muted)]" />
                      Agenda Items
                    </h4>
                    <div className="space-y-2">
                      {selectedMeeting.agenda.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-2.5 p-2 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)]"
                        >
                          <div className="shrink-0 mt-0.5">
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-[var(--border-hover)]" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={cn("text-xs font-medium", item.completed ? "line-through text-[var(--foreground-muted)]" : "text-[var(--foreground)]")}>
                              {item.title}
                            </p>
                            {(item.presenter || item.duration) && (
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-[var(--foreground-muted)]">
                                {item.presenter && <span>Presenter: {item.presenter}</span>}
                                {item.duration && <span>· {item.duration}m</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {selectedMeeting.agenda.length === 0 && (
                        <p className="text-xs text-[var(--foreground-muted)]">No agenda items configured.</p>
                      )}
                    </div>
                  </div>

                  {/* Attendees */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                      <Users className="w-4 h-4 text-[var(--foreground-muted)]" />
                      Participants ({selectedMeeting.participants.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedMeeting.participants.map((participant: any) => {
                        const statusColors = ({
                        accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
                        declined: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-900",
                        tentative: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-900",
                        pending: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
                      } as any)[participant.status];
                        return (
                          <div key={participant.name} className="flex items-center justify-between p-2 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]/50">
                            <span className="text-xs font-medium text-[var(--foreground)] truncate">{participant.name}</span>
                            <Badge variant="secondary" className={cn("text-[9px] capitalize px-1.5 h-4 border", statusColors)}>
                              {participant.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* AI Insights & Summary Hub */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                      AI Meeting Assistant
                    </h4>
                    {!aiSummary && (
                      <Button
                        size="sm"
                        onClick={() => handleFetchAISummary(selectedMeeting.id)}
                        disabled={loadingAi}
                      >
                        {loadingAi ? "Analyzing..." : "Generate AI Summary"}
                      </Button>
                    )}
                  </div>

                  {aiSummary && (
                    <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-950/10 space-y-4">
                      <div className="text-xs text-[var(--foreground-secondary)] leading-relaxed space-y-3">
                        <p className="font-semibold text-sm text-[var(--foreground)]">AI Synthesis Summary</p>
                        <div className="whitespace-pre-line text-xs font-normal">
                          {aiSummary}
                        </div>
                      </div>

                      {selectedMeeting.actionItems.length > 0 && (
                        <div className="space-y-2 mt-4">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Extracted Action Items</p>
                          <div className="space-y-1.5">
                            {selectedMeeting.actionItems.map((action: any) => (
                              <div key={action.id} className="flex items-center justify-between p-2 rounded bg-[var(--card-bg)] border border-[var(--border)] text-xs">
                                <div className="flex items-center gap-2">
                                  <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                                  <span className="font-medium text-[var(--foreground)]">{action.title}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-[var(--foreground-muted)]">
                                  <span>Assignee: {action.assignee}</span>
                                  {action.dueDate && <span>· Due {action.dueDate}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Action Items & Attachments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Action items manually tracker */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-[var(--foreground-muted)]" />
                      Manual Action Items
                    </h4>
                    <div className="space-y-2">
                      {selectedMeeting.actionItems.map((action: any) => (
                        <div key={action.id} className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]/40">
                          <span className="text-xs text-[var(--foreground)]">{action.title}</span>
                          <Badge variant="secondary" className="text-[9px] px-1.5">{action.assignee}</Badge>
                        </div>
                      ))}
                      {selectedMeeting.actionItems.length === 0 && (
                        <p className="text-xs text-[var(--foreground-muted)]">No action items defined.</p>
                      )}
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-[var(--foreground-muted)]" />
                      Attachments
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedMeeting.attachments.map((file: any) => (
                        <div key={file} className="flex items-center gap-2 p-2 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]/50">
                          <FileText className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                          <span className="text-xs text-[var(--foreground-secondary)] truncate flex-1">{file}</span>
                        </div>
                      ))}
                      {selectedMeeting.attachments.length === 0 && (
                        <p className="text-xs text-[var(--foreground-muted)]">No attachments uploaded.</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Meeting Notes Editor */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[var(--foreground-muted)]" />
                      Shared Notes
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (isEditingNotes) {
                          setIsEditingNotes(false);
                        } else {
                          setIsEditingNotes(true);
                        }
                      }}
                    >
                      {isEditingNotes ? (
                        <span className="flex items-center gap-1"><Save className="w-3.5 h-3.5" /> Save</span>
                      ) : (
                        <span className="flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</span>
                      )}
                    </Button>
                  </div>

                  {isEditingNotes ? (
                    <textarea
                      value={meetingNotes}
                      onChange={(e) => setMeetingNotes(e.target.value)}
                      className="w-full min-h-[120px] p-3 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                      placeholder="Add key bullet points, decisions, or follow-ups here..."
                    />
                  ) : (
                    <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]/30 text-xs text-[var(--foreground-secondary)] leading-relaxed whitespace-pre-line min-h-[80px]">
                      {meetingNotes || "No shared notes captured yet. Click Edit to add some."}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="py-24 text-center text-sm text-[var(--foreground-muted)]">
              Select a meeting to view workspace details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
