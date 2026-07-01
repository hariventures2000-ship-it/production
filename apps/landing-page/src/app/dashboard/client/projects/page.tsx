"use client";

import React, { useEffect, useState } from "react";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Badge, Button,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from "@hariventure/ui";
import { Plus, LayoutGrid, List as ListIcon } from "lucide-react";
import { useProjectStore } from "@/store/project.store";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";

export default function ClientProjectsPage() {
  const { projects, isLoading, fetchProjects } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track all your active engagements and monitor progress.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-2">
            <Button variant="ghost" size="sm" className="bg-white shadow-sm h-8 px-2">
              <LayoutGrid className="w-4 h-4 text-slate-700" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-slate-200">
              <ListIcon className="w-4 h-4 text-slate-500" />
            </Button>
          </div>
          <Button className="shrink-0 gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-lg">
              <p className="text-slate-500 mb-4">No projects found. Create one to get started!</p>
              <Button variant="outline" className="gap-2" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4" /> Start New Project
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Details</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((proj) => (
                  <TableRow key={proj._id}>
                    <TableCell>
                      <div className="font-medium text-slate-900">{proj.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{proj._id}</div>
                    </TableCell>
                    <TableCell>{proj.department}</TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {new Date(proj.startDate).toLocaleDateString()} - {new Date(proj.estimatedEndDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full max-w-[100px] bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${proj.completionPercentage || 0}%` }} 
                          />
                        </div>
                        <span className="text-xs text-slate-500">{proj.completionPercentage || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={
                          proj.status === 'COMPLETED' ? 'success' : 
                          proj.status === 'IN_PROGRESS' ? 'info' : 'outline'
                        }
                      >
                        {proj.status.replace('_', ' ')}
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
