"use client";

import React, { useEffect, useState } from "react";
import { projectService } from "@/lib/services/project.service";
import { useAppStore } from "@/store/app.store";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Download, CheckCircle2, CircleDashed } from "lucide-react";
import type { ProjectPhase } from "@/lib/types";
import { cn } from "@/lib/cn";

export default function ProjectTimelinePage() {
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const [loading, setLoading] = useState(true);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);

  useEffect(() => {
    if (!selectedProjectId) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await projectService.getProjectTimeline(selectedProjectId);
        setPhases(data.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error("Error fetching timeline", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProjectId]);

  if (loading) return <TimelineSkeleton />;
  if (phases.length === 0) return <div className="p-8 text-center text-[var(--foreground-secondary)]">No timeline available.</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Project Timeline"
        description="Phase-by-phase view of project execution and dependencies."
        icon={Clock}
      />

      <div className="relative pt-6">
        {/* Vertical line connecting phases */}
        <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-[var(--border)]" />

        <div className="space-y-6">
          {phases.map((phase, index) => {
            const isCompleted = phase.status === 'COMPLETED';
            const isInProgress = phase.status === 'IN_PROGRESS';
            const isNotStarted = phase.status === 'NOT_STARTED';

            return (
              <div key={phase.id} className="relative flex gap-6 group">
                {/* Timeline node */}
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-[var(--background)] transition-colors",
                    isCompleted ? "bg-success text-white" :
                    isInProgress ? "bg-primary text-white ring-primary/20" :
                    "bg-[var(--background-tertiary)] text-[var(--foreground-muted)] border-2 border-[var(--border)]"
                  )}>
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : 
                     isInProgress ? <span className="text-xs font-bold">{index + 1}</span> :
                     <span className="text-xs font-medium">{index + 1}</span>}
                  </div>
                </div>

                {/* Phase Card */}
                <Card className={cn(
                  "flex-1 overflow-hidden transition-all duration-300",
                  isInProgress ? "border-primary/50 shadow-md ring-1 ring-primary/10" : "hover:border-[var(--border-hover)]"
                )}>
                  <div className={cn(
                    "h-1.5 w-full",
                    isCompleted ? "bg-success" : isInProgress ? "bg-primary" : "bg-[var(--border)]"
                  )} />
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className={cn("text-lg font-semibold", isNotStarted && "text-[var(--foreground-muted)]")}>{phase.name}</h3>
                          <StatusBadge status={phase.status} />
                        </div>
                        <p className="text-xs text-[var(--foreground-secondary)]">
                          Owner: <span className="font-medium text-[var(--foreground)]">{phase.owner.firstName} {phase.owner.lastName}</span>
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] font-semibold uppercase text-[var(--foreground-muted)]">Timeline</p>
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          {new Date(phase.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(phase.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar (if in progress) */}
                    {(isInProgress || isCompleted) && (
                      <div className="mt-5 space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-[var(--foreground-secondary)]">Completion</span>
                          <span className="font-medium text-[var(--foreground)]">{phase.completionPercentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all duration-1000", isCompleted ? "bg-success" : "bg-primary")}
                            style={{ width: `${phase.completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Documents & Approval (if any) */}
                    {(phase.documents.length > 0 || phase.approvalStatus !== 'NOT_REQUIRED') && (
                      <div className="mt-5 pt-4 border-t border-[var(--border)] flex flex-wrap gap-4">
                        {phase.documents.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Download className="h-4 w-4 text-[var(--foreground-muted)]" />
                            <span className="text-xs text-[var(--foreground-secondary)]">{phase.documents.length} Deliverable(s)</span>
                          </div>
                        )}
                        {phase.approvalStatus !== 'NOT_REQUIRED' && (
                          <div className="flex items-center gap-2">
                            <CircleDashed className="h-4 w-4 text-[var(--foreground-muted)]" />
                            <span className="text-xs text-[var(--foreground-secondary)]">
                              Approval: <StatusBadge status={phase.approvalStatus} />
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-6 max-w-5xl">
      <Skeleton className="h-10 w-64 mb-8" />
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex gap-6">
          <Skeleton className="h-12 w-12 rounded-full shrink-0" />
          <Skeleton className="h-32 w-full" />
        </div>
      ))}
    </div>
  );
}
