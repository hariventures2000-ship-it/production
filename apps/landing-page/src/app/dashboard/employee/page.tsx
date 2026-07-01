"use client";

import React from "react";
import { useAuthStore } from "@/store/auth.store";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@hariventure/ui";
import { ListTodo, CheckCircle2, Clock, Calendar } from "lucide-react";
import Link from "next/link";

export default function EmployeeDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Workspace</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, {user?.firstName}. Here is your daily digest.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">5</div>
            <p className="text-xs text-slate-500 mt-1">Across 2 projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed (Sprint)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">12</div>
            <p className="text-xs text-slate-500 mt-1">8 story points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">32.5</div>
            <p className="text-xs text-slate-500 mt-1">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <Calendar className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">14</div>
            <p className="text-xs text-slate-500 mt-1">Annual days remaining</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="min-h-[300px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Up Next</CardTitle>
            <Link href="/dashboard/employee/tasks" className="text-sm font-medium text-green-600 hover:text-green-700">
              View All Tasks
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-slate-200 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Implement OAuth2 Login</h4>
                  <p className="text-xs text-slate-500 mt-1">Project: Corporate Website Redesign</p>
                </div>
                <Badge variant="info">IN PROGRESS</Badge>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Fix Sidebar Routing Bug</h4>
                  <p className="text-xs text-slate-500 mt-1">Project: Mobile App MVP</p>
                </div>
                <Badge variant="destructive">HIGH PRIORITY</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle>Sprint Burndown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[200px]">
            <p className="text-sm text-slate-400 italic">Chart implementation pending analytics backend</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
