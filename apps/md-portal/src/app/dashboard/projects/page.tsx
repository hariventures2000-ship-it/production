export default function ProjectsPage() {
  const projects = [
    { name: "Mervi Platform v3", client: "Hari Ventures", lead: "Arun Kumar", department: "Website Development", status: "DEVELOPMENT", priority: "CRITICAL", budget: 4500000, spent: 3240000, completion: 72, startDate: "2025-01-15", endDate: "2025-08-30" },
    { name: "E-Commerce Redesign", client: "ShopEasy Inc.", lead: "Priya Nair", department: "UI/UX Design", status: "DESIGN", priority: "HIGH", budget: 2800000, spent: 980000, completion: 35, startDate: "2025-03-01", endDate: "2025-09-15" },
    { name: "Mobile Banking App", client: "FinSecure Bank", lead: "Rahul Sharma", department: "Mobile App", status: "TESTING", priority: "HIGH", budget: 6200000, spent: 5456000, completion: 88, startDate: "2024-09-01", endDate: "2025-07-31" },
    { name: "AI Analytics Dashboard", client: "DataDriven Co.", lead: "Sneha Menon", department: "AI Solutions", status: "DEVELOPMENT", priority: "MEDIUM", budget: 1800000, spent: 810000, completion: 45, startDate: "2025-02-10", endDate: "2025-10-20" },
    { name: "Client Portal Revamp", client: "TechCorp Ltd.", lead: "Vijay Thakur", department: "Website Development", status: "PLANNING", priority: "LOW", budget: 1500000, spent: 150000, completion: 10, startDate: "2025-05-01", endDate: "2025-12-31" },
    { name: "Support Ticketing System", client: "Hari Ventures", lead: "Anita Desai", department: "Support & Maintenance", status: "COMPLETED", priority: "MEDIUM", budget: 900000, spent: 870000, completion: 100, startDate: "2024-11-01", endDate: "2025-04-30" },
    { name: "Digital Marketing Portal", client: "BrandUp Media", lead: "Karan Singh", department: "Digital Marketing", status: "DEVELOPMENT", priority: "HIGH", budget: 2200000, spent: 1540000, completion: 70, startDate: "2025-01-20", endDate: "2025-08-15" },
    { name: "PC Build Configurator", client: "GameZone", lead: "Deepak R.", department: "PC Build", status: "TESTING", priority: "MEDIUM", budget: 1200000, spent: 1020000, completion: 85, startDate: "2024-12-01", endDate: "2025-06-30" },
  ];

  const statusConfig: Record<string, { bg: string; text: string }> = {
    PLANNING: { bg: "bg-gray-100", text: "text-gray-600" },
    DESIGN: { bg: "bg-purple-50", text: "text-purple-600" },
    DEVELOPMENT: { bg: "bg-blue-50", text: "text-blue-600" },
    TESTING: { bg: "bg-amber-50", text: "text-amber-600" },
    DEPLOYMENT: { bg: "bg-orange-50", text: "text-orange-600" },
    COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-600" },
    ON_HOLD: { bg: "bg-red-50", text: "text-red-600" },
    MAINTENANCE: { bg: "bg-teal-50", text: "text-teal-600" },
  };

  const priorityConfig: Record<string, { bg: string; text: string }> = {
    LOW: { bg: "bg-slate-100", text: "text-slate-600" },
    MEDIUM: { bg: "bg-blue-50", text: "text-blue-600" },
    HIGH: { bg: "bg-orange-50", text: "text-orange-600" },
    CRITICAL: { bg: "bg-red-50", text: "text-red-600" },
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of all active and completed projects</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-mervi-indigo focus:ring-2 focus:ring-mervi-indigo/20 outline-none w-64"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Projects", value: projects.length, color: "border-l-indigo-500" },
          { label: "In Progress", value: projects.filter(p => ["DEVELOPMENT", "DESIGN", "TESTING"].includes(p.status)).length, color: "border-l-blue-500" },
          { label: "Completed", value: projects.filter(p => p.status === "COMPLETED").length, color: "border-l-emerald-500" },
          { label: "Total Budget", value: "₹" + (projects.reduce((s, p) => s + p.budget, 0) / 10000000).toFixed(1) + "Cr", color: "border-l-amber-500" },
        ].map((card) => (
          <div key={card.label} className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${card.color} p-4`}>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Team Lead</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((project, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {project.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{project.name}</p>
                        <p className="text-xs text-gray-500">{project.client} · {project.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{project.lead}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[project.status]?.bg} ${statusConfig[project.status]?.text}`}>
                      {project.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityConfig[project.priority]?.bg} ${priorityConfig[project.priority]?.text}`}>
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">₹{(project.spent / 100000).toFixed(1)}L</span>
                      <span className="text-gray-400"> / ₹{(project.budget / 100000).toFixed(0)}L</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 w-28">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${project.completion === 100 ? "bg-emerald-500" : "bg-indigo-500"}`} style={{ width: `${project.completion}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{project.completion}%</span>
                    </div>
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
