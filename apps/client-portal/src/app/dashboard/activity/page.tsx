"use client";

import React, { useEffect, useState } from "react";
import { activityService } from "@/lib/services/activity.service";
import { useAppStore } from "@/store/app.store";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Download, Filter } from "lucide-react";
import type { ActivityEntry } from "@/lib/types";

export default function ActivityLogPage() {
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await activityService.getActivity({ projectId: selectedProjectId });
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activity", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProjectId]);

  if (loading) return <ActivitySkeleton />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Activity Log"
          description="Complete audit trail of all project activities and changes."
          icon={Activity}
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
        </div>
      </div>

      <Card>
        <div className="divide-y divide-[var(--border)]">
          {activities.map((activity) => (
            <div key={activity.id} className="p-4 sm:p-5 flex gap-4 hover:bg-[var(--background-secondary)] transition-colors">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)]">{activity.title}</p>
                <p className="text-xs text-[var(--foreground-secondary)] mt-1">{activity.description}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  <span>{activity.actor}</span>
                  <span>•</span>
                  <span>{new Date(activity.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="p-12 text-center text-[var(--foreground-secondary)]">
              No activity found for this project.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-6 max-w-4xl">
      <Skeleton className="h-10 w-64 mb-6" />
      <Skeleton className="h-[600px] w-full rounded-[var(--radius-lg)]" />
    </div>
  );
}
