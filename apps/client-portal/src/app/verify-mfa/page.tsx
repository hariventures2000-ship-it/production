"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/lib/services/auth.service";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function VerifyMfaPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const tempToken = useAuthStore((s) => s.tempToken);
  const tempEmail = useAuthStore((s) => s.tempEmail);
  const setAuth = useAuthStore((s) => s.setAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!tempToken && !isAuthenticated) router.push("/");
  }, [tempToken, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempToken) return;
    setLoading(true);
    setError("");

    try {
      const res = await authService.verifyTotp(tempToken, code.trim());
      setAuth(res.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || "Invalid verification code.");
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-[380px] space-y-8">
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">Two-factor authentication</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-2">
            Enter the 6-digit code from your<br />
            <span className="font-medium text-[var(--foreground)]">Microsoft Authenticator</span> app.
          </p>
          {tempEmail && <p className="text-xs text-[var(--foreground-muted)] mt-1">{tempEmail}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="totp-code"
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-full h-14 text-center text-2xl tracking-[0.4em] font-mono rounded-[var(--radius-lg)] border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-primary"
              placeholder="000000"
              autoFocus
              autoComplete="one-time-code"
              aria-label="Verification code"
            />
          </div>

          {error && (
            <div className="text-sm text-danger bg-danger-light dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 rounded-[var(--radius-lg)]">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading} disabled={code.length < 6}>
            Verify & sign in
          </Button>
        </form>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            ← Use a different account
          </button>
        </div>
      </div>
    </div>
  );
}
