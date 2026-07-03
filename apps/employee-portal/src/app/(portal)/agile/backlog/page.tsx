"use client";

import { useState } from "react";
import { 
  Search, Filter, Plus, ChevronDown, ChevronRight, 
  MoreHorizontal, AlertCircle, Bookmark, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/cn";
import { mockTasks, mockActiveSprint, mockEpics } from "@/lib/mock-data/agile.mock";
import { PRIORITY_CONFIG } from "@/lib/constants";
import type { AgileTask, TaskStatus } from "@/lib/types/agile.types";

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  BACKLOG: { label: "Backlog", color: "text-slate-500 bg-slate-500/10" },
  TODO: { label: "To Do", color: "text-gray-500 bg-gray-500/10" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-500 bg-blue-500/10" },
  REVIEW: { label: "In Review", color: "text-purple-500 bg-purple-500/10" },
  TESTING: { label: "Testing", color: "text-amber-500 bg-amber-500/10" },
  DONE: { label: "Done", color: "text-emerald-500 bg-emerald-500/10" },
};

function TaskRow({ task }: { task: AgileTask }) {
  const epic = mockEpics.find(e => e.id === task.epicId);
  const prioConf = PRIORITY_CONFIG[task.priority];

  return (
    <TableRow className="group cursor-pointer">
      <TableCell className="w-[120px] font-medium text-[var(--foreground-secondary)] group-hover:text-[var(--color-primary)] transition-colors">
        {task.key}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {task.type === 'BUG' ? (
            <AlertCircle className="w-4 h-4 text-red-500" />
          ) : task.type === 'STORY' ? (
            <Bookmark className="w-4 h-4 text-emerald-500" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          )}
          <span className="font-medium text-[var(--foreground)]">{task.title}</span>
        </div>
      </TableCell>
      <TableCell>
        {epic && (
          <Badge variant="outline" className={cn("text-[10px] h-5 border-none text-white whitespace-nowrap", epic.color)}>
            {epic.name}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium", statusConfig[task.status].color)}>
          {statusConfig[task.status].label}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <div className={cn("w-2 h-2 rounded-full", prioConf.dot)} />
          <span className="text-xs font-medium text-[var(--foreground-secondary)]">{prioConf.label}</span>
        </div>
      </TableCell>
      <TableCell className="text-center">
        {task.storyPoints ? (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--background-secondary)] text-xs font-bold text-[var(--foreground)]">
            {task.storyPoints}
          </span>
        ) : (
          <span className="text-[var(--foreground-muted)]">-</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {task.assignee ? (
          <div className="flex justify-end">
            <Avatar className="w-7 h-7" title={task.assignee.name}>
              <AvatarImage src={task.assignee.avatar} />
              <AvatarFallback className="text-[10px]">{task.assignee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <span className="text-xs text-[var(--foreground-muted)]">Unassigned</span>
        )}
      </TableCell>
      <TableCell className="w-[50px]">
        <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function BacklogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sprintExpanded, setSprintExpanded] = useState(true);
  const [backlogExpanded, setBacklogExpanded] = useState(true);

  const sprintTasks = mockTasks.filter(t => t.sprintId === mockActiveSprint.id);
  const backlogTasks = mockTasks.filter(t => !t.sprintId || t.status === 'BACKLOG');

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Backlog</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Plan sprints and prioritize the product backlog.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
            <Input 
              placeholder="Search issues..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="hidden sm:flex">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Issue
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Active Sprint Section */}
        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
          <div 
            className="flex items-center justify-between p-4 bg-[var(--background-secondary)] cursor-pointer select-none"
            onClick={() => setSprintExpanded(!sprintExpanded)}
          >
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon-sm" className="h-6 w-6">
                {sprintExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
              <h2 className="text-lg font-bold text-[var(--foreground)]">{mockActiveSprint.name}</h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                Active Sprint
              </Badge>
              <span className="text-sm text-[var(--foreground-muted)] ml-2">
                {sprintTasks.length} issues
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--foreground-muted)]">
                {new Date(mockActiveSprint.startDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(mockActiveSprint.endDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>Complete Sprint</Button>
            </div>
          </div>

          {sprintExpanded && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Epic</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead className="text-right">Assignee</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sprintTasks.map(task => <TaskRow key={task.id} task={task} />)}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Backlog Section */}
        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
          <div 
            className="flex items-center justify-between p-4 bg-[var(--background-secondary)] cursor-pointer select-none"
            onClick={() => setBacklogExpanded(!backlogExpanded)}
          >
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon-sm" className="h-6 w-6">
                {backlogExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
              <h2 className="text-lg font-bold text-[var(--foreground)]">Backlog</h2>
              <span className="text-sm text-[var(--foreground-muted)] ml-2">
                {backlogTasks.length} issues
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>Create Sprint</Button>
          </div>

          {backlogExpanded && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Epic</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead className="text-right">Assignee</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backlogTasks.map(task => <TaskRow key={task.id} task={task} />)}
                <TableRow>
                  <TableCell colSpan={8} className="p-0">
                    <Button variant="ghost" className="w-full rounded-none justify-start h-12 text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
                      <Plus className="w-4 h-4 mr-2" />
                      Create issue
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
