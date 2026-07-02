"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { projectService } from "@/lib/services/project.service";
import { milestoneService } from "@/lib/services/milestone.service";
import { meetingService } from "@/lib/services/meeting.service";
import { approvalService } from "@/lib/services/approval.service";
import { activityService } from "@/lib/services/activity.service";
import { billingService } from "@/lib/services/billing.service";
import { useAppStore } from "@/store/app.store";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select } from "@/components/ui/select";
import {
  LayoutDashboard, FolderKanban, CheckSquare, CalendarDays,
  FileText, CreditCard, AlertCircle, Clock, ChevronRight, MessageSquare, Briefcase
} from "lucide-react";
import type { Project, Milestone, Meeting, ApprovalItem, ActivityEntry, Invoice } from "@/lib/types";
import { cn } from "@/lib/cn";

export default function DashboardPage() {
  const router = useRouter();
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const setSelectedProjectId = useAppStore((s) => s.setSelectedProjectId);
  const [loading, setLoading] = useState(true);

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const projs = await projectService.getProjects();
        setProjects(projs);
        const currentProj = projs.find(p => p.id === selectedProjectId) || projs[0];
        if (currentProj) {
          if (!selectedProjectId) setSelectedProjectId(currentProj.id);
          setActiveProject(currentProj);

          const [ms, mtgs, apps, acts, invs] = await Promise.all([
            milestoneService.getMilestones(currentProj.id),
            meetingService.getMeetings(), // Assuming we want all or filter by project in real app
            approvalService.getPendingApprovals(),
            activityService.getActivity({ projectId: currentProj.id }),
            billingService.getInvoices({ status: 'PENDING' })
          ]);
          setMilestones(ms);
          setMeetings(mtgs);
          setApprovals(apps.filter(a => a.relatedProjectId === currentProj.id));
          setActivities(acts.slice(0, 5));
          setInvoices(invs.filter(i => i.projectId === currentProj.id));
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProjectId, setSelectedProjectId]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProjectId(e.target.value);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!activeProject) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Briefcase className="h-12 w-12 text-[var(--foreground-muted)] mb-4" />
        <h2 className="text-xl font-semibold text-[var(--foreground)]">No Projects Found</h2>
        <p className="text-sm text-[var(--foreground-secondary)] mt-2">You don't have any active projects.</p>
      </div>
    );
  }

  const currentMilestone = milestones.find(m => m.status === 'IN_PROGRESS' || m.status === 'AWAITING_APPROVAL') || milestones[0];
  const pendingInvoice = invoices[0];
  const nextMeeting = meetings.find(m => m.status === 'SCHEDULED');

  return (
    <div className="space-y-6">
      {/* Header & Project Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Overview"
          description="A summary of your project's current state."
          icon={LayoutDashboard}
        />
        <div className="w-full sm:w-64">
          <Select
            value={activeProject.id}
            onChange={handleProjectChange}
            options={projects.map(p => ({ value: p.id, label: p.name }))}
            aria-label="Select Project"
          />
        </div>
      </div>

      {/* Alert Banners */}
      {pendingInvoice && (
        <div className="flex items-center justify-between p-4 rounded-[var(--radius-lg)] bg-warning-light dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Payment Due: {pendingInvoice.currency} {pendingInvoice.totalAmount.toLocaleString()}</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Invoice {pendingInvoice.invoiceNumber} for milestone "{pendingInvoice.milestoneTitle}"</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900" onClick={() => router.push('/dashboard/billing')}>
            Pay Now
          </Button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Phase"
          value={activeProject.currentPhase}
          icon={FolderKanban}
          iconColor="text-blue-500"
          subtitle={<StatusBadge status={activeProject.health} className="mt-1" />}
        />
        <StatCard
          title="Completion"
          value={`${activeProject.completionPercentage}%`}
          icon={CheckSquare}
          iconColor="text-emerald-500"
          subtitle="Overall project progress"
        />
        <StatCard
          title="Est. Delivery"
          value={new Date(activeProject.estimatedEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          icon={CalendarDays}
          iconColor="text-purple-500"
          subtitle={`${Math.ceil((new Date(activeProject.estimatedEndDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days remaining`}
        />
        <StatCard
          title="Pending Approvals"
          value={approvals.length.toString()}
          icon={FileText}
          iconColor="text-amber-500"
          subtitle="Items needing your review"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Milestone Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Milestone Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-[var(--foreground)]">{currentMilestone?.title || 'No active milestone'}</span>
                  <StatusBadge status={currentMilestone?.status || 'PENDING'} />
                </div>
                <Progress value={currentMilestone?.completionPercentage || 0} className="h-2" />
                <div className="flex justify-between text-xs text-[var(--foreground-secondary)]">
                  <span>{currentMilestone?.completionPercentage || 0}% Complete</span>
                  {currentMilestone?.dueDate && <span>Due: {new Date(currentMilestone.dueDate).toLocaleDateString()}</span>}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => router.push('/dashboard/milestones')}>
                  View All Milestones
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Summary */}
          <Card className="bg-primary-50 dark:bg-primary-900/10 border-primary/20">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-primary/20 text-primary flex items-center justify-center">
                  <MessageSquare className="h-3 w-3" />
                </div>
                <CardTitle className="text-primary text-sm">Project Digest</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--foreground)] leading-relaxed">
                The project is currently <span className="font-semibold text-success">on track</span>.
                The {activeProject.currentPhase} phase is progressing well at {activeProject.completionPercentage}% completion.
                {approvals.length > 0 ? ` There are ${approvals.length} items awaiting your approval to proceed to the next stage.` : ' No immediate blockers.'}
              </p>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/activity')}>View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, i) => (
                  <div key={activity.id} className="flex gap-3 relative">
                    {i !== activities.length - 1 && <div className="absolute left-4 top-8 bottom-[-16px] w-px bg-[var(--border)]" />}
                    <Avatar size="sm" className="ring-4 ring-[var(--card-bg)] shrink-0">
                      <AvatarFallback>{activity.actor.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 pb-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-[var(--foreground)] font-medium">{activity.title}</p>
                        <span className="text-[10px] text-[var(--foreground-muted)] shrink-0 ml-2">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--foreground-secondary)] mt-0.5">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start px-3 h-10" onClick={() => router.push('/dashboard/project/timeline')}>
                  <FolderKanban className="mr-2 h-4 w-4 text-[var(--foreground-muted)]" /> <span className="truncate">Timeline</span>
                </Button>
                <Button variant="outline" size="sm" className="justify-start px-3 h-10" onClick={() => router.push('/dashboard/documents')}>
                  <FileText className="mr-2 h-4 w-4 text-[var(--foreground-muted)]" /> <span className="truncate">Documents</span>
                </Button>
                <Button variant="outline" size="sm" className="justify-start px-3 h-10" onClick={() => router.push('/dashboard/billing')}>
                  <CreditCard className="mr-2 h-4 w-4 text-[var(--foreground-muted)]" /> <span className="truncate">Billing</span>
                </Button>
                <Button variant="outline" size="sm" className="justify-start px-3 h-10" onClick={() => router.push('/dashboard/approvals')}>
                  <CheckSquare className="mr-2 h-4 w-4 text-[var(--foreground-muted)]" /> <span className="truncate">Approvals</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Project Manager */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Project Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarImage src={activeProject.projectManager.avatar} />
                  <AvatarFallback>{activeProject.projectManager.firstName[0]}{activeProject.projectManager.lastName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{activeProject.projectManager.firstName} {activeProject.projectManager.lastName}</p>
                  <p className="text-xs text-[var(--foreground-secondary)]">{activeProject.projectManager.role}</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="w-full mt-4 text-xs h-8">
                Contact PM
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Meeting */}
          {nextMeeting && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Next Meeting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-[var(--radius-md)] bg-primary-50 dark:bg-primary-900/20 text-primary flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-medium leading-none uppercase">{new Date(nextMeeting.startTime).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-sm font-bold leading-none mt-1">{new Date(nextMeeting.startTime).getDate()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)] leading-tight">{nextMeeting.title}</p>
                    <div className="flex items-center text-xs text-[var(--foreground-secondary)] mt-1 gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(nextMeeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                {nextMeeting.meetingUrl && (
                  <Button size="sm" className="w-full mt-4" onClick={() => window.open(nextMeeting.meetingUrl, '_blank')}>
                    Join Meeting
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pending Approvals Widget */}
          {approvals.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle>Pending Approvals</CardTitle>
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{approvals.length}</span>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {approvals.slice(0, 3).map((approval) => (
                    <div key={approval.id} className="flex justify-between items-center cursor-pointer group" onClick={() => router.push('/dashboard/approvals')}>
                      <div>
                        <p className="text-xs font-medium text-[var(--foreground)] group-hover:text-primary transition-colors truncate max-w-[180px]">{approval.title}</p>
                        <p className="text-[10px] text-[var(--foreground-secondary)] mt-0.5">{approval.type}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[var(--foreground-muted)] group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[104px] w-full" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}
