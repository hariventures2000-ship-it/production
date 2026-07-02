"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@hariventure/ui";
import { useAuthStore } from "@/store/auth.store";
import apiClient from "@/lib/api-client";
import { AxiosError } from "axios";

export default function ClientFirstLoginPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiClient.patch("/auth/client/first-login-password-change", { 
        newPassword: password 
      });
      
      // Update the user state to reflect they are no longer on first login
      if (user && accessToken) {
        setAuth(accessToken, { ...user, isFirstLogin: false });
      }
      
      router.push("/dashboard/client");
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.message || "Failed to set password.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.isFirstLogin) {
    // If somehow accessed and not first login, redirect back
    if (typeof window !== "undefined") {
      router.replace("/dashboard/client");
    }
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Welcome to Hariventure!
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 px-4">
          Since this is your first time logging in, please set a permanent password for your account. You can use this for future logins.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">New Password</label>
              <Input
                type="password"
                required
                className="mt-1 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <Input
                type="password"
                required
                className="mt-1 w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm text-center text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
                {error}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={loading || !password || !confirmPassword}>
                {loading ? "Saving..." : "Set Password & Continue"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
