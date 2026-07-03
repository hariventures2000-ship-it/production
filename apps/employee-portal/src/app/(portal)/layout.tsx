"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/app.store";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notification.store";
import { mockNotifications } from "@/lib/mock-data/workspace.mock";
import { cn } from "@/lib/cn";
import { NAV_SECTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
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
  ChevronsUpDown, X,
} from "lucide-react";

// ── Sidebar ───────────────────────────────────────────────────────

function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/workspace") return pathname === "/workspace";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] z-40 transition-all duration-200 hidden lg:flex flex-col",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-14 px-4 border-b border-[var(--sidebar-border)]", collapsed ? "justify-center" : "gap-3")}>
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-[var(--foreground)] tracking-tight">Mervi</span>
        )}
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
    </aside>
  );
}

// ── Header ────────────────────────────────────────────────────────

function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { sidebarCollapsed, toggleSidebar, setCommandPaletteOpen, setMobileSidebarOpen } = useAppStore();
  const { user, clearAuth } = useAuthStore();
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

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden lg:flex"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </Button>

        <Separator orientation="vertical" className="h-5 hidden lg:block" />

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1 text-sm" aria-label="Breadcrumb">
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
          className="hidden sm:flex gap-2 text-[var(--foreground-secondary)]"
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
        >
          <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon-sm" className="relative" onClick={togglePanel} aria-label="Notifications">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--color-danger)] text-[10px] text-white flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>

        <Separator orientation="vertical" className="h-5 mx-1" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-[var(--background-secondary)] transition-colors cursor-pointer" aria-label="User menu">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="text-xs bg-[var(--color-primary)] text-white">
                  {user ? `${user.firstName[0]}${user.lastName[0]}` : "ME"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium text-[var(--foreground)] leading-none">
                  {user ? `${user.firstName} ${user.lastName}` : "Employee"}
                </p>
                <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">
                  {user?.role?.replace(/_/g, " ") || "Developer"}
                </p>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-[var(--foreground-muted)] hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : "Employee"}</p>
                <p className="text-xs text-[var(--foreground-muted)]">{user?.email || "employee@hariventures.com"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings"><User className="w-4 h-4 mr-2" />Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings"><Settings className="w-4 h-4 mr-2" />Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings"><Monitor className="w-4 h-4 mr-2" />Appearance</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { clearAuth(); window.location.href = "/login"; }} className="text-[var(--color-danger)]">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// ── Command Palette ───────────────────────────────────────────────

function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();

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

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {NAV_SECTIONS.slice(0, 6).map((section) => (
          <CommandGroup key={section.label} heading={section.label}>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.href}
                  onSelect={() => {
                    setCommandPaletteOpen(false);
                    window.location.href = item.href;
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem><Zap className="mr-2 h-4 w-4" />Create Task</CommandItem>
          <CommandItem><Zap className="mr-2 h-4 w-4" />New Document</CommandItem>
          <CommandItem><Zap className="mr-2 h-4 w-4" />Start Timer</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

// ── Notification Panel ────────────────────────────────────────────

function NotificationPanel() {
  const { notifications, panelOpen, setPanelOpen, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();

  return (
    <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
      <SheetContent side="right" className="w-[380px] p-0">
        <SheetTitle className="sr-only">Notifications</SheetTitle>
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
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
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-8 h-8 text-[var(--foreground-muted)] mx-auto mb-3" />
                <p className="text-sm text-[var(--foreground-muted)]">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
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
      </div>
    </TooltipProvider>
  );
}
