// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Documentation Hub Page
// Redesigned with Markdown Editor, Templates, Revision logs, Approvals & Comments
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState, useMemo } from "react";
import { 
  Search, FileText, Folder, Plus, Edit3, History, CheckSquare, 
  MessageSquare, FileCode, Check, Trash2, X, Send, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

// ── Mock Data for Wiki & Docs ──────────────────────────────────────

const MOCK_DOCS = [
  { id: "doc-1", title: "Platform Architecture wiki", type: "document", author: "Vijay S.", updated: "2d ago", body: "# Platform Architecture\n\nEvent-driven microservices deploying through Docker registries into Kubernetes staging/prod namespaces.\n\n## Data Flow\n- API Gateway intercepts incoming routes.\n- Broadcaster fires Kafka events.", approvals: ["Vijay S. (Approved)", "Arjun M. (Pending)"], comments: [{ author: "Arjun M.", text: "Can we clarify the backoff strategy on Kafka retry?", date: "1d ago" }], versions: [{ version: "v1.1.0", user: "Vijay S.", date: "2d ago" }, { version: "v1.0.0", user: "Vijay S.", date: "1w ago" }] },
  { id: "doc-2", title: "API Guidelines v2", type: "document", author: "Vijay S.", updated: "1w ago", body: "# API REST Guidelines\n\nStandard guidelines for HTTP endpoints.\n\n- Enforce camelCase json structures.\n- Return strict HTTP 400 Bad Request validations.", approvals: ["Vijay S. (Approved)"], comments: [], versions: [{ version: "v2.0.0", user: "Vijay S.", date: "1w ago" }] },
  { id: "doc-3", title: "Employee Onboarding SOP", type: "document", author: "HR Team", updated: "3d ago", body: "# HR Onboarding Checklist\n\nInstructions for setting up employee credentials.\n\n- Setup corporate LDAP email.\n- Allocate MacBook asset serials.", approvals: ["HR Manager (Approved)"], comments: [], versions: [{ version: "v1.0.0", user: "HR Team", date: "3d ago" }] }
];

const TEMPLATES = [
  { id: "t-1", name: "API Endpoint Spec", body: "# API Specification: [Endpoint]\n\n## Overview\n[Describe what this endpoint performs]\n\n## Request\n- Method: `GET` / `POST`\n- Headers: `Authorization: Bearer <JWT>`\n\n## Response\n`200 OK` JSON." },
  { id: "t-2", name: "Incident Postmortem", body: "# Incident Postmortem: [Date]\n\n## Severity\n[Critical / High / Medium]\n\n## Timeline\n- [Timestamp]: Breach/crash detected.\n- [Timestamp]: Rollback script executed." }
];

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  
  // Document Workspace State
  const [docList, setDocList] = useState(MOCK_DOCS);
  const [editorText, setEditorText] = useState("");
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("editor");

  // Threaded Comment Input State
  const [commentInput, setCommentInput] = useState("");

  const filteredDocs = useMemo(() => {
    return docList.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, docList]);

  const selectedDoc = useMemo(() => {
    return docList.find(d => d.id === selectedDocId) || null;
  }, [selectedDocId, docList]);

  const handleSelectDoc = (doc: typeof MOCK_DOCS[0]) => {
    setSelectedDocId(doc.id);
    setEditorText(doc.body);
  };

  const handleSaveDocument = () => {
    if (!selectedDocId) return;
    setDocList(prev => prev.map(d => {
      if (d.id === selectedDocId) {
        toast.success(`Saved changes for ${d.title}`);
        // Create new version log
        const nextVersion = `v1.${d.versions.length}.0`;
        return {
          ...d,
          body: editorText,
          updated: "Just now",
          versions: [{ version: nextVersion, user: "Sneha P.", date: "Just now" }, ...d.versions]
        };
      }
      return d;
    }));
  };

  const handleLoadTemplate = (templateBody: string) => {
    setEditorText(templateBody);
    toast.success("Loaded template markdown outline in editor!");
  };

  const handlePostComment = () => {
    if (!commentInput.trim() || !selectedDocId) return;
    setDocList(prev => prev.map(d => {
      if (d.id === selectedDocId) {
        return {
          ...d,
          comments: [...d.comments, { author: "Sneha P.", text: commentInput, date: "Just now" }]
        };
      }
      return d;
    }));
    setCommentInput("");
    toast.success("Comment posted successfully!");
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Documentation</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Browse internal wikis, operational templates, design decisions, and document approvals.
          </p>
        </div>
        <Button onClick={() => {
          const newDocId = `doc-${docList.length + 1}`;
          const newDoc = {
            id: newDocId,
            title: `Untitled Document ${docList.length + 1}`,
            type: "document",
            author: "Sneha P.",
            updated: "Just now",
            body: "# New Wiki Document\n\nStart writing markdown content here...",
            approvals: [],
            comments: [],
            versions: [{ version: "v1.0.0", user: "Sneha P.", date: "Just now" }]
          };
          setDocList([...docList, newDoc]);
          setSelectedDocId(newDocId);
          setEditorText(newDoc.body);
          toast.success("Created new untitled document!");
        }}>
          <Plus className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Search filter */}
      <div className="relative w-full max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
        <Input 
          placeholder="Search documentation..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-11 text-sm bg-[var(--card-bg)] border-[var(--border)]"
        />
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map(doc => (
          <Card 
            key={doc.id} 
            className="hover:border-[var(--color-primary)] transition-all duration-200 cursor-pointer group shadow-xs"
            onClick={() => handleSelectDoc(doc)}
          >
            <CardContent className="p-5 flex flex-col h-full justify-between min-h-[140px]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--background-secondary)] flex items-center justify-center mb-3 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors shrink-0 text-[var(--foreground-secondary)]">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors truncate">{doc.title}</h3>
                  <p className="text-[10px] text-[var(--foreground-muted)] mt-1">Author: {doc.author} · Revisions: {doc.versions.length}</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-[var(--foreground-muted)] border-t border-[var(--border)] pt-2.5 mt-4">
                <span>Updated {doc.updated}</span>
                {doc.approvals.length > 0 && (
                  <Badge variant="outline" className="text-[9px] h-4 bg-emerald-50 border-none text-emerald-700">Approved</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Slide-out Document Editor Workspace (Drawer) */}
      <Sheet open={selectedDocId !== null} onOpenChange={(open) => { if (!open) setSelectedDocId(null); }}>
        <SheetContent className="sm:max-w-[680px] p-0 flex flex-col h-full bg-[var(--card-bg)] border-l border-[var(--border)] shadow-2xl">
          {selectedDoc && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-[var(--border)] bg-[var(--background-secondary)]/50 flex items-start justify-between shrink-0">
                <div className="space-y-1.5 pr-8 text-xs">
                  <Badge variant="outline" className="text-[9px] border-none font-semibold uppercase bg-blue-50 text-blue-700">
                    {selectedDoc.versions[0]?.version || "Draft"}
                  </Badge>
                  <SheetTitle className="text-xl font-bold text-[var(--foreground)] mt-2">
                    {selectedDoc.title}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-[var(--foreground-secondary)] mt-1">
                    Last modified {selectedDoc.updated} · Created by {selectedDoc.author}
                  </SheetDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  onClick={() => setSelectedDocId(null)}
                  className="rounded-full text-[var(--foreground-muted)] hover:text-[var(--foreground)] shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Workspace Tabs */}
              <Tabs defaultValue="editor" className="flex-1 flex flex-col min-h-0">
                <div className="px-6 border-b border-[var(--border)] bg-[var(--background-secondary)]/30 shrink-0">
                  <TabsList className="flex gap-2 justify-start h-11 bg-transparent p-0 border-b-0">
                    <TabsTrigger value="editor" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Markdown Editor</TabsTrigger>
                    <TabsTrigger value="templates" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Templates</TabsTrigger>
                    <TabsTrigger value="versions" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Revisions</TabsTrigger>
                    <TabsTrigger value="approvals" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Approvals</TabsTrigger>
                    <TabsTrigger value="comments" className="tab-trigger h-11 border-b-2 border-transparent px-2 text-xs font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Comments ({selectedDoc.comments.length})</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 text-xs">
                  
                  {/* EDITOR TAB */}
                  <TabsContent value="editor" className="space-y-4 m-0 focus:outline-none flex flex-col h-full min-h-0">
                    <div className="flex justify-between items-center shrink-0">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4" /> Edit Wiki Markdown
                      </h4>
                      <Button size="sm" className="h-8" onClick={handleSaveDocument}>Save Document</Button>
                    </div>
                    <Textarea 
                      value={editorText} 
                      onChange={(e) => setEditorText(e.target.value)} 
                      rows={16}
                      className="flex-1 font-mono text-xs p-3 leading-relaxed border border-[var(--border)] rounded-xl"
                    />
                  </TabsContent>

                  {/* TEMPLATES TAB */}
                  <TabsContent value="templates" className="space-y-4 m-0 focus:outline-none">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> Operational Document Outlines
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {TEMPLATES.map((tmpl) => (
                        <div key={tmpl.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--card-bg)] shadow-xs flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-xs text-[var(--foreground)]">{tmpl.name}</p>
                            <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">Preconfigured wiki markdown layout</p>
                          </div>
                          <Button size="sm" variant="outline" className="h-8 text-[10px]" onClick={() => handleLoadTemplate(tmpl.body)}>
                            Load Template
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* REVISIONS TAB */}
                  <TabsContent value="versions" className="space-y-4 m-0 focus:outline-none">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-1.5">
                      <History className="w-4 h-4" /> Revisions Logs
                    </h4>
                    <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card-bg)] shadow-xs">
                      {selectedDoc.versions.map((ver, idx) => (
                        <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-[var(--background-secondary)]/50 transition-colors">
                          <div>
                            <p className="font-semibold text-xs font-mono text-[var(--color-primary)]">{ver.version}</p>
                            <p className="text-[10px] text-[var(--foreground-muted)] mt-1">Edited by {ver.user}</p>
                          </div>
                          <span className="text-[10px] text-[var(--foreground-muted)]">{ver.date}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* APPROVALS TAB */}
                  <TabsContent value="approvals" className="space-y-4 m-0 focus:outline-none">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4" /> Sign-Off & Approvals
                    </h4>
                    {selectedDoc.approvals.length === 0 ? (
                      <div className="p-4 border border-dashed border-[var(--border)] rounded-xl text-center text-[var(--foreground-muted)]">
                        No active approval request triggered for this document.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedDoc.approvals.map((app, idx) => (
                          <div key={idx} className="p-3 border border-[var(--border)] rounded-xl bg-[var(--card-bg)] flex items-center justify-between">
                            <span className="font-semibold text-xs text-[var(--foreground)]">{app}</span>
                            <Badge variant="outline" className="text-[9px] bg-emerald-50 border-none text-emerald-700">Approved</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button size="sm" className="w-full mt-2" onClick={() => {
                      toast.success("Request for Tech Lead review triggered.");
                    }}>
                      Trigger Approval Request
                    </Button>
                  </TabsContent>

                  {/* COMMENTS TAB */}
                  <TabsContent value="comments" className="space-y-4 m-0 focus:outline-none flex flex-col h-full min-h-0">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" /> Threaded Comments
                    </h4>
                    
                    {/* List of comments */}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
                      {selectedDoc.comments.map((comment, idx) => (
                        <div key={idx} className="p-3 border border-[var(--border)] bg-[var(--background-secondary)]/30 rounded-xl space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs text-[var(--foreground)]">{comment.author}</span>
                            <span className="text-[10px] text-[var(--foreground-muted)]">{comment.date}</span>
                          </div>
                          <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">{comment.text}</p>
                        </div>
                      ))}
                      {selectedDoc.comments.length === 0 && (
                        <p className="text-center text-[var(--foreground-muted)] py-6">No discussions yet. Be the first to comment!</p>
                      )}
                    </div>

                    <Separator />

                    {/* Comment post field */}
                    <div className="flex gap-2 shrink-0 pt-2">
                      <Input 
                        placeholder="Write a comment..." 
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="h-9"
                      />
                      <Button size="sm" className="h-9 shrink-0" onClick={handlePostComment}>
                        <Send className="w-3.5 h-3.5" />
                      </Button>
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
