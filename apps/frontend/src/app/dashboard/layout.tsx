"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useAuthStore } from "@/store/auth.store";
import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("@/components/ui/Hero3D").then((mod) => mod.Hero3D), { 
  ssr: false,
  loading: () => <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] bg-white animate-pulse" />
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isHydrated) return;

    // Route Protection
    if (!user) {
      // If client attempted to access dashboard, redirect to client login
      if (pathname.includes("/dashboard/client")) {
        router.push("/auth/client/login");
      } else {
        router.push("/auth/internal/login");
      }
    }
  }, [user, isHydrated, mounted, pathname, router]);

  // Prevent layout shifting / hydration mismatch while checking auth state
  if (!mounted || !isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If fully hydrated and no user, don't render the shell
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        
        {/* Universal 3D Hero Section */}
        <Hero3D 
          title="Hariventure Digital Workspace"
          subtitle="Enterprise infrastructure powered by Next.js and NestJS"
          highlightWords={["Hariventure", "Workspace"]}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-white relative z-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
