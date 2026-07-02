"use client";

import React, { useEffect, useState } from "react";
import { activityService } from "@/lib/services/activity.service";
import { useAppStore } from "@/store/app.store";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Activity, Download, Filter } from "lucide-react";
import type { ActivityEntry } from "@/lib/types";
import { EnterpriseFilterBar, FilterDefinition } from "@/components/ui/enterprise-filter-bar";
import { useUrlFilters } from "@/hooks/use-url-filters";

export default function ActivityLogPage() {
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const { filters, setFilter } = useUrlFilters();
  const itemsPerPage = 10;
  const currentPage = Number(filters.page) || 1;

  const activityFilters: FilterDefinition[] = [
    {
      id: "type",
      label: "Activity Type",
      type: "multi-select",
      options: [
        { label: "Upload", value: "UPLOAD" },
        { label: "Approval", value: "APPROVAL" },
        { label: "Update", value: "UPDATE" },
        { label: "Comment", value: "COMMENT" }
      ]
    },
    {
      id: "dateRange",
      label: "Date Range",
      type: "date-range"
    }
  ];

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

  const filteredActivities = activities.filter(activity => {
    if (filters.search) {
      const search = String(filters.search).toLowerCase();
      if (!activity.title.toLowerCase().includes(search) && !activity.description.toLowerCase().includes(search) && !activity.actor.toLowerCase().includes(search)) return false;
    }
    if (filters.type && Array.isArray(filters.type) && filters.type.length > 0) {
      if (!filters.type.includes(activity.type)) return false;
    }
    if (filters.dateRange && typeof filters.dateRange === 'object') {
      const { from, to } = filters.dateRange as any;
      const docDate = new Date(activity.createdAt).getTime();
      if (from && docDate < new Date(from).getTime()) return false;
      if (to && docDate > new Date(to).getTime()) return false;
    }
    return true;
  });

  const currentActivities = filteredActivities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Activity Log"
          description="Complete audit trail of all project activities and changes."
          icon={Activity}
        />
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 shadow-sm">
        <EnterpriseFilterBar 
          moduleId="activity"
          filters={activityFilters}
          searchPlaceholder="Search activities or actors..."
        />
      </div>

      <Card>
        <div className="divide-y divide-[var(--border)]">
          {currentActivities.map((activity) => (
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
          {currentActivities.length === 0 && (
            <div className="p-12 text-center text-[var(--foreground-secondary)]">
              No activity found matching your criteria.
            </div>
          )}
        </div>
        
        {/* Pagination Footer */}
        {filteredActivities.length > 0 && (
          <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 bg-[var(--background)] rounded-b-[var(--radius-lg)]">
            <div className="text-xs text-[var(--foreground-muted)]">
              Showing <span className="font-medium text-[var(--foreground)]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-[var(--foreground)]">{Math.min(currentPage * itemsPerPage, filteredActivities.length)}</span> of <span className="font-medium text-[var(--foreground)]">{filteredActivities.length}</span> Activities
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setFilter('page', Math.max(currentPage - 1, 1))} disabled={currentPage === 1} className="h-8 px-3 text-xs font-medium border border-[var(--border)] rounded-md disabled:opacity-50 hover:bg-[var(--background-secondary)]">Previous</button>
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => setFilter('page', page)} className={`h-8 w-8 rounded-md text-xs font-medium transition-colors ${page === currentPage ? 'bg-[var(--foreground)] text-[var(--background)]' : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'}`}>{page}</button>
                ))}
              </div>
              <button onClick={() => setFilter('page', Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} className="h-8 px-3 text-xs font-medium border border-[var(--border)] rounded-md disabled:opacity-50 hover:bg-[var(--background-secondary)]">Next</button>
            </div>
          </div>
        )}
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
