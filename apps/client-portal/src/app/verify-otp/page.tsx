"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import apiClient from "@/lib/api-client";
import { AxiosError } from "axios";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const tempEmail = useAuthStore((state) => state.tempEmail);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    if (!tempEmail) {
      router.push("/");
    }
  }, [tempEmail, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await apiClient.post("/auth/client/verify-otp", {
        email: tempEmail,
        otp: otp.trim(),
      });

      const response = data as any;
      const token = response.data?.accessToken || response.accessToken;
      
      // We will fetch the user session info. In Mervi, verify-otp returns token,
      // and we can decode it or fetch a mock user profile. Since we need firstName,
      // let's build a session payload.
      const mockSession = {
        userId: "mock-client-id",
        role: "CLIENT" as any,
        authType: "CLIENT" as any,
        tenantId: "6676aa9ae9a701309909dcda",
        firstName: "Client",
        lastName: "User",
        email: tempEmail || "client@hariventures.com"
      };

      setAuth(token, mockSession);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.message || "Invalid or expired code.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_45%)] pointer-events-none" />

      <div className="relative w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1.5 bg-gradient-to-r from-mervi-cyan via-mervi-blue to-mervi-teal rounded-full" />

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-mervi-cyan to-mervi-blue rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Security Check</h1>
          <p className="text-sm text-slate-400 mt-2 text-center">
            We sent a verification code to <br />
            <span className="text-mervi-cyan font-semibold">{tempEmail}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp-input" className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
              6-Digit Code
            </label>
            <input
              id="otp-input"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-4 bg-slate-950/60 border border-slate-800 rounded-2xl focus:border-mervi-cyan focus:ring-2 focus:ring-mervi-cyan/20 outline-none text-white font-mono text-center text-2xl tracking-[0.5em] transition-all placeholder-slate-700"
              placeholder="000000"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 p-3 rounded-2xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.length < 4}
            className="w-full py-4 px-4 bg-gradient-to-r from-mervi-cyan to-mervi-blue hover:from-mervi-cyan/90 hover:to-mervi-blue/90 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex justify-center items-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Verify & Access"
            )}
          </button>
        </form>

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
          >
            ← Use different email
          </button>
          <button
            type="button"
            onClick={async () => {
              setError("");
              try {
                await apiClient.post("/auth/client/login", { email: tempEmail });
                alert("Code resent!");
              } catch (e) {
                setError("Resend failed. Please try again.");
              }
            }}
            className="text-xs text-slate-400 hover:text-mervi-cyan font-medium transition-colors"
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
}
