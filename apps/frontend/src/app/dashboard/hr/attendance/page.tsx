"use client";

import React from "react";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Button,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from "@hariventure/ui";
import { Check, X } from "lucide-react";

const MOCK_LEAVE_REQUESTS = [
  { id: "LR-091", employee: "Michael Chang", type: "Sick Leave", dates: "Oct 24 - Oct 25", days: 2, status: "PENDING" },
  { id: "LR-092", employee: "Emily Chen", type: "Vacation", dates: "Nov 01 - Nov 05", days: 5, status: "PENDING" },
];

export default function HRAttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance & Leave</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review pending leave requests and monitor daily attendance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Present Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">138</div>
            <p className="text-xs text-green-600 mt-1">97% attendance rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">4</div>
            <p className="text-xs text-slate-500 mt-1">Approved leaves</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">12</div>
            <p className="text-xs text-yellow-700 mt-1">Requires your review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_LEAVE_REQUESTS.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium text-slate-900">{req.employee}</TableCell>
                  <TableCell>{req.type}</TableCell>
                  <TableCell>{req.dates}</TableCell>
                  <TableCell>{req.days}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 px-2">
                        <X className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 px-2">
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
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
