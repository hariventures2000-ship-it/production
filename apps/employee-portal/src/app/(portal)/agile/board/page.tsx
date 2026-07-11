// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Sprint Board Page
// Implemented with Touch/Pointer Sensors, Collision Detection, Optimistic Updates & Undo
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { 
  Plus, Search, Filter, MoreHorizontal, User, 
  AlignLeft, MessageSquare, Paperclip, AlertCircle, ChevronDown, CheckCircle2, Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";
import { mockTasks, mockActiveSprint, mockEpics } from "@/lib/mock-data/agile.mock";
import type { TaskStatus, AgileTask } from "@/lib/types/agile.types";
import { PRIORITY_CONFIG } from "@/lib/constants";
import { useEnterpriseFilter } from "@/hooks/use-enterprise-filter";
import { EnterpriseFilterBar } from "@/components/ui/enterprise-filter-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { FilterFieldConfig } from "@/types/filter.types";
import { toast } from "sonner";

// ── Dnd Kit Imports ────────────────────────────────────────────────

import { 
  DndContext, useDraggable, useDroppable, 
  PointerSensor, TouchSensor, useSensor, useSensors,
  rectIntersection
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "REVIEW", title: "In Review" },
  { id: "TESTING", title: "Testing" },
  { id: "DONE", title: "Done" },
];

// ── Droppable Column Wrapper ───────────────────────────────────────

function BoardColumn({ col, columnTasks, children }: { col: { id: TaskStatus; title: string }; columnTasks: AgileTask[]; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: col.id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex-shrink-0 w-80 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] flex flex-col max-h-full transition-all duration-200",
        isOver && "bg-[var(--color-primary)]/5 border-[var(--color-primary)]/40 shadow-inner scale-[1.01]"
      )}
    >
      <div className="p-3 border-b border-[var(--border)] flex items-center justify-between shrink-0 bg-[var(--card-bg)] rounded-t-xl">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-[var(--foreground)]">{col.title}</h3>
          <span className="text-xs bg-[var(--background-tertiary)] text-[var(--foreground-secondary)] px-2 py-0.5 rounded-full font-medium">
            {columnTasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon-sm" className="h-7 w-7" onClick={() => toast.info("Creating tasks within column is available in sprint planning.")}>
          <Plus className="w-4 h-4 text-[var(--foreground-muted)]" />
        </Button>
      </div>

      <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar min-h-[250px] pb-6">
        {children}
        {columnTasks.length === 0 && (
          <div className="h-28 border-2 border-dashed border-[var(--border)] rounded-lg flex items-center justify-center transition-colors">
            <span className="text-xs text-[var(--foreground-muted)]">Drop issues here</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Draggable Card Component ───────────────────────────────────────

function BoardCard({ task }: { task: AgileTask }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const epic = mockEpics.find(e => e.id === task.epicId);
  const prioConf = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.LOW;

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : 1,
    cursor: isDragging ? "grabbing" : "grab"
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group bg-[var(--card-bg)] p-3 rounded-lg border border-[var(--border)] shadow-sm hover:border-[var(--color-primary)] hover:shadow-md transition-all active:cursor-grabbing select-none"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[var(--foreground)] leading-snug">
            {task.title}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon-sm" 
          className="opacity-0 group-hover:opacity-100 h-6 w-6 shrink-0 -mr-1 -mt-1 transition-opacity"
          onPointerDown={(e) => e.stopPropagation()} // Let button click register without dragging
          onClick={() => toast.info(`Viewing logs for ${task.key}`)}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {epic && (
          <Badge variant="outline" className={cn("text-[9px] h-5 border-none text-white font-semibold", epic.color)}>
            {epic.name}
          </Badge>
        )}
        {task.labels.map(l => (
          <span key={l} className="text-[9px] font-semibold text-[var(--foreground-secondary)] bg-[var(--background-secondary)] px-1.5 py-0.5 rounded">
            {l}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          {task.type === 'BUG' ? (
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          ) : task.type === 'STORY' ? (
            <Bookmark className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
          )}
          <div className={cn("w-1.5 h-1.5 rounded-full", prioConf.dot)} title={`Priority: ${prioConf.label}`} />
          <span className="text-[10px] font-semibold text-[var(--foreground-secondary)]">
            {task.key}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {task.storyPoints && (
            <div className="w-4 h-4 rounded-full bg-[var(--background-secondary)] text-[9px] font-bold text-[var(--foreground)] flex items-center justify-center">
              {task.storyPoints}
            </div>
          )}
          {task.assignee ? (
            <Avatar className="w-5 h-5 shrink-0">
              <AvatarImage src={task.assignee.avatar} />
              <AvatarFallback className="text-[9px] font-bold bg-blue-100 text-blue-700">{task.assignee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-5 h-5 rounded-full border border-dashed border-[var(--foreground-muted)] flex items-center justify-center text-[var(--foreground-muted)]">
              <User className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────────────

export default function SprintBoardPage() {
  const [tasks, setTasks] = useState(() => mockTasks.filter(t => t.sprintId === mockActiveSprint.id));

  // Pointer constraint filters click vs drag threshold
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const fieldsConfig: FilterFieldConfig[] = [
    { key: "priority", label: "Priority", type: "select", options: [
      { value: "all", label: "All Priorities" },
      { value: "CRITICAL", label: "Critical" },
      { value: "HIGH", label: "High" },
      { value: "MEDIUM", label: "Medium" },
      { value: "LOW", label: "Low" },
    ]},
    { key: "epicId", label: "Epic", type: "select", options: [
      { value: "all", label: "All Epics" },
      ...mockEpics.map(e => ({ value: e.id, label: e.name }))
    ]}
  ];

  const {
    state,
    filteredData,
    setSearch,
    setFilter,
    removeFilter,
    clearAll,
    setSort,
    saveView,
    applyView,
  } = useEnterpriseFilter({
    moduleId: "agile-board",
    defaultState: {
      search: "",
      filters: {},
      sort: null,
      visibleColumns: {},
      currentPage: 1,
      itemsPerPage: 1000,
    },
    data: tasks,
    searchFields: ["title", "key", "description"],
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const overColumnId = over.id as TaskStatus;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.status === overColumnId) return;

    // Cache copy for Undo operation
    const previousTasks = [...tasks];

    // Optimistic Update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: overColumnId } : t));

    // Toast notification with undo action
    toast.success(`Moved ${task.key} to ${overColumnId.replace("_", " ")}`, {
      action: {
        label: "Undo",
        onClick: () => {
          setTasks(previousTasks);
          toast.success(`Reverted ${task.key} back to ${task.status.replace("_", " ")}`);
        }
      }
    });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-full overflow-hidden space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
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
          <Button size="sm" onClick={() => toast.info("Creating user stories is supported in the backlog page.")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Issue
          </Button>
        </div>
      </div>

      {/* Enterprise Filter Bar */}
      <EnterpriseFilterBar
        moduleId="agile-board"
        fieldsConfig={fieldsConfig}
        state={state}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onRemoveFilter={removeFilter}
        onClearAll={clearAll}
        onApplyView={applyView}
        onSaveView={saveView}
        sortOptions={[
          { value: "key", label: "Issue Key" },
          { value: "title", label: "Title" },
        ]}
        onSortSelect={setSort}
        filteredData={filteredData}
      >
        <FilterDropdown
          label="Priority"
          value={(state.filters.priority as any)?.value || "all"}
          options={fieldsConfig[0].options || []}
          onChange={(val) => setFilter("priority", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Epic"
          value={(state.filters.epicId as any)?.value || "all"}
          options={fieldsConfig[1].options || []}
          onChange={(val) => setFilter("epicId", { type: "select", value: val })}
        />
      </EnterpriseFilterBar>

      {/* DndContext Wrapping Column Board */}
      <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start custom-scrollbar">
          {COLUMNS.map(col => {
            const columnTasks = filteredData.filter(t => t.status === col.id);
            return (
              <BoardColumn key={col.id} col={col} columnTasks={columnTasks}>
                {columnTasks.map(task => (
                  <BoardCard key={task.id} task={task} />
                ))}
              </BoardColumn>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}
