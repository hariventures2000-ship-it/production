"use client";

import { useState } from "react";

const mockLeaves = [
  { id: "LR-001", type: "Casual Leave", days: 3, startDate: "2026-06-24", endDate: "2026-06-26", status: "PENDING", reason: "Family trip" },
  { id: "LR-002", type: "Earned Leave", days: 5, startDate: "2026-05-10", endDate: "2026-05-15", status: "APPROVED", reason: "Vacation" },
  { id: "LR-003", type: "Sick Leave", days: 2, startDate: "2026-04-01", endDate: "2026-04-02", status: "APPROVED", reason: "Fever" },
  { id: "LR-004", type: "Casual Leave", days: 1, startDate: "2026-02-15", endDate: "2026-02-15", status: "REJECTED", reason: "Personal work" },
];

export default function MyLeavesPage() {
  const [isRequesting, setIsRequesting] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {isRequesting ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Request New Leave</h2>
              <p className="text-sm text-gray-500 mt-1">Submit a leave application for approval.</p>
            </div>
            <button 
              onClick={() => setIsRequesting(false)}
              className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
          </div>
          <form className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type *</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-blue focus:ring-2 focus:ring-mervi-blue/20 outline-none transition-all">
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Earned Leave</option>
                  <option>Maternity/Paternity Leave</option>
                  <option>Leave Without Pay</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Days *</label>
                <input type="number" min="0.5" step="0.5" placeholder="e.g. 2" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-blue focus:ring-2 focus:ring-mervi-blue/20 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-blue focus:ring-2 focus:ring-mervi-blue/20 outline-none transition-all text-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-blue focus:ring-2 focus:ring-mervi-blue/20 outline-none transition-all text-gray-600" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leave *</label>
                <textarea rows={3} placeholder="Provide a brief reason..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-blue focus:ring-2 focus:ring-mervi-blue/20 outline-none transition-all resize-none"></textarea>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setIsRequesting(false)} className="px-8 py-2.5 bg-mervi-blue hover:bg-blue-600 text-white rounded-xl font-medium transition-all shadow-md active:scale-[0.98]">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Leaves</h1>
              <p className="text-sm text-gray-500 mt-1">Track your leave requests and balances.</p>
            </div>
            <button 
              onClick={() => setIsRequesting(true)}
              className="px-4 py-2 bg-mervi-blue hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-mervi-blue/20 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Request Leave
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Leave Details</th>
                    <th className="px-6 py-4 font-semibold">Duration</th>
                    <th className="px-6 py-4 font-semibold">Reason</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockLeaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{leave.type}</div>
                        <div className="text-gray-400 text-xs font-mono mt-0.5">{leave.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-700">{leave.days} day{leave.days > 1 ? "s" : ""}</div>
                        <div className="text-gray-400 text-xs">{leave.startDate} to {leave.endDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600 truncate max-w-[300px]" title={leave.reason}>{leave.reason}</div>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
