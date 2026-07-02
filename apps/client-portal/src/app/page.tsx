"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/lib/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setTempCredentials = useAuthStore((s) => s.setTempCredentials);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authService.login({ email, password, rememberMe });
      if (res.requiresMfa && res.tempToken) {
        setTempCredentials(email, res.tempToken);
        router.push("/verify-mfa");
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || "Invalid credentials. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] bg-primary relative flex-col justify-between p-10 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] bg-white/20 text-sm font-bold">M</div>
            <span className="text-lg font-semibold">Mervi</span>
          </div>
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-3xl font-bold leading-tight">Enterprise Client<br />Portal</h1>
          <p className="text-sm text-white/70 max-w-sm leading-relaxed">
            Complete transparency into your software project. Track milestones, review deliverables, approve work, and manage payments — all in one place.
          </p>
          <div className="flex items-center gap-6 pt-4 text-xs text-white/50">
            <span>Hariventure Digital Production</span>
            <span>•</span>
            <span>Multi-Tenant SaaS</span>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[380px] space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] bg-primary text-white text-sm font-bold">M</div>
            <span className="text-lg font-semibold text-[var(--foreground)]">Mervi</span>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Sign in to your account</h2>
            <p className="text-sm text-[var(--foreground-secondary)] mt-1">Enter your credentials to access the client portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--foreground-secondary)]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex h-10 w-full rounded-[var(--radius-lg)] border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-1 focus:border-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[var(--input-border)] text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                />
                <span className="text-xs text-[var(--foreground-secondary)]">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-xs text-primary hover:text-primary-hover font-medium">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="text-sm text-danger bg-danger-light dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 rounded-[var(--radius-lg)]">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>

          <p className="text-xs text-center text-[var(--foreground-muted)] leading-relaxed">
            Protected by multi-factor authentication.<br />
            Contact your administrator if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}
