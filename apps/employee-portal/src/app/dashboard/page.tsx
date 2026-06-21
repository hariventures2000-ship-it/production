"use client";

import { useState } from "react";

export default function EmployeeDashboard() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const handleAttendance = () => {
    if (!isCheckedIn) {
      setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsCheckedIn(true);
    } else {
      setIsCheckedIn(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Greeting & Quick Action */}
      <div className="bg-gradient-to-r from-mervi-blue to-blue-600 rounded-3xl p-8 text-white flex justify-between items-center shadow-lg shadow-mervi-blue/20">
        <div>
          <h1 className="text-3xl font-bold mb-2">Good morning, Rahul! 👋</h1>
          <p className="text-blue-100">It's {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}. Have a great day at work!</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center min-w-[200px]">
          <span className="text-sm font-medium text-blue-100 mb-4 uppercase tracking-wider">Today's Attendance</span>
          <button 
            onClick={handleAttendance}
            className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              isCheckedIn 
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30" 
                : "bg-white hover:bg-gray-50 text-mervi-blue shadow-lg shadow-white/10"
            }`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isCheckedIn 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              }
            </svg>
            {isCheckedIn ? "Check Out" : "Check In"}
          </button>
          {isCheckedIn && (
            <p className="text-xs text-blue-100 mt-3 font-medium">Checked in at {checkInTime}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Leave Balance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800">Leave Balance</h3>
            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded">2026</span>
          </div>
          <div className="space-y-5 flex-1">
            {[
              { type: "Casual Leave", available: 8, total: 12, color: "bg-blue-500" },
              { type: "Sick Leave", available: 5, total: 8, color: "bg-red-500" },
              { type: "Earned Leave", available: 12, total: 15, color: "bg-emerald-500" },
            ].map((leave) => (
              <div key={leave.type}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">{leave.type}</span>
                  <span className="text-gray-900 font-bold">{leave.available} <span className="text-gray-400 font-normal">/ {leave.total}</span></span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${leave.color} h-2 rounded-full`} style={{ width: `${(leave.available / leave.total) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm">
            Request Leave
          </button>
        </div>

        {/* Recent Activity */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
              
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Checked out</p>
                  <p className="text-xs text-gray-500 mt-0.5">Yesterday, 6:30 PM • 9h 15m worked</p>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Checked in</p>
                  <p className="text-xs text-gray-500 mt-0.5">Yesterday, 9:15 AM</p>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Leave Request Approved</p>
                  <p className="text-xs text-gray-500 mt-0.5">Jun 18, 2026 • 2 days Casual Leave</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
