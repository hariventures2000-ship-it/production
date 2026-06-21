"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeLogin() {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-mervi-blue rounded-lg flex items-center justify-center shadow-lg shadow-mervi-blue/30 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-mervi-dark tracking-tight">Mervi Platform</h1>
          <p className="text-sm text-gray-500 mt-1">Employee Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-gray-600 uppercase mb-2">Email Address</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mervi-blue focus:ring-2 focus:ring-mervi-blue/20 outline-none transition-all"
              placeholder="employee@hariventures.com" required />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-wider text-gray-600 uppercase mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mervi-blue focus:ring-2 focus:ring-mervi-blue/20 outline-none transition-all"
              placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={isLoading}
            className="w-full py-3.5 px-4 bg-mervi-dark hover:bg-black text-white rounded-xl font-medium transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex justify-center items-center">
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
