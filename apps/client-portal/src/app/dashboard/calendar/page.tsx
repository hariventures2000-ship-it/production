"use client";

import React, { useEffect, useState } from "react";
import { calendarService } from "@/lib/services/calendar.service";
import { useAppStore } from "@/store/app.store";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Video, FileText, CheckCircle2 } from "lucide-react";
import type { CalendarEvent } from "@/lib/types";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isSameDay, isToday, parseISO
} from "date-fns";
import { cn } from "@/lib/cn";

export default function CalendarPage() {
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await calendarService.getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching calendar events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProjectId]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToday = () => setCurrentDate(new Date());

  if (loading) return <CalendarSkeleton />;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Padding days for grid
  const startDayOfWeek = monthStart.getDay(); // 0 is Sunday
  const paddingDays = Array.from({ length: startDayOfWeek }).map((_, i) => i);

  const getDayEvents = (date: Date) => {
    return events.filter(e => isSameDay(parseISO(e.startDate), date));
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'MEETING': return <Video className="h-3 w-3 shrink-0" />;
      case 'MILESTONE': return <CheckCircle2 className="h-3 w-3 shrink-0" />;
      case 'DEADLINE': return <FileText className="h-3 w-3 shrink-0" />;
      default: return null;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'MEETING': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'MILESTONE': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'DEADLINE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Project Calendar"
          description="Schedule of meetings, milestones, and deliverable due dates."
          icon={CalendarIcon}
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToday}>Today</Button>
          <div className="flex items-center rounded-md border border-[var(--border)] overflow-hidden">
            <Button variant="ghost" size="icon" className="rounded-none border-r border-[var(--border)] h-9 w-9" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 text-sm font-medium w-40 text-center text-[var(--foreground)]">
              {format(currentDate, 'MMMM yyyy')}
            </div>
            <Button variant="ghost" size="icon" className="rounded-none border-l border-[var(--border)] h-9 w-9" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-7 border-b border-[var(--border)]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] border-r last:border-r-0 border-[var(--border)]">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 grid-rows-5 bg-[var(--border)] gap-px border-[var(--border)] border-l border-r border-b rounded-b-[var(--radius-lg)] overflow-hidden">
          {paddingDays.map(i => (
            <div key={`empty-${i}`} className="bg-[var(--card-bg)] min-h-[120px] p-2 opacity-50" />
          ))}
          
          {daysInMonth.map((day, i) => {
            const dayEvents = getDayEvents(day);
            const isTodayDate = isToday(day);
            return (
              <div key={day.toISOString()} className={cn(
                "bg-[var(--card-bg)] min-h-[120px] p-2 transition-colors hover:bg-[var(--background-secondary)]",
                isTodayDate && "bg-primary/5 dark:bg-primary/10"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "text-xs font-medium flex h-6 w-6 items-center justify-center rounded-full",
                    isTodayDate ? "bg-primary text-white" : "text-[var(--foreground-secondary)]"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="space-y-1.5 max-h-[80px] overflow-y-auto no-scrollbar">
                  {dayEvents.map(event => (
                    <div key={event.id} className={cn(
                      "text-[10px] p-1.5 rounded border leading-tight truncate flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity",
                      getEventColor(event.type)
                    )} title={event.title}>
                      {getEventIcon(event.type)}
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Fill remaining cells if needed */}
          {Array.from({ length: 42 - (paddingDays.length + daysInMonth.length) }).map((_, i) => (
            <div key={`empty-end-${i}`} className="bg-[var(--card-bg)] min-h-[120px] p-2 opacity-50" />
          ))}
        </div>
      </Card>
      
      <div className="flex flex-wrap gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-[var(--foreground-secondary)]">
          <div className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800" /> Meetings
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--foreground-secondary)]">
          <div className="w-3 h-3 rounded-sm bg-purple-100 border border-purple-200 dark:bg-purple-900/30 dark:border-purple-800" /> Milestones Due
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--foreground-secondary)]">
          <div className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800" /> Deliverables
        </div>
      </div>
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-48" />
      </div>
      <Skeleton className="h-[600px] w-full rounded-[var(--radius-lg)]" />
    </div>
  );
}
