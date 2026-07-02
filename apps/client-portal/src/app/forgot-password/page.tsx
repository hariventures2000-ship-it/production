"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authService } from "@/lib/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.forgotPassword({ email });
      setSent(true);
    } catch {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-[380px] space-y-8">
        {sent ? (
          <div className="text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-semibold text-[var(--foreground)]">Check your email</h1>
            <p className="text-sm text-[var(--foreground-secondary)]">
              We sent a password reset link to<br />
              <span className="font-medium text-[var(--foreground)]">{email}</span>
            </p>
            <Link href="/">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="h-4 w-4" /> Back to sign in
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-semibold text-[var(--foreground)]">Reset your password</h1>
              <p className="text-sm text-[var(--foreground-secondary)] mt-2">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
              {error && <div className="text-sm text-danger bg-danger-light dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 rounded-[var(--radius-lg)]">{error}</div>}
              <Button type="submit" className="w-full" loading={loading}>Send reset link</Button>
            </form>

            <div className="text-center">
              <Link href="/" className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                ← Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
