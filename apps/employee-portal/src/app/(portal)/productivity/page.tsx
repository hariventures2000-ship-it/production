"use client";

import { useState } from "react";
import { Play, Square, Timer, Clock, CalendarDays, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export default function ProductivityPage() {
  const [isTracking, setIsTracking] = useState(false);
  const [time, setTime] = useState("00:00:00");

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Productivity</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Track time, manage timesheets, and view activity logs.
          </p>
        </div>
        <Button variant="outline"><CalendarDays className="w-4 h-4 mr-2" />My Timesheet</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className={cn(
            "w-32 h-32 rounded-full border-4 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-colors",
            isTracking ? "border-emerald-500 shadow-emerald-500/20" : "border-[var(--border)]"
          )}>
            <span className={cn(
              "text-3xl font-mono font-bold tracking-tight",
              isTracking ? "text-emerald-500" : "text-[var(--foreground)]"
            )}>
              {time}
            </span>
          </div>
          <p className="text-sm text-[var(--foreground-secondary)] mb-6 max-w-xs">
            {isTracking ? "Currently tracking time for 'Authentication UI (MVP-124)'" : "Select a task to start tracking your time."}
          </p>
          <Button 
            size="lg" 
            className={cn("w-48 rounded-full", isTracking ? "bg-red-500 hover:bg-red-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white")}
            onClick={() => {
              setIsTracking(!isTracking);
              if (!isTracking) setTime("00:00:01"); // visual feedback only
              else setTime("00:00:00");
            }}
          >
            {isTracking ? (
              <><Square className="w-5 h-5 mr-2 fill-current" /> Stop Tracking</>
            ) : (
              <><Play className="w-5 h-5 mr-2 fill-current" /> Start Timer</>
            )}
          </Button>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg text-[var(--foreground)] mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-[var(--foreground-muted)]" /> Recent Time Entries
            </h3>
            <div className="space-y-4">
              {[
                { task: "Fix CSRF issues", time: "1h 45m", date: "Today" },
                { task: "Design review", time: "45m", date: "Today" },
                { task: "Sprint Planning", time: "1h 30m", date: "Yesterday" },
                { task: "Dashboard UI", time: "3h 15m", date: "Yesterday" },
              ].map((entry, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]">
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">{entry.task}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{entry.date}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground-secondary)]">
                    <Clock className="w-4 h-4" />
                    {entry.time}
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
