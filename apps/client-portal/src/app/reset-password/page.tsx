"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authService } from "@/lib/services/auth.service";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = React.useMemo(() => {
    if (newPassword.length === 0) return { score: 0, label: "" };
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (/[A-Z]/.test(newPassword)) s++;
    if (/[0-9]/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    return { score: s, label: labels[s] };
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setError("");
    try {
      await authService.resetPassword({ token, newPassword, confirmPassword });
      setSuccess(true);
    } catch {
      setError("Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-[380px] text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success mx-auto"><CheckCircle2 className="h-6 w-6" /></div>
        <h1 className="text-xl font-semibold text-[var(--foreground)]">Password reset successful</h1>
        <p className="text-sm text-[var(--foreground-secondary)]">Your password has been updated. You can now sign in with your new password.</p>
        <Button onClick={() => router.push("/")} className="mt-4">Sign in</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[380px] space-y-8">
      <div className="text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-4"><Lock className="h-6 w-6" /></div>
        <h1 className="text-xl font-semibold text-[var(--foreground)]">Set new password</h1>
        <p className="text-sm text-[var(--foreground-secondary)] mt-2">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[var(--foreground-secondary)]">New password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••"
              className="flex h-10 w-full rounded-[var(--radius-lg)] border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-primary pr-10" />
            <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] cursor-pointer" aria-label="Toggle visibility">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordStrength.score > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1 flex-1">{[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= passwordStrength.score ? (passwordStrength.score >= 3 ? 'bg-success' : passwordStrength.score >= 2 ? 'bg-warning' : 'bg-danger') : 'bg-[var(--border)]'}`} />)}</div>
              <span className="text-[10px] text-[var(--foreground-muted)]">{passwordStrength.label}</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[var(--foreground-secondary)]">Confirm password</label>
          <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
            className="flex h-10 w-full rounded-[var(--radius-lg)] border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-primary" />
        </div>

        {error && <div className="text-sm text-danger bg-danger-light dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 rounded-[var(--radius-lg)]">{error}</div>}
        <Button type="submit" className="w-full" loading={loading}>Reset password</Button>
      </form>

      <div className="text-center">
        <Link href="/" className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">← Back to sign in</Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <Suspense fallback={<div className="w-full max-w-[380px] text-center space-y-4 text-sm text-[var(--foreground-muted)]">Loading reset form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
