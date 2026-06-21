"use client";

import Link from "next/link";
import { useState } from "react";

const mockEmployees = [
  { id: "EMP-001", name: "Rahul Sharma", email: "rahul.sharma@hariventures.com", dept: "Engineering", role: "Sr. Developer", status: "Active" },
  { id: "EMP-002", name: "Priya Nair", email: "priya.nair@hariventures.com", dept: "Design", role: "UX Lead", status: "Active" },
  { id: "EMP-003", name: "Arun Kumar", email: "arun.kumar@hariventures.com", dept: "DevOps", role: "DevOps Engineer", status: "On Leave" },
  { id: "EMP-004", name: "Neha Gupta", email: "neha.gupta@hariventures.com", dept: "Marketing", role: "Marketing Specialist", status: "Probation" },
  { id: "EMP-005", name: "Vikram Singh", email: "vikram.singh@hariventures.com", dept: "Engineering", role: "Backend Developer", status: "Active" },
];

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = mockEmployees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-500 mt-1">Manage organization workforce and roles.</p>
        </div>
        <Link href="/dashboard/employees/onboard" className="px-4 py-2 bg-mervi-green hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-mervi-green/20 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Onboard Employee
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search by name, email or ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mervi-green/20 focus:border-mervi-green"
            />
          </div>
          <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mervi-green/20 focus:border-mervi-green">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Design</option>
            <option>DevOps</option>
            <option>Marketing</option>
          </select>
          <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mervi-green/20 focus:border-mervi-green">
            <option>All Statuses</option>
            <option>Active</option>
            <option>On Leave</option>
            <option>Probation</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/50 group transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-mervi-dark text-white flex items-center justify-center text-xs font-bold">
                      {emp.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{emp.name}</div>
                      <div className="text-gray-400 text-xs">{emp.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-xs">{emp.id}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.dept}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      emp.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-purple-50 text-purple-700 border border-purple-100'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-mervi-green hover:text-emerald-700 font-medium text-sm transition-colors opacity-0 group-hover:opacity-100">
                      Edit
                    </button>
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
