"use client";

import { useState } from "react";
import { 
  CheckCircle2, Circle, Clock, MoreHorizontal, Plus, 
  Search, Filter, Calendar as CalendarIcon, CheckSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";
import { mockTodayTasks } from "@/lib/mock-data/workspace.mock";
import { PRIORITY_CONFIG } from "@/lib/constants";

export default function MyTasksPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const tasks = [...mockTodayTasks, 
    { id: 'task-6', title: 'Prepare Q3 OKRs presentation', priority: 'MEDIUM', status: 'DONE', projectName: 'Management', dueDate: '2026-07-01' },
    { id: 'task-7', title: 'Onboard new UI designer', priority: 'HIGH', status: 'DONE', projectName: 'HR', dueDate: '2026-07-02' }
  ] as const;

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = 
      activeTab === "all" ? true :
      activeTab === "today" ? task.status !== "DONE" :
      activeTab === "completed" ? task.status === "DONE" :
      true;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">My Tasks</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Manage your personal to-dos and assigned project tasks.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="today">To Do</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
            <Input 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {filteredTasks.map((task) => {
              const priorityConf = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG];
              const isCompleted = task.status === "DONE";

              return (
                <div 
                  key={task.id}
                  className="flex items-center gap-4 p-4 hover:bg-[var(--background-secondary)] transition-colors group"
                >
                  <button className="text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors shrink-0">
                    {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium transition-colors", isCompleted ? "text-[var(--foreground-muted)] line-through" : "text-[var(--foreground)]")}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--foreground-secondary)]">
                      <span className="truncate max-w-[200px]">{task.projectName}</span>
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className={cn("text-[10px] shrink-0 hidden sm:inline-flex", priorityConf.color)}>
                    {priorityConf.label}
                  </Badge>
                  <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
            {filteredTasks.length === 0 && (
              <div className="p-12 text-center">
                <CheckSquare className="w-8 h-8 text-[var(--foreground-muted)] mx-auto mb-3" />
                <p className="text-sm font-medium text-[var(--foreground)]">No tasks found</p>
                <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                  You are all caught up!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
