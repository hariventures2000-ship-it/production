"use client";

import React from "react";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Badge, 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from "@hariventure/ui";

const MOCK_INVOICES = [
  { id: "INV-2024-089", date: "2024-10-01", amount: "$4,500.00", status: "PAID", project: "Corporate Website Redesign" },
  { id: "INV-2024-102", date: "2024-10-15", amount: "$2,250.00", status: "OVERDUE", project: "Mobile App MVP" },
  { id: "INV-2024-115", date: "2024-11-01", amount: "$3,000.00", status: "PENDING", project: "Corporate Website Redesign" },
];

export default function ClientInvoicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Billing & Invoices</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your payments and download past invoices.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INVOICES.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium text-green-600 cursor-pointer hover:underline">
                    {inv.id}
                  </TableCell>
                  <TableCell>{inv.project}</TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell className="text-right font-medium">{inv.amount}</TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={
                        inv.status === 'PAID' ? 'success' : 
                        inv.status === 'OVERDUE' ? 'destructive' : 'warning'
                      }
                    >
                      {inv.status}
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
