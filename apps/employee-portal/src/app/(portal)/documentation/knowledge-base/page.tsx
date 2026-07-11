// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Knowledge Base Page
// Refined with Author/Tag Filters, Pagination, Skeletons, Error Retry, and Empty States
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect } from "react";
import {
  FileText, Search, Eye, Clock, Tag, Star, BookOpen,
  Shield, Users, Code2, Briefcase, ChevronRight,
  AlertTriangle, RefreshCcw, User, Calendar, Plus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/cn";
import { Pagination } from "@/components/ui/pagination";
import { useEnterpriseFilter } from "@/hooks/use-enterprise-filter";
import { useFilterStore } from "@/store/filter.store";
import { EnterpriseFilterBar } from "@/components/ui/enterprise-filter-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { FilterFieldConfig } from "@/types/filter.types";

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

const popularArticles = [...articles]
  .sort((a, b) => b.views - a.views)
  .slice(0, 5);

// ── Skeletons ──────────────────────────────────────────────────────
function ArticlesSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5 space-y-3">
          <div className="h-4 bg-[var(--background-secondary)] rounded w-2/5" />
          <div className="h-3 bg-[var(--background-secondary)] rounded w-full" />
          <div className="h-3 bg-[var(--background-secondary)] rounded w-4/5" />
          <div className="flex gap-2 mt-2">
            <div className="h-3.5 bg-[var(--background-secondary)] rounded w-12" />
            <div className="h-3.5 bg-[var(--background-secondary)] rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Error View ─────────────────────────────────────────────────────
function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="p-8 text-center border border-[var(--border)] rounded-xl bg-[var(--card-bg)] flex flex-col items-center justify-center max-w-md mx-auto my-12 shadow-sm">
      <AlertTriangle className="w-12 h-12 text-[var(--color-danger)] mb-4 animate-bounce" />
      <h3 className="text-lg font-bold text-[var(--foreground)]">Wiki Service Offline</h3>
      <p className="text-sm text-[var(--foreground-secondary)] mt-2 mb-6">{message}</p>
      <div className="flex gap-2">
        <Button onClick={onRetry} variant="default" className="h-9 px-4">
          <RefreshCcw className="w-4 h-4 mr-2" /> Retry Connection
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline" className="h-9 px-4">
          Refresh Page
        </Button>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────
function EmptyState({ onAction, onSecondaryAction }: { onAction: () => void, onSecondaryAction: () => void }) {
  return (
    <div className="p-12 text-center border border-dashed border-[var(--border)] rounded-xl bg-[var(--card-bg)] flex flex-col items-center justify-center">
      <FileText className="w-12 h-12 text-[var(--foreground-muted)] mb-4" />
      <h3 className="text-lg font-bold text-[var(--foreground)]">No Articles Found</h3>
      <p className="text-sm text-[var(--foreground-secondary)] mt-2 max-w-sm mb-6">
        No wiki pages or guidelines match your filter query. Create a new article to get started.
      </p>
      <div className="flex gap-2">
        <Button onClick={onAction}><Plus className="w-4 h-4 mr-2" /> Create New Article</Button>
        <Button onClick={onSecondaryAction} variant="outline">Reset Filters</Button>
      </div>
    </div>
  );
}

export default function KnowledgeBasePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (Math.random() < 0.05) {
        setError("Failed to fetch markdown assets from database RAG storage cluster.");
      }
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    loadData();
  }, []);

  const fieldsConfig: FilterFieldConfig[] = [
    { key: "category", label: "Category", type: "select", options: [
      { value: "all", label: "All Categories" },
      { value: "hr", label: "HR Policies" },
      { value: "security", label: "Security" },
      { value: "engineering", label: "Engineering Standards" },
      { value: "onboarding", label: "Onboarding" },
    ]},
    { key: "author", label: "Author", type: "select", options: [
      { value: "all", label: "All Authors" },
      { value: "HR Team", label: "HR Team" },
      { value: "Vijay S.", label: "Vijay S." },
      { value: "Security Team", label: "Security Team" },
      { value: "Arjun M.", label: "Arjun M." },
    ]},
    { key: "tags", label: "Tag", type: "select", options: [
      { value: "all", label: "All Tags" },
      { value: "leave", label: "leave" },
      { value: "policy", label: "policy" },
      { value: "hr", label: "hr" },
      { value: "security", label: "security" },
      { value: "code-review", label: "code-review" },
      { value: "git", label: "git" },
      { value: "onboarding", label: "onboarding" },
    ]}
  ];

  const {
    state,
    filteredData,
    paginatedData,
    totalItems,
    setSearch,
    setFilter,
    removeFilter,
    clearAll,
    setSort,
    saveView,
    applyView,
  } = useEnterpriseFilter({
    moduleId: "knowledge-base",
    defaultState: {
      search: "",
      filters: {},
      sort: null,
      visibleColumns: {},
      currentPage: 1,
      itemsPerPage: 6,
    },
    data: articles,
    searchFields: ["title", "excerpt", "tags"],
  });

  const activeCategory = (state.filters.category as any)?.value || "all";
  const handleSelectCategory = (catId: string) => {
    if (catId === "all") removeFilter("category");
    else setFilter("category", { type: "select", value: catId });
  };

  const handlePageChange = (page: number) => {
    useFilterStore.getState().updateState("knowledge-base", { currentPage: page });
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-12 w-48 bg-[var(--background-secondary)] rounded animate-pulse" />
        <ArticlesSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Knowledge Base</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Company policies, standard operating procedures, and engineering guidelines.
          </p>
        </div>
        <Button onClick={() => alert("Creating documentation thread is available via text editor integration.")}>
          <Plus className="w-4 h-4 mr-2" /> New Document
        </Button>
      </div>

      {/* Enterprise Filter Bar */}
      <EnterpriseFilterBar
        moduleId="knowledge-base"
        fieldsConfig={fieldsConfig}
        state={state}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onRemoveFilter={removeFilter}
        onClearAll={clearAll}
        onApplyView={applyView}
        onSaveView={saveView}
        sortOptions={[
          { value: "views", label: "Most Viewed" },
          { value: "title", label: "Alphabetical" },
          { value: "updatedAt", label: "Recent Updates" },
        ]}
        onSortSelect={setSort}
        filteredData={filteredData}
      >
        <FilterDropdown
          label="Author"
          value={(state.filters.author as any)?.value || "all"}
          options={fieldsConfig[1].options || []}
          onChange={(val) => setFilter("author", { type: "select", value: val })}
        />
        <FilterDropdown
          label="Tag"
          value={(state.filters.tags as any)?.value || "all"}
          options={fieldsConfig[2].options || []}
          onChange={(val) => setFilter("tags", { type: "select", value: val })}
        />
      </EnterpriseFilterBar>

      <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr_280px] gap-6">
        {/* Left: Category Sidebar */}
        <nav className="flex xl:flex-col gap-1 overflow-x-auto xl:overflow-x-visible pb-2 xl:pb-0 shrink-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <Button
                key={cat.id}
                variant="ghost"
                className={cn(
                  "justify-start shrink-0 xl:shrink text-xs h-9",
                  isActive
                    ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] font-semibold"
                    : "text-[var(--foreground-secondary)]"
                )}
                onClick={() => handleSelectCategory(cat.id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {cat.label}
                <span className="ml-auto text-[10px] text-[var(--foreground-muted)]">{cat.count}</span>
              </Button>
            );
          })}
        </nav>

        {/* Center: Article Grid */}
        <div className="space-y-4">
          <div className="space-y-4">
            {paginatedData.map((article) => (
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
                      <p className="text-xs text-[var(--foreground-secondary)] mt-1 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                      <div className="flex items-center gap-3 mt-3 text-[10px] text-[var(--foreground-muted)] flex-wrap">
                        <span>By {article.author}</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(article.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {article.views} views
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0 font-normal">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)] shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            ))}

            {paginatedData.length === 0 && (
              <EmptyState onAction={() => alert("Creating documentation thread...")} onSecondaryAction={clearAll} />
            )}
          </div>

          <Pagination
            currentPage={state.currentPage}
            totalItems={totalItems}
            itemsPerPage={state.itemsPerPage}
            onPageChange={handlePageChange}
            itemName="articles"
          />
        </div>

        {/* Right: Popular Articles */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2 uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Most Viewed
          </h3>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border)]">
                {popularArticles.map((article, i) => (
                  <div key={article.id} className="flex items-center gap-3 p-3 hover:bg-[var(--background-secondary)] transition-colors cursor-pointer">
                    <span className="text-xs font-bold text-[var(--foreground-muted)] w-5 text-center shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--foreground)] truncate">{article.title}</p>
                      <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
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
