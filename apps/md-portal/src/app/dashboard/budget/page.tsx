export default function BudgetPage() {
  const projects = [
    { name: "Mervi Platform v3", budget: 4500000, spent: 3240000, status: "DEVELOPMENT", completion: 72 },
    { name: "Mobile Banking App", budget: 6200000, spent: 5456000, status: "TESTING", completion: 88 },
    { name: "E-Commerce Redesign", budget: 2800000, spent: 980000, status: "DESIGN", completion: 35 },
    { name: "Digital Marketing Portal", budget: 2200000, spent: 1540000, status: "DEVELOPMENT", completion: 70 },
    { name: "AI Analytics Dashboard", budget: 1800000, spent: 810000, status: "DEVELOPMENT", completion: 45 },
    { name: "Client Portal Revamp", budget: 1500000, spent: 150000, status: "PLANNING", completion: 10 },
    { name: "PC Build Configurator", budget: 1200000, spent: 1020000, status: "TESTING", completion: 85 },
    { name: "Support Ticketing System", budget: 900000, spent: 870000, status: "COMPLETED", completion: 100 },
  ];

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallUtilization = Math.round((totalSpent / totalBudget) * 100);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Budget & Finance</h1>
        <p className="text-sm text-gray-500 mt-1">Budget allocation and spending across all projects</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 border-l-4 border-l-indigo-500">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Budget</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalBudget)}</p>
          <p className="text-xs text-gray-400 mt-1">Across {projects.length} projects</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 border-l-4 border-l-blue-500">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Spent</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(totalSpent)}</p>
          <p className="text-xs text-gray-400 mt-1">{overallUtilization}% of total budget</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 border-l-4 border-l-emerald-500">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Remaining</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(totalRemaining)}</p>
          <p className="text-xs text-gray-400 mt-1">{100 - overallUtilization}% available</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 border-l-4 border-l-amber-500">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">At Risk</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{projects.filter(p => (p.spent / p.budget) > 0.85 && p.status !== "COMPLETED").length}</p>
          <p className="text-xs text-gray-400 mt-1">Projects exceeding 85% budget</p>
        </div>
      </div>

      {/* Budget Utilization by Project */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-6">Budget Utilization by Project</h3>
        <div className="space-y-5">
          {projects
            .sort((a, b) => b.budget - a.budget)
            .map((project) => {
              const utilization = Math.round((project.spent / project.budget) * 100);
              const isOverBudget = utilization > 90 && project.status !== "COMPLETED";
              return (
                <div key={project.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">{project.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        project.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600" :
                        project.status === "TESTING" ? "bg-amber-50 text-amber-600" :
                        project.status === "DEVELOPMENT" ? "bg-blue-50 text-blue-600" :
                        project.status === "DESIGN" ? "bg-purple-50 text-purple-600" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {project.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
                      </span>
                      <span className={`text-sm font-bold w-12 text-right ${
                        isOverBudget ? "text-red-500" : utilization >= 70 ? "text-amber-600" : "text-emerald-600"
                      }`}>
                        {utilization}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isOverBudget ? "bg-red-500" :
                        project.status === "COMPLETED" ? "bg-emerald-500" :
                        utilization >= 70 ? "bg-amber-500" : "bg-indigo-500"
                      }`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Cost Breakdown Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Detailed Cost Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Spent</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Remaining</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilization</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.sort((a, b) => b.budget - a.budget).map((p, i) => {
                const util = Math.round((p.spent / p.budget) * 100);
                const remaining = p.budget - p.spent;
                const health = p.status === "COMPLETED" ? "✅" : util > 90 ? "🔴" : util > 70 ? "🟡" : "🟢";
                return (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right font-mono">{formatCurrency(p.budget)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right font-mono">{formatCurrency(p.spent)}</td>
                    <td className={`px-6 py-4 text-sm text-right font-mono ${remaining < 0 ? "text-red-600" : "text-gray-700"}`}>{formatCurrency(remaining)}</td>
                    <td className="px-6 py-4 text-sm text-right font-semibold">{util}%</td>
                    <td className="px-6 py-4 text-center text-lg">{health}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50/80 border-t-2 border-gray-200">
              <tr>
                <td className="px-6 py-3 text-sm font-bold text-gray-900">TOTAL</td>
                <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right font-mono">{formatCurrency(totalBudget)}</td>
                <td className="px-6 py-3 text-sm font-bold text-blue-600 text-right font-mono">{formatCurrency(totalSpent)}</td>
                <td className="px-6 py-3 text-sm font-bold text-emerald-600 text-right font-mono">{formatCurrency(totalRemaining)}</td>
                <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">{overallUtilization}%</td>
                <td className="px-6 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
