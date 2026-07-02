"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/auth.store";
import { useAppStore } from "@/store/app.store";
import { useNotificationStore } from "@/store/notification.store";
import { notificationService } from "@/lib/services/notification.service";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  LayoutDashboard, FolderKanban, Milestone as MilestoneIcon, FileText, CheckSquare,
  CreditCard, Server, Video, CalendarDays, LifeBuoy, Bot, Activity,
  Settings, LogOut, Bell, Search, Sun, Moon, PanelLeftClose, PanelLeftOpen,
  Menu, X, ChevronRight, ChevronUp, User, Monitor
} from "lucide-react";
import { FloatingAIAssistant } from "@/components/floating-ai-assistant";
import { motion, AnimatePresence } from "framer-motion";

// ── Navigation Configuration ──────────────────────────────────────

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Project",
    items: [
      { name: "Project Workspace", href: "/dashboard/project", icon: FolderKanban },
      { name: "Milestones", href: "/dashboard/milestones", icon: MilestoneIcon },
      { name: "Document Center", href: "/dashboard/documents", icon: FileText },
      { name: "Approvals", href: "/dashboard/approvals", icon: CheckSquare },
    ],
  },
  {
    label: "Finance",
    items: [
      { name: "Billing & Payments", href: "/dashboard/billing", icon: CreditCard },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Infrastructure", href: "/dashboard/infrastructure", icon: Server },
      { name: "Meetings", href: "/dashboard/meetings", icon: Video },
      { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
    ],
  },
  {
    label: "Support",
    items: [
      { name: "Support Center", href: "/dashboard/tickets", icon: LifeBuoy },
      { name: "AI Assistant", href: "/dashboard/assistant", icon: Bot },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Activity Log", href: "/dashboard/activity", icon: Activity },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

// ── Breadcrumb ────────────────────────────────────────────────────

function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const allItems = navGroups.flatMap((g) => g.items);
  const matched = allItems.find((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)));
  const crumbs = [{ label: "Portal", href: "/dashboard" }];
  if (matched && matched.href !== "/dashboard") {
    // Check for sub-routes
    if (pathname.includes("/project/timeline")) crumbs.push({ label: "Project Workspace", href: "/dashboard/project" }, { label: "Timeline", href: pathname });
    else if (pathname.includes("/project/kanban")) crumbs.push({ label: "Project Workspace", href: "/dashboard/project" }, { label: "Task Board", href: pathname });
    else crumbs.push({ label: matched.name, href: matched.href });
  }
  return crumbs;
}

// ── Dashboard Layout Component ────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const mobileSidebarOpen = useAppStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useAppStore((s) => s.setMobileSidebarOpen);
  const commandPaletteOpen = useAppStore((s) => s.commandPaletteOpen);
  const setCommandPaletteOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const setNotifications = useNotificationStore((s) => s.setNotifications);

  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      if (!isAuthenticated) { router.push("/"); }
      else { setLoading(false); }
    }
  }, [isHydrated, isAuthenticated, router]);

  // Fetch notifications
  useEffect(() => {
    if (!loading) {
      notificationService.getNotifications().then(setNotifications).catch(console.error);
    }
  }, [loading, setNotifications]);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "Escape") setCommandPaletteOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const handleLogout = useCallback(() => {
    clearAuth();
    router.push("/");
  }, [clearAuth, router]);

  const breadcrumbs = getBreadcrumbs(pathname);
  const userInitials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` : "CU";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--foreground-secondary)]">Securing session…</p>
        </div>
      </div>
    );
  }

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen overflow-hidden bg-[var(--background)]">
        {/* ── Mobile Sidebar Overlay ── */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={cn(
            "flex flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] transition-all duration-200 ease-out z-50",
            sidebarCollapsed ? "w-[68px]" : "w-[260px]",
            // Mobile
            "fixed inset-y-0 left-0 lg:relative",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          {/* Sidebar Header */}
          <div className="flex flex-col border-b border-[var(--sidebar-border)] px-4 py-3">
            <div className={cn("flex items-center", sidebarCollapsed ? "justify-center" : "justify-between")}>
              <Link href="/dashboard" className={cn("flex items-center gap-2.5 min-w-0", sidebarCollapsed && "justify-center")}>
                <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-lg)] bg-primary text-white text-xs font-bold shrink-0">
                  M
                </div>
                {!sidebarCollapsed && (
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-[var(--foreground)] block truncate">Mervi</span>
                    <span className="text-[10px] text-[var(--foreground-muted)] block">Client Portal</span>
                  </div>
                )}
              </Link>
              {/* Mobile close */}
              <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto lg:hidden text-[var(--foreground-muted)] hover:text-[var(--foreground)] cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Collapse Toggle — Desktop only */}
            <div className={cn("hidden lg:flex mt-4", sidebarCollapsed ? "justify-center" : "justify-start")}>
              <button
                onClick={toggleSidebar}
                className="group flex items-center justify-center h-7 w-7 rounded-[var(--radius-md)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors cursor-pointer"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <PanelLeftClose className="h-4 w-4" />
                </motion.div>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-5">
            {navGroups.map((group) => (
              <div key={group.label}>
                {!sidebarCollapsed && (
                  <p className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                    {group.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2 text-[13px] font-medium transition-colors relative",
                          active
                            ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)]"
                            : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)]",
                          sidebarCollapsed && "justify-center px-0",
                        )}
                        title={sidebarCollapsed ? item.name : undefined}
                      >
                        {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full" />}
                        <Icon className={cn("h-4 w-4 shrink-0", active ? "text-[var(--sidebar-active-text)]" : "text-[var(--foreground-muted)]")} />
                        {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer: User Profile */}
          <div className="relative border-t border-[var(--sidebar-border)] p-2.5" ref={profileMenuRef}>
            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "absolute bottom-[calc(100%+8px)] z-50 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card-bg)] shadow-xl overflow-hidden",
                    sidebarCollapsed ? "left-2 w-[220px]" : "left-2.5 right-2.5"
                  )}
                >
                  <div className="px-3 py-2 border-b border-[var(--border)] bg-[var(--background-secondary)]">
                    <p className="text-xs font-medium text-[var(--foreground)] truncate">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)] truncate">{user?.email}</p>
                  </div>
                  <div className="p-1 space-y-0.5">
                    <button onClick={() => { setProfileMenuOpen(false); router.push("/dashboard/settings"); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)] cursor-pointer">
                      <User className="h-3.5 w-3.5" /> Profile Settings
                    </button>
                    <button onClick={() => { setProfileMenuOpen(false); router.push("/dashboard/settings"); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)] cursor-pointer">
                      <Settings className="h-3.5 w-3.5" /> Account Settings
                    </button>
                    <div className="h-px bg-[var(--border)] my-1 mx-2" />
                    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)] cursor-pointer">
                      <div className="flex items-center gap-2">
                        {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                        Theme
                      </div>
                      <span className="text-[10px] text-[var(--foreground-muted)] uppercase">{theme}</span>
                    </button>
                    <div className="h-px bg-[var(--border)] my-1 mx-2" />
                    <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-danger hover:bg-danger-light dark:hover:bg-red-950/30 cursor-pointer">
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className={cn(
                "flex items-center w-full rounded-[var(--radius-md)] hover:bg-[var(--background-secondary)] transition-colors cursor-pointer text-left",
                sidebarCollapsed ? "justify-center p-1.5" : "p-1.5 gap-3"
              )}
            >
              <Avatar size="sm" className="shrink-0 h-8 w-8 border border-[var(--border)]">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">{userInitials}</AvatarFallback>
              </Avatar>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--foreground)] truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[10px] text-[var(--foreground-muted)] truncate">{user?.organizationName}</p>
                </div>
              )}
              {!sidebarCollapsed && (
                <ChevronUp className={cn("h-4 w-4 shrink-0 text-[var(--foreground-muted)] transition-transform duration-200", profileMenuOpen && "rotate-180")} />
              )}
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <header className="flex items-center justify-between h-[60px] px-4 sm:px-6 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile hamburger */}
              <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden text-[var(--foreground-secondary)] hover:text-[var(--foreground)] cursor-pointer">
                <Menu className="h-5 w-5" />
              </button>

              {/* Breadcrumb */}
              <nav className="hidden sm:flex items-center gap-1 text-sm min-w-0" aria-label="Breadcrumb">
                {breadcrumbs.map((crumb, i) => (
                  <React.Fragment key={crumb.href}>
                    {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-[var(--foreground-muted)] shrink-0" />}
                    <Link
                      href={crumb.href}
                      className={cn(
                        "truncate max-w-[160px]",
                        i === breadcrumbs.length - 1
                          ? "text-[var(--foreground)] font-medium"
                          : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                      )}
                    >
                      {crumb.label}
                    </Link>
                  </React.Fragment>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Search trigger */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden sm:flex items-center gap-2 text-[var(--foreground-muted)] font-normal"
              >
                <Search className="h-4 w-4" />
                <span className="text-xs">Search…</span>
                <kbd className="ml-2 inline-flex items-center gap-0.5 rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--foreground-muted)]">
                  ⌘K
                </kbd>
              </Button>

              <Separator orientation="vertical" className="h-5 mx-1 hidden sm:block" />

              {/* Notifications */}
              <Button variant="ghost" size="icon-sm" onClick={() => router.push('/dashboard/notifications')} className="relative" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="mx-auto max-w-[1400px] p-4 sm:p-6 animate-fade-in">
              {children}
            </div>
          </main>
        </div>

        {/* ── Command Palette ── */}
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]" onClick={() => setCommandPaletteOpen(false)}>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg mx-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card-bg)] shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 px-4 border-b border-[var(--border)]">
                <Search className="h-4 w-4 text-[var(--foreground-muted)] shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search projects, documents, invoices…"
                  className="flex-1 h-12 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none"
                />
                <kbd className="text-[10px] border border-[var(--border)] rounded px-1.5 py-0.5 text-[var(--foreground-muted)]">ESC</kbd>
              </div>
              <div className="p-2 max-h-[50vh] overflow-y-auto">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">Quick Actions</p>
                {[
                  { label: "Go to Dashboard", href: "/dashboard", icon: LayoutDashboard },
                  { label: "View Project Timeline", href: "/dashboard/project/timeline", icon: FolderKanban },
                  { label: "View Milestones", href: "/dashboard/milestones", icon: MilestoneIcon },
                  { label: "Billing & Payments", href: "/dashboard/billing", icon: CreditCard },
                  { label: "Support Center", href: "/dashboard/tickets", icon: LifeBuoy },
                ].map((action) => (
                  <button
                    key={action.href}
                    onClick={() => { router.push(action.href); setCommandPaletteOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-md)] text-sm text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)] transition-colors cursor-pointer text-left"
                  >
                    <action.icon className="h-4 w-4 text-[var(--foreground-muted)]" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* ── Global Floating AI Assistant ── */}
        <FloatingAIAssistant />
      </div>
    </TooltipProvider>
  );
}
