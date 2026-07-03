"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FolderKanban, Plus, Search, Filter, MoreHorizontal, 
  Users, CheckCircle2, AlertTriangle, XCircle, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";
import { mockProjects } from "@/lib/mock-data/projects.mock";
import type { ProjectStatus, ProjectHealth } from "@/lib/types/projects.types";

const statusConfig: Record<ProjectStatus, { label: string; icon: any; color: string }> = {
  ACTIVE: { label: "Active", icon: Clock, color: "text-blue-500 bg-blue-500/10" },
  COMPLETED: { label: "Completed", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" },
  ON_HOLD: { label: "On Hold", icon: AlertTriangle, color: "text-amber-500 bg-amber-500/10" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "text-red-500 bg-red-500/10" },
  PLANNING: { label: "Planning", icon: FolderKanban, color: "text-purple-500 bg-purple-500/10" },
};

const healthConfig: Record<ProjectHealth, { label: string; color: string; bg: string }> = {
  ON_TRACK: { label: "On Track", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500" },
  AT_RISK: { label: "At Risk", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500" },
  BEHIND: { label: "Behind", color: "text-red-600 dark:text-red-400", bg: "bg-red-500" },
};

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "ALL">("ALL");

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Projects</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Manage and track all organizational projects and initiatives.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--card-bg)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
            <Input 
              placeholder="Search projects by name or key..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 shrink-0">
                <Filter className="w-4 h-4" />
                Status: {statusFilter === "ALL" ? "All" : statusConfig[statusFilter].label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("ALL")}>All Projects</DropdownMenuItem>
              {(Object.keys(statusConfig) as ProjectStatus[]).map((status) => (
                <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                  {statusConfig[status].label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="text-sm text-[var(--foreground-secondary)]">
          Showing <span className="font-medium text-[var(--foreground)]">{filteredProjects.length}</span> projects
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const StatusIcon = statusConfig[project.status].icon;
          const health = healthConfig[project.health];

          return (
            <div 
              key={project.id}
              className="group flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--border-hover)] transition-all overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-[var(--border)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--background-secondary)] text-[var(--foreground-secondary)]">
                        {project.key}
                      </span>
                      <div className={cn("flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full", statusConfig[project.status].color)}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[project.status].label}
                      </div>
                    </div>
                    <Link href={`/projects/${project.id}`} className="block group-hover:text-[var(--color-primary)] transition-colors">
                      <h3 className="text-lg font-bold text-[var(--foreground)] truncate">
                        {project.name}
                      </h3>
                    </Link>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="shrink-0 -mr-2">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Project</DropdownMenuItem>
                      <DropdownMenuItem>Manage Team</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">Archive Project</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-[var(--foreground-secondary)] mt-2 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-[10px] font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-center space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--foreground)]">Progress</span>
                    <span className="font-medium text-[var(--foreground)]">{project.progress}%</span>
                  </div>
                  <Progress 
                    value={project.progress} 
                    className="h-1.5 bg-[var(--background-tertiary)]" 
                    indicatorClassName={health.bg}
                  />
                  <div className="flex items-center justify-between text-[10px] mt-1">
                    <span className={health.color}>{health.label}</span>
                    <span className="text-[var(--foreground-muted)]">
                      {project.stats.completedTasks} / {project.stats.totalTasks} tasks
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-[var(--background-secondary)] border-t border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Avatar className="w-7 h-7 border-2 border-[var(--background-secondary)] z-10">
                      <AvatarImage src={project.lead.avatar} />
                      <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">{project.lead.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {project.team.slice(0, 2).map((member, i) => (
                      <Avatar key={member.userId} className={cn("w-7 h-7 border-2 border-[var(--background-secondary)] -ml-2", `z-[${9-i}]`)}>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-[10px] bg-gray-200 text-gray-700">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ))}
                    {project.team.length > 2 && (
                      <div className="w-7 h-7 rounded-full bg-[var(--background)] border-2 border-[var(--background-secondary)] flex items-center justify-center text-[10px] font-medium text-[var(--foreground-muted)] -ml-2 z-0">
                        +{project.team.length - 2}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-[var(--foreground-muted)]">
                  Due {new Date(project.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 bg-[var(--card-bg)] rounded-xl border border-[var(--border)] border-dashed">
          <FolderKanban className="w-10 h-10 text-[var(--foreground-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[var(--foreground)]">No projects found</h3>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
