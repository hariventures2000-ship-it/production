"use client";

import { useState } from "react";

const mockLeaves = [
  { id: "LR-001", empName: "Rahul Sharma", dept: "Engineering", type: "Casual Leave", days: 3, startDate: "2026-06-24", endDate: "2026-06-26", status: "PENDING", reason: "Family trip" },
  { id: "LR-002", empName: "Priya Nair", dept: "Design", type: "Sick Leave", days: 1, startDate: "2026-06-23", endDate: "2026-06-23", status: "PENDING", reason: "Fever" },
  { id: "LR-003", empName: "Arun Kumar", dept: "DevOps", type: "Earned Leave", days: 5, startDate: "2026-07-01", endDate: "2026-07-05", status: "PENDING", reason: "Vacation" },
  { id: "LR-004", empName: "Neha Gupta", dept: "Marketing", type: "Casual Leave", days: 2, startDate: "2026-06-20", endDate: "2026-06-21", status: "APPROVED", reason: "Personal work" },
  { id: "LR-005", empName: "Vikram Singh", dept: "Engineering", type: "Sick Leave", days: 2, startDate: "2026-06-15", endDate: "2026-06-16", status: "REJECTED", reason: "Not feeling well" },
];

export default function LeaveManagementPage() {
  const [filter, setFilter] = useState("ALL");

  const filteredLeaves = mockLeaves.filter(l => filter === "ALL" ? true : l.status === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage employee leave applications.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
          <button 
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === "ALL" ? "bg-white shadow-sm text-gray-900 border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}>
            All Requests
          </button>
          <button 
            onClick={() => setFilter("PENDING")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${filter === "PENDING" ? "bg-amber-50 text-amber-700 border border-amber-200" : "text-gray-500 hover:text-gray-700"}`}>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Pending
          </button>
          <button 
            onClick={() => setFilter("APPROVED")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${filter === "APPROVED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "text-gray-500 hover:text-gray-700"}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Approved
          </button>
          <button 
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Leave Details</th>
                <th className="px-6 py-4 font-semibold">Duration</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading leave requests...</td></tr>
              ) : leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{leave.employeeName}</div>
                    <div className="text-gray-400 text-xs mt-0.5">EMP-0012</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-700">{leave.type}</div>
                    <div className="text-gray-400 text-xs mt-0.5 truncate max-w-[200px]" title={leave.reason}>{leave.reason}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-700">{leave.days} day{leave.days > 1 ? "s" : ""}</div>
                    <div className="text-gray-400 text-xs">{leave.startDate} to {leave.endDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      leave.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      leave.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {leave.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleAction(leave.id, 'REJECTED')}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Reject">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <button 
                          onClick={() => handleAction(leave.id, 'APPROVED')}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Approve">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium tracking-wide">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
