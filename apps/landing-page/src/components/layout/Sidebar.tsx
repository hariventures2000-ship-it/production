"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Clock, 
  Receipt, 
  ShieldAlert, 
  Briefcase,
  Activity
} from "lucide-react";
import { cn } from "@hariventure/utils";

// Define the role-based navigation mapping
const NAV_ITEMS = {
  CEO: [
    { label: "Executive Dashboard", href: "/dashboard/ceo", icon: LayoutDashboard },
    { label: "Financials", href: "/dashboard/ceo/finance", icon: Receipt },
    { label: "Company Performance", href: "/dashboard/ceo/performance", icon: Activity },
  ],
  HR: [
    { label: "HR Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },
    { label: "Employees", href: "/dashboard/hr/employees", icon: Users },
    { label: "Attendance & Leave", href: "/dashboard/hr/attendance", icon: Clock },
    { label: "Recruitment", href: "/dashboard/hr/recruitment", icon: Briefcase },
  ],
  TEAM_LEAD: [
    { label: "Team Dashboard", href: "/dashboard/lead", icon: LayoutDashboard },
    { label: "My Team", href: "/dashboard/lead/team", icon: Users },
    { label: "Sprints", href: "/dashboard/lead/sprints", icon: FolderKanban },
  ],
  EMPLOYEE: [
    { label: "My Workspace", href: "/dashboard/employee", icon: LayoutDashboard },
    { label: "My Tasks", href: "/dashboard/employee/tasks", icon: FolderKanban },
    { label: "Attendance", href: "/dashboard/employee/attendance", icon: Clock },
  ],
  CLIENT: [
    { label: "Client Portal", href: "/dashboard/client", icon: LayoutDashboard },
    { label: "My Projects", href: "/dashboard/client/projects", icon: FolderKanban },
    { label: "Invoices", href: "/dashboard/client/invoices", icon: Receipt },
    { label: "Support Tickets", href: "/dashboard/client/support", icon: ShieldAlert },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  // Fallback to employee if role is unexpected
  const role = user.role.toUpperCase();
  const navLinks = NAV_ITEMS[role as keyof typeof NAV_ITEMS] || NAV_ITEMS.EMPLOYEE;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col min-h-screen border-r border-slate-800">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white tracking-tight">Hariventure</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navLinks.map((item) => {
          const isRootPath = item.href === `/dashboard/${role.toLowerCase()}`;
          const isActive = 
            pathname === item.href || 
            (!isRootPath && pathname.startsWith(`${item.href}/`));
            
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-green-600/10 text-green-400" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400">
          <p>Role: <span className="text-slate-200 font-medium capitalize">{user.role.toLowerCase()}</span></p>
        </div>
      </div>
    </aside>
  );
}
