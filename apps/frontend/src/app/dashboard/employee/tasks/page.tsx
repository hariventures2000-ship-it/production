"use client";


import React, { useEffect, useState } from "react";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Badge, Button,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from "@hariventure/ui";
import { useTaskStore } from "@/store/task.store";
import { Plus } from "lucide-react";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";

export default function EmployeeTasksPage() {
  const { tasks, isLoading, fetchTasks, updateTaskStatus } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusClick = (taskId: string, currentStatus: string) => {
    // Simple mock workflow: TODO -> IN_PROGRESS -> REVIEW -> DONE
    const workflow: Record<string, string> = {
      TODO: "IN_PROGRESS",
      IN_PROGRESS: "REVIEW",
      REVIEW: "DONE",
      DONE: "TODO"
    };
    
    // Safely cast currentStatus ensuring it exists in workflow
    const nextStatus = workflow[currentStatus as keyof typeof workflow] || "TODO";
    updateTaskStatus(taskId, nextStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your assignments across all active sprints.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">All Tasks ({tasks.length})</Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200">
              In Progress ({tasks.filter(t => t.status === 'IN_PROGRESS').length})
            </Badge>
            <Badge variant="success" className="cursor-pointer">
              Done ({tasks.filter(t => t.status === 'DONE').length})
            </Badge>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" /> New Task
          </Button>
        </div>
      </div>
      
      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-lg">
              <p className="text-slate-500 mb-4">No tasks assigned to you right now. Take a break!</p>
              <Button variant="outline" className="gap-2" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4" /> Create a Task
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((tsk) => (
                  <TableRow key={tsk._id}>
                    <TableCell className="font-medium text-slate-500">
                      {tsk._id.substring(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-900">{tsk.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{tsk.type}</div>
                    </TableCell>
                    <TableCell>{typeof tsk.projectId === 'object' ? tsk.projectId.name : 'Unknown Project'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          tsk.priority === 'CRITICAL' || tsk.priority === 'HIGH' ? 'destructive' : 
                          tsk.priority === 'LOW' ? 'secondary' : 'default'
                        }
                      >
                        {tsk.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        className="cursor-pointer transition-colors hover:opacity-80"
                        onClick={() => handleStatusClick(tsk._id, tsk.status)}
                        variant={
                          tsk.status === 'DONE' ? 'success' : 
                          tsk.status === 'IN_PROGRESS' ? 'info' : 'outline'
                        }
                      >
                        {tsk.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
