"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { authService } from "@/lib/services/auth.service";
import { Loader2, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordChecks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Contains number", valid: /\d/.test(password) },
    { label: "Contains special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const isPasswordValid = passwordChecks.every((c) => c.valid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError("Password does not meet the requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token,
        newPassword: password,
        confirmPassword,
      });
      setIsReset(true);
      toast.success("Password reset successfully!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to reset password.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isReset) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-[var(--border)]">
          <CardContent className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Password updated</h2>
            <p className="text-sm text-[var(--foreground-secondary)] mt-2">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Button className="w-full mt-6" onClick={() => router.push("/login")}>
              Continue to Sign In
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={() => router.push("/login")}
        className="flex items-center gap-1.5 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sign in
      </button>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <KeyRound className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight mt-4">
        Create new password
      </h2>
      <p className="text-[var(--foreground-secondary)] mt-1.5 text-sm">
        Your new password must be different from previous passwords
      </p>

      <Card className="mt-6 border-[var(--border)]">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--color-danger-light)] dark:bg-red-950/30 border border-red-200 dark:border-red-800/50"
              >
                <AlertCircle className="w-4 h-4 text-[var(--color-danger)] mt-0.5 shrink-0" />
                <p className="text-sm text-[var(--color-danger)]">{error}</p>
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  required
                  autoComplete="new-password"
                  autoFocus
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1.5 mt-2"
                >
                  {passwordChecks.map((check) => (
                    <div
                      key={check.label}
                      className={`flex items-center gap-2 text-xs transition-colors ${
                        check.valid
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-[var(--foreground-muted)]"
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${check.valid ? "opacity-100" : "opacity-30"}`} />
                      {check.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  required
                  autoComplete="new-password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading || !isPasswordValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Resetting…
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--foreground-muted)]" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
