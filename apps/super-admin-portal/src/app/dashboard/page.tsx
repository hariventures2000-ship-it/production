"use client";

import { useEffect, useState } from "react";

interface SuperAdminStats {
  activeTenants: number;
  totalUsers: number;
  platformMrr: string;
  systemHealth: string;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        tenantId: "platform",
        role: "ROLE_SUPER_ADMIN",
        userId: "superadmin",
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
        tenantId: payload.tenantId || "platform",
        role: payload.role || "ROLE_SUPER_ADMIN",
        userId: payload.sub || "superadmin",
        token: token,
      };
    } catch (e) {
      return {
        tenantId: "platform",
        role: "ROLE_SUPER_ADMIN",
        userId: "superadmin",
        token: null,
      };
    }
  }

  const fetchStats = async () => {
    try {
      const { tenantId, role, userId, token } = getAuthDetails();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      headers["X-Tenant-Id"] = tenantId;
      headers["X-User-Role"] = role;
      headers["X-User-Id"] = userId;

      const res = await fetch("http://localhost:8080/api/v1/analytics/superadmin", {
        headers,
      });

      if (res.ok) {
        const body = await res.json();
        setStats(body.data);
      } else {
        throw new Error("Failed to fetch superadmin statistics: " + res.statusText);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-mervi-green/20 border-t-mervi-green rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading Super Admin analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
        <h3 className="text-red-800 font-semibold mb-2">Failed to Load Stats</h3>
        <p className="text-xs text-red-600 mb-4">{error || "Could not retrieve system dashboard statistics."}</p>
        <button
          onClick={() => {
            setIsLoading(true);
            setError(null);
            fetchStats();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 text-sm font-medium">Active Tenants</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.activeTenants}</h3>
            <span className="text-mervi-green text-xs font-semibold mt-1 inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Live count
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 text-sm font-medium">Total Users</span>
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</h3>
            <span className="text-mervi-green text-xs font-semibold mt-1 inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Across tenants
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 text-sm font-medium">Platform MRR</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.platformMrr}</h3>
            <span className="text-mervi-green text-xs font-semibold mt-1 inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Project spend sum
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 text-sm font-medium">System Health</span>
            <div className="w-8 h-8 rounded-full bg-mervi-green/10 text-mervi-green flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-mervi-green">{stats.systemHealth}</h3>
            <span className="text-gray-400 text-xs mt-1 block">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Activity / Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-800">Recent Tenant Activity</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Organization</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                  <th className="px-6 py-3 font-medium">Time</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-mervi-dark">TechCorp Inc.</td>
                  <td className="px-6 py-4">Upgraded to Enterprise Plan</td>
                  <td className="px-6 py-4 text-gray-500">2 hours ago</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-green-50 text-mervi-green text-xs font-semibold">
                      Success
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-mervi-dark">Global Logistics</td>
                  <td className="px-6 py-4">New Tenant Onboarding</td>
                  <td className="px-6 py-4 text-gray-500">5 hours ago</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                      In Progress
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-mervi-dark">Retail Networks</td>
                  <td className="px-6 py-4">Subscription Payment Failed</td>
                  <td className="px-6 py-4 text-gray-500">1 day ago</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                      Action Required
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Infrastructure Alerts</h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">High API Latency</p>
                <p className="text-xs text-gray-500 mt-0.5">tenant-service experiencing p99 latency &gt; 500ms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
