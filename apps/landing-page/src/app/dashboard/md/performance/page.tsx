"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from "@hariventure/ui";

const MOCK_DEPTS = [
  { name: "Website Development", headcount: 42, activeProjects: 8, health: "EXCELLENT" },
  { name: "Mobile App Development", headcount: 28, activeProjects: 5, health: "GOOD" },
  { name: "UI/UX Design", headcount: 14, activeProjects: 12, health: "WARNING" },
  { name: "AI Solutions", headcount: 8, activeProjects: 2, health: "GOOD" },
];

export default function MDPerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Company Performance</h1>
        <p className="text-sm text-slate-500 mt-1">
          Departmental health metrics and operational efficiency.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Headcount</TableHead>
                <TableHead className="text-center">Active Projects</TableHead>
                <TableHead className="text-right">Health Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_DEPTS.map((dept, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell className="text-center">{dept.headcount}</TableCell>
                  <TableCell className="text-center">{dept.activeProjects}</TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={
                        dept.health === 'EXCELLENT' ? 'success' : 
                        dept.health === 'WARNING' ? 'warning' : 'secondary'
                      }
                    >
                      {dept.health}
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
