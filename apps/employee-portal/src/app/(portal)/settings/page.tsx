"use client";

import { useAuthStore } from "@/store/auth.store";
import { User, Shield, Bell, Monitor, Key, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--foreground-secondary)] mt-1">
          Manage your account preferences and profile details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <nav className="flex flex-col gap-1">
          <Button variant="ghost" className="justify-start bg-[var(--sidebar-active)] text-[var(--foreground)]"><User className="w-4 h-4 mr-2" />Profile</Button>
          <Button variant="ghost" className="justify-start text-[var(--foreground-secondary)]"><Monitor className="w-4 h-4 mr-2" />Appearance</Button>
          <Button variant="ghost" className="justify-start text-[var(--foreground-secondary)]"><Bell className="w-4 h-4 mr-2" />Notifications</Button>
          <Button variant="ghost" className="justify-start text-[var(--foreground-secondary)]"><Shield className="w-4 h-4 mr-2" />Security & MFA</Button>
          <Button variant="ghost" className="justify-start text-[var(--foreground-secondary)]"><Key className="w-4 h-4 mr-2" />API Keys</Button>
        </nav>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and email address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue={user?.firstName || ""} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue={user?.lastName || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input defaultValue={user?.email || ""} disabled />
                <p className="text-xs text-[var(--foreground-muted)]">Please contact IT support to change your email address.</p>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how Mervi Portal looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                <div>
                  <Label className="text-base">System Theme</Label>
                  <p className="text-xs text-[var(--foreground-secondary)]">Automatically switch between light and dark themes.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                <div>
                  <Label className="text-base">Compact Mode</Label>
                  <p className="text-xs text-[var(--foreground-secondary)]">Reduce spacing in lists and tables.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-base">Animations</Label>
                  <p className="text-xs text-[var(--foreground-secondary)]">Enable interface animations and transitions.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
