"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Shield, Bell, Key, Smartphone, Building, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function SettingsPage() {
  const user = useAuthStore(s => s.user);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved successfully.");
    }, 600);
  };

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-4xl pb-10">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
        icon={Settings}
      />

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        {/* Settings Navigation */}
        <nav className="flex flex-col gap-1">
          <Button variant="secondary" className="justify-start"><User className="mr-2 h-4 w-4" /> Profile</Button>
          <Button variant="ghost" className="justify-start"><Building className="mr-2 h-4 w-4 text-[var(--foreground-muted)]" /> Organization</Button>
          <Button variant="ghost" className="justify-start"><Shield className="mr-2 h-4 w-4 text-[var(--foreground-muted)]" /> Security</Button>
          <Button variant="ghost" className="justify-start"><Bell className="mr-2 h-4 w-4 text-[var(--foreground-muted)]" /> Notifications</Button>
        </nav>

        <div className="space-y-8">
          {/* Profile Settings */}
          <section className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Profile Details</h3>
              <p className="text-sm text-[var(--foreground-secondary)]">Manage your personal information.</p>
            </div>
            <Separator />
            <div className="flex items-center gap-6 py-4">
              <Avatar size="lg" className="h-20 w-20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xl">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button size="sm">Upload new avatar</Button>
                <p className="text-xs text-[var(--foreground-muted)]">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" defaultValue={user.firstName} />
              <Input label="Last Name" defaultValue={user.lastName} />
            </div>
            <Input label="Email Address" defaultValue={user.email} disabled />
            <Input label="Phone Number" placeholder="+1 (555) 000-0000" />
            
            <div className="flex justify-end pt-4">
              <Button loading={loading} onClick={handleSave}>Save Changes</Button>
            </div>
          </section>

          {/* Security Settings */}
          <section className="space-y-4 pt-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Security</h3>
              <p className="text-sm text-[var(--foreground-secondary)]">Manage your password and 2FA.</p>
            </div>
            <Separator />
            
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Password</CardTitle>
                  <CardDescription>Last changed 3 months ago</CardDescription>
                </div>
                <Button variant="outline" size="sm"><Key className="mr-2 h-4 w-4" /> Change Password</Button>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    Two-Factor Authentication (2FA)
                    <span className="bg-success-light text-success-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Enabled</span>
                  </CardTitle>
                  <CardDescription>Protected by Microsoft Authenticator</CardDescription>
                </div>
                <Button variant="outline" size="sm"><Smartphone className="mr-2 h-4 w-4" /> Manage 2FA</Button>
              </CardHeader>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
