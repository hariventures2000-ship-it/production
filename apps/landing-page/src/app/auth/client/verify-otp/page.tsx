"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, OTPInput } from "@hariventure/ui";
import { useAuthStore } from "@/store/auth.store";
import apiClient from "@/lib/api-client";
import { AxiosError } from "axios";

export default function ClientVerifyOTPPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  
  const tempEmail = useAuthStore((state) => state.tempEmail);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    if (!tempEmail) {
      router.push("/auth/client/login");
    }
  }, [tempEmail, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/client/verify-otp", { 
        otp 
      });
      
      const { accessToken, user } = response.data.data;
      
      // Update global auth state
      setAuth(accessToken, user);
      
      // Redirect to client dashboard or first-login flow
      if (user.isFirstLogin) {
        router.push("/auth/client/first-login");
      } else {
        router.push("/dashboard/client");
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.message || "Invalid or expired code.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!tempEmail) return null;

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Verify your identity
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          We sent a 6-digit code to <span className="font-medium text-slate-900">{tempEmail}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-center">
              <OTPInput
                length={6}
                value={otp}
                onChange={setOtp}
              />
            </div>

            {error && (
              <div className="text-sm text-center text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
                {error}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
            
            <div className="text-center mt-4">
               <button 
                 type="button" 
                 className="text-sm text-green-600 hover:text-green-500 font-medium transition-colors"
                 onClick={() => router.push("/auth/client/login")}
               >
                 Use a different email
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
