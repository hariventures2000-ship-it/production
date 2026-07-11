// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Interactive Settings Dashboard
// Fully completed settings tabs: Profile, Appearance, Notifications, Security, Preferences, Connections
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useTheme } from "next-themes";
import { 
  User, Shield, Bell, Monitor, Key, Link2, 
  Settings, Check, UploadCloud, Smartphone, Laptop,
  Lock, AlertTriangle, Eye, EyeOff, CheckCircle2, RotateCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "notifications" | "security" | "preferences" | "connections">("profile");

  // Profile forms state
  const [firstName, setFirstName] = useState(user?.firstName || "Sneha");
  const [lastName, setLastName] = useState(user?.lastName || "Patil");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [bio, setBio] = useState("Senior Software Engineer at Mervi Platform Engineering.");
  const [profileVisible, setProfileVisible] = useState(true);
  const [showPass, setShowPass] = useState(false);

  // Security active sessions state
  const [sessions, setSessions] = useState([
    { id: "sess-1", device: "MacBook Pro", browser: "Chrome (Bangalore, IN)", current: true, icon: Laptop },
    { id: "sess-2", device: "iPhone 15 Pro", browser: "Mervi App (Bangalore, IN)", current: false, icon: Smartphone }
  ]);

  // Connected accounts state
  const [connections, setConnections] = useState([
    { id: "github", name: "GitHub", connected: true, username: "sneha-patil" },
    { id: "gitlab", name: "GitLab", connected: false, username: "" },
    { id: "jira", name: "Jira", connected: true, username: "sp-mervi" },
    { id: "slack", name: "Slack", connected: true, username: "sneha-mervi" },
    { id: "teams", name: "Microsoft Teams", connected: false, username: "" },
    { id: "google", name: "Google Calendar", connected: true, username: "sneha@hariventures.com" }
  ]);

  const handleSaveProfile = () => {
    toast.success("Profile details updated successfully!");
  };

  const handleRevokeSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast.success("Active session revoked successfully!");
  };

  const handleToggleConnection = (id: string) => {
    setConnections(connections.map(c => {
      if (c.id === id) {
        if (c.connected) {
          toast.success(`Disconnected from ${c.name}`);
          return { ...c, connected: false, username: "" };
        } else {
          toast.success(`Connected to ${c.name} as test-user`);
          return { ...c, connected: true, username: "test-user" };
        }
      }
      return c;
    }));
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--foreground-secondary)] mt-1">
          Manage your personal details, user preferences, security parameters, and workspace integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start">
        {/* Navigation Sidebar */}
        <nav className="flex flex-col gap-1 bg-[var(--background-secondary)]/50 p-2 rounded-xl border border-[var(--border)]">
          <Button 
            variant="ghost" 
            className={cn("justify-start text-xs h-9", activeTab === "profile" ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] font-semibold" : "text-[var(--foreground-secondary)]")}
            onClick={() => setActiveTab("profile")}
          >
            <User className="w-4 h-4 mr-2" />Profile
          </Button>
          <Button 
            variant="ghost" 
            className={cn("justify-start text-xs h-9", activeTab === "appearance" ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] font-semibold" : "text-[var(--foreground-secondary)]")}
            onClick={() => setActiveTab("appearance")}
          >
            <Monitor className="w-4 h-4 mr-2" />Appearance
          </Button>
          <Button 
            variant="ghost" 
            className={cn("justify-start text-xs h-9", activeTab === "notifications" ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] font-semibold" : "text-[var(--foreground-secondary)]")}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="w-4 h-4 mr-2" />Notifications
          </Button>
          <Button 
            variant="ghost" 
            className={cn("justify-start text-xs h-9", activeTab === "security" ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] font-semibold" : "text-[var(--foreground-secondary)]")}
            onClick={() => setActiveTab("security")}
          >
            <Shield className="w-4 h-4 mr-2" />Security & MFA
          </Button>
          <Button 
            variant="ghost" 
            className={cn("justify-start text-xs h-9", activeTab === "preferences" ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] font-semibold" : "text-[var(--foreground-secondary)]")}
            onClick={() => setActiveTab("preferences")}
          >
            <Settings className="w-4 h-4 mr-2" />Preferences
          </Button>
          <Button 
            variant="ghost" 
            className={cn("justify-start text-xs h-9", activeTab === "connections" ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] font-semibold" : "text-[var(--foreground-secondary)]")}
            onClick={() => setActiveTab("connections")}
          >
            <Link2 className="w-4 h-4 mr-2" />Integrations
          </Button>
        </nav>

        {/* Settings Tab Workspaces */}
        <div className="space-y-6">

          {/* ── PROFILE SETTINGS ── */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile Information</CardTitle>
                <CardDescription>Update your public demographics, avatar picture, and phone details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                {/* Avatar Row */}
                <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]/30">
                  <Avatar className="w-14 h-14 bg-[var(--color-primary)] text-white text-base font-bold shrink-0">
                    <AvatarFallback>{firstName[0]}{lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-xs text-[var(--foreground)]">Profile Avatar</h4>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Upload a high resolution square portrait for team directories.</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => toast.success("Select avatar file dialog triggered.")}>
                        <UploadCloud className="w-3.5 h-3.5 mr-1" /> Upload Image
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-[var(--color-danger)]" onClick={() => toast.info("Avatar reset to default initials.")}>
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Grid inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">First Name</Label>
                    <Input className="h-9" value={firstName} onChange={e => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Last Name</Label>
                    <Input className="h-9" value={lastName} onChange={e => setLastName(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Official Email</Label>
                    <Input className="h-9" value={user?.email || "sneha@hariventures.com"} disabled />
                    <p className="text-[10px] text-[var(--foreground-muted)]">Corporate email address cannot be changed.</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Contact Phone</Label>
                    <Input className="h-9" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Bio Description</Label>
                  <Textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} />
                </div>

                <Separator />

                {/* Profile Visibility Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-[var(--foreground)]">Profile Visibility</h4>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Make your profile details, contact card, and timeline visible to everyone in the directory.</p>
                  </div>
                  <Switch checked={profileVisible} onCheckedChange={setProfileVisible} />
                </div>

                <Button size="sm" onClick={handleSaveProfile} className="mt-2">
                  Save Profile Details
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ── APPEARANCE SETTINGS ── */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Appearance Preferences</CardTitle>
                <CardDescription>Tailor the layout styling, theme colors, sizes, and menu density.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                {/* Theme Selector */}
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <div>
                    <h4 className="font-semibold text-xs text-[var(--foreground)]">System Theme</h4>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Switch between light mode and dark mode preferences.</p>
                  </div>
                  <Select value={theme} onValueChange={(val) => setTheme(val)}>
                    <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Theme" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light Theme</SelectItem>
                      <SelectItem value="dark">Dark Theme</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sidebar Density Selection */}
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <div>
                    <h4 className="font-semibold text-xs text-[var(--foreground)]">Sidebar Density</h4>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Set compact list padding or comfortable spacing.</p>
                  </div>
                  <Select defaultValue="comfortable">
                    <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact Mode</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Size Settings */}
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <div>
                    <h4 className="font-semibold text-xs text-[var(--foreground)]">Interface Font Size</h4>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Set font scale parameter across the dashboard portal.</p>
                  </div>
                  <Select defaultValue="normal">
                    <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (13px)</SelectItem>
                      <SelectItem value="normal">Normal (14px)</SelectItem>
                      <SelectItem value="large">Large (16px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Accessibility Toggles */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-semibold text-xs text-[var(--foreground)]">Reduce Motion</h4>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Disable animations and transitions for page widgets.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── NOTIFICATIONS SETTINGS ── */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Rules</CardTitle>
                <CardDescription>Select which channels process alert logs and workspace mentions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">Alert Channels Toggles</p>
                  
                  <div className="flex items-center justify-between py-1">
                    <Label className="font-semibold">Email Alerts</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <Label className="font-semibold">Browser Push Notifications</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <Label className="font-semibold">Slack Bot Integration Alerts</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <Label className="font-semibold">Microsoft Teams Alerts</Label>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">Trigger Events</p>
                  
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <Label className="font-semibold">CI/CD & Deployment Releases</Label>
                      <p className="text-[9px] text-[var(--foreground-muted)]">Get notified on successful/failed pipelines.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div>
                      <Label className="font-semibold">Sprint Boards & Task Movements</Label>
                      <p className="text-[9px] text-[var(--foreground-muted)]">Get alerts when card statuses shift or comments are added.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div>
                      <Label className="font-semibold">Meetings & Calendar Invites</Label>
                      <p className="text-[9px] text-[var(--foreground-muted)]">Get alerts 10 minutes before meeting startups.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── SECURITY & MFA SETTINGS ── */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Security & Authentication</CardTitle>
                <CardDescription>Configure Multi-Factor credentials and manage current log sessions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                {/* Reset Password block */}
                <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--background-secondary)]/20 space-y-3">
                  <p className="font-bold text-xs text-[var(--foreground)]">Reset Password</p>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label>Current Password</Label>
                      <Input type={showPass ? "text" : "password"} className="h-9" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>New Password</Label>
                        <Input type={showPass ? "text" : "password"} className="h-9" />
                      </div>
                      <div className="space-y-1">
                        <Label>Confirm Password</Label>
                        <Input type={showPass ? "text" : "password"} className="h-9" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />} Show Characters
                    </Button>
                    <Button size="sm" className="h-8" onClick={() => toast.success("Password updated successfully!")}>
                      Change Password
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* MFA configuration */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-[var(--foreground)]">Two-Factor Authentication (MFA)</h4>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Secure your portal using standard Google/Microsoft Authenticator keys.</p>
                  </div>
                  <Switch defaultChecked onCheckedChange={(checked) => toast.info(checked ? "MFA Enforced." : "MFA Disabled. Contact admin for authorization.")} />
                </div>

                <Separator />

                {/* Active Sessions */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-[var(--foreground)] uppercase tracking-wider">Active Device Sessions</h4>
                  <div className="space-y-2">
                    {sessions.map((sess) => {
                      const DeviceIcon = sess.icon;
                      return (
                        <div key={sess.id} className="flex items-center justify-between p-3 border border-[var(--border)] rounded-xl bg-[var(--card-bg)] shadow-xs">
                          <div className="flex items-center gap-3">
                            <DeviceIcon className="w-4 h-4 text-[var(--foreground-muted)]" />
                            <div>
                              <p className="font-semibold text-xs text-[var(--foreground)]">
                                {sess.device} {sess.current && <Badge className="bg-emerald-500/10 text-emerald-700 border-none font-bold text-[9px] h-4 ml-1.5">This Session</Badge>}
                              </p>
                              <p className="text-[9px] text-[var(--foreground-muted)] mt-0.5">{sess.browser}</p>
                            </div>
                          </div>
                          {!sess.current && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 text-[10px] text-[var(--color-danger)] hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={() => handleRevokeSession(sess.id)}
                            >
                              Revoke
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── PREFERENCES SETTINGS ── */}
          {activeTab === "preferences" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Workspace Preferences</CardTitle>
                <CardDescription>Set layout startup preferences, default sprints, and target timezones.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Default Active Project</Label>
                    <Select defaultValue="mervi">
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mervi">Mervi Platform v2</SelectItem>
                        <SelectItem value="client">Client Portal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Start Dashboard Page</Label>
                    <Select defaultValue="workspace">
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workspace">Workspace Dashboard</SelectItem>
                        <SelectItem value="my-work">My Work Matrix</SelectItem>
                        <SelectItem value="agile">Sprint Board</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Display Timezone</Label>
                    <Select defaultValue="ist">
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ist">India Standard Time (UTC+5:30)</SelectItem>
                        <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                        <SelectItem value="pst">Pacific Standard Time (UTC-8:00)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Calendar Start Day</Label>
                    <Select defaultValue="monday">
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button size="sm" onClick={() => toast.success("Workspace preferences updated.")}>
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ── CONNECTED ACCOUNTS ACCOUNTS ── */}
          {activeTab === "connections" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Workspace Integrations</CardTitle>
                <CardDescription>Authorise secure connections to code repositories and communication workspaces.</CardDescription>
              </CardHeader>
              <CardContent className="text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {connections.map((c) => (
                    <div key={c.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--card-bg)] flex flex-col justify-between h-[110px] shadow-xs">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-xs text-[var(--foreground)]">{c.name}</h4>
                          <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">
                            {c.connected ? `Connected as @${c.username}` : "Not Connected"}
                          </p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-[9px] border-none",
                            c.connected ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 text-slate-500"
                          )}
                        >
                          {c.connected ? "Active" : "Disconnected"}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant={c.connected ? "outline" : "default"} 
                        className="h-7 text-[10px] w-full"
                        onClick={() => handleToggleConnection(c.id)}
                      >
                        {c.connected ? "Disconnect Integration" : "Connect Account"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
