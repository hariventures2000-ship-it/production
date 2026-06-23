"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CreditCard, 
  MessageSquareCode, 
  Bot, 
  LogOut,
  UserCheck
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isHydrated) {
      if (!isAuthenticated) {
        router.push("/");
      } else {
        setLoading(false);
      }
    }
  }, [isHydrated, isAuthenticated, router]);

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Document Center", href: "/dashboard/documents", icon: FolderKanban },
    { name: "Billing & Invoices", href: "/dashboard/billing", icon: CreditCard },
    { name: "Support Tickets", href: "/dashboard/tickets", icon: MessageSquareCode },
    { name: "AI Assistant", href: "/dashboard/assistant", icon: Bot },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-mervi-cyan" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-medium">Securing session...</p>
        </div>
      </div>
    );
  }

  const currentNav = navigation.find(n => pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href)));

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-68 bg-slate-900 border-r border-slate-800 flex flex-col shadow-xl z-20">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-mervi-cyan to-mervi-blue rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wider block text-white">MERVI</span>
            <span className="text-[10px] text-mervi-cyan font-semibold uppercase tracking-widest block">Client Portal</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-semibold border ${
                  isActive 
                    ? "bg-indigo-600/10 border-indigo-500/20 text-indigo-400" 
                    : "border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info / Sign out */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-extrabold text-mervi-cyan">
              HV
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">Tenant Partner</p>
              <p className="text-sm font-bold text-white truncate">Hari Ventures</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full border border-transparent hover:border-red-500/10 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {/* Header */}
        <header className="h-20 border-b border-slate-900 bg-slate-900/40 backdrop-blur-md flex items-center px-8 justify-between z-10">
          <h2 className="text-base font-extrabold text-white tracking-wide uppercase">
            {currentNav?.name || "Client Console"}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-white leading-tight">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{user?.email}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center text-sm font-bold cursor-pointer">
              CU
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
