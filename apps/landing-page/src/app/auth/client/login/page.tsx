"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@hariventure/ui";
import { AuthType, Role } from "@hariventure/types";
import { useAuthStore } from "@/store/auth.store";
import apiClient from "@/lib/api-client";
import { AxiosError } from "axios";

export default function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setTempEmail = useAuthStore((state) => state.setTempEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Phase 1 API integration
      await apiClient.post("/auth/client/login", { email });
      setTempEmail(email);
      router.push("/auth/client/verify-otp");
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.message || "Failed to send OTP.");
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
          Client Portal Login
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Enter your email to receive a secure login code.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
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
                    placeholder="name@company.com"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
                {error}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={loading || !email}>
                {loading ? "Sending Code..." : "Continue"}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
