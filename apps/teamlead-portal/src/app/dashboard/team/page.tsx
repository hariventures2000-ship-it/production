export default function TeamPage() {
  const members = [
    { name: "Ravi Patel", role: "Senior Developer", skills: ["React", "Node.js", "MongoDB"], activeTasks: 5, completedTasks: 12, points: 34, status: "online" },
    { name: "Meera Sharma", role: "Full Stack Developer", skills: ["TypeScript", "NestJS", "Redis"], activeTasks: 4, completedTasks: 10, points: 28, status: "online" },
    { name: "Arjun Thakur", role: "Backend Developer", skills: ["Java", "Spring Boot", "Kafka"], activeTasks: 6, completedTasks: 15, points: 42, status: "online" },
    { name: "Neha Kapoor", role: "QA Engineer", skills: ["Selenium", "Jest", "Cypress"], activeTasks: 3, completedTasks: 22, points: 18, status: "online" },
    { name: "Vikram Joshi", role: "UI/UX Designer", skills: ["Figma", "Tailwind CSS", "Framer"], activeTasks: 2, completedTasks: 8, points: 15, status: "away" },
    { name: "Pooja Rao", role: "Full Stack Developer", skills: ["React", "Python", "PostgreSQL"], activeTasks: 4, completedTasks: 11, points: 30, status: "online" },
    { name: "Sandeep M.", role: "Junior Developer", skills: ["JavaScript", "HTML/CSS", "Git"], activeTasks: 3, completedTasks: 6, points: 12, status: "offline" },
    { name: "Lakshmi V.", role: "DevOps Engineer", skills: ["Docker", "Kubernetes", "CI/CD"], activeTasks: 2, completedTasks: 14, points: 20, status: "online" },
    { name: "Amit G.", role: "Developer", skills: ["Vue.js", "Go", "gRPC"], activeTasks: 3, completedTasks: 9, points: 22, status: "online" },
    { name: "Divya S.", role: "Business Analyst", skills: ["Jira", "Confluence", "SQL"], activeTasks: 1, completedTasks: 7, points: 8, status: "away" },
  ];

  const statusColors: Record<string, string> = {
    online: "bg-emerald-500",
    away: "bg-amber-400",
    offline: "bg-gray-300",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Team</h1>
          <p className="text-sm text-gray-500 mt-1">Website Development — {members.length} members</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-mervi-cyan to-mervi-teal text-white rounded-xl text-sm font-medium shadow-sm hover:opacity-90 transition-opacity">
          + Add Member
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Online", value: members.filter(m => m.status === "online").length, color: "text-emerald-600" },
          { label: "Total Active Tasks", value: members.reduce((s, m) => s + m.activeTasks, 0), color: "text-blue-600" },
          { label: "Tasks Completed", value: members.reduce((s, m) => s + m.completedTasks, 0), color: "text-cyan-600" },
          { label: "Total Points", value: members.reduce((s, m) => s + m.points, 0), color: "text-indigo-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-mervi-dark text-white flex items-center justify-center text-sm font-bold">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ${statusColors[member.status]} border-2 border-white`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm">{member.name}</h4>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {member.skills.map((skill) => (
                <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{member.activeTasks}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Active</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-600">{member.completedTasks}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Done</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-cyan-600">{member.points}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Points</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
