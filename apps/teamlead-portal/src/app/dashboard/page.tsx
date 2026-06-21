export default function TeamLeadDashboard() {
  const tasksByStatus = {
    BACKLOG: 8,
    TODO: 12,
    IN_PROGRESS: 6,
    REVIEW: 3,
    TESTING: 4,
    DONE: 18,
  };

  const totalTasks = Object.values(tasksByStatus).reduce((s, v) => s + v, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Team Members", value: "14", change: "Website Dev Team", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "bg-cyan-50 text-cyan-500", accent: "text-cyan-600" },
          { label: "Active Tasks", value: "13", change: "6 in-progress, 3 review, 4 testing", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", color: "bg-blue-50 text-blue-500", accent: "text-blue-600" },
          { label: "Pending Leaves", value: "3", change: "Needs your approval", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "bg-amber-50 text-amber-500", accent: "text-amber-600" },
          { label: "Sprint Progress", value: "65%", change: "Sprint 4 — 5 days left", icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "bg-emerald-50 text-emerald-500", accent: "text-emerald-600" },
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Task Status Distribution */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Task Distribution</h3>
            <span className="px-2.5 py-1 bg-cyan-50 text-cyan-600 rounded-full text-xs font-semibold">{totalTasks} tasks</span>
          </div>
          <div className="p-6">
            {/* Horizontal stacked bar */}
            <div className="mb-6">
              <div className="flex rounded-full h-4 overflow-hidden bg-gray-100">
                {[
                  { key: "BACKLOG", color: "bg-gray-400", count: tasksByStatus.BACKLOG },
                  { key: "TODO", color: "bg-slate-500", count: tasksByStatus.TODO },
                  { key: "IN_PROGRESS", color: "bg-blue-500", count: tasksByStatus.IN_PROGRESS },
                  { key: "REVIEW", color: "bg-purple-500", count: tasksByStatus.REVIEW },
                  { key: "TESTING", color: "bg-amber-500", count: tasksByStatus.TESTING },
                  { key: "DONE", color: "bg-emerald-500", count: tasksByStatus.DONE },
                ].map((s) => (
                  <div key={s.key} className={`${s.color} transition-all duration-500`} style={{ width: `${(s.count / totalTasks) * 100}%` }} title={`${s.key}: ${s.count}`} />
                ))}
              </div>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Backlog", count: tasksByStatus.BACKLOG, color: "bg-gray-400" },
                { label: "Todo", count: tasksByStatus.TODO, color: "bg-slate-500" },
                { label: "In Progress", count: tasksByStatus.IN_PROGRESS, color: "bg-blue-500" },
                { label: "Review", count: tasksByStatus.REVIEW, color: "bg-purple-500" },
                { label: "Testing", count: tasksByStatus.TESTING, color: "bg-amber-500" },
                { label: "Done", count: tasksByStatus.DONE, color: "bg-emerald-500" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${s.color}`} />
                  <span className="text-sm text-gray-600">{s.label}</span>
                  <span className="text-sm font-bold text-gray-900 ml-auto">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sprint Progress */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Sprint 4 Progress</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#06b6d4" strokeWidth="12"
                  strokeDasharray={`${65 * 3.267} ${100 * 3.267}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">65%</span>
                <span className="text-xs text-gray-500">complete</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Goal</span>
              <span className="font-medium text-gray-900">Checkout Flow v2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration</span>
              <span className="font-medium text-gray-900">Jun 9 – Jun 23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Capacity</span>
              <span className="font-medium text-gray-900">42 points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Velocity</span>
              <span className="font-medium text-cyan-600">27 / 42 pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Member Workload & Upcoming Deadlines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Workload */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Team Workload</h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { name: "Ravi P.", tasks: 5, maxTasks: 6, role: "Developer" },
              { name: "Meera S.", tasks: 4, maxTasks: 6, role: "Developer" },
              { name: "Arjun T.", tasks: 6, maxTasks: 6, role: "Developer" },
              { name: "Neha K.", tasks: 3, maxTasks: 5, role: "Tester" },
              { name: "Vikram J.", tasks: 2, maxTasks: 5, role: "UI/UX Designer" },
              { name: "Pooja R.", tasks: 4, maxTasks: 5, role: "Developer" },
            ].map((member) => {
              const load = Math.round((member.tasks / member.maxTasks) * 100);
              return (
                <div key={member.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-mervi-dark text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900 truncate">{member.name}</span>
                      <span className="text-xs text-gray-500 shrink-0">{member.tasks}/{member.maxTasks} tasks</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          load >= 100 ? "bg-red-500" : load >= 80 ? "bg-amber-500" : "bg-cyan-500"
                        }`}
                        style={{ width: `${Math.min(load, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Upcoming Deadlines</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { task: "Payment Gateway Integration", assignee: "Ravi P.", due: "Jun 22", priority: "CRITICAL", daysLeft: 1 },
              { task: "User Profile Redesign", assignee: "Vikram J.", due: "Jun 24", priority: "HIGH", daysLeft: 3 },
              { task: "API Rate Limiting", assignee: "Meera S.", due: "Jun 25", priority: "HIGH", daysLeft: 4 },
              { task: "Unit Test Coverage", assignee: "Neha K.", due: "Jun 27", priority: "MEDIUM", daysLeft: 6 },
              { task: "Performance Optimization", assignee: "Arjun T.", due: "Jun 30", priority: "MEDIUM", daysLeft: 9 },
            ].map((item, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.task}</p>
                  <p className="text-xs text-gray-500">{item.assignee} · Due {item.due}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    item.priority === "CRITICAL" ? "bg-red-50 text-red-600" :
                    item.priority === "HIGH" ? "bg-orange-50 text-orange-600" :
                    "bg-blue-50 text-blue-600"
                  }`}>
                    {item.priority}
                  </span>
                  <span className={`text-xs font-bold ${item.daysLeft <= 2 ? "text-red-500" : item.daysLeft <= 5 ? "text-amber-500" : "text-gray-500"}`}>
                    {item.daysLeft}d
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
