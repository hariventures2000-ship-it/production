"use client";

import React, { useEffect, useState } from "react";
import { ticketService } from "@/lib/services/ticket.service";
import { useAppStore } from "@/store/app.store";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LifeBuoy, Plus, MessageSquare, AlertCircle } from "lucide-react";
import type { SupportTicket } from "@/lib/types";
import { cn } from "@/lib/cn";
import { EnterpriseFilterBar, FilterDefinition } from "@/components/ui/enterprise-filter-bar";
import { useUrlFilters } from "@/hooks/use-url-filters";

export default function SupportCenterPage() {
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const { filters } = useUrlFilters();

  const ticketFilters: FilterDefinition[] = [
    {
      id: "status",
      label: "Status",
      type: "multi-select",
      options: [
        { label: "Open", value: "OPEN" },
        { label: "In Progress", value: "IN_PROGRESS" },
        { label: "Awaiting Client", value: "AWAITING_CLIENT" },
        { label: "Resolved", value: "RESOLVED" },
        { label: "Closed", value: "CLOSED" }
      ]
    },
    {
      id: "type",
      label: "Category",
      type: "multi-select",
      options: [
        { label: "Bug Report", value: "BUG_REPORT" },
        { label: "Feature Request", value: "FEATURE_REQUEST" },
        { label: "General", value: "GENERAL" },
        { label: "Billing", value: "BILLING" }
      ]
    },
    {
      id: "priority",
      label: "Priority",
      type: "multi-select",
      options: [
        { label: "Low", value: "LOW" },
        { label: "Medium", value: "MEDIUM" },
        { label: "High", value: "HIGH" },
        { label: "Critical", value: "CRITICAL" }
      ]
    },
    {
      id: "dateRange",
      label: "Created Date",
      type: "date-range"
    }
  ];

  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await ticketService.getTickets();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProjectId]);

  if (loading) return <TicketsSkeleton />;

  const filteredTickets = tickets.filter(t => {
    if (filters.search) {
      const search = String(filters.search).toLowerCase();
      if (!t.subject.toLowerCase().includes(search) && !t.ticketNumber.toLowerCase().includes(search)) return false;
    }
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      if (!filters.status.includes(t.status)) return false;
    }
    if (filters.type && Array.isArray(filters.type) && filters.type.length > 0) {
      if (!filters.type.includes(t.type)) return false;
    }
    if (filters.priority && Array.isArray(filters.priority) && filters.priority.length > 0) {
      if (!filters.priority.includes(t.priority)) return false;
    }
    if (filters.dateRange && typeof filters.dateRange === 'object') {
      const { from, to } = filters.dateRange as any;
      const docDate = new Date(t.createdAt).getTime();
      if (from && docDate < new Date(from).getTime()) return false;
      if (to && docDate > new Date(to).getTime()) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Support Center"
          description="Create and track support tickets and feature requests."
          icon={LifeBuoy}
        />
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Ticket
        </Button>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 mb-6 shadow-sm">
        <EnterpriseFilterBar 
          moduleId="tickets"
          filters={ticketFilters}
          searchPlaceholder="Search tickets by ID or subject..."
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-[var(--foreground-secondary)] bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)]">No tickets found matching your criteria.</div>
        ) : filteredTickets.map(ticket => (
          <Card key={ticket.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-medium text-[var(--foreground-muted)]">{ticket.ticketNumber}</span>
                  <StatusBadge status={ticket.status} />
                  {ticket.priority === 'HIGH' || ticket.priority === 'CRITICAL' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-danger bg-danger-light px-1.5 py-0.5 rounded">
                      <AlertCircle className="h-3 w-3" /> {ticket.priority}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium uppercase text-[var(--foreground-muted)] bg-[var(--background-tertiary)] px-1.5 py-0.5 rounded">
                      {ticket.priority}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-[var(--foreground)] group-hover:text-primary transition-colors truncate">{ticket.subject}</h3>
                <p className="text-sm text-[var(--foreground-secondary)] mt-1 line-clamp-1">{ticket.description}</p>
              </div>
              
              <div className="flex items-center gap-6 sm:w-48 shrink-0 text-right justify-between sm:justify-end border-t sm:border-t-0 border-[var(--border)] pt-3 sm:pt-0">
                <div className="flex items-center gap-1.5 text-sm text-[var(--foreground-secondary)]">
                  <MessageSquare className="h-4 w-4" />
                  <span>{ticket.messageCount}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-semibold text-[var(--foreground-muted)]">Last Updated</p>
                  <p className="text-xs font-medium text-[var(--foreground)] mt-0.5">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {filteredTickets.length === 0 && (
          <div className="p-12 text-center border-2 border-dashed border-[var(--border)] rounded-[var(--radius-lg)]">
            <LifeBuoy className="h-8 w-8 text-[var(--foreground-muted)] mx-auto mb-3" />
            <p className="text-[var(--foreground-secondary)]">No tickets found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TicketsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full rounded-[var(--radius-lg)]" />)}
      </div>
    </div>
  );
}
