"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from "@hariventure/ui";

const MOCK_INVOICES = [
  { id: "INV-2024-089", client: "TechCorp Inc", amount: "₹4,50,000", status: "PAID", date: "2024-10-01" },
  { id: "INV-2024-102", client: "Global Solutions", amount: "₹2,25,000", status: "OVERDUE", date: "2024-10-15" },
  { id: "INV-2024-115", client: "Startup Next", amount: "₹3,00,000", status: "PENDING", date: "2024-11-01" },
];

export default function MDFinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Financial Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Revenue tracking, accounts receivable, and financial health.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Cash in Bank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">₹8.5M</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Accounts Receivable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">₹1.2M</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Overdue Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900">₹2.25L</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Receivables</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INVOICES.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium text-slate-500">{inv.id}</TableCell>
                  <TableCell className="font-medium text-slate-900">{inv.client}</TableCell>
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
