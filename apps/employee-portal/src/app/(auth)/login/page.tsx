"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/lib/services/auth.service";
import { Loader2, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { setTempToken } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setTempToken(response.tempToken);
      toast.success("Credentials verified", {
        description: "Please complete MFA verification.",
      });
      router.push("/verify-mfa");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Mobile logo */}
      <div className="flex items-center gap-3 mb-8 lg:hidden">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[var(--foreground)]">Mervi Portal</h1>
          <p className="text-xs text-[var(--foreground-muted)]">Employee Workspace</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
          Welcome back
        </h2>
        <p className="text-[var(--foreground-secondary)] mt-1.5 text-sm">
          Sign in to your employee account
        </p>
      </div>

      <Card className="border-[var(--border)]">
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
              <Label htmlFor="login-email">Email address</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="employee@hariventures.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                required
                autoComplete="email"
                autoFocus
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <button
                  type="button"
                  className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:underline transition-colors cursor-pointer"
                  onClick={() => router.push("/forgot-password")}
                  tabIndex={-1}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  required
                  autoComplete="current-password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember-device"
                checked={rememberDevice}
                onCheckedChange={(checked) =>
                  setRememberDevice(checked === true)
                }
              />
              <label
                htmlFor="remember-device"
                className="text-sm text-[var(--foreground-secondary)] cursor-pointer select-none"
              >
                Remember this device
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[var(--foreground-muted)]">
        <span>Protected by MFA</span>
        <span className="w-1 h-1 rounded-full bg-[var(--foreground-muted)]" />
        <span>256-bit encryption</span>
      </div>
    </motion.div>
  );
}
