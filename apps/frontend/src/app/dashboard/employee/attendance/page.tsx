"use client";

import React from "react";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Button
} from "@hariventure/ui";
import { Clock, Coffee, LogOut, CalendarRange } from "lucide-react";

export default function EmployeeAttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Time & Attendance</h1>
        <p className="text-sm text-slate-500 mt-1">
          Log your daily hours and request time off.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Time Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <Clock className="w-12 h-12 text-slate-400 mb-4" />
              <div className="text-4xl font-mono font-bold text-slate-900 tracking-wider">04:22:15</div>
              <p className="text-sm text-slate-500 mt-2 mb-6">Current Session Duration</p>
              
              <div className="flex gap-3 w-full max-w-xs">
                <Button className="flex-1 gap-2 bg-green-600 hover:bg-green-700" disabled>
                  <Clock className="w-4 h-4" /> Clocked In
                </Button>
                <Button variant="outline" className="flex-1 gap-2 border-yellow-200 text-yellow-700 hover:bg-yellow-50">
                  <Coffee className="w-4 h-4" /> Break
                </Button>
                <Button variant="outline" className="flex-1 gap-2 border-red-200 text-red-700 hover:bg-red-50">
                  <LogOut className="w-4 h-4" /> Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Leave Balances</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarRange className="w-4 h-4" />
              Request Leave
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Annual Vacation</span>
                <span className="text-slate-500">14 / 21 Days</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '66%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Sick Leave</span>
                <span className="text-slate-500">5 / 7 Days</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '71%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Bereavement / Other</span>
                <span className="text-slate-500">3 / 3 Days</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
