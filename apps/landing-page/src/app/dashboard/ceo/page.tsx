"use client";

import React from "react";
import { useAuthStore } from "@/store/auth.store";

export default function CEODashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome, {user?.firstName}. Company overview and AI Insights.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm border-t-4 border-t-green-500">
          <h3 className="text-sm font-medium text-slate-500">Total Revenue (YTD)</h3>
          <div className="mt-2 text-3xl font-bold text-slate-900">₹0</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm border-t-4 border-t-blue-500">
          <h3 className="text-sm font-medium text-slate-500">Active Clients</h3>
          <div className="mt-2 text-3xl font-bold text-slate-900">0</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm border-t-4 border-t-purple-500">
          <h3 className="text-sm font-medium text-slate-500">Active Projects</h3>
          <div className="mt-2 text-3xl font-bold text-slate-900">0</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm border-t-4 border-t-yellow-500">
          <h3 className="text-sm font-medium text-slate-500">Total Headcount</h3>
          <div className="mt-2 text-3xl font-bold text-slate-900">0</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm min-h-[300px]">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Hariventure AI Digest</h2>
        <div className="flex items-center justify-center h-[200px] bg-slate-50 rounded-lg">
          <p className="text-slate-500 italic">No AI insights generated yet. Waiting for operational data...</p>
        </div>
      </div>
    </div>
  );
}
