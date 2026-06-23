"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
      await apiClient.post("/auth/client/login", { email });
      setTempEmail(email);
      router.push("/verify-otp");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.1),transparent_40%)] pointer-events-none" />

      <div className="relative w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        {/* Accent Bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1.5 bg-gradient-to-r from-mervi-cyan via-mervi-blue to-mervi-teal rounded-full" />

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-mervi-cyan to-mervi-blue rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 transform hover:scale-105 transition-transform">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Mervi Platform</h1>
          <p className="text-sm text-slate-400 mt-1.5">Enterprise Client Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email-input" className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
              Email Address
            </label>
            <input
              id="email-input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl focus:border-mervi-cyan focus:ring-2 focus:ring-mervi-cyan/20 outline-none text-white transition-all placeholder-slate-600"
              placeholder="client@hariventures.com"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 p-3 rounded-2xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-4 px-4 bg-gradient-to-r from-mervi-cyan to-mervi-blue hover:from-mervi-cyan/90 hover:to-mervi-blue/90 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex justify-center items-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Send Login Code"
            )}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6 leading-relaxed">
          Secure multi-tenant network. Enter the email associated with your client account to request a temporary login code.
        </p>
      </div>
    </div>
  );
}
