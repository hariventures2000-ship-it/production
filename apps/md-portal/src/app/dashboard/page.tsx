export default function MdDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Projects", value: "12", change: "+2 this quarter", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "bg-indigo-50 text-indigo-500", accent: "text-indigo-600" },
          { label: "Total Budget", value: "₹2.4Cr", change: "68% utilized", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-emerald-50 text-emerald-500", accent: "text-emerald-600" },
          { label: "Workforce", value: "156", change: "7 teams active", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "bg-blue-50 text-blue-500", accent: "text-blue-600" },
          { label: "On-Time Delivery", value: "87%", change: "+5% vs last quarter", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-amber-50 text-amber-500", accent: "text-amber-600" },
        ].map((metric) => (
          <div key={metric.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-500 text-sm font-medium">{metric.label}</span>
              <div className={`w-10 h-10 rounded-xl ${metric.color} flex items-center justify-center`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metric.icon} />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{metric.value}</h3>
            <span className={`${metric.accent} text-xs font-medium mt-1 block`}>{metric.change}</span>
          </div>
        ))}
      </div>

      {/* Project Status & Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Project Status Breakdown */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Project Status Overview</h3>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">12 projects</span>
          </div>
          <div className="p-6 space-y-4">
            {[
              { status: "Development", count: 5, total: 12, color: "bg-blue-500" },
              { status: "Design", count: 2, total: 12, color: "bg-purple-500" },
              { status: "Testing", count: 2, total: 12, color: "bg-amber-500" },
              { status: "Planning", count: 1, total: 12, color: "bg-gray-400" },
              { status: "Completed", count: 2, total: 12, color: "bg-emerald-500" },
            ].map((item) => (
              <div key={item.status} className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-28">{item.status}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${(item.count / item.total) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Utilization */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Budget Utilization</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#6366f1" strokeWidth="12"
                  strokeDasharray={`${68 * 3.267} ${100 * 3.267}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">68%</span>
                <span className="text-xs text-gray-500">utilized</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Budget</span>
              <span className="font-semibold text-gray-900">₹2,40,00,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Spent</span>
              <span className="font-semibold text-indigo-600">₹1,63,20,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Remaining</span>
              <span className="font-semibold text-emerald-600">₹76,80,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Recent Project Activity</h3>
          <button className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">View All →</button>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { name: "Mervi Platform v3", lead: "Arun K.", status: "Development", priority: "Critical", completion: 72, budget: "₹45L" },
            { name: "E-Commerce Redesign", lead: "Priya N.", status: "Design", priority: "High", completion: 35, budget: "₹28L" },
            { name: "Mobile Banking App", lead: "Rahul S.", status: "Testing", priority: "High", completion: 88, budget: "₹62L" },
            { name: "AI Analytics Dashboard", lead: "Sneha M.", status: "Development", priority: "Medium", completion: 45, budget: "₹18L" },
            { name: "Client Portal Revamp", lead: "Vijay T.", status: "Planning", priority: "Low", completion: 10, budget: "₹15L" },
          ].map((project, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">
                  {project.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{project.name}</p>
                  <p className="text-xs text-gray-500">Lead: {project.lead} · Budget: {project.budget}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  project.status === "Development" ? "bg-blue-50 text-blue-600" :
                  project.status === "Design" ? "bg-purple-50 text-purple-600" :
                  project.status === "Testing" ? "bg-amber-50 text-amber-600" :
                  project.status === "Planning" ? "bg-gray-100 text-gray-600" :
                  "bg-emerald-50 text-emerald-600"
                }`}>
                  {project.status}
                </span>
                <div className="w-24 flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${project.completion}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-600 w-8 text-right">{project.completion}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
