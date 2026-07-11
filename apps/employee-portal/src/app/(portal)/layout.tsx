"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/app.store";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notification.store";
import { useAIStore } from "@/store/ai.store";
import { Pagination } from "@/components/ui/pagination";
import { mockNotifications } from "@/lib/mock-data/workspace.mock";
import { cn } from "@/lib/cn";
import { NAV_SECTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import {
  Sheet, SheetContent, SheetTitle,
} from "@/components/ui/sheet";
import {
  Bell, Search, Sun, Moon, PanelLeftClose, PanelLeftOpen,
  Menu, LogOut, User, Settings, ChevronRight, Zap, Monitor,
  ChevronsUpDown, X, Keyboard, Send, Bot, Sparkles, Minimize2,
  Maximize2, ShieldCheck, ChevronLeft, Clock,
} from "lucide-react";

// ── Sidebar ───────────────────────────────────────────────────────

function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, clearAuth } = useAuthStore();
  const { toggleSidebar, setCommandPaletteOpen } = useAppStore();

  const isActive = (href: string) => {
    if (href === "/workspace") return pathname === "/workspace";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] z-40 transition-all duration-200 hidden lg:flex flex-col justify-between",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      <div className="flex-1 flex flex-col min-h-0">
        {/* Logo and Collapse Button */}
        <div className={cn("flex border-b border-[var(--sidebar-border)]", collapsed ? "flex-col items-center py-2 gap-2 h-20" : "flex-row items-center justify-between h-14 px-4")}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-[var(--foreground)] tracking-tight">Mervi</span>
            )}
          </div>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn("h-7 w-7 text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] transition-all", collapsed && "mt-1")}
                  onClick={toggleSidebar}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <motion.div
                    animate={{ rotate: collapsed ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                  </motion.div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
                {collapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <nav className="px-2 space-y-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label}>
                {!collapsed && (
                  <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--sidebar-section)]">
                    {section.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                      <TooltipProvider key={item.href} delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg text-sm transition-all duration-150 group",
                                collapsed ? "justify-center p-2.5" : "px-3 py-2",
                                active
                                  ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] font-medium"
                                  : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
                              )}
                            >
                              <Icon className={cn("w-4 h-4 shrink-0", active && "text-[var(--sidebar-active-text)]")} />
                              {!collapsed && <span className="truncate">{item.name}</span>}
                              {!collapsed && item.badge && (
                                <Badge variant="secondary" className="ml-auto text-[10px] h-5 px-1.5">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </TooltipTrigger>
                          {collapsed && (
                            <TooltipContent side="right" sideOffset={8}>
                              {item.name}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Profile Section Fixed to bottom of left Sidebar */}
      <div className="mt-auto shrink-0 flex flex-col border-t border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] p-2">
        <DropdownMenu>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex items-center rounded-lg hover:bg-[var(--sidebar-hover)] transition-all duration-200 cursor-pointer text-left w-full focus:outline-none",
                    collapsed ? "justify-center p-1.5" : "gap-3 p-2"
                  )}>
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="text-xs bg-[var(--color-primary)] text-white font-bold">
                        {user ? `${user.firstName[0]}${user.lastName[0]}` : "ME"}
                      </AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[var(--foreground)] truncate leading-tight">
                          {user ? `${user.firstName} ${user.lastName}` : "Employee"}
                        </p>
                        <p className="text-[10px] text-[var(--foreground-muted)] truncate mt-0.5">
                          {user?.role?.replace(/_/g, " ") || "Developer"}
                        </p>
                      </div>
                    )}
                    {!collapsed && <ChevronsUpDown className="w-3.5 h-3.5 text-[var(--foreground-muted)] shrink-0" />}
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" sideOffset={12}>
                  <p className="font-semibold text-xs">{user ? `${user.firstName} ${user.lastName}` : "Employee"}</p>
                  <p className="text-[10px] text-[var(--foreground-muted)]">{user?.email || "employee@hariventures.com"}</p>
                  <p className="text-[9px] text-[var(--foreground-muted)] mt-0.5">{user?.role?.replace(/_/g, " ") || "Developer"}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent side="right" align="end" className="w-60 ml-2">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : "Employee"}</p>
                <p className="text-xs text-[var(--foreground-muted)]">{user?.email || "employee@hariventures.com"}</p>
                <p className="text-[10px] text-[var(--foreground-muted)]">Platform Engineering</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer"><User className="w-4 h-4 mr-2" />My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer"><Settings className="w-4 h-4 mr-2" />My Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer"><ShieldCheck className="w-4 h-4 mr-2" />Security</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="cursor-pointer">
              {theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
              Theme Toggle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCommandPaletteOpen(true)} className="cursor-pointer">
              <Keyboard className="w-4 h-4 mr-2" />Keyboard Shortcuts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { clearAuth(); window.location.href = "/login"; }} className="text-[var(--color-danger)] cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

// ── Header ────────────────────────────────────────────────────────

function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { setCommandPaletteOpen, setMobileSidebarOpen } = useAppStore();
  const { unreadCount, togglePanel } = useNotificationStore();

  // Breadcrumb
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-[var(--header-border)] glass flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />}
              {crumb.isLast ? (
                <span className="text-[var(--foreground)] font-medium">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Search */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex gap-2 text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="w-4 h-4" />
          <span className="text-xs">Search…</span>
          <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-[var(--border)] bg-[var(--background-secondary)] px-1.5 text-[10px] font-medium text-[var(--foreground-muted)]">
            ⌘K
          </kbd>
        </Button>
        <Button variant="ghost" size="icon-sm" className="sm:hidden" onClick={() => setCommandPaletteOpen(true)} aria-label="Search">
          <Search className="w-4 h-4" />
        </Button>

        {/* Theme */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="hover:bg-[var(--background-secondary)]"
        >
          <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon-sm" className="relative hover:bg-[var(--background-secondary)]" onClick={togglePanel} aria-label="Notifications">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--color-danger)] text-[10px] text-white flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}

// ── Command Palette ───────────────────────────────────────────────

function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const [search, setSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "auth-service", "leave policy", "BUG-042"
  ]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const searchItems = [
    { category: "Tasks", name: "JWT refresh token rotation (wt-1)", href: "/tasks" },
    { category: "Tasks", name: "Fix widget timeout bugs (wt-2)", href: "/tasks" },
    { category: "Stories", name: "Implement multi-tenant isolation (story-101)", href: "/agile/backlog" },
    { category: "Stories", name: "Setup Kafka event stream (story-102)", href: "/agile/backlog" },
    { category: "Bugs", name: "BUG-042: CSRF token mismatch on Firefox", href: "/qa/bug-reports" },
    { category: "Bugs", name: "BUG-038: PDF generation failure (> ₹1,00,000)", href: "/qa/bug-reports" },
    { category: "Meetings", name: "Daily Standup (10:00 AM)", href: "/workspace/meetings" },
    { category: "Meetings", name: "Sprint Planning meeting (2:00 PM)", href: "/workspace/meetings" },
    { category: "Projects", name: "Mervi Platform v2 (Active)", href: "/projects" },
    { category: "Projects", name: "Client Portal Redesign (At Risk)", href: "/projects" },
    { category: "Documentation", name: "Platform Architecture wiki", href: "/documentation/knowledge-base" },
    { category: "Documentation", name: "API Guidelines v2", href: "/documentation" },
    { category: "PRs", name: "pr-247: Add dashboard analytics", href: "/development/pull-requests" },
    { category: "PRs", name: "pr-244: Fix Kafka consumer retry", href: "/development/pull-requests" },
    { category: "Deployments", name: "auth-service v3.0.1 failed production release", href: "/deployment" },
    { category: "Deployments", name: "client-portal v2.4.1 successful staging release", href: "/deployment" },
    { category: "Employees", name: "Vijay S. (Team Lead)", href: "/settings" },
    { category: "Employees", name: "Arjun M. (DevOps Engineer)", href: "/settings" },
    { category: "Employees", name: "Priya K. (Senior Developer)", href: "/settings" },
  ];

  const filteredItems = searchItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCategories = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof searchItems>);

  const handleSelect = (href: string, query: string) => {
    if (query && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
    setCommandPaletteOpen(false);
    setSearch("");
    window.location.href = href;
  };

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput 
        placeholder="Search tasks, stories, bugs, meetings, docs..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {/* Recent Searches */}
        {search === "" && recentSearches.length > 0 && (
          <CommandGroup heading="Recent Searches">
            {recentSearches.map((term) => (
              <CommandItem
                key={term}
                onSelect={() => {
                  setSearch(term);
                }}
              >
                <Clock className="mr-2 h-4 w-4 text-[var(--foreground-muted)]" />
                <span>{term}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Dynamic grouped search results */}
        {Object.keys(groupedCategories).map((category) => (
          <CommandGroup key={category} heading={category}>
            {groupedCategories[category].map((item) => (
              <CommandItem
                key={item.name}
                onSelect={() => handleSelect(item.href, search)}
              >
                <Zap className="mr-2 h-4 w-4 text-[var(--color-primary)]" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}

        <CommandSeparator />
        
        {/* Navigation Shortcut list */}
        {search === "" && (
          <CommandGroup heading="Navigation Shortcuts">
            {NAV_SECTIONS.slice(0, 6).map((section) => 
              section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.href}
                    onSelect={() => handleSelect(item.href, "")}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>Go to {item.name}</span>
                  </CommandItem>
                );
              })
            )}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

// ── Notification Panel ────────────────────────────────────────────

function NotificationPanel() {
  const { notifications, panelOpen, setPanelOpen, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalItems = notifications.length;
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
      <SheetContent side="right" className="w-[380px] p-0 flex flex-col h-full">
        <SheetTitle className="sr-only">Notifications</SheetTitle>
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] shrink-0">
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-[var(--foreground-muted)]">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {paginatedNotifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-8 h-8 text-[var(--foreground-muted)] mx-auto mb-3" />
                <p className="text-sm text-[var(--foreground-muted)]">No notifications yet</p>
              </div>
            ) : (
              paginatedNotifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors cursor-pointer mb-0.5",
                    n.read ? "opacity-60" : "bg-[var(--background-secondary)]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {!n.read && <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0" />}
                    <div className={cn(!n.read ? "" : "ml-5")}>
                      <p className="text-sm font-medium text-[var(--foreground)]">{n.title}</p>
                      <p className="text-xs text-[var(--foreground-secondary)] mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-[var(--foreground-muted)] mt-1">{n.actorName}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
        {totalItems > itemsPerPage && (
          <div className="p-2 border-t border-[var(--border)] bg-[var(--card-bg)] shrink-0">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              itemName="notifications"
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ── Mobile Sidebar ────────────────────────────────────────────────

function MobileSidebar() {
  const pathname = usePathname();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useAppStore();

  const isActive = (href: string) => {
    if (href === "/workspace") return pathname === "/workspace";
    return pathname.startsWith(href);
  };

  return (
    <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex items-center gap-3 h-14 px-4 border-b border-[var(--sidebar-border)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[var(--foreground)]">Mervi</span>
        </div>
        <ScrollArea className="h-[calc(100vh-56px)] py-2">
          <nav className="px-2 space-y-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label}>
                <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--sidebar-section)]">
                  {section.label}
                </p>
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                        active
                          ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] font-medium"
                          : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)]"
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ── Markdown renderer for AI Messages ────────────────────────────────
function MarkdownText({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-1.5">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "";
          const code = match ? match[2] : part.slice(3, -3);
          return (
            <pre key={index} className="p-2.5 rounded bg-slate-950 text-slate-100 font-mono text-[10px] overflow-x-auto border border-slate-800 my-1">
              {lang && <div className="text-[8px] text-slate-500 uppercase font-semibold mb-1 border-b border-slate-800 pb-0.5">{lang}</div>}
              <code>{code.trim()}</code>
            </pre>
          );
        }
        return (
          <p key={index} className="whitespace-pre-line">
            {part.split("\n").map((line, lIdx) => {
              let renderedLine: React.ReactNode = line;
              if (line.trim().startsWith("- ")) {
                renderedLine = (
                  <span className="flex items-start gap-1.5 ml-2">
                    <span className="text-[var(--color-primary)]">•</span>
                    <span>{line.trim().substring(2)}</span>
                  </span>
                );
              } else {
                const boldMatch = line.split(/(\*\*.*?\*\*)/g);
                renderedLine = boldMatch.map((subPart, sIdx) => {
                  if (subPart.startsWith("**") && subPart.endsWith("**")) {
                    return <strong key={sIdx} className="font-semibold text-[var(--foreground)]">{subPart.slice(2, -2)}</strong>;
                  }
                  return subPart;
                });
              }
              return <span key={lIdx} className="block">{renderedLine}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

// ── Smart AI Mock Responses ──────────────────────────────────────────
function getAIResponse(text: string): string {
  const query = text.toLowerCase().trim();
  if (query.includes("task")) {
    return `Here are your current **tasks** for today:
- **JWT refresh token rotation** (High priority, In Progress)
- **Fix dashboard widget timeout bugs** (Medium priority, To Do)
- **Prepare Q3 OKRs presentation** (Medium priority, Done)
- **Onboard new UI designer** (High priority, Done)

Would you like me to start the timer on one of your active tasks?`;
  }
  if (query.includes("sprint")) {
    return `Here is your **Sprint Summary** for **Sprint 18**:
- **Completion Progress**: 72%
- **Tasks**: 18 of 25 tasks completed
- **Time Remaining**: 4 days left
- **Velocity Track**: 42 story points committed, 31 points delivered
- **Insights**: You are on track to complete the sprint goals, but have 2 blocked tasks that need attention.`;
  }
  if (query.includes("standup")) {
    return `Here is a draft for your **daily standup update**:
\`\`\`text
Yesterday:
- Resolved the duplicate notification sounds in the WebSocket handler.
- Worked on client-side pagination for long tables.

Today:
- Implementing the global floating AI Copilot slide panel.
- Refactoring the sidebar layouts and collapse button transitions.

Blockers:
- None.
\`\`\`
Would you like me to adjust the tone of this update?`;
  }
  if (query.includes("pr") || query.includes("pull request")) {
    return `You have **3 pull requests** pending your review:
1. **pr-247**: *Add dashboard analytics with Recharts integration* (mervi-platform)
2. **pr-244**: *Fix Kafka consumer error handling in notification-service* (mervi-platform)
3. **pr-241**: *Add WebSocket reconnection with backoff strategy* (notification-service)

All pull requests have passing CI tests.`;
  }
  if (query.includes("bug")) {
    return `There are currently **8 open bug reports**:
- **BUG-042**: *CSRF token mismatch on Firefox browsers* (Critical, Assignee: Arjun M.)
- **BUG-041**: *Dashboard widgets not loading after timeout* (Major, Assignee: Priya K.)
- **BUG-040**: *Notification sound plays multiple times* (Minor, Assignee: Sneha P.)
- **BUG-038**: *PDF invoice generation fails for amounts > ₹1,00,000* (Critical, Assignee: Vijay S.)

Would you like me to help troubleshoot any of these issues?`;
  }
  if (query.includes("meeting")) {
    return `Here are your **meetings** scheduled for today:
- **Daily Standup** (Ongoing now, Google Meet, 10 attendees)
- **Sprint Planning** (2:00 PM - 3:00 PM, Zoom, 6 attendees)
- **1:1 with Team Lead** (4:30 PM - 5:00 PM, 2 attendees)

You can click "Join" on the dashboard to jump straight in!`;
  }
  if (query.includes("workload")) {
    return `Here is a **Workload Analysis** of your active assignments:
- **Story Points**: 12 points assigned
- **Active Tasks**: 2 in progress, 2 to-do
- **Workload Status**: Balanced (82% capacity utilized)
- **Recommendation**: Avoid taking on additional tasks in this sprint to ensure high-quality delivery.`;
  }
  if (query.includes("story") || query.includes("user story")) {
    return `Here is a draft **User Story template** for your new feature:
\`\`\`markdown
# User Story: [Feature Title]

As a [Type of User],
I want to [Perform an Action],
So that [Benefit / Value is Achieved].

## Acceptance Criteria:
1. GIVEN [context], WHEN [action], THEN [result].
2. Focus states are fully WCAG AA compliant.
3. Framer Motion transition animations run under 200ms.
\`\`\`
Fill in the placeholders, and I can refine the acceptance criteria for you!`;
  }
  if (query.includes("deployment") || query.includes("fail")) {
    return `The last deployment of **auth-service v3.0.1** to Production **failed** 1 day ago.
**Error Log Snippet**:
\`\`\`text
[ERROR] WebServerStartFailedException: Port 8081 already in use.
[INFO] Shutting down connection pools...
[INFO] Deployment rolled back to v3.0.0.
\`\`\`
**Recommended Fix**: Kill any running auth-service process on port 8081 or modify the system service configuration.`;
  }
  if (query.includes("documentation") || query.includes("summarize")) {
    return `Here is a brief summary of the **Platform Architecture** documentation:
- **Architecture Type**: Event-driven microservices
- **Frontend Layer**: Next.js 15 portals (App Router) + Zustand
- **Backend Services**: Spring Boot apps running on Docker
- **Event Bus**: Apache Kafka for async event broadcasting
- **Persistence**: MongoDB (analytics) + PostgreSQL (users, tenants)`;
  }
  if (query.includes("project")) {
    return `I found the following active projects:
- **Mervi Platform v2 (MVP)**: 72% progress, On Track, Lead: Vijay S.
- **Client Portal Redesign**: 45% progress, At Risk, Lead: Arjun M.
- **Notification Hub**: 90% progress, On Track, Lead: Priya K.`;
  }
  if (query.includes("knowledge") || query.includes("kb")) {
    return `Here are popular articles from the **Knowledge Base**:
1. *Employee Leave Policy 2026* (Accruals, workflows, and rules)
2. *Code Review Best Practices* (PR sizes, reviewer SLAs)
3. *Two-Factor Authentication Setup Guide* (TOTP configuration)

Which one would you like me to retrieve?`;
  }
  return `I've analyzed your query: "${text}".
As your Mervi AI Assistant, I'm connected to the platform database and can help fetch files, tasks, sprint reports, or code repositories.
Try asking me:
- *"Show my tasks"*
- *"Summarize the current sprint status"*
- *"List today's meetings"*`;
}

// ── AI Copilot FAB Component ─────────────────────────────────────────
function AICopilotFAB() {
  const { isOpen, setIsOpen, unreadCount } = useAIStore();
  return (
    <motion.button
      onClick={() => setIsOpen(!isOpen)}
      className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[var(--color-primary)] text-white shadow-xl flex items-center justify-center z-50 cursor-pointer focus:outline-none"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={unreadCount > 0 ? {
        boxShadow: ["0px 0px 0px 0px rgba(99, 102, 241, 0.4)", "0px 0px 0px 10px rgba(99, 102, 241, 0)", "0px 0px 0px 0px rgba(99, 102, 241, 0)"]
      } : {}}
      transition={unreadCount > 0 ? {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
      aria-label="AI Copilot"
    >
      <Sparkles className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900">
          {unreadCount}
        </span>
      )}
    </motion.button>
  );
}

// ── AI Copilot Panel Component ───────────────────────────────────────
function AICopilotPanel() {
  const { isOpen, setIsOpen, isMinimized, setIsMinimized, messages, addMessage, clearHistory } = useAIStore();
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const filteredMessages = messages.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    addMessage('user', text);
    setInput("");
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const reply = getAIResponse(text);
    addMessage('assistant', reply);
    setIsTyping(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed right-0 bottom-0 bg-[var(--card-bg)] border-l border-[var(--border)] shadow-2xl z-50 flex flex-col transition-all duration-200",
          isMinimized 
            ? "h-14 w-full sm:w-[380px] md:w-[420px] rounded-t-xl" 
            : "h-screen w-full sm:w-[380px] md:w-[420px]"
        )}
      >
        <div className="flex items-center justify-between p-3.5 border-b border-[var(--border)] bg-[var(--background-secondary)]/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-xs text-[var(--foreground)]">Mervi AI Copilot</h3>
              <p className="text-[9px] text-[var(--foreground-muted)]">Active • RAG Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="p-2 border-b border-[var(--border)] shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                <Input
                  placeholder="Search chat history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs bg-[var(--background-secondary)]/30 border-[var(--border)]"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 pb-2">
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-xs font-semibold",
                      msg.role === 'assistant' 
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
                        : "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 text-[var(--color-primary)]"
                    )}>
                      {msg.role === 'assistant' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                    <div className={cn(
                      "max-w-[80%] rounded-xl p-3 text-xs leading-relaxed",
                      msg.role === 'user'
                        ? "bg-[var(--color-primary)] text-white rounded-tr-none"
                        : "bg-[var(--background-secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-tl-none"
                    )}>
                      <MarkdownText content={msg.content} />
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 animate-pulse" />
                    </div>
                    <div className="bg-[var(--background-secondary)] text-[var(--foreground-muted)] border border-[var(--border)] rounded-xl rounded-tl-none p-3 text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {messages.length === 1 && (
              <div className="p-3 border-t border-[var(--border)] bg-[var(--background-secondary)]/30 shrink-0">
                <p className="text-[10px] font-semibold text-[var(--foreground-muted)] mb-2 uppercase tracking-wider">Suggested Prompts</p>
                <div className="grid grid-cols-2 gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                  {[
                    "Show my tasks",
                    "Sprint summary",
                    "Generate standup update",
                    "Pending PR reviews",
                    "Open bugs",
                    "Today's meetings",
                    "Workload analysis",
                    "Create user story",
                    "Explain deployment failure",
                    "Summarize documentation",
                    "Find project",
                    "Search knowledge base"
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="text-[10px] text-left p-1.5 rounded bg-[var(--card-bg)] hover:bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors truncate focus:outline-none cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3.5 border-t border-[var(--border)] bg-[var(--card-bg)] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="relative"
              >
                <Input
                  placeholder="Ask AI Copilot anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="pr-10 h-10 text-xs rounded-lg border-[var(--border)] bg-[var(--background-secondary)]/10"
                />
                <Button
                  type="submit"
                  size="icon-sm"
                  disabled={!input.trim()}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
              <div className="flex items-center justify-between mt-2 px-1">
                <button
                  onClick={clearHistory}
                  className="text-[9px] text-[var(--foreground-muted)] hover:text-[var(--color-danger)] transition-colors cursor-pointer"
                >
                  Clear conversation
                </button>
                <span className="text-[9px] text-[var(--foreground-muted)]">Press Send or Enter to submit</span>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ── Portal Layout ─────────────────────────────────────────────────

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useAppStore();
  const { setNotifications } = useNotificationStore();

  // Load mock notifications
  useEffect(() => {
    setNotifications(mockNotifications);
  }, [setNotifications]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-[var(--background)]">
        {/* Desktop Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} />

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Content */}
        <div
          className={cn(
            "transition-all duration-200 min-h-screen",
            sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-[260px]"
          )}
        >
          <Header />
          <main className="p-4 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={usePathname()}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Overlays */}
        <CommandPalette />
        <NotificationPanel />

        {/* Global AI Copilot */}
        <AICopilotFAB />
        <AICopilotPanel />
      </div>
    </TooltipProvider>
  );
}
