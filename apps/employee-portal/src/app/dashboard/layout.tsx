"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "../../components/NotificationBell";
import ChatbotDrawer from "../../components/ChatbotDrawer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "My Profile", href: "/dashboard/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { name: "My Leaves", href: "/dashboard/leaves", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { name: "Payslips", href: "/dashboard/payslips", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-mervi-dark text-white flex flex-col shadow-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-mervi-blue rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-wide">MERVI <span className="text-mervi-blue font-normal text-xs ml-1 uppercase">Portal</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive ? "bg-white/10 text-mervi-blue" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}>
                <svg className={`w-5 h-5 ${isActive ? "text-mervi-blue" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors w-full">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between shadow-sm">
          <h2 className="text-sm font-medium text-gray-800 uppercase tracking-wider">
            {navigation.find(n => pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href)))?.name || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800 leading-tight">Rahul Sharma</p>
                <p className="text-xs text-gray-500">Sr. Developer</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-mervi-blue text-white flex items-center justify-center text-sm font-bold cursor-pointer border-2 border-gray-100">
                RS
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8 bg-gray-50/50">{children}</main>
        <ChatbotDrawer />
      </div>
    </div>
  );
}
