"use client";

import { useState } from "react";
import { Search, Book, FileText, Folder, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const DOCS = [
  { id: 1, title: "Platform Architecture", type: "folder", items: 12, updated: "2d ago" },
  { id: 2, title: "API Guidelines v2", type: "document", author: "Vijay S.", updated: "1w ago" },
  { id: 3, title: "Onboarding Guide", type: "document", author: "HR Team", updated: "3d ago" },
  { id: 4, title: "Security Protocols", type: "folder", items: 5, updated: "1mo ago" },
];

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Documentation</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Internal wiki, architecture docs, and team guidelines.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>

      <div className="relative w-full max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
        <Input 
          placeholder="Search documentation..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-11 text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DOCS.map(doc => (
          <Card key={doc.id} className="hover:border-[var(--color-primary)] transition-colors cursor-pointer group">
            <CardContent className="p-5 flex flex-col items-center text-center h-full">
              <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-3 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                {doc.type === "folder" ? <Folder className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
              </div>
              <h3 className="font-semibold text-[var(--foreground)] mb-1">{doc.title}</h3>
              <p className="text-xs text-[var(--foreground-secondary)] mt-auto">
                {doc.type === "folder" ? `${doc.items} items` : `By ${doc.author}`} · Updated {doc.updated}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
