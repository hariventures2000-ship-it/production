export default function WorkforcePage() {
  const departments = [
    { name: "Website Development", headcount: 42, teams: 3, utilization: 88, color: "bg-blue-500" },
    { name: "Mobile App Development", headcount: 28, teams: 2, utilization: 92, color: "bg-purple-500" },
    { name: "AI Solutions", headcount: 18, teams: 1, utilization: 75, color: "bg-emerald-500" },
    { name: "UI/UX Design", headcount: 22, teams: 2, utilization: 80, color: "bg-amber-500" },
    { name: "Digital Marketing", headcount: 16, teams: 1, utilization: 65, color: "bg-pink-500" },
    { name: "PC Build", headcount: 12, teams: 1, utilization: 70, color: "bg-cyan-500" },
    { name: "Support & Maintenance", headcount: 18, teams: 1, utilization: 85, color: "bg-orange-500" },
  ];

  const teamLeads = [
    { name: "Arun Kumar", department: "Website Dev", members: 14, projects: 3, status: "Active" },
    { name: "Priya Nair", department: "UI/UX Design", members: 11, projects: 2, status: "Active" },
    { name: "Rahul Sharma", department: "Mobile App", members: 14, projects: 2, status: "Active" },
    { name: "Sneha Menon", department: "AI Solutions", members: 18, projects: 2, status: "Active" },
    { name: "Karan Singh", department: "Digital Mktg", members: 16, projects: 1, status: "Active" },
    { name: "Anita Desai", department: "Support", members: 18, projects: 2, status: "Active" },
    { name: "Deepak R.", department: "PC Build", members: 12, projects: 1, status: "Active" },
  ];

  const totalHeadcount = departments.reduce((sum, d) => sum + d.headcount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Workforce Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Cross-department employee metrics and team allocation</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Employees", value: totalHeadcount.toString(), sub: "Across all departments" },
          { label: "Active Teams", value: departments.reduce((s, d) => s + d.teams, 0).toString(), sub: "7 departments" },
          { label: "Avg. Utilization", value: Math.round(departments.reduce((s, d) => s + d.utilization, 0) / departments.length) + "%", sub: "Capacity allocation" },
          { label: "Open Positions", value: "5", sub: "3 engineering, 2 design" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{m.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
            <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Department Breakdown */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-6">Department Headcount & Utilization</h3>
          <div className="space-y-5">
            {departments.map((dept) => (
              <div key={dept.name} className="flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full ${dept.color} shrink-0`} />
                <span className="text-sm text-gray-700 w-48 shrink-0">{dept.name}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className={`${dept.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${(dept.headcount / 42) * 100}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8 text-right">{dept.headcount}</span>
                  </div>
                </div>
                <span className={`text-xs font-semibold w-12 text-right ${dept.utilization >= 85 ? "text-emerald-600" : dept.utilization >= 70 ? "text-amber-600" : "text-red-500"}`}>
                  {dept.utilization}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Distribution</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-36 h-36">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                {(() => {
                  let offset = 0;
                  const total = departments.reduce((s, d) => s + d.headcount, 0);
                  const colors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#f97316"];
                  return departments.map((dept, i) => {
                    const pct = (dept.headcount / total) * 326.7;
                    const el = (
                      <circle key={dept.name} cx="60" cy="60" r="52" fill="none" stroke={colors[i]}
                        strokeWidth="10" strokeDasharray={`${pct} ${326.7 - pct}`}
                        strokeDashoffset={`${-offset}`} />
                    );
                    offset += pct;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-900">{totalHeadcount}</span>
                <span className="text-xs text-gray-500">total</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {departments.slice(0, 5).map((dept) => (
              <div key={dept.name} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${dept.color}`} />
                <span className="text-xs text-gray-600 flex-1 truncate">{dept.name}</span>
                <span className="text-xs font-semibold text-gray-700">{Math.round((dept.headcount / totalHeadcount) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Leads */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Team Leads</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {teamLeads.map((lead, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-mervi-dark text-white flex items-center justify-center text-sm font-bold">
                  {lead.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{lead.members}</p>
                  <p className="text-xs text-gray-500">members</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{lead.projects}</p>
                  <p className="text-xs text-gray-500">projects</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold">{lead.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
