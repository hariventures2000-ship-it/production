"use client";

import { useState } from "react";
import { 
  Plus, Search, Filter, MoreHorizontal, User, 
  AlignLeft, MessageSquare, Paperclip, AlertCircle, ChevronDown, CheckCircle2, Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { mockTasks, mockActiveSprint, mockEpics } from "@/lib/mock-data/agile.mock";
import type { TaskStatus, AgileTask } from "@/lib/types/agile.types";
import { PRIORITY_CONFIG } from "@/lib/constants";

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "REVIEW", title: "In Review" },
  { id: "TESTING", title: "Testing" },
  { id: "DONE", title: "Done" },
];

export default function SprintBoardPage() {
  const [tasks, setTasks] = useState<AgileTask[]>(mockTasks.filter(t => t.sprintId === mockActiveSprint.id));
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
              Mervi Platform Board
            </h1>
            <Badge variant="outline" className="bg-[var(--background-secondary)] text-[var(--foreground)] font-medium">
              {mockActiveSprint.name}
            </Badge>
          </div>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            {mockActiveSprint.goal}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
            <Input 
              placeholder="Search board..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Issue
          </Button>
        </div>
      </div>

      {/* Board Columns */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start custom-scrollbar">
        {COLUMNS.map(col => {
          const columnTasks = filteredTasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="flex-shrink-0 w-80 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] flex flex-col max-h-full">
              <div className="p-3 border-b border-[var(--border)] flex items-center justify-between shrink-0 bg-[var(--card-bg)] rounded-t-xl">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-[var(--foreground)]">{col.title}</h3>
                  <span className="text-xs bg-[var(--background-tertiary)] text-[var(--foreground-secondary)] px-2 py-0.5 rounded-full font-medium">
                    {columnTasks.length}
                  </span>
                </div>
                <Button variant="ghost" size="icon-sm" className="h-7 w-7">
                  <Plus className="w-4 h-4 text-[var(--foreground-muted)]" />
                </Button>
              </div>

              <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar min-h-[150px]">
                {columnTasks.map(task => {
                  const epic = mockEpics.find(e => e.id === task.epicId);
                  const prioConf = PRIORITY_CONFIG[task.priority];

                  return (
                    <div 
                      key={task.id}
                      className="group bg-[var(--card-bg)] p-3 rounded-lg border border-[var(--border)] shadow-sm hover:border-[var(--color-primary)] hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--foreground)] leading-snug">
                            {task.title}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 shrink-0 -mr-1 -mt-1 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {epic && (
                          <Badge variant="outline" className={cn("text-[10px] h-5 border-none text-white", epic.color)}>
                            {epic.name}
                          </Badge>
                        )}
                        {task.labels.map(l => (
                          <span key={l} className="text-[10px] text-[var(--foreground-secondary)] bg-[var(--background-secondary)] px-1.5 py-0.5 rounded">
                            {l}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border)]">
                        <div className="flex items-center gap-2">
                          {task.type === 'BUG' ? (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          ) : task.type === 'STORY' ? (
                            <Bookmark className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                          )}
                          <div className={cn("w-2 h-2 rounded-full", prioConf.dot)} title={`Priority: ${prioConf.label}`} />
                          <span className="text-xs font-semibold text-[var(--foreground-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer">
                            {task.key}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {task.storyPoints && (
                            <div className="w-5 h-5 rounded-full bg-[var(--background-secondary)] text-[10px] font-bold text-[var(--foreground)] flex items-center justify-center">
                              {task.storyPoints}
                            </div>
                          )}
                          {task.assignee ? (
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={task.assignee.avatar} />
                              <AvatarFallback className="text-[10px]">{task.assignee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-6 h-6 rounded-full border border-dashed border-[var(--foreground-muted)] flex items-center justify-center text-[var(--foreground-muted)]">
                              <User className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {columnTasks.length === 0 && (
                  <div className="h-full min-h-[100px] border-2 border-dashed border-[var(--border)] rounded-lg flex items-center justify-center">
                    <span className="text-xs text-[var(--foreground-muted)]">Drop issues here</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
