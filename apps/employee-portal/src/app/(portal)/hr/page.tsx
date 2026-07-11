// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Employee Self Service Portal (HR)
// Complete Production Upgrade with Profile Cards, 13 Tabs, and 10 Quick Actions
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState, useMemo } from "react";
import {
  CalendarDays, Clock, Users, TreePalm, Thermometer,
  GraduationCap, Plus, ChevronRight, Circle, CheckCircle2,
  XCircle, Timer, Building2, Mail, Phone, MapPin, Download,
  UserCheck, ShieldAlert, Award, FileText, Briefcase, Heart,
  Settings, HelpCircle, Laptop, Landmark, ClipboardList,
  UploadCloud, FileCheck, Check, Send, Sparkles, User, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import { toast } from "sonner";

// ── Mock Data for Self-Service HR ──────────────────────────────────

const mockEmployee = {
  photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  name: "Sneha Patil",
  id: "EMP-042",
  designation: "Senior Software Engineer",
  department: "Platform Engineering",
  manager: "Vijay S. (Engineering Lead)",
  type: "Full-Time",
  joiningDate: "Jan 15, 2024",
  location: "Bangalore, India",
  shift: "General Shift (9:00 AM - 6:00 PM)",
  workMode: "Hybrid",
  officialEmail: "sneha@hariventures.com",
  officialPhone: "+91 98765 43210",
  emergencyContact: "Asha Sharma (Spouse) - +91 98765 43211",
  bloodGroup: "O+",
  status: "Active",
  experience: "5.5 Years",
  skills: ["React", "Next.js", "Go", "TypeScript", "TailwindCSS", "PostgreSQL", "Kafka"],
  bio: "Passionate software engineer specializing in building high-performance web applications and distributed architectures."
};

const leaveBalances = [
  { type: "Casual Leave", used: 4, total: 12, color: "text-blue-500", bg: "bg-blue-500", icon: CalendarDays },
  { type: "Sick Leave", used: 2, total: 8, color: "text-amber-500", bg: "bg-amber-500", icon: Thermometer },
  { type: "Earned Leave", used: 5, total: 15, color: "text-emerald-500", bg: "bg-emerald-500", icon: TreePalm },
  { type: "Comp Off", used: 0, total: 3, color: "text-purple-500", bg: "bg-purple-500", icon: Clock },
];

const leaveHistory = [
  { id: "LR-001", type: "Casual Leave", from: "2026-07-14", to: "2026-07-15", days: 2, reason: "Personal work", status: "APPROVED", appliedOn: "2026-07-01" },
  { id: "LR-002", type: "Sick Leave", from: "2026-06-20", to: "2026-06-21", days: 2, reason: "Fever and cold", status: "APPROVED", appliedOn: "2026-06-19" },
  { id: "LR-003", type: "Earned Leave", from: "2026-08-10", to: "2026-08-14", days: 5, reason: "Family vacation", status: "PENDING", appliedOn: "2026-07-03" },
];

const attendanceLogs = [
  { date: "2026-07-11", status: "Present", checkIn: "09:05 AM", checkOut: "06:12 PM", hours: "9h 7m" },
  { date: "2026-07-10", status: "Present", checkIn: "08:58 AM", checkOut: "06:05 PM", hours: "9h 7m" },
  { date: "2026-07-09", status: "Present", checkIn: "09:12 AM", checkOut: "06:30 PM", hours: "9h 18m" },
  { date: "2026-07-08", status: "WFH", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "9h 0m" },
];

const payslips = [
  { id: "PAY-2026-06", period: "June 2026", basic: "₹95,000", deductions: "₹8,500", net: "₹86,500", date: "2026-06-30" },
  { id: "PAY-2026-05", period: "May 2026", basic: "₹95,000", deductions: "₹8,500", net: "₹86,500", date: "2026-05-31" },
];

const performanceGoals = [
  { id: "G-1", title: "Optimize Kafka Consumer Latency", target: "Reduce ingestion latency below 50ms", progress: 85 },
  { id: "G-2", title: "Complete WCAG AA Compliance Audit", target: "Achieve 100% compliant audits for portals", progress: 60 }
];

const documentsList = [
  { id: "doc-1", name: "Employment Contract.pdf", size: "2.4 MB", type: "Contract" },
  { id: "doc-2", name: "PAN Card Copy.pdf", size: "1.1 MB", type: "ID Proof" },
  { id: "doc-3", name: "Aadhaar Card Copy.pdf", size: "1.5 MB", type: "ID Proof" }
];

const assetsList = [
  { name: "MacBook Pro M3 Max 16\"", serial: "C02F8XYZQ05D", status: "Active", date: "Jan 15, 2024" },
  { name: "Dell 27\" Ultrasharp Monitor", serial: "CN-084W23-744", status: "Active", date: "Jan 15, 2024" }
];

const policiesList = [
  { title: "Employee Code of Conduct", version: "v2.1", updated: "Jan 2026" },
  { title: "Prevention of Sexual Harassment (POSH) Policy", version: "v1.5", updated: "Nov 2025" },
  { title: "Staging and Production Deployment SOP", version: "v3.0", updated: "Mar 2026" }
];

const STATUS_STYLES = {
  APPROVED: { label: "Approved", color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950", icon: CheckCircle2 },
  PENDING: { label: "Pending", color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950", icon: Timer },
  REJECTED: { label: "Rejected", color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950", icon: XCircle },
} as const;

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [applyLeaveOpen, setApplyLeaveOpen] = useState(false);
  const [hrTicketOpen, setHrTicketOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // Custom dialog parameters
  const [leaveType, setLeaveType] = useState("casual");
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Quick Action triggers
  const handleDownloadPayslip = () => {
    toast.success("Downloading Payslip PAY-2026-06.pdf...");
  };

  const handleDownloadOfferLetter = () => {
    toast.success("Downloading Offer_Letter_EMP-042.pdf...");
  };

  const handleDownloadIdCard = () => {
    toast.success("Downloading Employee_ID_EMP-042.pdf...");
  };

  const handleAttendanceToggle = () => {
    setIsCheckedIn(!isCheckedIn);
    toast.success(isCheckedIn ? "Checked out successfully!" : "Checked in successfully! Shift timer started.");
  };

  const handleApplyWFH = () => {
    toast.success("WFH request submitted for approval to Vijay S.");
  };

  const handleSubmitLeave = () => {
    setApplyLeaveOpen(false);
    toast.success(`Leave request submitted from ${leaveFrom || "N/A"} to ${leaveTo || "N/A"}.`);
  };

  const handleRaiseTicket = () => {
    setHrTicketOpen(false);
    toast.success("HR Support Ticket created successfully. SLA: 24h.");
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Employee Self-Service</h1>
        <p className="text-sm text-[var(--foreground-secondary)] mt-1">
          Manage your employment profile, leaves, attendance, payroll logs, and training assets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
        {/* Left Side: Profile Card + Quick Actions */}
        <div className="space-y-6">
          {/* Employee Profile Card */}
          <Card className="shadow-xs bg-[var(--card-bg)] border border-[var(--border)] overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative shrink-0" />
            <CardContent className="p-5 pt-0 relative flex flex-col items-center text-center">
              {/* Photo */}
              <div className="w-20 h-20 rounded-full border-4 border-[var(--card-bg)] overflow-hidden bg-slate-200 -mt-10 shadow-md">
                <Avatar className="w-full h-full">
                  <AvatarImage src={mockEmployee.photo} />
                  <AvatarFallback className="bg-[var(--color-primary)] text-white text-lg font-bold">SP</AvatarFallback>
                </Avatar>
              </div>

              {/* Basic Fields */}
              <h2 className="text-lg font-bold text-[var(--foreground)] mt-2">{mockEmployee.name}</h2>
              <p className="text-xs text-[var(--color-primary)] font-semibold">{mockEmployee.designation}</p>
              <Badge className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-none font-bold text-[9px] mt-1.5">{mockEmployee.status}</Badge>

              <Separator className="my-4" />

              {/* Profile details grid */}
              <div className="w-full space-y-2 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Employee ID</span>
                  <span className="font-semibold text-[var(--foreground)]">{mockEmployee.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Department</span>
                  <span className="font-semibold text-[var(--foreground)]">{mockEmployee.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Reporting Lead</span>
                  <span className="font-semibold text-[var(--foreground)] truncate max-w-[170px]">{mockEmployee.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Work Mode</span>
                  <span className="font-semibold text-[var(--foreground)]">{mockEmployee.workMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Office Location</span>
                  <span className="font-semibold text-[var(--foreground)]">{mockEmployee.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Official Phone</span>
                  <span className="font-semibold text-[var(--foreground)]">{mockEmployee.officialPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Experience</span>
                  <span className="font-semibold text-[var(--foreground)]">{mockEmployee.experience}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <Card className="shadow-xs bg-[var(--card-bg)] border border-[var(--border)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase text-[var(--foreground-muted)] tracking-wider">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="text-[10px] h-8 justify-start px-2.5" onClick={() => setApplyLeaveOpen(true)}>
                  <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Request Leave
                </Button>
                <Button size="sm" variant="outline" className="text-[10px] h-8 justify-start px-2.5" onClick={handleDownloadPayslip}>
                  <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Download Payslip
                </Button>
                <Button size="sm" variant="outline" className={cn("text-[10px] h-8 justify-start px-2.5", isCheckedIn && "bg-emerald-550/10 text-emerald-600")} onClick={handleAttendanceToggle}>
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> {isCheckedIn ? "Check Out" : "Check In"}
                </Button>
                <Button size="sm" variant="outline" className="text-[10px] h-8 justify-start px-2.5" onClick={() => setProfileDialogOpen(true)}>
                  <Settings className="w-3.5 h-3.5 mr-1.5 text-purple-500" /> Update Profile
                </Button>
                <Button size="sm" variant="outline" className="text-[10px] h-8 justify-start px-2.5" onClick={() => setHrTicketOpen(true)}>
                  <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-red-500" /> Raise HR Ticket
                </Button>
                <Button size="sm" variant="outline" className="text-[10px] h-8 justify-start px-2.5" onClick={handleDownloadOfferLetter}>
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> Offer Letter
                </Button>
                <Button size="sm" variant="outline" className="text-[10px] h-8 justify-start px-2.5" onClick={handleDownloadIdCard}>
                  <Award className="w-3.5 h-3.5 mr-1.5 text-rose-500" /> ID Card
                </Button>
                <Button size="sm" variant="outline" className="text-[10px] h-8 justify-start px-2.5" onClick={() => setActiveTab("policies")}>
                  <Briefcase className="w-3.5 h-3.5 mr-1.5 text-teal-500" /> View Policies
                </Button>
                <Button size="sm" variant="outline" className="text-[10px] h-8 justify-start px-2.5" onClick={handleApplyWFH}>
                  <Laptop className="w-3.5 h-3.5 mr-1.5 text-cyan-500" /> Apply WFH
                </Button>
                <Button size="sm" variant="outline" className="text-[10px] h-8 justify-start px-2.5" onClick={() => setUploadDialogOpen(true)}>
                  <UploadCloud className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Upload Docs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Tab panel workspace */}
        <Card className="shadow-xs bg-[var(--card-bg)] border border-[var(--border)] min-h-[600px] flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            {/* Scrollable Tabs List */}
            <div className="border-b border-[var(--border)] bg-[var(--background-secondary)]/50 px-4 pt-1 shrink-0 overflow-x-auto max-w-full custom-scrollbar">
              <TabsList className="h-10 bg-transparent flex justify-start gap-4 p-0">
                <TabsTrigger value="personal" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Personal Info</TabsTrigger>
                <TabsTrigger value="employment" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Employment</TabsTrigger>
                <TabsTrigger value="attendance" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Attendance</TabsTrigger>
                <TabsTrigger value="leave" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Leave</TabsTrigger>
                <TabsTrigger value="documents" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Documents</TabsTrigger>
                <TabsTrigger value="payroll" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Payroll</TabsTrigger>
                <TabsTrigger value="performance" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Performance</TabsTrigger>
                <TabsTrigger value="goals" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Goals</TabsTrigger>
                <TabsTrigger value="training" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Training</TabsTrigger>
                <TabsTrigger value="assets" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Assets</TabsTrigger>
                <TabsTrigger value="contacts" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Contacts</TabsTrigger>
                <TabsTrigger value="policies" className="tab-trigger text-xs font-semibold px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)] bg-transparent">Policies</TabsTrigger>
              </TabsList>
            </div>

            {/* TAB CONTENTS */}
            <div className="p-6 flex-1">
              
              {/* 1. PERSONAL INFORMATION */}
              <TabsContent value="personal" className="space-y-6 m-0 focus:outline-none">
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Personal Profile Overview</h3>
                  <p className="text-xs text-[var(--foreground-muted)]">Manage your basic demographics, emergency records, and bio summary.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-2">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[var(--foreground-muted)] uppercase text-[10px] font-semibold">Bio Statement</p>
                      <p className="text-[var(--foreground-secondary)] leading-relaxed">{mockEmployee.bio}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[var(--foreground-muted)] uppercase text-[10px] font-semibold">Skills Inventory</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {mockEmployee.skills.map(s => (
                          <Badge key={s} variant="secondary" className="text-[10px] h-5">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 bg-[var(--background-secondary)]/50 p-4 border border-[var(--border)] rounded-xl">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">Demographic Info</p>
                    <div className="flex justify-between py-1 border-b border-[var(--border)]">
                      <span>Blood Group</span>
                      <span className="font-semibold">{mockEmployee.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[var(--border)]">
                      <span>Official Email</span>
                      <span className="font-semibold">{mockEmployee.officialEmail}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Emergency Detail</span>
                      <span className="font-semibold text-right">{mockEmployee.emergencyContact}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* 2. EMPLOYMENT */}
              <TabsContent value="employment" className="space-y-6 m-0 focus:outline-none">
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Employment Details</h3>
                  <p className="text-xs text-[var(--foreground-muted)]">Verify your work schedule, shift configurations, and joining timestamps.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-2">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--foreground-muted)]">Employment Category</span>
                      <span className="font-semibold text-[var(--foreground)]">{mockEmployee.type}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--foreground-muted)]">Joining Date</span>
                      <span className="font-semibold text-[var(--foreground)]">{mockEmployee.joiningDate}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[var(--foreground-muted)]">Work Shift Config</span>
                      <span className="font-semibold text-[var(--foreground)]">{mockEmployee.shift}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl">
                    <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-2">Corporate Placement</p>
                    <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">
                      You are placed as a <strong>{mockEmployee.designation}</strong> in the <strong>{mockEmployee.department}</strong> department, reporting to <strong>{mockEmployee.manager}</strong>.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* 3. ATTENDANCE */}
              <TabsContent value="attendance" className="space-y-6 m-0 focus:outline-none">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--foreground)]">Attendance Log</h3>
                    <p className="text-xs text-[var(--foreground-muted)]">Review your recent check-in times and clocked hours.</p>
                  </div>
                  <Button size="sm" onClick={handleAttendanceToggle}>
                    <Clock className="w-3.5 h-3.5 mr-1" /> {isCheckedIn ? "Check Out Now" : "Clock In Now"}
                  </Button>
                </div>
                <div className="border border-[var(--border)] rounded-xl overflow-hidden shadow-xs bg-[var(--card-bg)]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[var(--background-secondary)] border-b border-[var(--border)] text-[var(--foreground-muted)] font-semibold">
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Check-In</th>
                        <th className="p-3">Check-Out</th>
                        <th className="p-3 text-right">Work Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {attendanceLogs.map((log, i) => (
                        <tr key={i} className="hover:bg-[var(--background-secondary)]/20">
                          <td className="p-3">{log.date}</td>
                          <td className="p-3">
                            <Badge variant="outline" className={cn("text-[9px] border-none font-semibold", log.status === 'Present' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700')}>{log.status}</Badge>
                          </td>
                          <td className="p-3">{log.checkIn}</td>
                          <td className="p-3">{log.checkOut}</td>
                          <td className="p-3 text-right font-medium">{log.hours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* 4. LEAVE */}
              <TabsContent value="leave" className="space-y-6 m-0 focus:outline-none">
                {/* Leave balances */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {leaveBalances.map((leave) => {
                    const Icon = leave.icon;
                    const remaining = leave.total - leave.used;
                    const percentage = (leave.used / leave.total) * 100;
                    return (
                      <div key={leave.type} className="p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl shadow-xs">
                        <div className="flex items-center justify-between mb-3">
                          <Icon className={cn("w-4 h-4", leave.color)} />
                          <span className={cn("text-lg font-bold", leave.color)}>{remaining}</span>
                        </div>
                        <p className="text-[10px] font-semibold text-[var(--foreground)]">{leave.type}</p>
                        <Progress value={percentage} className="h-1.5 my-1.5" />
                        <p className="text-[9px] text-[var(--foreground-muted)]">
                          {leave.used} used of {leave.total}d
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* History list */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">Leave Applications</h4>
                  <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card-bg)]">
                    {leaveHistory.map((leave) => {
                      const statusConf = STATUS_STYLES[leave.status as keyof typeof STATUS_STYLES];
                      const StatusIcon = statusConf.icon;
                      return (
                        <div key={leave.id} className="flex items-center justify-between p-3.5 hover:bg-[var(--background-secondary)]/20 transition-colors text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[var(--foreground)]">{leave.type}</span>
                              <Badge className={cn("text-[9px] border-none", statusConf.color)}>
                                <StatusIcon className="w-2.5 h-2.5 mr-1" />
                                {statusConf.label}
                              </Badge>
                            </div>
                            <p className="text-[10px] text-[var(--foreground-muted)] mt-1">
                              Duration: {leave.from} — {leave.to} ({leave.days} days) · Applied on {leave.appliedOn}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-[var(--foreground-muted)]">{leave.id}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* 5. DOCUMENTS */}
              <TabsContent value="documents" className="space-y-6 m-0 focus:outline-none">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--foreground)]">Corporate & ID Documents</h3>
                    <p className="text-xs text-[var(--foreground-muted)]">Securely download official files or upload verified credentials.</p>
                  </div>
                  <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
                    <UploadCloud className="w-3.5 h-3.5 mr-1.5" /> Upload File
                  </Button>
                </div>
                <div className="space-y-3">
                  {documentsList.map((doc) => (
                    <div key={doc.id} className="p-3 border border-[var(--border)] rounded-xl bg-[var(--card-bg)] hover:border-[var(--color-primary)] transition-all flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">{doc.name}</p>
                          <p className="text-[10px] text-[var(--foreground-muted)]">Type: {doc.type} · Size: {doc.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-[var(--foreground-muted)] hover:text-[var(--color-primary)]" onClick={() => toast.success(`Downloading ${doc.name}...`)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* 6. PAYROLL */}
              <TabsContent value="payroll" className="space-y-6 m-0 focus:outline-none">
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Payroll & Salary Slips</h3>
                  <p className="text-xs text-[var(--foreground-muted)]">View monthly salary details, basic structure, and download PDF slips.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                  <div className="p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl md:col-span-2">
                    <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-2">Salary Component Breakdown</p>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-[var(--border)]">
                        <span>Basic Salary</span>
                        <span className="font-semibold">₹65,000</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[var(--border)]">
                        <span>House Rent Allowance (HRA)</span>
                        <span className="font-semibold">₹20,000</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[var(--border)]">
                        <span>Special Allowance</span>
                        <span className="font-semibold">₹10,000</span>
                      </div>
                      <div className="flex justify-between py-1 pt-2 text-sm font-bold text-[var(--foreground)]">
                        <span>Gross Salary</span>
                        <span>₹95,000</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">Download Payslip history</p>
                    {payslips.map(slip => (
                      <div key={slip.id} className="p-3 border border-[var(--border)] rounded-xl bg-[var(--card-bg)] hover:border-[var(--color-primary)] transition-all flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-xs text-[var(--foreground)]">{slip.period}</p>
                          <p className="text-[9px] text-[var(--foreground-muted)]">Net: {slip.net}</p>
                        </div>
                        <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-[var(--foreground-muted)] hover:text-[var(--color-primary)]" onClick={handleDownloadPayslip}>
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* 7. PERFORMANCE */}
              <TabsContent value="performance" className="space-y-6 m-0 focus:outline-none">
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Performance Metrics</h3>
                  <p className="text-xs text-[var(--foreground-muted)]">Review evaluation results and performance grading history.</p>
                </div>
                <div className="p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-lg">
                    A
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--foreground)]">Q1 2026 Appraisal Rating</h4>
                    <p className="text-[11px] text-[var(--foreground-secondary)] mt-0.5 leading-relaxed">
                      Graded as **Exceeds Expectations** by Lead Developer Vijay S. Keep up the clean architectures!
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* 8. GOALS */}
              <TabsContent value="goals" className="space-y-6 m-0 focus:outline-none">
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Individual OKRs & Goals</h3>
                  <p className="text-xs text-[var(--foreground-muted)]">Track individual deliverables committed for this quarter.</p>
                </div>
                <div className="space-y-4">
                  {performanceGoals.map(goal => (
                    <div key={goal.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--card-bg)] shadow-xs space-y-2 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-semibold text-[var(--foreground)]">{goal.title}</span>
                        <Badge variant="secondary" className="text-[9px]">{goal.progress}%</Badge>
                      </div>
                      <Progress value={goal.progress} className="h-1.5" />
                      <p className="text-[10px] text-[var(--foreground-muted)]">Target checklist: {goal.target}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* 9. TRAINING */}
              <TabsContent value="training" className="space-y-6 m-0 focus:outline-none">
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Assigned Training Modules</h3>
                  <p className="text-xs text-[var(--foreground-muted)]">Complete continuous learning models and compliance modules.</p>
                </div>
                <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--card-bg)] shadow-xs space-y-3 text-xs">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[var(--foreground)]">Platform Security Best Practices</span>
                    <span className="text-[var(--foreground-muted)]">Completed</span>
                  </div>
                  <Progress value={100} className="h-1.5" indicatorClassName="bg-emerald-500" />
                  <p className="text-[10px] text-[var(--foreground-muted)]">Expires: Jan 15, 2027 · Refresher due next year.</p>
                </div>
              </TabsContent>

              {/* 10. ASSETS */}
              <TabsContent value="assets" className="space-y-6 m-0 focus:outline-none">
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Assigned Hardware Assets</h3>
                  <p className="text-xs text-[var(--foreground-muted)]">Company hardware assets and inventory registered in your name.</p>
                </div>
                <div className="space-y-3">
                  {assetsList.map((asset, i) => (
                    <div key={i} className="p-3 border border-[var(--border)] rounded-xl bg-[var(--card-bg)] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <Laptop className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">{asset.name}</p>
                          <p className="text-[10px] text-[var(--foreground-muted)]">S/N: {asset.serial} · Assigned {asset.date}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 border-none text-[9px] font-semibold">{asset.status}</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* 11. CONTACTS */}
              <TabsContent value="contacts" className="space-y-6 m-0 focus:outline-none">
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Emergency Contacts</h3>
                  <p className="text-xs text-[var(--foreground-muted)]">Verify primary and secondary emergency contact records.</p>
                </div>
                <div className="p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-[var(--border)]">
                    <span className="text-[var(--foreground-muted)]">Primary Contact</span>
                    <span className="font-semibold text-[var(--foreground)]">{mockEmployee.emergencyContact}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--foreground-muted)]">Relationship</span>
                    <span className="font-semibold text-[var(--foreground)]">Spouse</span>
                  </div>
                </div>
              </TabsContent>

              {/* 12. POLICIES */}
              <TabsContent value="policies" className="space-y-6 m-0 focus:outline-none">
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Company Policies</h3>
                  <p className="text-xs text-[var(--foreground-muted)]">Access Mervi internal employee guides and development protocols.</p>
                </div>
                <div className="space-y-3">
                  {policiesList.map((policy, i) => (
                    <div key={i} className="p-3.5 border border-[var(--border)] rounded-xl bg-[var(--card-bg)] hover:border-[var(--color-primary)] transition-all flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{policy.title}</p>
                        <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">Version {policy.version} · Updated {policy.updated}</p>
                      </div>
                      <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-[var(--foreground-muted)] hover:text-[var(--color-primary)]" onClick={() => toast.success(`Opening ${policy.title}...`)}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

            </div>
          </Tabs>
        </Card>
      </div>

      {/* ── Dialog Modals ────────────────────────────────────────────── */}

      {/* 1. Request Leave Dialog */}
      <Dialog open={applyLeaveOpen} onOpenChange={setApplyLeaveOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2 text-xs">
            <div className="space-y-2">
              <Label>Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select leave type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="earned">Earned Leave</SelectItem>
                  <SelectItem value="compoff">Comp Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input type="date" className="h-9" value={leaveFrom} onChange={(e) => setLeaveFrom(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input type="date" className="h-9" value={leaveTo} onChange={(e) => setLeaveTo(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea placeholder="Describe the reason for leave..." rows={3} value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setApplyLeaveOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSubmitLeave}>Submit Request</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Raise HR Ticket Dialog */}
      <Dialog open={hrTicketOpen} onOpenChange={setHrTicketOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create HR Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2 text-xs">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select defaultValue="payroll">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="payroll">Payroll Queries</SelectItem>
                  <SelectItem value="reimburse">Reimbursements</SelectItem>
                  <SelectItem value="hardware">Hardware Repair</SelectItem>
                  <SelectItem value="policy">Policy Clarification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input placeholder="Enter ticket summary..." className="h-9" />
            </div>
            <div className="space-y-2">
              <Label>Issue Description</Label>
              <Textarea placeholder="Describe your query in detail..." rows={4} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setHrTicketOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={handleRaiseTicket}>Create Ticket</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. Update Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Request Profile Update</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2 text-xs">
            <div className="space-y-2">
              <Label>Primary Phone Number</Label>
              <Input defaultValue={mockEmployee.officialPhone} className="h-9" />
            </div>
            <div className="space-y-2">
              <Label>Bio / Summary Statement</Label>
              <Textarea defaultValue={mockEmployee.bio} rows={3} />
            </div>
            <p className="text-[10px] text-[var(--foreground-muted)]">Note: Core details such as Designation, Salary, and Manager require direct HR validation and cannot be self-edited.</p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setProfileDialogOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={() => { setProfileDialogOpen(false); toast.success("Profile update request submitted for HR approval."); }}>Submit Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. Upload Documents Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Upload Credentials</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2 text-xs flex flex-col items-center">
            <div className="w-full h-32 border-2 border-dashed border-[var(--border)] rounded-xl flex flex-col items-center justify-center bg-[var(--background-secondary)]/50 hover:border-[var(--color-primary)] transition-all cursor-pointer">
              <UploadCloud className="w-8 h-8 text-[var(--foreground-muted)] mb-2" />
              <p className="text-xs font-semibold text-[var(--foreground)]">Drag & drop files here</p>
              <p className="text-[9px] text-[var(--foreground-muted)] mt-0.5">PDF, PNG, JPG up to 10MB</p>
            </div>
            <div className="flex justify-end w-full gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={() => { setUploadDialogOpen(false); toast.success("File uploaded successfully and queued for verification."); }}>Confirm Upload</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
