"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import apiClient from "@/lib/api-client";
import { LogOut, User as UserIcon } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { getInitials } from "@hariventure/utils";

export function Topbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    try {
      // Invalidate on backend (clears http-only cookie)
      await apiClient.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      clearAuth();
      router.push("/");
    }
  };

  if (!user) return null;

  const initials = getInitials(`${user.firstName} ${user.lastName}`);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">
          Welcome back, {user.firstName}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-sm font-semibold text-green-700 hover:ring-2 hover:ring-green-500 hover:ring-offset-2 transition-all outline-none">
              {initials}
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              align="end" 
              className="min-w-[200px] bg-white rounded-md shadow-lg border border-slate-200 p-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50"
            >
              <div className="px-2 py-2 border-b border-slate-100 mb-1">
                <p className="text-sm font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>

              <DropdownMenu.Item 
                onSelect={(e) => {
                  e.preventDefault();
                  router.push(`/dashboard/${user.role.toLowerCase()}/profile`);
                }}
                className="flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-sm cursor-pointer outline-none transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                Profile Settings
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
              
              <DropdownMenu.Item 
                onSelect={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="flex items-center gap-2 px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-sm cursor-pointer outline-none transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
