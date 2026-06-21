"use client";

import React from "react";
import { useAuthStore } from "@/store/auth.store";
import { Card, CardHeader, CardTitle, CardContent } from "@hariventure/ui";
import { User, Mail, Shield } from "lucide-react";

export default function ClientProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profile Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account details and preferences.</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-xl font-bold text-green-700">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">{user?.firstName} {user?.lastName}</h3>
              <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{user?.role?.toLowerCase()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <div className="p-2 border border-slate-200 rounded-md bg-slate-50 text-slate-900">{user?.firstName}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <div className="p-2 border border-slate-200 rounded-md bg-slate-50 text-slate-900">{user?.lastName}</div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-md bg-slate-50 text-slate-900">
                <Mail className="h-4 w-4 text-slate-400" />
                {user?.email}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
