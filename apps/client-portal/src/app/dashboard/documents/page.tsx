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
import { FileText, Download, Folder, Eye, MessageSquare, History } from "lucide-react";
import type { Document as MerviDocument } from "@/lib/types";
import { EnterpriseFilterBar, FilterDefinition } from "@/components/ui/enterprise-filter-bar";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { useFilterStore } from "@/store/filter.store";

export default function DocumentCenterPage() {
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<MerviDocument[]>([]);
  const { filters, setFilter } = useUrlFilters();
  const { hiddenColumns } = useFilterStore();
  const itemsPerPage = 6;
  const currentPage = Number(filters.page) || 1;

  const documentFilters: FilterDefinition[] = [
    {
      id: "folder",
      label: "Category (Folder)",
      type: "multi-select",
      options: [
        { label: "Design", value: "Design" },
        { label: "Requirements", value: "Requirements" },
        { label: "Legal", value: "Legal" },
        { label: "Deliverables", value: "Deliverables" }
      ]
    },
    {
      id: "type",
      label: "Document Type",
      type: "multi-select",
      options: [
        { label: "Requirements", value: "REQUIREMENTS" },
        { label: "Design", value: "DESIGN" },
        { label: "Contract", value: "CONTRACT" },
        { label: "Deliverable", value: "DELIVERABLE" }
      ]
    },
    {
      id: "approvalStatus",
      label: "Approval Status",
      type: "multi-select",
      options: [
        { label: "Pending", value: "PENDING" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
        { label: "Not Required", value: "NOT_REQUIRED" }
      ]
    },
    {
      id: "uploadDate",
      label: "Upload Date",
      type: "date-range"
    }
  ];

  const documentColumns = [
    { id: "type", label: "Type" },
    { id: "size", label: "Size" },
    { id: "date", label: "Date" },
    { id: "status", label: "Status" }
  ];

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

  const filteredDocs = documents.filter(doc => {
    // Search
    if (filters.search) {
      const search = String(filters.search).toLowerCase();
      if (!doc.name.toLowerCase().includes(search) && !doc.folder.toLowerCase().includes(search)) {
        return false;
      }
    }
    // Folder
    if (filters.folder && Array.isArray(filters.folder) && filters.folder.length > 0) {
      if (!filters.folder.includes(doc.folder)) return false;
    }
    // Type
    if (filters.type && Array.isArray(filters.type) && filters.type.length > 0) {
      if (!filters.type.includes(doc.type)) return false;
    }
    // Approval Status
    if (filters.approvalStatus && Array.isArray(filters.approvalStatus) && filters.approvalStatus.length > 0) {
      if (!filters.approvalStatus.includes(doc.approvalStatus)) return false;
    }
    // Upload Date
    if (filters.uploadDate && typeof filters.uploadDate === 'object') {
      const { from, to } = filters.uploadDate as any;
      const docDate = new Date(doc.uploadedAt).getTime();
      if (from && docDate < new Date(from).getTime()) return false;
      if (to && docDate > new Date(to).getTime()) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const currentDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        <div className="border-b border-[var(--border)] p-4">
          <EnterpriseFilterBar 
            moduleId="documents"
            filters={documentFilters}
            columns={documentColumns}
            searchPlaceholder="Search documents or folders..."
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              {!(hiddenColumns['documents']?.includes('type')) && <TableHead>Type</TableHead>}
              {!(hiddenColumns['documents']?.includes('size')) && <TableHead>Size</TableHead>}
              {!(hiddenColumns['documents']?.includes('date')) && <TableHead>Date</TableHead>}
              {!(hiddenColumns['documents']?.includes('status')) && <TableHead>Status</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDocs.length > 0 ? (
              currentDocs.map((doc) => (
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
                  {!(hiddenColumns['documents']?.includes('type')) && (
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--background-tertiary)] text-[var(--foreground-secondary)]">
                        {doc.type}
                      </span>
                    </TableCell>
                  )}
                  {!(hiddenColumns['documents']?.includes('size')) && <TableCell className="text-[var(--foreground-secondary)]">{formatBytes(doc.sizeBytes)}</TableCell>}
                  {!(hiddenColumns['documents']?.includes('date')) && <TableCell className="text-[var(--foreground-secondary)]">{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>}
                  {!(hiddenColumns['documents']?.includes('status')) && (
                    <TableCell>
                      <StatusBadge status={doc.approvalStatus} />
                    </TableCell>
                  )}
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

        {/* Pagination Footer */}
        {filteredDocs.length > 0 && (
          <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 bg-[var(--background)]">
            <div className="text-xs text-[var(--foreground-muted)]">
              Showing <span className="font-medium text-[var(--foreground)]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-[var(--foreground)]">{Math.min(currentPage * itemsPerPage, filteredDocs.length)}</span> of <span className="font-medium text-[var(--foreground)]">{filteredDocs.length}</span> Documents
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFilter('page', Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 text-xs"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setFilter('page', page)}
                    className={`h-8 w-8 rounded-md text-xs font-medium transition-colors ${page === currentPage ? 'bg-[var(--foreground)] text-[var(--background)]' : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFilter('page', Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
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
