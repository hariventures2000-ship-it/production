"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthType, Role } from "@hariventure/types";
import { Button, Input } from "@hariventure/ui";
import { useAuthStore } from "@/store/auth.store";
import apiClient from "@/lib/api-client";
import { AxiosError } from "axios";

export default function InternalLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const setTempEmail = useAuthStore((state) => state.setTempEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/internal/login", { email, password });

      const { mfaRequired, mfaSetupRequired, message } = response.data;

      // Store email temporarily for the MFA steps
      setTempEmail(email);

      if (mfaSetupRequired) {
        // First time login, needs to setup Authenticator
        router.push("/auth/internal/mfa-setup");
      } else if (mfaRequired) {
        // Needs to verify TOTP
        router.push("/auth/internal/mfa-verify");
      } else {
        // Fallback or error state, internal users MUST use MFA.
        setError(message || "MFA is required for internal accounts.");
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.message || "Invalid credentials.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Staff Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Internal access for Hariventure employees
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hariventure.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
                {error}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={loading || !email || !password}>
                {loading ? "Authenticating..." : "Sign in"}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
