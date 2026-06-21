"use client";

import { useState } from "react";

interface LeaveRequest {
  id: string;
  name: string;
  role: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  appliedOn: string;
}

const initialLeaves: LeaveRequest[] = [
  { id: "L-001", name: "Ravi Patel", role: "Senior Developer", type: "Casual Leave", startDate: "Jun 25", endDate: "Jun 27", days: 3, reason: "Family function — sister's wedding", status: "PENDING", appliedOn: "Jun 18" },
  { id: "L-002", name: "Neha Kapoor", role: "QA Engineer", type: "Sick Leave", startDate: "Jun 23", endDate: "Jun 23", days: 1, reason: "Medical appointment and recovery", status: "PENDING", appliedOn: "Jun 20" },
  { id: "L-003", name: "Vikram Joshi", role: "UI/UX Designer", type: "Earned Leave", startDate: "Jul 1", endDate: "Jul 5", days: 5, reason: "Annual vacation — hill station trip", status: "PENDING", appliedOn: "Jun 15" },
  { id: "L-004", name: "Meera Sharma", role: "Full Stack Developer", type: "Casual Leave", startDate: "Jun 20", endDate: "Jun 20", days: 1, reason: "Personal work — bank visit", status: "APPROVED", appliedOn: "Jun 16" },
  { id: "L-005", name: "Sandeep M.", role: "Junior Developer", type: "Sick Leave", startDate: "Jun 19", endDate: "Jun 19", days: 1, reason: "Not feeling well — fever", status: "APPROVED", appliedOn: "Jun 19" },
  { id: "L-006", name: "Pooja Rao", role: "Full Stack Developer", type: "Casual Leave", startDate: "Jun 14", endDate: "Jun 14", days: 1, reason: "Personal emergency", status: "REJECTED", appliedOn: "Jun 12" },
];

export default function LeaveApprovalsPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(initialLeaves);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  const filtered = filter === "ALL" ? leaves : leaves.filter(l => l.status === filter);
  const pendingCount = leaves.filter(l => l.status === "PENDING").length;

  const handleApprove = (id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: "APPROVED" as const } : l));
  };

  const handleReject = (id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: "REJECTED" as const } : l));
  };

  const statusBadge: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600",
    APPROVED: "bg-emerald-50 text-emerald-600",
    REJECTED: "bg-red-50 text-red-600",
  };

  const typeBadge: Record<string, string> = {
    "Casual Leave": "bg-blue-50 text-blue-600",
    "Sick Leave": "bg-red-50 text-red-600",
    "Earned Leave": "bg-purple-50 text-purple-600",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage team leave requests</p>
        </div>
        {pendingCount > 0 && (
          <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-sm font-semibold">
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? "bg-mervi-dark text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            {f === "PENDING" && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded text-xs">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Leave Cards */}
      <div className="space-y-4">
        {filtered.map((leave) => (
          <div key={leave.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-mervi-dark text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {leave.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-gray-900">{leave.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusBadge[leave.status]}`}>
                      {leave.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{leave.role} · Applied on {leave.appliedOn}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${typeBadge[leave.type] || "bg-gray-100 text-gray-600"}`}>
                      {leave.type}
                    </span>
                    <span className="text-gray-600">
                      {leave.startDate} {leave.startDate !== leave.endDate && `— ${leave.endDate}`}
                    </span>
                    <span className="text-gray-400">·</span>
                    <span className="font-semibold text-gray-900">{leave.days} day{leave.days > 1 ? "s" : ""}</span>
                  </div>

                  <p className="text-sm text-gray-600 mt-3 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="font-medium text-gray-700">Reason: </span>{leave.reason}
                  </p>
                </div>
              </div>

              {leave.status === "PENDING" && (
                <div className="flex gap-2 shrink-0 ml-4">
                  <button
                    onClick={() => handleApprove(leave.id)}
                    className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-semibold hover:bg-emerald-500 hover:text-white transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(leave.id)}
                    className="px-4 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 font-medium">No leave requests found</p>
            <p className="text-sm text-gray-400 mt-1">All caught up! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}
