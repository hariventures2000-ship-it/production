"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MdLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
      <div className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
        {/* Decorative accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-1 bg-gradient-to-r from-mervi-indigo to-mervi-indigo-light rounded-full" />

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-mervi-indigo to-mervi-indigo-light rounded-xl flex items-center justify-center shadow-lg shadow-mervi-indigo/30 mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-mervi-dark tracking-tight">Mervi Platform</h1>
          <p className="text-sm text-gray-500 mt-1">Managing Director Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-gray-600 uppercase mb-2">Username</label>
            <input
              id="md-login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mervi-indigo focus:ring-2 focus:ring-mervi-indigo/20 outline-none transition-all"
              placeholder="md@hariventures.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-wider text-gray-600 uppercase mb-2">Password</label>
            <input
              id="md-login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mervi-indigo focus:ring-2 focus:ring-mervi-indigo/20 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            id="md-login-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-mervi-indigo to-mervi-indigo-light hover:from-mervi-indigo/90 hover:to-mervi-indigo-light/90 text-white rounded-xl font-medium transition-all shadow-md shadow-mervi-indigo/20 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center cursor-pointer"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          Authorized access for Managing Directors only
        </p>
      </div>
    </div>
  );
}
