"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface OrganizationAnalytics {
  activeProjectsCount: number;
  totalBudget: number;
  spentBudget: number;
  workforceCount: number;
  onTimeDeliveryRate: number;
  projectStatusCounts: Record<string, number>;
  monthlyRevenue: Record<string, number>;
  recentActivity: Array<Record<string, string>>;
}

export default function MdDashboard() {
  const [analytics, setAnalytics] = useState<OrganizationAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Copilot State
  const [copilotQuery, setCopilotQuery] = useState("");
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [copilotResult, setCopilotResult] = useState<{ pipeline: string; explanation: string } | null>(null);
  const [copilotError, setCopilotError] = useState<string | null>(null);

  // Helper to read cookies
  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  }

  // Parse JWT details
  function getAuthDetails() {
    const token = getCookie("routeSessionToken");
    if (!token) {
      return {
        tenantId: "6676aa9ae9a701309909dcda",
        role: "ROLE_MANAGING_DIRECTOR",
        userId: "md",
        token: null,
      };
    }
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      return {
        tenantId: payload.tenantId || "6676aa9ae9a701309909dcda",
        role: payload.role || "ROLE_MANAGING_DIRECTOR",
        userId: payload.sub || "md",
        token: token,
      };
    } catch (e) {
      return {
        tenantId: "6676aa9ae9a701309909dcda",
        role: "ROLE_MANAGING_DIRECTOR",
        userId: "md",
        token: null,
      };
    }
  }

  const { tenantId, role, userId, token } = getAuthDetails();

  const fetchAnalytics = async () => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      headers["X-Tenant-Id"] = tenantId;
      headers["X-User-Role"] = role;
      headers["X-User-Id"] = userId;

      const res = await fetch("http://localhost:8080/api/v1/analytics/md", {
        headers,
      });

      if (res.ok) {
        const body = await res.json();
        setAnalytics(body.data);
      } else {
        throw new Error("Failed to fetch MD analytics: " + res.statusText);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim()) return;

    setIsCopilotLoading(true);
    setCopilotResult(null);
    setCopilotError(null);

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      headers["X-Tenant-Id"] = tenantId;
      headers["X-User-Role"] = role;
      headers["X-User-Id"] = userId;

      const res = await fetch("http://localhost:8080/api/v1/ai/analytics-copilot", {
        method: "POST",
        headers,
        body: JSON.stringify({ query: copilotQuery }),
      });

      if (res.ok) {
        const body = await res.json();
        const parsed = JSON.parse(body.data);
        setCopilotResult({
          pipeline: typeof parsed.pipeline === "object" ? JSON.stringify(parsed.pipeline, null, 2) : parsed.pipeline,
          explanation: parsed.explanation || "No explanation provided.",
        });
      } else {
        throw new Error("Copilot response error: " + res.statusText);
      }
    } catch (err: any) {
      console.error(err);
      setCopilotError("Failed to translate query. Please try again.");
    } finally {
      setIsCopilotLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading MD Dashboard analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
        <h3 className="text-red-800 font-semibold mb-2">Failed to Load Dashboard</h3>
        <p className="text-xs text-red-600 mb-4">{error || "Could not retrieve organization statistics."}</p>
        <button
          onClick={() => {
            setIsLoading(true);
            setError(null);
            fetchAnalytics();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} L`;
    }
    return `₹${val.toLocaleString()}`;
  };

  const statusChartData = Object.entries(analytics.projectStatusCounts || {}).map(
    ([name, value]) => ({ name, value })
  );

  const COLORS = ["#3b82f6", "#a855f7", "#f59e0b", "#94a3b8", "#10b981"];

  const spentPct = analytics.totalBudget > 0
    ? Math.round((analytics.spentBudget / analytics.totalBudget) * 100)
    : 0;

  const budgetChartData = [
    { name: "Spent", value: Number(analytics.spentBudget) },
    { name: "Remaining", value: Math.max(0, Number(analytics.totalBudget) - Number(analytics.spentBudget)) },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Analytics Copilot Search Bar */}
      <div className="bg-gradient-to-r from-indigo-950 to-slate-900 rounded-3xl p-6 shadow-xl text-white border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-wide">Mervi AI Analytics Copilot</h3>
              <p className="text-xs text-indigo-200">Ask questions in natural language and get MongoDB aggregations instantly.</p>
            </div>
          </div>
          
          <form onSubmit={handleCopilotSubmit} className="flex gap-2">
            <input
              type="text"
              value={copilotQuery}
              onChange={(e) => setCopilotQuery(e.target.value)}
              placeholder="e.g. 'Show budget spent vs remaining' or 'Summarize project statuses'"
              className="flex-1 bg-white/10 border border-white/10 focus:border-indigo-400 focus:bg-white/15 outline-none rounded-2xl px-5 py-3 text-sm text-white placeholder-gray-400 transition-all"
            />
            <button
              type="submit"
              disabled={isCopilotLoading}
              className="px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium text-sm rounded-2xl flex items-center gap-2 active:scale-98 transition shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-75"
            >
              {isCopilotLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Ask Copilot
                </>
              )}
            </button>
          </form>

          {/* Copilot Response Card */}
          {(copilotResult || copilotError) && (
            <div className="mt-4 bg-black/40 border border-white/5 rounded-2xl p-5 space-y-3 animate-in slide-in-from-top-2 duration-300">
              {copilotError ? (
                <p className="text-red-400 text-xs">{copilotError}</p>
              ) : (
                <>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-indigo-400 font-bold mb-1">Copilot Explanation</h4>
                    <p className="text-xs text-slate-200 leading-relaxed">{copilotResult?.explanation}</p>
                  </div>
                  {copilotResult?.pipeline && copilotResult.pipeline !== "[]" && (
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-2">Generated Pipeline</h4>
                      <pre className="bg-black/50 p-4 rounded-xl text-[10px] text-emerald-300 font-mono overflow-x-auto max-h-40 border border-white/5 scrollbar-thin">
                        {copilotResult.pipeline}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Active Projects",
            value: analytics.activeProjectsCount.toString(),
            change: "Live status metrics",
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            color: "bg-indigo-50 text-indigo-500",
            accent: "text-indigo-600",
          },
          {
            label: "Total Budget",
            value: formatCurrency(analytics.totalBudget),
            change: `${spentPct}% utilized`,
            icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            color: "bg-emerald-50 text-emerald-500",
            accent: "text-emerald-600",
          },
          {
            label: "Workforce",
            value: analytics.workforceCount.toString(),
            change: "Employees onboarded",
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
            color: "bg-blue-50 text-blue-500",
            accent: "text-blue-600",
          },
          {
            label: "On-Time Delivery",
            value: `${analytics.onTimeDeliveryRate}%`,
            change: "Overall operational efficiency",
            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            color: "bg-amber-50 text-amber-500",
            accent: "text-amber-600",
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-500 text-sm font-medium">{metric.label}</span>
              <div className={`w-10 h-10 rounded-xl ${metric.color} flex items-center justify-center`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metric.icon} />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{metric.value}</h3>
            <span className={`${metric.accent} text-xs font-semibold mt-1 block`}>{metric.change}</span>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Project Status Breakdown (Recharts Bar Chart) */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-semibold text-gray-800">Project Status Distribution</h3>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">
              Live status counts
            </span>
          </div>
          <div className="p-6 flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #f1f5f9" }}
                  labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={45}>
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Utilization (Recharts Pie Chart) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-4">Budget Utilization Breakdown</h3>
          <div className="flex-1 flex flex-col justify-between">
            <div className="relative h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#6366f1" />
                    <Cell fill="#e2e8f0" />
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{spentPct}%</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">utilized</span>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  Total Budget
                </span>
                <span className="font-semibold text-gray-900">{formatCurrency(analytics.totalBudget)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Spent
                </span>
                <span className="font-semibold text-emerald-600">{formatCurrency(analytics.spentBudget)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  Remaining
                </span>
                <span className="font-semibold text-gray-600">
                  {formatCurrency(Math.max(0, analytics.totalBudget - analytics.spentBudget))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-semibold text-gray-800">Recent Project Activity</h3>
          <button className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
            View All →
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {(analytics.recentActivity || []).map((project, i) => (
            <div
              key={i}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">
                  {(project.name || "PR").split(" ").map((n) => n[0]).join("").substring(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{project.name}</p>
                  <p className="text-xs text-gray-500">
                    Lead: {project.lead || "N/A"} · Budget: {project.budget || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    project.status === "Development"
                      ? "bg-blue-50 text-blue-600"
                      : project.status === "Design"
                      ? "bg-purple-50 text-purple-600"
                      : project.status === "Testing"
                      ? "bg-amber-50 text-amber-600"
                      : project.status === "Planning"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {project.status || "Planned"}
                </span>
                <div className="w-24 flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${project.completion || 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 w-8 text-right">
                    {project.completion || 0}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
