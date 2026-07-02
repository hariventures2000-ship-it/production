"use client";

import React, { useEffect, useState } from "react";
import { milestoneService } from "@/lib/services/milestone.service";
import { useAppStore } from "@/store/app.store";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Milestone as MilestoneIcon, CheckCircle2, Lock, Unlock, FileText } from "lucide-react";
import type { Milestone } from "@/lib/types";
import { cn } from "@/lib/cn";
import { EnterpriseFilterBar, FilterDefinition } from "@/components/ui/enterprise-filter-bar";
import { useUrlFilters } from "@/hooks/use-url-filters";

export default function MilestonesPage() {
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const { filters } = useUrlFilters();

  const milestoneFilters: FilterDefinition[] = [
    {
      id: "status",
      label: "Status",
      type: "multi-select",
      options: [
        { label: "Pending", value: "PENDING" },
        { label: "In Progress", value: "IN_PROGRESS" },
        { label: "In QA", value: "IN_QA" },
        { label: "Awaiting Approval", value: "AWAITING_APPROVAL" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" }
      ]
    },
    {
      id: "paymentStatus",
      label: "Payment Status",
      type: "multi-select",
      options: [
        { label: "Locked", value: "LOCKED" },
        { label: "Unlocked", value: "UNLOCKED" },
        { label: "Invoiced", value: "INVOICED" },
        { label: "Paid", value: "PAID" }
      ]
    },
    {
      id: "dueDate",
      label: "Due Date",
      type: "date-range"
    }
  ];

  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const ms = await milestoneService.getMilestones(selectedProjectId);
        setMilestones(ms.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error("Error fetching milestones", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProjectId]);

  if (loading) return <MilestonesSkeleton />;

  const filteredMilestones = milestones.filter(ms => {
    if (filters.search) {
      const search = String(filters.search).toLowerCase();
      if (!ms.title.toLowerCase().includes(search) && !ms.description.toLowerCase().includes(search)) return false;
    }
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      if (!filters.status.includes(ms.status)) return false;
    }
    if (filters.paymentStatus && Array.isArray(filters.paymentStatus) && filters.paymentStatus.length > 0) {
      if (!filters.paymentStatus.includes(ms.paymentStatus)) return false;
    }
    if (filters.dueDate && typeof filters.dueDate === 'object') {
      const { from, to } = filters.dueDate as any;
      const docDate = new Date(ms.dueDate).getTime();
      if (from && docDate < new Date(from).getTime()) return false;
      if (to && docDate > new Date(to).getTime()) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Milestones"
        description="Track project milestones, deliverables, and payment unlocks."
        icon={MilestoneIcon}
      />

      <div className="mb-6 bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 shadow-sm">
        <EnterpriseFilterBar 
          moduleId="milestones"
          filters={milestoneFilters}
          searchPlaceholder="Search milestones..."
        />
      </div>

      <div className="space-y-6">
        {filteredMilestones.length === 0 ? (
          <div className="p-8 text-center text-[var(--foreground-secondary)] bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--border)]">No milestones match your criteria.</div>
        ) : filteredMilestones.map((milestone, index) => {
          const isPaid = milestone.paymentStatus === 'PAID';
          const isUnlocked = milestone.paymentStatus === 'UNLOCKED' || milestone.paymentStatus === 'INVOICED';
          
          return (
            <Card key={milestone.id} className={cn(
              "overflow-hidden transition-all duration-300",
              milestone.status === 'IN_PROGRESS' || milestone.status === 'AWAITING_APPROVAL' ? "border-primary/50 shadow-md ring-1 ring-primary/10" : ""
            )}>
              <div className="flex flex-col sm:flex-row border-b border-[var(--border)]">
                {/* Milestone Info */}
                <div className="flex-1 p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-[var(--foreground-muted)] uppercase">Milestone {index + 1}</span>
                        <StatusBadge status={milestone.status} />
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">{milestone.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
                    {milestone.description}
                  </p>
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--foreground-secondary)]">Progress</span>
                      <span className="font-medium text-[var(--foreground)]">{milestone.completionPercentage}%</span>
                    </div>
                    <Progress value={milestone.completionPercentage} className="h-2" />
                  </div>
                </div>

                {/* Financial/Action Sidebar */}
                <div className="bg-[var(--background-secondary)] p-5 sm:w-64 sm:border-l border-t sm:border-t-0 border-[var(--border)] flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-[var(--foreground-muted)] font-medium mb-1">Amount</p>
                      <p className="text-xl font-bold text-[var(--foreground)]">{milestone.currency} {milestone.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--foreground-muted)] font-medium mb-1">Due Date</p>
                      <p className="text-sm font-medium text-[var(--foreground)]">{new Date(milestone.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--foreground-muted)] font-medium mb-1.5">Payment Status</p>
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                        isPaid ? "bg-success-light dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" :
                        isUnlocked ? "bg-warning-light dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800" :
                        "bg-[var(--background-tertiary)] text-[var(--foreground-secondary)] border-[var(--border)]"
                      )}>
                        {isPaid ? <CheckCircle2 className="h-3 w-3" /> :
                         isUnlocked ? <Unlock className="h-3 w-3" /> :
                         <Lock className="h-3 w-3" />}
                        {milestone.paymentStatus}
                      </div>
                    </div>
                  </div>

                  {milestone.status === 'AWAITING_APPROVAL' && (
                    <Button size="sm" className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white">
                      Review & Approve
                    </Button>
                  )}
                  {milestone.paymentStatus === 'INVOICED' && (
                    <Button size="sm" className="w-full mt-6" variant="default">
                      Pay Invoice
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Deliverables List */}
              {milestone.deliverables.length > 0 && (
                <div className="p-5 bg-[var(--background-tertiary)]/50">
                  <h4 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Deliverables</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {milestone.deliverables.map(del => (
                      <div key={del.id} className="flex items-start gap-3 p-3 bg-[var(--card-bg)] rounded-[var(--radius-md)] border border-[var(--border)]">
                        <FileText className="h-4 w-4 text-[var(--foreground-muted)] mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)]">{del.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-[var(--foreground-secondary)]">{del.type}</span>
                            <span className="text-[10px]">•</span>
                            <StatusBadge status={del.status} showDot={false} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function MilestonesSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl">
      <Skeleton className="h-10 w-64 mb-6" />
      {[1, 2, 3].map(i => (
        <Skeleton key={i} className="h-64 w-full rounded-[var(--radius-lg)]" />
      ))}
    </div>
  );
}
