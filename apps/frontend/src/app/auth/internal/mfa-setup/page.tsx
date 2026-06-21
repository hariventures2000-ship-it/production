"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, OTPInput } from "@hariventure/ui";
import { useAuthStore } from "@/store/auth.store";
import apiClient from "@/lib/api-client";
import { AxiosError } from "axios";

export default function InternalMfaSetupPage() {
  const [otp, setOtp] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  
  const tempEmail = useAuthStore((state) => state.tempEmail);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    if (!tempEmail) {
      router.push("/auth/internal/login");
      return;
    }

    const fetchMfaSetup = async () => {
      try {
        const response = await apiClient.post("/auth/internal/mfa-setup", { email: tempEmail });
        setQrCodeUrl(response.data.data.qrCodeUrl);
        setSetupKey(response.data.data.secret);
      } catch {
        setError("Failed to initialize MFA setup. Please start over.");
      } finally {
        setLoading(false);
      }
    };

    fetchMfaSetup();
  }, [tempEmail, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setVerifying(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/internal/mfa-verify", { 
        email: tempEmail, 
        token: otp 
      });
      
      const { accessToken, user } = response.data.data;
      
      setAuth(accessToken, user);
      
      // Route based on role
      router.push(`/dashboard/${user.role.toLowerCase()}`);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.message || "Invalid code. Try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setVerifying(false);
    }
  };

  if (!tempEmail) return null;

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Setup Authenticator
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Scan this QR code with Microsoft Authenticator or Google Authenticator.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 border border-slate-200 text-center">
          
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <span className="text-slate-500">Generating QR Code...</span>
            </div>
          ) : qrCodeUrl ? (
            <div className="flex flex-col items-center space-y-4 mb-8">
              <div className="bg-white p-2 border-2 border-slate-100 rounded-lg shadow-sm">
                <Image src={qrCodeUrl} alt="MFA QR Code" width={200} height={200} />
              </div>
              <p className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded">
                Key: {setupKey}
              </p>
            </div>
          ) : null}

          <form className="space-y-6" onSubmit={handleVerify}>
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-slate-700 mb-4">
                Enter the 6-digit code from your app
              </label>
              <OTPInput
                length={6}
                value={otp}
                onChange={setOtp}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
                {error}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={loading || verifying || otp.length !== 6}>
                {verifying ? "Verifying..." : "Complete Setup"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
