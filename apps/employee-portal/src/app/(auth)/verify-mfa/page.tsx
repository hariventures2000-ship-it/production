"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/lib/services/auth.service";
import { Loader2, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const CODE_LENGTH = 6;

export default function VerifyMfaPage() {
  const router = useRouter();
  
  const tempToken = useAuthStore((state) => state.tempToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no temp token and not already authenticated
  useEffect(() => {
    if (isHydrated && !tempToken && !isAuthenticated) {
      router.replace("/login");
    }
  }, [tempToken, router, isHydrated, isAuthenticated]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;

      const newCode = [...code];

      // Handle paste
      if (value.length > 1) {
        const digits = value.slice(0, CODE_LENGTH).split("");
        digits.forEach((d, i) => {
          if (index + i < CODE_LENGTH) newCode[index + i] = d;
        });
        setCode(newCode);
        const nextIndex = Math.min(index + digits.length, CODE_LENGTH - 1);
        inputRefs.current[nextIndex]?.focus();
        return;
      }

      newCode[index] = value;
      setCode(newCode);
      setError(null);

      if (value && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [code]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [code]
  );

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== CODE_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.verifyMfa({
        tempToken: tempToken || "",
        code: fullCode,
      });
      setAccessToken(response.accessToken);
      setAuth({
        userId: response.user.userId,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        avatar: response.user.avatar,
        role: response.user.role,
        subRole: response.user.subRole,
        department: response.user.department,
        tenantId: response.user.tenantId,
        mfaEnabled: response.user.mfaEnabled,
        isFirstLogin: response.user.isFirstLogin,
      });
      toast.success("Authentication successful", {
        description: `Welcome back, ${response.user.firstName}!`,
      });
      router.push("/workspace");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid code. Please try again.";
      setError(message);
      setCode(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  }, [code, tempToken, setAccessToken, setAuth, router]);

  // Auto-submit when code is complete
  useEffect(() => {
    const fullCode = code.join("");
    if (fullCode.length === CODE_LENGTH && !isLoading) {
      const timer = setTimeout(() => {
        handleSubmit();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [code, isLoading, handleSubmit]);

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
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight mt-4">
        Two-factor authentication
      </h2>
      <p className="text-[var(--foreground-secondary)] mt-1.5 text-sm">
        Enter the 6-digit code from your authenticator app
      </p>

      <Card className="mt-6 border-[var(--border)]">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={CODE_LENGTH}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => {
                    e.preventDefault();
                    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
                    handleChange(index, paste);
                  }}
                  className={`
                    w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 transition-all duration-150
                    bg-[var(--input-bg)] text-[var(--foreground)]
                    ${
                      digit
                        ? "border-[var(--color-primary)] shadow-sm shadow-blue-500/10"
                        : "border-[var(--input-border)]"
                    }
                    focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--input-focus-ring)]
                  `}
                  aria-label={`Digit ${index + 1}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading || code.join("").length !== CODE_LENGTH}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                "Verify & Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-[var(--foreground-muted)] mt-6">
        Open Microsoft Authenticator or Google Authenticator to get your code
      </p>
    </motion.div>
  );
}
