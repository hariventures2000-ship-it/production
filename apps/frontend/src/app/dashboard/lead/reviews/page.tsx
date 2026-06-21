"use client";

import React from "react";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Button,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from "@hariventure/ui";
import { Check, X, FileSearch } from "lucide-react";

const MOCK_REVIEWS = [
  { id: "REV-102", title: "OAuth2 Middleware Implementation", author: "David Ross", project: "Web App Phase 1", status: "PENDING" },
  { id: "REV-103", title: "Homepage Hero Section Redesign", author: "Sarah Jenkins", project: "Corporate Website Redesign", status: "PENDING" },
];

export default function LeadReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Code & Design Reviews</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review and approve pull requests and design mockups from your team.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Your Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Review Item</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_REVIEWS.map((rev) => (
                <TableRow key={rev.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">{rev.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{rev.id}</div>
                  </TableCell>
                  <TableCell>{rev.author}</TableCell>
                  <TableCell>{rev.project}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="border-slate-200 hover:bg-slate-50 px-2">
                        <FileSearch className="w-4 h-4" />
                      </Button>
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
