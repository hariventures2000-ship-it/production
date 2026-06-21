"use client";

import { useState } from "react";

interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  type: "FEATURE" | "BUG" | "CHORE" | "SPIKE";
  points: number;
}

const initialTasks: Record<string, Task[]> = {
  BACKLOG: [
    { id: "T-101", title: "Database migration script", assignee: "Ravi P.", priority: "MEDIUM", type: "CHORE", points: 3 },
    { id: "T-102", title: "Dark mode support", assignee: "Vikram J.", priority: "LOW", type: "FEATURE", points: 5 },
    { id: "T-103", title: "Redis caching layer", assignee: "Meera S.", priority: "HIGH", type: "FEATURE", points: 8 },
  ],
  TODO: [
    { id: "T-104", title: "Payment gateway integration", assignee: "Ravi P.", priority: "CRITICAL", type: "FEATURE", points: 8 },
    { id: "T-105", title: "User profile redesign", assignee: "Vikram J.", priority: "HIGH", type: "FEATURE", points: 5 },
    { id: "T-106", title: "API rate limiting", assignee: "Meera S.", priority: "HIGH", type: "FEATURE", points: 3 },
    { id: "T-107", title: "Fix cart total rounding", assignee: "Pooja R.", priority: "MEDIUM", type: "BUG", points: 2 },
  ],
  IN_PROGRESS: [
    { id: "T-108", title: "Checkout flow v2", assignee: "Ravi P.", priority: "CRITICAL", type: "FEATURE", points: 13 },
    { id: "T-109", title: "Email notification service", assignee: "Arjun T.", priority: "HIGH", type: "FEATURE", points: 5 },
    { id: "T-110", title: "Responsive nav refactor", assignee: "Vikram J.", priority: "MEDIUM", type: "CHORE", points: 3 },
  ],
  REVIEW: [
    { id: "T-111", title: "Search autocomplete", assignee: "Meera S.", priority: "MEDIUM", type: "FEATURE", points: 5 },
    { id: "T-112", title: "Fix session timeout bug", assignee: "Pooja R.", priority: "HIGH", type: "BUG", points: 3 },
  ],
  TESTING: [
    { id: "T-113", title: "Product filter component", assignee: "Arjun T.", priority: "MEDIUM", type: "FEATURE", points: 5 },
    { id: "T-114", title: "Order history page", assignee: "Neha K.", priority: "LOW", type: "FEATURE", points: 3 },
  ],
  DONE: [
    { id: "T-115", title: "Login page redesign", assignee: "Vikram J.", priority: "HIGH", type: "FEATURE", points: 5 },
    { id: "T-116", title: "Fix password reset flow", assignee: "Ravi P.", priority: "CRITICAL", type: "BUG", points: 3 },
    { id: "T-117", title: "Add loading skeletons", assignee: "Pooja R.", priority: "LOW", type: "CHORE", points: 2 },
  ],
};

const columnConfig: Record<string, { label: string; color: string; dotColor: string }> = {
  BACKLOG: { label: "Backlog", color: "border-t-gray-400", dotColor: "bg-gray-400" },
  TODO: { label: "To Do", color: "border-t-slate-500", dotColor: "bg-slate-500" },
  IN_PROGRESS: { label: "In Progress", color: "border-t-blue-500", dotColor: "bg-blue-500" },
  REVIEW: { label: "Review", color: "border-t-purple-500", dotColor: "bg-purple-500" },
  TESTING: { label: "Testing", color: "border-t-amber-500", dotColor: "bg-amber-500" },
  DONE: { label: "Done", color: "border-t-emerald-500", dotColor: "bg-emerald-500" },
};

const priorityBadge: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-50 text-blue-600",
  HIGH: "bg-orange-50 text-orange-600",
  CRITICAL: "bg-red-50 text-red-600",
};

const typeBadge: Record<string, string> = {
  FEATURE: "🚀",
  BUG: "🐛",
  CHORE: "🔧",
  SPIKE: "🔍",
};

export default function TaskBoardPage() {
  const [tasks] = useState(initialTasks);

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
          <p className="text-sm text-gray-500 mt-1">Sprint 4 — Checkout Flow v2</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gradient-to-r from-mervi-cyan to-mervi-teal text-white rounded-xl text-sm font-medium shadow-sm hover:opacity-90 transition-opacity">
            + New Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.entries(columnConfig).map(([status, config]) => (
          <div key={status} className="flex-shrink-0 w-72">
            <div className={`bg-white rounded-xl shadow-sm border border-gray-100 border-t-4 ${config.color}`}>
              {/* Column Header */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                  <span className="text-sm font-semibold text-gray-800">{config.label}</span>
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {tasks[status]?.length || 0}
                </span>
              </div>

              {/* Tasks */}
              <div className="px-3 pb-3 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
                {(tasks[status] || []).map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-50/80 rounded-lg p-3 border border-gray-100 hover:border-mervi-cyan/30 hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-gray-400 font-mono">{task.id}</span>
                      <span className="text-sm">{typeBadge[task.type]}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-2 group-hover:text-mervi-cyan transition-colors">{task.title}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${priorityBadge[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-400">{task.points}pts</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-mervi-dark text-white flex items-center justify-center text-[9px] font-bold" title={task.assignee}>
                        {task.assignee.split(" ").map(n => n[0]).join("")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
