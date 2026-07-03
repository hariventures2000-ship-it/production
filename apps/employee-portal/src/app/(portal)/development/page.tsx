"use client";

import { useState } from "react";
import { 
  GitBranch, GitPullRequest, GitCommit, Search, 
  Settings, Clock, Activity, AlertCircle, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/cn";

const MOCK_REPOS = [
  { id: 1, name: "mervi-platform", desc: "Core platform microservices", lang: "TypeScript", stars: 12, forks: 4, updated: "2h ago", status: "success" },
  { id: 2, name: "client-portal", desc: "Next.js frontend for clients", lang: "TypeScript", stars: 8, forks: 2, updated: "5h ago", status: "success" },
  { id: 3, name: "auth-service", desc: "Authentication and SSO", lang: "Go", stars: 24, forks: 6, updated: "1d ago", status: "warning" },
  { id: 4, name: "analytics-engine", desc: "Real-time data pipeline", lang: "Rust", stars: 15, forks: 3, updated: "2d ago", status: "error" },
];

export default function DevHubPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRepos = MOCK_REPOS.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Development Hub</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Overview of repositories, PRs, and CI/CD pipelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/development/pull-requests">
              <GitPullRequest className="w-4 h-4 mr-2" />
              My PRs
            </Link>
          </Button>
          <Button>
            <GitBranch className="w-4 h-4 mr-2" />
            New Repository
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">42</p>
              <p className="text-sm text-[var(--foreground-secondary)]">Active Repositories</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <GitPullRequest className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">14</p>
              <p className="text-sm text-[var(--foreground-secondary)]">Open Pull Requests</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">98%</p>
              <p className="text-sm text-[var(--foreground-secondary)]">Build Success Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
          <Input 
            placeholder="Find a repository..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRepos.map(repo => (
          <Card key={repo.id} className="hover:border-[var(--color-primary)] transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-[var(--foreground-muted)]" />
                    <Link href={`/development/repositories/${repo.name}`} className="hover:underline">
                      hariventures/{repo.name}
                    </Link>
                    <Badge variant="outline" className="ml-2 font-normal">Internal</Badge>
                  </CardTitle>
                  <p className="text-sm text-[var(--foreground-secondary)] mt-1">{repo.desc}</p>
                </div>
                {repo.status === "success" && <div className="w-2 h-2 rounded-full bg-emerald-500" title="Build Passing" />}
                {repo.status === "warning" && <div className="w-2 h-2 rounded-full bg-amber-500" title="Build Unstable" />}
                {repo.status === "error" && <div className="w-2 h-2 rounded-full bg-red-500" title="Build Failing" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    repo.lang === "TypeScript" ? "bg-blue-500" :
                    repo.lang === "Go" ? "bg-cyan-500" : "bg-orange-500"
                  )} />
                  {repo.lang}
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> {repo.stars}
                </div>
                <div className="flex items-center gap-1">
                  <GitPullRequest className="w-3.5 h-3.5" /> {repo.forks}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Updated {repo.updated}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
