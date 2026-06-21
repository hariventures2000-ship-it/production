"use client";

import React from "react";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Badge, 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from "@hariventure/ui";

const MOCK_TEAM = [
  { id: "EMP-1001", name: "Sarah Jenkins", role: "UI/UX Designer", tasks: 4, points: 12, status: "ONLINE" },
  { id: "EMP-1002", name: "Michael Chang", role: "DevOps Engineer", tasks: 2, points: 8, status: "ON_LEAVE" },
  { id: "EMP-1003", name: "David Ross", role: "Developer", tasks: 6, points: 24, status: "ONLINE" },
];

export default function LeadTeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Team Members</h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor workload and active assignments for your direct reports.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Direct Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Assigned Tasks</TableHead>
                <TableHead className="text-center">Story Points</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_TEAM.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">{emp.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{emp.id}</div>
                  </TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell className="text-center font-medium">{emp.tasks}</TableCell>
                  <TableCell className="text-center text-slate-500">{emp.points}</TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={
                        emp.status === 'ONLINE' ? 'success' : 'secondary'
                      }
                    >
                      {emp.status.replace('_', ' ')}
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
