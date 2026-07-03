"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { authService } from "@/lib/services/auth.service";
import { Loader2, Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword({ email });
      setIsSent(true);
      toast.success("Reset link sent", {
        description: "Check your email for the password reset link.",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send reset link.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-[var(--border)]">
          <CardContent className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Check your email</h2>
            <p className="text-sm text-[var(--foreground-secondary)] mt-2 max-w-xs mx-auto">
              We sent a password reset link to{" "}
              <span className="font-medium text-[var(--foreground)]">{email}</span>
            </p>
            <div className="mt-6 space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsSent(false);
                  setEmail("");
                }}
              >
                Try a different email
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => router.push("/login")}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <button
        onClick={() => router.push("/login")}
        className="flex items-center gap-1.5 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sign in
      </button>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight mt-4">
        Reset your password
      </h2>
      <p className="text-[var(--foreground-secondary)] mt-1.5 text-sm">
        Enter your email and we&apos;ll send you a reset link
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
              <Label htmlFor="reset-email">Email address</Label>
              <Input
                id="reset-email"
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

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
