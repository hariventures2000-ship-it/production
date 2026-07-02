"use client";

import React from "react";
import { useAuthStore } from "@/store/auth.store";
import { Card, CardHeader, CardTitle, CardContent } from "@hariventure/ui";
import { DollarSign, Briefcase, Users, TrendingUp } from "lucide-react";

export default function MDDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, {user?.firstName}. Company overview and high-level KPIs.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (YTD)</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">₹4.2M</div>
            <p className="text-xs text-green-600 mt-1">+12% from last year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Briefcase className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">24</div>
            <p className="text-xs text-slate-500 mt-1">Across 3 regions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Headcount</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">142</div>
            <p className="text-xs text-slate-500 mt-1">Across 7 departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Target</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">68%</div>
            <p className="text-xs text-slate-500 mt-1">On track for Q4</p>
          </CardContent>
        </Card>
      </div>

      <Card className="min-h-[300px]">
        <CardHeader>
          <CardTitle>Hariventure AI Digest</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Automated Executive Summary</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
              <li>Revenue from <span className="font-semibold text-slate-900">Website Development</span> is up 15% this quarter, largely driven by the Corporate Rebranding initiative.</li>
              <li>There is a bottleneck in <span className="font-semibold text-slate-900">UI/UX Design</span>; 3 projects are currently waiting for design sign-off. Consider adjusting recruitment priorities.</li>
              <li>Overall attendance rate has normalized to 97% following the flu season dip.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
