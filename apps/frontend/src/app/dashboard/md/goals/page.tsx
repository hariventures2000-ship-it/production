"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@hariventure/ui";
import { Target } from "lucide-react";

export default function MDGoalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Strategic Goals (OKRs)</h1>
        <p className="text-sm text-slate-500 mt-1">
          Objectives and Key Results for FY 2024.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Objective 1: Expand Market Presence</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Owner: Vijay Salvatore</p>
            </div>
            <Target className="text-blue-500 w-5 h-5" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>KR 1: Launch 3 new regional marketing campaigns</span>
                <span className="font-medium">66%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '66%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>KR 2: Increase inbound leads by 40%</span>
                <span className="font-medium">15%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Objective 2: Engineering Excellence</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Owner: CTO</p>
            </div>
            <Target className="text-green-500 w-5 h-5" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>KR 1: Migrate all legacy code to modern Next.js stack</span>
                <span className="font-medium">95%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>KR 2: Achieve zero critical bugs in production</span>
                <span className="font-medium">100%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
