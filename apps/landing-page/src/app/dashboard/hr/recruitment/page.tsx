"use client";

import React from "react";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Badge, Button,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from "@hariventure/ui";
import { Plus } from "lucide-react";

const MOCK_REQS = [
  { id: "REQ-01", title: "Senior React Developer", department: "Website Development", applicants: 24, status: "ACTIVE" },
  { id: "REQ-02", title: "QA Engineer", department: "Support & Maintenance", applicants: 8, status: "ACTIVE" },
  { id: "REQ-03", title: "Product Manager", department: "Website Development", applicants: 0, status: "DRAFT" },
];

export default function HRRecruitmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Recruitment</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage open job requisitions and track applicant pipelines.
          </p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="w-4 h-4" />
          New Requisition
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Requisitions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_REQS.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">{req.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{req.id}</div>
                  </TableCell>
                  <TableCell>{req.department}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{req.applicants} Candidates</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={
                        req.status === 'ACTIVE' ? 'success' : 'outline'
                      }
                    >
                      {req.status}
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
