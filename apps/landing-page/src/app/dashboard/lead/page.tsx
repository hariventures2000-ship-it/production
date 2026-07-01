"use client";

import React from "react";
import { useAuthStore } from "@/store/auth.store";
import { Card, CardHeader, CardTitle, CardContent } from "@hariventure/ui";
import { Users, Timer, CheckCircle2, ShieldAlert } from "lucide-react";

export default function LeadDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Team Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, {user?.firstName}.          Manage your team&apos;s sprints, code reviews, and performance.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sprint</CardTitle>
            <Timer className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">Sprint 42</div>
            <p className="text-xs text-slate-500 mt-1">Ends in 3 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Velocity</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">85%</div>
            <p className="text-xs text-slate-500 mt-1">45/52 Story Points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Tasks</CardTitle>
            <ShieldAlert className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2</div>
            <p className="text-xs text-slate-500 mt-1">Requires your attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Attendance</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">11/12</div>
            <p className="text-xs text-slate-500 mt-1">1 member on leave</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle>Sprint Burndown</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[200px] border-2 border-dashed border-slate-100 rounded-lg">
            <p className="text-slate-400 italic">Chart implementation pending</p>
          </CardContent>
        </Card>
        
        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Task completed: Database Migration</p>
                  <p className="text-xs text-slate-500">by David Ross • 1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-red-500"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Task blocked: OAuth Integration</p>
                  <p className="text-xs text-slate-500">by Sarah Jenkins • 3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
