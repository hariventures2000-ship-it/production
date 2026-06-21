"use client";

import React from "react";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Badge, Button,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from "@hariventure/ui";
import { Plus, Download } from "lucide-react";

const MOCK_EMPLOYEES = [
  { id: "EMP-1001", name: "Sarah Jenkins", role: "UI/UX Designer", department: "UI/UX Design", status: "ACTIVE", joined: "2022-03-15" },
  { id: "EMP-1002", name: "Michael Chang", role: "DevOps Engineer", department: "Support & Maintenance", status: "ON_LEAVE", joined: "2021-11-01" },
  { id: "EMP-1003", name: "David Ross", role: "Developer", department: "Website Development", status: "ACTIVE", joined: "2023-01-10" },
  { id: "EMP-1004", name: "Emily Chen", role: "Business Analyst", department: "AI Solutions", status: "ACTIVE", joined: "2023-06-22" },
];

export default function HREmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Employee Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage all active and inactive personnel across departments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="shrink-0 gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="shrink-0 gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_EMPLOYEES.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">{emp.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{emp.id}</div>
                  </TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell className="text-slate-500">{emp.joined}</TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={
                        emp.status === 'ACTIVE' ? 'success' : 'warning'
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
