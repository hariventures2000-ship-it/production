"use client";

import React, { useEffect, useState } from "react";
import { documentService } from "@/lib/services/document.service";
import { useAppStore } from "@/store/app.store";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search, Download, Folder, MoreHorizontal, Eye, MessageSquare, History } from "lucide-react";
import type { Document as MerviDocument } from "@/lib/types";

export default function DocumentCenterPage() {
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<MerviDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const docs = await documentService.getDocuments(selectedProjectId);
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProjectId]);

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.folder.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  if (loading) return <DocumentsSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Document Center"
          description="View, approve, and download project files and deliverables."
          icon={FileText}
        />
        <div className="flex items-center gap-2">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download All</Button>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between gap-4">
          <div className="w-full max-w-sm">
            <Input 
              icon={<Search className="h-4 w-4" />} 
              placeholder="Search documents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:flex"><Folder className="mr-2 h-4 w-4" /> Group by Folder</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <TableRow key={doc.id} className="group cursor-default">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[var(--background-tertiary)] flex items-center justify-center shrink-0">
                        {doc.mimeType.includes('pdf') ? <FileText className="h-4 w-4 text-red-500" /> : <FileText className="h-4 w-4 text-blue-500" />}
                      </div>
                      <div>
                        <p className="text-sm text-[var(--foreground)] truncate max-w-[280px]">{doc.name}</p>
                        <p className="text-[10px] text-[var(--foreground-muted)] flex items-center gap-1">
                          <Folder className="h-3 w-3" /> {doc.folder}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--background-tertiary)] text-[var(--foreground-secondary)]">
                      {doc.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-[var(--foreground-secondary)]">{formatBytes(doc.sizeBytes)}</TableCell>
                  <TableCell className="text-[var(--foreground-secondary)]">{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={doc.approvalStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon-sm" title="Preview"><Eye className="h-4 w-4 text-[var(--foreground-secondary)]" /></Button>
                      <Button variant="ghost" size="icon-sm" title="Download"><Download className="h-4 w-4 text-[var(--foreground-secondary)]" /></Button>
                      <Button variant="ghost" size="icon-sm" title="Comments">
                        <div className="relative">
                          <MessageSquare className="h-4 w-4 text-[var(--foreground-secondary)]" />
                          {doc.commentCount > 0 && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />}
                        </div>
                      </Button>
                      <Button variant="ghost" size="icon-sm" title="Version History"><History className="h-4 w-4 text-[var(--foreground-secondary)]" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-[var(--foreground-secondary)]">
                  No documents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function DocumentsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64 mb-6" />
      <Skeleton className="h-[500px] w-full rounded-[var(--radius-lg)]" />
    </div>
  );
}
