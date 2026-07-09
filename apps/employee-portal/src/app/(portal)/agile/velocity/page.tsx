"use client";

import { useState } from "react";
import {
  Zap, TrendingUp, Target, BarChart3, Users, ArrowUp, ArrowDown, Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from "recharts";

// ── Mock Data ────────────────────────────────────────────────────────

const velocityData = [
  { sprint: "Sprint 9", committed: 32, completed: 28 },
  { sprint: "Sprint 10", committed: 38, completed: 35 },
  { sprint: "Sprint 11", committed: 30, completed: 30 },
  { sprint: "Sprint 12", committed: 42, completed: 36 },
  { sprint: "Sprint 13", committed: 36, completed: 34 },
  { sprint: "Sprint 14", committed: 34, completed: 23 },
];

const burndownData = [
  { day: "Day 1", ideal: 34, actual: 34 },
  { day: "Day 2", ideal: 31, actual: 33 },
  { day: "Day 3", ideal: 28, actual: 30 },
  { day: "Day 4", ideal: 24, actual: 29 },
  { day: "Day 5", ideal: 20, actual: 26 },
  { day: "Day 6", ideal: 17, actual: 24 },
  { day: "Day 7", ideal: 14, actual: 20 },
  { day: "Day 8", ideal: 10, actual: 15 },
  { day: "Day 9", ideal: 7, actual: 13 },
  { day: "Day 10", ideal: 0, actual: 11 },
];

const teamBreakdown = [
  { name: "Vijay S.", role: "Lead Developer", sprints: [8, 10, 9, 12, 10, 7], avgVelocity: 9.3, trend: "up" },
  { name: "Arjun M.", role: "Senior Developer", sprints: [7, 9, 8, 10, 9, 6], avgVelocity: 8.2, trend: "down" },
  { name: "Priya K.", role: "UI/UX Designer", sprints: [5, 6, 5, 8, 7, 5], avgVelocity: 6.0, trend: "stable" },
  { name: "Deepak S.", role: "QA Engineer", sprints: [8, 10, 8, 12, 8, 5], avgVelocity: 8.5, trend: "down" },
];

const summaryMetrics = [
  { label: "Avg Velocity", value: "31.0", sublabel: "pts / sprint", icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Predictability", value: "87%", sublabel: "committed vs delivered", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Sprint Goal Rate", value: "67%", sublabel: "goals completed", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Avg Carry Over", value: "4.2", sublabel: "pts / sprint", icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10" },
];

const TREND_ICON = {
  up: { icon: ArrowUp, color: "text-emerald-500" },
  down: { icon: ArrowDown, color: "text-red-500" },
  stable: { icon: Minus, color: "text-slate-500" },
} as const;

// ── Custom Tooltip ───────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-[var(--foreground)] mb-1.5">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[var(--foreground-secondary)]">{entry.name}:</span>
          <span className="font-medium text-[var(--foreground)]">{entry.value} pts</span>
        </div>
      ))}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────

export default function AgileVelocityPage() {
  const [chartView, setChartView] = useState("velocity");

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Velocity Reports</h1>
        <p className="text-sm text-[var(--foreground-secondary)] mt-1">
          Analyze team performance, sprint predictability, and burndown trends.
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", m.bg)}>
                    <Icon className={cn("w-5 h-5", m.color)} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{m.value}</p>
                <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{m.sublabel}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <Tabs value={chartView} onValueChange={setChartView}>
        <TabsList>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
          <TabsTrigger value="burndown">Burndown</TabsTrigger>
        </TabsList>
      </Tabs>

      {chartView === "velocity" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sprint Velocity (Last 6 Sprints)</CardTitle>
            <CardDescription>Commitment vs. completed story points per sprint.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={velocityData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="sprint" tick={{ fontSize: 12, fill: "var(--foreground-muted)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--foreground-muted)" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, color: "var(--foreground-secondary)" }}
                  />
                  <Bar dataKey="committed" name="Committed" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {chartView === "burndown" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sprint 14 — Burndown Chart</CardTitle>
            <CardDescription>Ideal vs. actual remaining story points throughout the sprint.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={burndownData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--foreground-muted)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--foreground-muted)" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, color: "var(--foreground-secondary)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ideal"
                    name="Ideal"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.1}
                    strokeDasharray="5 5"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.15}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--foreground-muted)]" />
            Team Velocity Breakdown
          </CardTitle>
          <CardDescription>Per-member velocity contributions across the last 6 sprints.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                  <th className="text-left p-3 font-medium text-[var(--foreground-secondary)]">Member</th>
                  {velocityData.map((s) => (
                    <th key={s.sprint} className="text-center p-3 font-medium text-[var(--foreground-secondary)] text-xs">
                      {s.sprint.replace("Sprint ", "S")}
                    </th>
                  ))}
                  <th className="text-center p-3 font-medium text-[var(--foreground-secondary)]">Avg</th>
                  <th className="text-center p-3 font-medium text-[var(--foreground-secondary)]">Trend</th>
                </tr>
              </thead>
              <tbody>
                {teamBreakdown.map((member) => {
                  const trendConf = TREND_ICON[member.trend as keyof typeof TREND_ICON];
                  const TrendIcon = trendConf.icon;
                  return (
                    <tr key={member.name} className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors">
                      <td className="p-3">
                        <p className="font-medium text-[var(--foreground)]">{member.name}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">{member.role}</p>
                      </td>
                      {member.sprints.map((pts, i) => (
                        <td key={i} className="text-center p-3">
                          <span className="text-sm font-mono text-[var(--foreground)]">{pts}</span>
                        </td>
                      ))}
                      <td className="text-center p-3">
                        <span className="text-sm font-bold text-[var(--foreground)]">{member.avgVelocity}</span>
                      </td>
                      <td className="text-center p-3">
                        <div className="flex items-center justify-center">
                          <TrendIcon className={cn("w-4 h-4", trendConf.color)} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
