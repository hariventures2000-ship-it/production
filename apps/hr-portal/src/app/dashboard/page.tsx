export default function HrDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Employees", value: "156", change: "+3 this month", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "bg-blue-50 text-blue-500" },
          { label: "Present Today", value: "142", change: "91% attendance", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-emerald-50 text-emerald-500" },
          { label: "Pending Leaves", value: "8", change: "Needs review", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "bg-amber-50 text-amber-500" },
          { label: "On Probation", value: "12", change: "3 ending soon", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-purple-50 text-purple-500" },
        ].map((metric) => (
          <div key={metric.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-500 text-sm font-medium">{metric.label}</span>
              <div className={`w-8 h-8 rounded-full ${metric.color} flex items-center justify-center`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metric.icon} />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{metric.value}</h3>
            <span className="text-mervi-green text-xs font-medium mt-1 block">{metric.change}</span>
          </div>
        ))}
      </div>

      {/* Pending Leave Requests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Pending Leave Requests</h3>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold">8 pending</span>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { name: "Rahul Sharma", type: "Casual Leave", dates: "Jun 24 – Jun 26", days: 3, dept: "Engineering" },
              { name: "Priya Nair", type: "Sick Leave", dates: "Jun 23", days: 1, dept: "Design" },
              { name: "Arun Kumar", type: "Earned Leave", dates: "Jul 1 – Jul 5", days: 5, dept: "DevOps" },
            ].map((req, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-mervi-dark text-white flex items-center justify-center text-sm font-bold">
                    {req.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{req.name}</p>
                    <p className="text-xs text-gray-500">{req.dept} · {req.type} · {req.days} day{req.days > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{req.dates}</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-mervi-green/10 text-mervi-green rounded-lg text-xs font-semibold hover:bg-mervi-green hover:text-white transition-colors">Approve</button>
                    <button className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors">Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Department Breakdown</h3>
          <div className="space-y-4">
            {[
              { dept: "Engineering", count: 64, color: "bg-blue-500" },
              { dept: "Design", count: 22, color: "bg-purple-500" },
              { dept: "DevOps", count: 18, color: "bg-emerald-500" },
              { dept: "Marketing", count: 28, color: "bg-amber-500" },
              { dept: "Support", count: 24, color: "bg-red-400" },
            ].map((d) => (
              <div key={d.dept} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${d.color}`}></div>
                <span className="text-sm text-gray-700 flex-1">{d.dept}</span>
                <span className="text-sm font-semibold text-gray-900">{d.count}</span>
                <div className="w-20 bg-gray-100 rounded-full h-1.5">
                  <div className={`${d.color} h-1.5 rounded-full`} style={{ width: `${(d.count / 64) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
