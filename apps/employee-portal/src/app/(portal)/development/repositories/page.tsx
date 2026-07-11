// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Development Repositories Page
// Implemented with Rich Detail Drawers, Commits, PRs, and Activity Timelines
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState, useMemo } from "react";
import { 
  GitBranch, GitPullRequest, GitCommit, Search, Filter, 
  Copy, Check, Clock, User, BarChart2, Eye, Shield, Cpu,
  ExternalLink, Code, Layers, AlertCircle, CheckCircle2, ChevronRight, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

// ── Mock Data for Repositories ─────────────────────────────────────

const MOCK_REPOS_FULL = [
  {
    id: "repo-1",
    name: "mervi-platform",
    description: "Core platform microservices containing authorization, orchestrator, and event routing systems.",
    lang: "TypeScript",
    langPercent: 78,
    secondaryLang: "Go",
    secondaryLangPercent: 22,
    size: "1.4 GB",
    stars: 12,
    forks: 4,
    updated: "2 hours ago",
    status: "success",
    defaultBranch: "main",
    protectedBranches: ["main", "release/*"],
    gitProvider: "GitHub",
    visibility: "Internal",
    cloneUrl: "git@github.com:hariventures/mervi-platform.git",
    contributors: [
      { name: "Vijay S.", avatar: "VS", role: "Lead" },
      { name: "Arjun M.", avatar: "AM", role: "DevOps" },
      { name: "Priya K.", avatar: "PK", role: "UI/UX" }
    ],
    commits: [
      { hash: "7a1b3c4", author: "Arjun M.", message: "feat(ci): configure automated cypress test suite in staging pipeline", date: "2 hours ago" },
      { hash: "c2d3e4f", author: "Vijay S.", message: "fix(auth): rotate JWT signing keys smoothly on server startup", date: "5 hours ago" },
      { hash: "9e8d7c6", author: "Sneha P.", message: "refactor(core): optimized database indexes for workspace collections", date: "1 day ago" }
    ],
    prs: [
      { number: 248, title: "feat: add multi-tenant rate limiter using redis", status: "open", author: "Vijay S.", date: "1 day ago" },
      { number: 247, title: "fix: client portal dashboard crash on browser resize", status: "merged", author: "Priya K.", date: "2 days ago" }
    ],
    timeline: [
      { date: "Jul 11, 2026", event: "Automated backup cron job executed successfully" },
      { date: "Jul 10, 2026", event: "Production release v2.4.0 deployed by CI/CD" },
      { date: "Jul 08, 2026", event: "Branch main locked for sprint planning review" }
    ]
  },
  {
    id: "repo-2",
    name: "client-portal",
    description: "Responsive Next.js application designed for client dashboard workspace and real-time project metrics.",
    lang: "TypeScript",
    langPercent: 92,
    secondaryLang: "CSS",
    secondaryLangPercent: 8,
    size: "820 MB",
    stars: 8,
    forks: 2,
    updated: "5 hours ago",
    status: "success",
    defaultBranch: "main",
    protectedBranches: ["main"],
    gitProvider: "GitHub",
    visibility: "Internal",
    cloneUrl: "git@github.com:hariventures/client-portal.git",
    contributors: [
      { name: "Priya K.", avatar: "PK", role: "UI/UX" },
      { name: "Vijay S.", avatar: "VS", role: "Lead" }
    ],
    commits: [
      { hash: "1d2e3f4", author: "Priya K.", message: "style: upgrade custom charts to use consistent design shadows", date: "5 hours ago" },
      { hash: "9a8b7c6", author: "Vijay S.", message: "docs: update API endpoints config checklist for staging", date: "1 day ago" }
    ],
    prs: [
      { number: 104, title: "refactor: convert filters to useEnterpriseFilter hook", status: "open", author: "Vijay S.", date: "3 days ago" }
    ],
    timeline: [
      { date: "Jul 11, 2026", event: "Webpack bundle size audit optimization executed" },
      { date: "Jul 09, 2026", event: "Merged main branch sync" }
    ]
  },
  {
    id: "repo-3",
    name: "auth-service",
    description: "OAuth2 authentication server delivering single sign-on capabilities across Mervi workspaces.",
    lang: "Go",
    langPercent: 95,
    secondaryLang: "Shell",
    secondaryLangPercent: 5,
    size: "180 MB",
    stars: 24,
    forks: 6,
    updated: "1 day ago",
    status: "warning",
    defaultBranch: "main",
    protectedBranches: ["main", "prod-sync"],
    gitProvider: "GitLab",
    visibility: "Private",
    cloneUrl: "git@gitlab.com:hariventures/auth-service.git",
    contributors: [
      { name: "Arjun M.", avatar: "AM", role: "DevOps" },
      { name: "Vijay S.", avatar: "VS", role: "Lead" }
    ],
    commits: [
      { hash: "f3e2d1c", author: "Arjun M.", message: "fix: resolve memory leak in session validation middleware", date: "1 day ago" },
      { hash: "b5a49c3", author: "Vijay S.", message: "feat: enforce MFA requirement for administrator logins", date: "3 days ago" }
    ],
    prs: [
      { number: 42, title: "security: support WebAuthn keys and biometric authentication", status: "open", author: "Arjun M.", date: "2 days ago" }
    ],
    timeline: [
      { date: "Jul 10, 2026", event: "Security scan reported 0 high vulnerability issues" }
    ]
  },
  {
    id: "repo-4",
    name: "analytics-engine",
    description: "Real-time streaming pipeline processing platform interaction data to produce analytics charts.",
    lang: "Rust",
    langPercent: 88,
    secondaryLang: "Python",
    secondaryLangPercent: 12,
    size: "2.1 GB",
    stars: 15,
    forks: 3,
    updated: "2 days ago",
    status: "error",
    defaultBranch: "develop",
    protectedBranches: ["main", "develop"],
    gitProvider: "Azure DevOps",
    visibility: "Private",
    cloneUrl: "git@ssh.dev.azure.com:hariventures/analytics-engine.git",
    contributors: [
      { name: "Sneha P.", avatar: "SP", role: "Dev" },
      { name: "Arjun M.", avatar: "AM", role: "DevOps" }
    ],
    commits: [
      { hash: "e9d8c7b", author: "Sneha P.", message: "fix: catch socket connection failure on message consumer startup", date: "2 days ago" }
    ],
    prs: [
      { number: 89, title: "fix: memory leak in Kafka partition rebalance listener", status: "draft", author: "Sneha P.", date: "4 days ago" }
    ],
    timeline: [
      { date: "Jul 09, 2026", event: "Kafka event broker reconnection failure detected" }
    ]
  }
];

export default function RepositoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Filters
  const filteredRepos = useMemo(() => {
    return MOCK_REPOS_FULL.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            repo.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLang = languageFilter === "all" || repo.lang.toLowerCase() === languageFilter.toLowerCase();
      const matchesStatus = statusFilter === "all" || repo.status === statusFilter;
      return matchesSearch && matchesLang && matchesStatus;
    });
  }, [searchQuery, languageFilter, statusFilter]);

  const selectedRepo = useMemo(() => {
    return MOCK_REPOS_FULL.find(r => r.id === selectedRepoId) || null;
  }, [selectedRepoId]);

  const handleCopyCloneUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Clone URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Repository Center</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Browse corporate source repositories, branches history, contributor activities, and build health.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => toast.info("Contact workspace administrator to register new Git repositories.")}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Repository
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--foreground)]">{MOCK_REPOS_FULL.length}</p>
              <p className="text-xs text-[var(--foreground-muted)]">Tracked Repositories</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--foreground)]">2 Healthy</p>
              <p className="text-xs text-[var(--foreground-muted)]">Build Integrity</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--foreground)]">1 Unstable</p>
              <p className="text-xs text-[var(--foreground-muted)]">Needs Dev Attention</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--foreground)]">1 Failing</p>
              <p className="text-xs text-[var(--foreground-muted)]">Failing Pipeline Release</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[var(--card-bg)] p-4 rounded-xl border border-[var(--border)] shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
          <Input 
            placeholder="Search repositories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
          <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-secondary)] font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>
          <select 
            className="h-9 px-3 text-xs bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-[var(--foreground)]"
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            <option value="all">All Languages</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
          <select 
            className="h-9 px-3 text-xs bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-[var(--foreground)]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Healths</option>
            <option value="success">Healthy (Success)</option>
            <option value="warning">Unstable (Warning)</option>
            <option value="error">Failing (Error)</option>
          </select>
        </div>
      </div>

      {/* Repository Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRepos.map((repo) => (
          <Card 
            key={repo.id} 
            className="hover:border-[var(--color-primary)] transition-all duration-200 cursor-pointer shadow-xs group"
            onClick={() => setSelectedRepoId(repo.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2 text-[var(--foreground)] font-bold group-hover:text-[var(--color-primary)] transition-colors">
                    <GitBranch className="w-4 h-4 text-[var(--foreground-muted)]" />
                    <span>hariventures/{repo.name}</span>
                    <Badge variant="outline" className="text-[9px] font-semibold h-5 bg-[var(--background-secondary)] border-[var(--border)]">{repo.visibility}</Badge>
                  </CardTitle>
                  <p className="text-xs text-[var(--foreground-secondary)] mt-1.5 leading-relaxed line-clamp-2">
                    {repo.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--foreground-muted)] font-medium">{repo.gitProvider}</span>
                  <div className={cn(
                    "w-2 h-2 rounded-full shadow-xs",
                    repo.status === "success" ? "bg-emerald-500 animate-pulse" :
                    repo.status === "warning" ? "bg-amber-500 animate-pulse" : "bg-red-500 animate-pulse"
                  )} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-[var(--border)] text-xs text-[var(--foreground-muted)]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      repo.lang === "TypeScript" ? "bg-blue-500" :
                      repo.lang === "Go" ? "bg-cyan-500" : "bg-orange-500"
                    )} />
                    <span className="font-semibold text-[var(--foreground)]">{repo.lang}</span>
                    <span className="text-[10px]">({repo.langPercent}%)</span>
                  </div>
                  <span>·</span>
                  <span>{repo.size}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-0.5"><Eye className="w-3.5 h-3.5 mr-0.5" />{repo.stars}</span>
                  <span className="flex items-center gap-0.5"><GitPullRequest className="w-3.5 h-3.5 mr-0.5" />{repo.forks}</span>
                  <span>Updated {repo.updated}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRepos.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-[var(--border)] rounded-xl bg-[var(--card-bg)]">
            <GitBranch className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4" />
            <h3 className="text-base font-bold text-[var(--foreground)]">No Repositories Found</h3>
            <p className="text-xs text-[var(--foreground-secondary)] mt-1.5 max-w-sm mx-auto">
              We couldn't find any repositories matching your search query or filters. Check your spelling or reset the filters.
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSearchQuery(""); setLanguageFilter("all"); setStatusFilter("all"); }}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Slide-out Repository Details Drawer */}
      <Sheet open={selectedRepoId !== null} onOpenChange={(open) => { if (!open) setSelectedRepoId(null); }}>
        <SheetContent className="sm:max-w-[620px] p-0 flex flex-col h-full bg-[var(--card-bg)] border-l border-[var(--border)] shadow-2xl">
          {selectedRepo && (
            <>
              {/* Drawer Header */}
              <div className="p-6 border-b border-[var(--border)] bg-[var(--background-secondary)]/50 flex items-start justify-between shrink-0">
                <div className="space-y-1.5 pr-8">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-none">
                      {selectedRepo.visibility}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-none">
                      {selectedRepo.gitProvider}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border-none">
                      Default: {selectedRepo.defaultBranch}
                    </Badge>
                  </div>
                  <SheetTitle className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2 mt-2">
                    <GitBranch className="w-5 h-5 text-[var(--foreground-muted)]" />
                    hariventures/{selectedRepo.name}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-[var(--foreground-secondary)] leading-relaxed mt-1">
                    {selectedRepo.description}
                  </SheetDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  onClick={() => setSelectedRepoId(null)}
                  className="rounded-full text-[var(--foreground-muted)] hover:text-[var(--foreground)] shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Drawer Content Area (Tabs) */}
              <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
                <div className="px-6 border-b border-[var(--border)] bg-[var(--background-secondary)]/30 shrink-0">
                  <TabsList className="flex gap-2 justify-start h-11 bg-transparent p-0 border-b-0">
                    <TabsTrigger value="overview" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Overview</TabsTrigger>
                    <TabsTrigger value="commits" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Commits</TabsTrigger>
                    <TabsTrigger value="prs" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Pull Requests</TabsTrigger>
                    <TabsTrigger value="timeline" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Timeline</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                  {/* OVERVIEW TAB */}
                  <TabsContent value="overview" className="space-y-6 m-0 focus:outline-none">
                    {/* Clone URL Box */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">Clone Repository</h4>
                      <div className="flex items-center bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg p-2 gap-2">
                        <code className="text-xs font-mono text-[var(--foreground-secondary)] flex-1 truncate select-all">{selectedRepo.cloneUrl}</code>
                        <Button 
                          variant="ghost" 
                          size="icon-sm"
                          onClick={() => handleCopyCloneUrl(selectedRepo.cloneUrl)}
                          className="h-8 w-8 text-[var(--foreground-muted)] hover:text-[var(--foreground)] shrink-0"
                          title="Copy SSH URL"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                    </div>

                    {/* Metadata list */}
                    <div className="grid grid-cols-2 gap-4 bg-[var(--background-secondary)]/50 p-4 border border-[var(--border)] rounded-xl">
                      <div>
                        <p className="text-[10px] text-[var(--foreground-muted)] font-semibold uppercase">Protected Branches</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {selectedRepo.protectedBranches.map(b => (
                            <Badge key={b} variant="secondary" className="text-[9px] h-5 bg-amber-500/10 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-none font-mono">
                              <Shield className="w-2.5 h-2.5 mr-1" />{b}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--foreground-muted)] font-semibold uppercase">Total Size</p>
                        <p className="text-sm font-semibold text-[var(--foreground)] mt-1">{selectedRepo.size}</p>
                      </div>
                    </div>

                    {/* Language composition */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">Language Composition</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[var(--foreground)]">{selectedRepo.lang}</span>
                          <span className="text-[var(--foreground-muted)]">{selectedRepo.langPercent}%</span>
                        </div>
                        <Progress value={selectedRepo.langPercent} className="h-1.5" />
                        
                        {selectedRepo.secondaryLang && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-[var(--foreground)]">{selectedRepo.secondaryLang}</span>
                              <span className="text-[var(--foreground-muted)]">{selectedRepo.secondaryLangPercent}%</span>
                            </div>
                            <Progress value={selectedRepo.secondaryLangPercent} className="h-1.5 bg-slate-100" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contributors */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">Top Contributors</h4>
                      <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card-bg)] shadow-xs">
                        {selectedRepo.contributors.map(c => (
                          <div key={c.name} className="flex items-center gap-3 p-3 hover:bg-[var(--background-secondary)]/50 transition-colors">
                            <Avatar className="w-8 h-8 shrink-0">
                              <AvatarFallback className="text-[10px] font-bold bg-[var(--color-primary)] text-white">{c.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[var(--foreground)]">{c.name}</p>
                              <p className="text-[10px] text-[var(--foreground-muted)]">Role: {c.role}</p>
                            </div>
                            <Badge variant="secondary" className="text-[9px] h-4">Active</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* COMMITS TAB */}
                  <TabsContent value="commits" className="space-y-4 m-0 focus:outline-none">
                    <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">Recent Commits</h4>
                    <div className="space-y-3">
                      {selectedRepo.commits.map((commit, idx) => (
                        <div key={idx} className="p-3.5 border border-[var(--border)] bg-[var(--card-bg)] rounded-xl hover:border-[var(--color-primary)] transition-all shadow-xs flex items-start gap-3">
                          <GitCommit className="w-4 h-4 text-[var(--foreground-muted)] mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[var(--foreground)] leading-relaxed">{commit.message}</p>
                            <div className="flex items-center gap-2 mt-2 text-[10px] text-[var(--foreground-muted)]">
                              <span className="font-semibold text-[var(--foreground-secondary)]">{commit.author}</span>
                              <span>·</span>
                              <span>{commit.date}</span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-[9px] font-mono shrink-0 font-bold px-1.5 h-5 bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)]">
                            {commit.hash}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* PULL REQUESTS TAB */}
                  <TabsContent value="prs" className="space-y-4 m-0 focus:outline-none">
                    <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">Pull Requests</h4>
                    <div className="space-y-3">
                      {selectedRepo.prs.map((pr, idx) => (
                        <div key={idx} className="p-3.5 border border-[var(--border)] bg-[var(--card-bg)] rounded-xl hover:border-[var(--color-primary)] transition-all shadow-xs flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] text-[var(--foreground-muted)] font-mono">#{pr.number}</span>
                              <span className="text-xs font-semibold text-[var(--foreground)] line-clamp-1">{pr.title}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-[10px] text-[var(--foreground-muted)]">
                              <span>By {pr.author}</span>
                              <span>·</span>
                              <span>Opened {pr.date}</span>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-[9px] font-semibold capitalize shrink-0 h-5 border-none",
                              pr.status === "merged" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" :
                              pr.status === "draft" ? "bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400" :
                              "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                            )}
                          >
                            {pr.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* TIMELINE TAB */}
                  <TabsContent value="timeline" className="space-y-4 m-0 focus:outline-none">
                    <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">Activity Timeline</h4>
                    <div className="relative border-l border-[var(--border)] pl-4 ml-2 space-y-6 pt-2">
                      {selectedRepo.timeline.map((event, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] border-2 border-[var(--card-bg)] shadow-xs" />
                          <p className="text-[10px] text-[var(--foreground-muted)] font-semibold">{event.date}</p>
                          <p className="text-xs text-[var(--foreground-secondary)] mt-0.5 leading-relaxed">{event.event}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ── Simple Helper PlusIcon ─────────────────────────────────────────

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
