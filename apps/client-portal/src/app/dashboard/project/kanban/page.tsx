"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/app.store";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckSquare, MessageSquare, Paperclip, AlertCircle, Clock } from "lucide-react";
import type { Task, TaskStatus } from "@/lib/types";
import { mockTasks } from "@/lib/mock-data"; // Directly importing mock data as we don't have a task service yet
import { cn } from "@/lib/cn";

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'TODO', label: 'To Do', color: 'bg-slate-500' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-500' },
  { id: 'REVIEW', label: 'In Review', color: 'bg-purple-500' },
  { id: 'TESTING', label: 'Testing', color: 'bg-amber-500' },
  { id: 'DONE', label: 'Done', color: 'bg-emerald-500' },
];

export default function KanbanPage() {
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!selectedProjectId) {
      setLoading(false);
      return;
    }
    // Simulate API call using mock data directly for now
    setLoading(true);
    setTimeout(() => {
      setTasks(mockTasks.filter(t => t.projectId === selectedProjectId && t.status !== 'BACKLOG'));
      setLoading(false);
    }, 400);
  }, [selectedProjectId]);

  if (loading) return <KanbanSkeleton />;
  if (tasks.length === 0) return <div className="p-8 text-center text-[var(--foreground-secondary)]">No active tasks found.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="shrink-0 mb-6">
        <PageHeader
          title="Task Board"
          description="Read-only view of active project tasks and their current state."
          icon={CheckSquare}
        />
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-4 h-full min-w-max px-1">
          {COLUMNS.map(column => {
            const columnTasks = tasks.filter(t => t.status === column.id);
            return (
              <div key={column.id} className="flex flex-col w-[320px] h-full bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] shrink-0 overflow-hidden">
                {/* Column Header */}
                <div className="flex items-center justify-between p-3 border-b border-[var(--border)] bg-[var(--card-bg)] shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", column.color)} />
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">{column.label}</h3>
                  </div>
                  <span className="text-xs font-medium text-[var(--foreground-muted)] bg-[var(--background-tertiary)] px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column Content */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {columnTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="h-20 border-2 border-dashed border-[var(--border)] rounded-lg flex items-center justify-center">
                      <span className="text-xs text-[var(--foreground-muted)]">No tasks</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-default group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-1.5 flex-wrap">
          <Badge variant={task.type === 'BUG' ? 'danger' : 'default'} className="px-1.5 py-0 rounded text-[9px]">
            {task.type}
          </Badge>
          {task.priority === 'HIGH' || task.priority === 'CRITICAL' ? (
            <Badge variant="danger" className="px-1.5 py-0 rounded text-[9px]"><AlertCircle className="h-2.5 w-2.5 mr-0.5 inline" />{task.priority}</Badge>
          ) : null}
        </div>
      </div>
      
      <h4 className="text-sm font-medium text-[var(--foreground)] leading-snug mb-3 group-hover:text-primary transition-colors">
        {task.title}
      </h4>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2.5 text-[var(--foreground-muted)]">
          {task.commentCount > 0 && (
            <div className="flex items-center text-xs gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{task.commentCount}</span>
            </div>
          )}
          {task.attachmentCount > 0 && (
            <div className="flex items-center text-xs gap-1">
              <Paperclip className="h-3 w-3" />
              <span>{task.attachmentCount}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center text-xs gap-1 text-danger">
              <Clock className="h-3 w-3" />
            </div>
          )}
        </div>
        
        {task.assignee && (
          <Avatar size="sm" className="h-6 w-6">
            <AvatarImage src={task.assignee.avatar} />
            <AvatarFallback className="text-[9px]">{task.assignee.firstName[0]}{task.assignee.lastName[0]}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}

function KanbanSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <Skeleton className="h-10 w-64 mb-6 shrink-0" />
      <div className="flex gap-4 h-full overflow-hidden">
        {[1, 2, 3, 4].map(col => (
          <div key={col} className="w-[320px] h-full bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] p-3 shrink-0 flex flex-col gap-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
