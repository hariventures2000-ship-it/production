"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { projectService } from "@/lib/services/project.service";
import { useAppStore } from "@/store/app.store";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FolderKanban, Users, ShieldAlert, GitCommit, FileText, CheckCircle2, Clock } from "lucide-react";
import type { Project, ProjectMember, ActivityEntry } from "@/lib/types";

export default function ProjectWorkspacePage() {
  const router = useRouter();
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    if (!selectedProjectId) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const [proj, mems, acts] = await Promise.all([
          projectService.getProject(selectedProjectId),
          projectService.getProjectMembers(selectedProjectId),
          projectService.getProjectActivity(selectedProjectId)
        ]);
        setProject(proj);
        setMembers(mems);
        setActivities(acts.slice(0, 8)); // latest 8
      } catch (error) {
        console.error("Error fetching project workspace data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProjectId]);

  if (loading) return <ProjectWorkspaceSkeleton />;
  if (!project) return <div className="p-8 text-center text-[var(--foreground-secondary)]">No project selected.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Project Workspace"
          description={project.name}
          icon={FolderKanban}
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/project/timeline')}>
            <Clock className="mr-2 h-4 w-4" /> Timeline
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/project/kanban')}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Task Board
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details & Members */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed mb-6">
                {project.description}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[var(--border)]">
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[var(--foreground-muted)] mb-1">Status</p>
                  <StatusBadge status={project.status} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[var(--foreground-muted)] mb-1">Health</p>
                  <StatusBadge status={project.health} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[var(--foreground-muted)] mb-1">Start Date</p>
                  <p className="text-sm font-medium text-[var(--foreground)]">{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[var(--foreground-muted)] mb-1">Target End</p>
                  <p className="text-sm font-medium text-[var(--foreground)]">{new Date(project.estimatedEndDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[var(--foreground-muted)]" />
                <CardTitle>Project Team</CardTitle>
              </div>
              <span className="text-xs bg-[var(--background-tertiary)] px-2 py-0.5 rounded-full">{members.length} Members</span>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {members.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">{member.firstName} {member.lastName}</p>
                      <p className="text-xs text-[var(--foreground-secondary)] truncate">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-3">
              <ShieldAlert className="h-4 w-4 text-[var(--foreground-muted)]" />
              <CardTitle>Dependencies & Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-warning-light/50 dark:bg-amber-950/30 border border-warning-light dark:border-amber-900">
                  <div className="h-2 w-2 mt-1.5 rounded-full bg-warning shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">Third-party API Integration</p>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-0.5">Waiting on final documentation from the payment gateway provider. Could delay Phase 4 by 3-5 days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--border)]">
                  <div className="h-2 w-2 mt-1.5 rounded-full bg-success shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">Content Delivery</p>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-0.5">Client content provided on time. Dependency resolved.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Updates Feed */}
        <div className="space-y-6">
          <Card className="h-full max-h-[800px] flex flex-col">
            <CardHeader className="flex flex-row items-center gap-2 pb-3 border-b border-[var(--border)]">
              <GitCommit className="h-4 w-4 text-[var(--foreground-muted)]" />
              <CardTitle>Recent Updates</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pt-4">
              <div className="space-y-6">
                {activities.map((activity, i) => (
                  <div key={activity.id} className="relative flex gap-3">
                    {i !== activities.length - 1 && <div className="absolute left-3.5 top-7 bottom-[-24px] w-px bg-[var(--border)]" />}
                    <div className="h-7 w-7 rounded-full bg-[var(--background-tertiary)] flex items-center justify-center shrink-0 ring-4 ring-[var(--card-bg)] z-10">
                      {activity.type === 'UPLOAD' ? <FileText className="h-3 w-3 text-info" /> :
                       activity.type === 'APPROVAL' ? <CheckCircle2 className="h-3 w-3 text-success" /> :
                       <GitCommit className="h-3 w-3 text-[var(--foreground-muted)]" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-[var(--foreground)]">{activity.actor}</p>
                        <span className="text-[10px] text-[var(--foreground-muted)]">{new Date(activity.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-[var(--foreground-secondary)] mt-1">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProjectWorkspaceSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div>
          <Skeleton className="h-[800px] w-full" />
        </div>
      </div>
    </div>
  );
}
