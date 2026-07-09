"use client";

import { useState } from "react";
import {
  FileText, Search, Eye, Clock, Tag, Star, BookOpen,
  Shield, Users, Code2, Briefcase, ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

// ── Mock Data ────────────────────────────────────────────────────────

const categories = [
  { id: "all", label: "All Articles", icon: BookOpen, count: 18 },
  { id: "hr", label: "HR Policies", icon: Users, count: 5 },
  { id: "security", label: "Security", icon: Shield, count: 4 },
  { id: "engineering", label: "Engineering Standards", icon: Code2, count: 6 },
  { id: "onboarding", label: "Onboarding", icon: Briefcase, count: 3 },
];

const articles = [
  {
    id: 1, title: "Employee Leave Policy 2026", category: "hr",
    excerpt: "Complete guide to leave types, eligibility, accrual rules, and the approval workflow for all employees.",
    author: "HR Team", updatedAt: "2026-06-15", views: 342,
    tags: ["leave", "policy", "hr"], featured: true,
  },
  {
    id: 2, title: "Code Review Best Practices", category: "engineering",
    excerpt: "Guidelines for conducting thorough and respectful code reviews, including PR size limits and review SLAs.",
    author: "Vijay S.", updatedAt: "2026-06-28", views: 289,
    tags: ["code-review", "git", "best-practices"], featured: true,
  },
  {
    id: 3, title: "Security Incident Response Playbook", category: "security",
    excerpt: "Step-by-step procedures for identifying, containing, and remediating security incidents across the platform.",
    author: "Security Team", updatedAt: "2026-05-20", views: 156,
    tags: ["security", "incident", "playbook"], featured: false,
  },
  {
    id: 4, title: "New Employee Onboarding Checklist", category: "onboarding",
    excerpt: "Day-by-day checklist for the first two weeks covering IT setup, tool access, team introductions, and compliance training.",
    author: "HR Team", updatedAt: "2026-07-01", views: 478,
    tags: ["onboarding", "checklist", "new-hire"], featured: true,
  },
  {
    id: 5, title: "API Design Standards (REST)", category: "engineering",
    excerpt: "Naming conventions, versioning strategy, error response formats, and pagination patterns for all REST APIs.",
    author: "Vijay S.", updatedAt: "2026-06-10", views: 215,
    tags: ["api", "rest", "standards"], featured: false,
  },
  {
    id: 6, title: "Work From Home Policy", category: "hr",
    excerpt: "Remote work eligibility, communication expectations, equipment policy, and hybrid schedule guidelines.",
    author: "HR Team", updatedAt: "2026-04-15", views: 530,
    tags: ["remote", "wfh", "policy"], featured: true,
  },
  {
    id: 7, title: "Git Branching Strategy", category: "engineering",
    excerpt: "Trunk-based development workflow with short-lived feature branches, release tagging, and hotfix procedures.",
    author: "Arjun M.", updatedAt: "2026-06-22", views: 198,
    tags: ["git", "branching", "workflow"], featured: false,
  },
  {
    id: 8, title: "Two-Factor Authentication Setup Guide", category: "security",
    excerpt: "How to configure TOTP-based MFA using Google Authenticator or Microsoft Authenticator for portal access.",
    author: "Security Team", updatedAt: "2026-05-30", views: 312,
    tags: ["mfa", "security", "setup"], featured: false,
  },
  {
    id: 9, title: "Database Naming Conventions", category: "engineering",
    excerpt: "MongoDB collection names, field naming patterns, index naming, and migration file conventions.",
    author: "Vijay S.", updatedAt: "2026-06-05", views: 145,
    tags: ["database", "mongodb", "conventions"], featured: false,
  },
];

const popularArticles = articles
  .sort((a, b) => b.views - a.views)
  .slice(0, 5);

// ── Component ────────────────────────────────────────────────────────

export default function KnowledgeBasePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter((a) => {
    const matchesCategory = selectedCategory === "all" || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Knowledge Base</h1>
        <p className="text-sm text-[var(--foreground-secondary)] mt-1">
          Company policies, standard operating procedures, and engineering guidelines.
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
        <Input
          placeholder="Search articles, topics, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-11 text-base"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr_280px] gap-6">
        {/* Left: Category Sidebar */}
        <nav className="flex xl:flex-col gap-1 overflow-x-auto xl:overflow-x-visible pb-2 xl:pb-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <Button
                key={cat.id}
                variant="ghost"
                className={cn(
                  "justify-start shrink-0 xl:shrink",
                  isActive
                    ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] font-medium"
                    : "text-[var(--foreground-secondary)]"
                )}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {cat.label}
                <span className="ml-auto text-xs text-[var(--foreground-muted)]">{cat.count}</span>
              </Button>
            );
          })}
        </nav>

        {/* Center: Article Grid */}
        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-8 h-8 text-[var(--foreground-muted)] mx-auto mb-3" />
              <p className="text-sm font-medium text-[var(--foreground)]">No articles found</p>
              <p className="text-xs text-[var(--foreground-secondary)] mt-1">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <Card key={article.id} className="hover:border-[var(--color-primary)] transition-colors cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {article.featured && (
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                        <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                          {article.title}
                        </h3>
                      </div>
                      <p className="text-xs text-[var(--foreground-secondary)] mt-1 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center gap-3 mt-3 text-[10px] text-[var(--foreground-muted)] flex-wrap">
                        <span>{article.author}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(article.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views} views
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)] shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Right: Popular Articles */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Most Viewed
          </h3>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border)]">
                {popularArticles.map((article, i) => (
                  <div key={article.id} className="flex items-center gap-3 p-3 hover:bg-[var(--background-secondary)] transition-colors cursor-pointer">
                    <span className="text-xs font-bold text-[var(--foreground-muted)] w-5 text-center shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[var(--foreground)] truncate">{article.title}</p>
                      <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views} views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
