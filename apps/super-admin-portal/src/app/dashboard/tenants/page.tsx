"use client";

import Link from "next/link";
import { useState } from "react";

const mockTenants = [
  { id: "1", name: "Hari Ventures", slug: "hari-ventures", domain: "hariventures.com", plan: "ENTERPRISE", status: "ACTIVE", maxUsers: 10000, users: 154 },
  { id: "2", name: "TechCorp Inc.", slug: "techcorp", domain: "techcorp.io", plan: "PRO", status: "ACTIVE", maxUsers: 500, users: 432 },
  { id: "3", name: "Global Logistics", slug: "global-logistics", domain: "globallogistics.com", plan: "STARTER", status: "ACTIVE", maxUsers: 50, users: 12 },
  { id: "4", name: "Retail Networks", slug: "retail-networks", domain: "retailnet.org", plan: "PRO", status: "SUSPENDED", maxUsers: 500, users: 201 },
  { id: "5", name: "Acme Innovations", slug: "acme", domain: "acme.dev", plan: "TRIAL", status: "ACTIVE", maxUsers: 10, users: 5 },
];

export default function TenantsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTenants = mockTenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage organizations and their subscriptions on the Mervi platform.</p>
        </div>
        <Link href="/dashboard/tenants/create" className="px-4 py-2 bg-mervi-green hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-mervi-green/20 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Onboard Tenant
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search tenants by name or slug..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mervi-green/20 focus:border-mervi-green"
            />
          </div>
          <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mervi-green/20 focus:border-mervi-green">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Suspended</option>
            <option>Trial</option>
          </select>
          <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mervi-green/20 focus:border-mervi-green">
            <option>All Plans</option>
            <option>Enterprise</option>
            <option>Pro</option>
            <option>Starter</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Organization</th>
                <th className="px-6 py-4 font-semibold">Domain</th>
                <th className="px-6 py-4 font-semibold">Plan</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Users</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50/50 group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{tenant.name}</div>
                    <div className="text-gray-400 text-xs">slug: {tenant.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{tenant.domain}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      tenant.plan === 'ENTERPRISE' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                      tenant.plan === 'PRO' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}>
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 ${
                      tenant.status === 'ACTIVE' ? 'text-mervi-green' : 
                      tenant.status === 'SUSPENDED' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        tenant.status === 'ACTIVE' ? 'bg-mervi-green' : 
                        tenant.status === 'SUSPENDED' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></span>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-[4rem]">
                        <div className="bg-mervi-dark h-1.5 rounded-full" style={{ width: `${(tenant.users / tenant.maxUsers) * 100}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{tenant.users} / {tenant.maxUsers}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/dashboard/tenants/${tenant.id}`} className="text-mervi-green hover:text-emerald-700 font-medium text-sm transition-colors opacity-0 group-hover:opacity-100">
                      Manage
                    </Link>
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
