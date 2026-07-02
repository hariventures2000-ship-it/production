"use client";

import React, { useEffect, useState } from "react";
import { approvalService } from "@/lib/services/approval.service";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckSquare, Check, X, MessageSquare, AlertCircle } from "lucide-react";
import type { ApprovalItem } from "@/lib/types";
import { EnterpriseFilterBar, FilterDefinition } from "@/components/ui/enterprise-filter-bar";
import { useUrlFilters } from "@/hooks/use-url-filters";

export default function ApprovalCenterPage() {
  const [loading, setLoading] = useState(true);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const { filters } = useUrlFilters();

  const approvalFilters: FilterDefinition[] = [
    {
      id: "type",
      label: "Approval Type",
      type: "multi-select",
      options: [
        { label: "Milestone", value: "MILESTONE" },
        { label: "Document", value: "DOCUMENT" },
        { label: "Design", value: "DESIGN" },
        { label: "Deliverable", value: "DELIVERABLE" }
      ]
    },
    {
      id: "priority",
      label: "Priority",
      type: "multi-select",
      options: [
        { label: "Normal", value: "NORMAL" },
        { label: "Urgent", value: "URGENT" }
      ]
    },
    {
      id: "status",
      label: "Status",
      type: "multi-select",
      options: [
        { label: "Pending", value: "PENDING" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
        { label: "Changes Requested", value: "CHANGES_REQUESTED" }
      ]
    },
    {
      id: "dateRange",
      label: "Approval Date",
      type: "date-range"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await approvalService.getPendingApprovals();
        setApprovals(data);
      } catch (error) {
        console.error("Error fetching approvals", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approvalService.approve(id);
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <ApprovalsSkeleton />;

  const filteredApprovals = approvals.filter(item => {
    if (filters.search) {
      const search = String(filters.search).toLowerCase();
      const submitter = `${item.submittedBy.firstName} ${item.submittedBy.lastName}`.toLowerCase();
      if (!item.title.toLowerCase().includes(search) && !item.description.toLowerCase().includes(search) && !submitter.includes(search)) return false;
    }
    if (filters.type && Array.isArray(filters.type) && filters.type.length > 0) {
      if (!filters.type.includes(item.type)) return false;
    }
    if (filters.priority && Array.isArray(filters.priority) && filters.priority.length > 0) {
      if (!filters.priority.includes(item.priority)) return false;
    }
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      if (!filters.status.includes(item.status)) return false;
    }
    if (filters.dateRange && typeof filters.dateRange === 'object') {
      const { from, to } = filters.dateRange as any;
      const docDate = new Date(item.submittedAt).getTime();
      if (from && docDate < new Date(from).getTime()) return false;
      if (to && docDate > new Date(to).getTime()) return false;
    }
    return true;
  });

  const pendingApprovals = filteredApprovals.filter(a => a.status === 'PENDING');
  const pastApprovals = filteredApprovals.filter(a => a.status !== 'PENDING');

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Approval Center"
        description="Review and sign off on milestones, documents, and deliverables."
        icon={CheckSquare}
      />

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 shadow-sm">
        <EnterpriseFilterBar 
          moduleId="approvals"
          filters={approvalFilters}
          searchPlaceholder="Search approvals or submitters..."
        />
      </div>

      {filteredApprovals.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-12 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-[var(--background-secondary)] text-[var(--foreground-muted)] flex items-center justify-center mb-4">
            <CheckSquare className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">No Approvals Found</h2>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">Try adjusting your filters or search query.</p>
        </div>
      ) : pendingApprovals.length === 0 && pastApprovals.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-12 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-success/10 text-success flex items-center justify-center mb-4">
            <Check className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">All Caught Up!</h2>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">There are no items currently awaiting your approval.</p>
        </div>
      ) : pendingApprovals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2">Requires Action</h3>
          {pendingApprovals.map((item) => (
            <Card key={item.id} className="border-warning/50 ring-1 ring-warning/10 shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--foreground-muted)] bg-[var(--background-tertiary)] px-2 py-0.5 rounded">{item.type}</span>
                      {item.priority === 'URGENT' && (
                        <span className="text-xs font-semibold text-danger flex items-center gap-1"><AlertCircle className="h-3 w-3" /> URGENT</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[var(--foreground)]">{item.title}</h4>
                      <p className="text-sm text-[var(--foreground-secondary)] mt-1">{item.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xs text-[var(--foreground-muted)]">Submitted by:</span>
                      <Avatar size="sm" className="h-5 w-5">
                        <AvatarImage src={item.submittedBy.avatar} />
                        <AvatarFallback className="text-[8px]">{item.submittedBy.firstName[0]}{item.submittedBy.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-[var(--foreground)]">{item.submittedBy.firstName} {item.submittedBy.lastName}</span>
                      <span className="text-xs text-[var(--foreground-muted)] mx-2">•</span>
                      <span className="text-xs text-[var(--foreground-muted)]">{new Date(item.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0 sm:w-40">
                    <Button className="w-full bg-success hover:bg-success-light hover:text-success-700 text-white" onClick={() => handleApprove(item.id)}>
                      <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                    <Button variant="outline" className="w-full text-danger border-danger/30 hover:bg-danger-light">
                      <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button variant="outline" className="w-full hidden sm:flex">
                      <MessageSquare className="mr-2 h-4 w-4" /> Request Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {pastApprovals.length > 0 && (
        <div className="mt-12 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2">Past Approvals</h3>
          {pastApprovals.map(item => (
            <Card key={item.id} className="opacity-75 hover:opacity-100 transition-opacity">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--foreground)]">{item.title}</h4>
                  <p className="text-xs text-[var(--foreground-secondary)] mt-0.5">{item.type} • {item.relatedProjectName}</p>
                </div>
                <StatusBadge status={item.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ApprovalsSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl">
      <Skeleton className="h-10 w-64 mb-6" />
      {[1, 2].map(i => <Skeleton key={i} className="h-48 w-full rounded-[var(--radius-lg)]" />)}
    </div>
  );
}
