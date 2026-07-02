"use client";

import React, { useEffect, useState } from "react";
import { meetingService } from "@/lib/services/meeting.service";
import { useAppStore } from "@/store/app.store";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Calendar, Clock, MapPin, Link as LinkIcon, FileText } from "lucide-react";
import type { Meeting } from "@/lib/types";
import { format } from "date-fns";
import { EnterpriseFilterBar, FilterDefinition } from "@/components/ui/enterprise-filter-bar";
import { useUrlFilters } from "@/hooks/use-url-filters";

export default function MeetingsPage() {
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const { filters } = useUrlFilters();

  const meetingFilters: FilterDefinition[] = [
    {
      id: "status",
      label: "Status",
      type: "multi-select",
      options: [
        { label: "Scheduled", value: "SCHEDULED" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Cancelled", value: "CANCELLED" }
      ]
    },
    {
      id: "dateRange",
      label: "Meeting Date",
      type: "date-range"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await meetingService.getMeetings();
        setMeetings(data); // In real app, filter by project if needed
      } catch (error) {
        console.error("Error fetching meetings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProjectId]);

  if (loading) return <MeetingsSkeleton />;

  if (loading) return <MeetingsSkeleton />;

  const filteredMeetings = meetings.filter(m => {
    if (filters.search) {
      const search = String(filters.search).toLowerCase();
      if (!m.title.toLowerCase().includes(search) && !m.description?.toLowerCase().includes(search)) return false;
    }
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      if (!filters.status.includes(m.status)) return false;
    }
    if (filters.dateRange && typeof filters.dateRange === 'object') {
      const { from, to } = filters.dateRange as any;
      const docDate = new Date(m.startTime).getTime();
      if (from && docDate < new Date(from).getTime()) return false;
      if (to && docDate > new Date(to).getTime()) return false;
    }
    return true;
  });

  const upcomingMeetings = filteredMeetings.filter(m => m.status === 'SCHEDULED').sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  const pastMeetings = filteredMeetings.filter(m => m.status !== 'SCHEDULED').sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Meetings"
          description="View upcoming project meetings and past recordings."
          icon={Video}
        />
        <Button>Request Meeting</Button>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 shadow-sm">
        <EnterpriseFilterBar 
          moduleId="meetings"
          filters={meetingFilters}
          searchPlaceholder="Search meetings..."
        />
      </div>

      {filteredMeetings.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-12 text-center text-[var(--foreground-secondary)]">
          No meetings found matching your criteria.
        </div>
      ) : (
        <>
          {upcomingMeetings.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-4">Upcoming Meetings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingMeetings.map(meeting => (
              <Card key={meeting.id} className="border-primary/30 ring-1 ring-primary/5 hover:border-primary/60 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <StatusBadge status={meeting.status} />
                    <span className="text-xs font-semibold text-[var(--foreground-muted)] bg-[var(--background-tertiary)] px-2 py-0.5 rounded">Video Call</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] leading-snug">{meeting.title}</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>{format(new Date(meeting.startTime), 'EEEE, MMMM do, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{format(new Date(meeting.startTime), 'h:mm a')} – {format(new Date(meeting.endTime), 'h:mm a')}</span>
                    </div>
                    {meeting.meetingUrl && (
                      <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>Online Video Call</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {meeting.participants.map(a => (
                        <Avatar key={a.id} size="sm" className="ring-2 ring-[var(--card-bg)]">
                          <AvatarImage src={a.avatar} />
                          <AvatarFallback className="text-[10px]">{a.firstName[0]}{a.lastName[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    {meeting.meetingUrl && (
                      <Button size="sm" onClick={() => window.open(meeting.meetingUrl, '_blank')}>
                        Join Call
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {pastMeetings.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-4">Past Meetings</h2>
          <Card>
            <div className="divide-y divide-[var(--border)]">
              {pastMeetings.map(meeting => (
                <div key={meeting.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--background-secondary)] transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[var(--foreground-muted)]">{format(new Date(meeting.startTime), 'MMM d, yyyy')}</span>
                      <StatusBadge status={meeting.status} showDot={false} className="scale-90 origin-left" />
                    </div>
                    <h4 className="text-sm font-semibold text-[var(--foreground)]">{meeting.title}</h4>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-0.5">Video Call</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {meeting.recordingUrl && (
                      <Button variant="outline" size="sm" onClick={() => window.open(meeting.recordingUrl, '_blank')}>
                        <Video className="mr-2 h-4 w-4" /> Watch Recording
                      </Button>
                    )}
                    {meeting.notes && (
                      <Button variant="ghost" size="sm">
                        <FileText className="mr-2 h-4 w-4" /> Notes
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
          )}
        </>
      )}
    </div>
  );
}

function MeetingsSkeleton() {
  return (
    <div className="space-y-8 max-w-5xl">
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-64 w-full rounded-[var(--radius-lg)]" />
        <Skeleton className="h-64 w-full rounded-[var(--radius-lg)]" />
      </div>
      <Skeleton className="h-[300px] w-full rounded-[var(--radius-lg)]" />
    </div>
  );
}
