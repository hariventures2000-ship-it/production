"use client";

import React from "react";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Badge, Button,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from "@hariventure/ui";
import { Plus } from "lucide-react";

const MOCK_TICKETS = [
  { id: "TKT-492", subject: "DNS configuration issue for new domain", priority: "HIGH", status: "RESOLVED", updated: "2 days ago" },
  { id: "TKT-510", subject: "Requesting access to staging environment", priority: "MEDIUM", status: "IN_PROGRESS", updated: "4 hours ago" },
];

export default function ClientSupportPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Support Tickets</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage your requests with our support team.
          </p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="w-4 h-4" />
          New Ticket
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_TICKETS.map((tkt) => (
                <TableRow key={tkt.id}>
                  <TableCell className="font-medium text-slate-500">{tkt.id}</TableCell>
                  <TableCell className="font-medium text-slate-900">{tkt.subject}</TableCell>
                  <TableCell>
                    <Badge variant={tkt.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                      {tkt.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">{tkt.updated}</TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={
                        tkt.status === 'RESOLVED' ? 'success' : 'info'
                      }
                    >
                      {tkt.status.replace('_', ' ')}
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
