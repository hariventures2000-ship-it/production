"use client";

import React from "react";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Badge, Button,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from "@hariventure/ui";
import { Plus } from "lucide-react";

const MOCK_SPRINTS = [
  { id: "SPR-42", name: "Web App Launch Phase 1", dates: "Oct 20 - Nov 03", points: 52, progress: 85, status: "ACTIVE" },
  { id: "SPR-43", name: "Web App Launch Phase 2", dates: "Nov 04 - Nov 18", points: 40, progress: 0, status: "PLANNING" },
  { id: "SPR-41", name: "Database Optimization", dates: "Oct 06 - Oct 19", points: 34, progress: 100, status: "COMPLETED" },
];

export default function LeadSprintsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Sprints</h1>
          <p className="text-sm text-slate-500 mt-1">
            Plan, track, and close Agile sprints for your department.
          </p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="w-4 h-4" />
          Create Sprint
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sprint History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sprint Name</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Total Points</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_SPRINTS.map((spr) => (
                <TableRow key={spr.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">{spr.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{spr.id}</div>
                  </TableCell>
                  <TableCell>{spr.dates}</TableCell>
                  <TableCell className="font-medium">{spr.points}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-full max-w-[100px] bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${spr.progress === 100 ? 'bg-slate-800' : 'bg-green-500'}`} 
                          style={{ width: `${spr.progress}%` }} 
                        />
                      </div>
                      <span className="text-xs text-slate-500">{spr.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={
                        spr.status === 'ACTIVE' ? 'info' : 
                        spr.status === 'COMPLETED' ? 'success' : 'secondary'
                      }
                    >
                      {spr.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
