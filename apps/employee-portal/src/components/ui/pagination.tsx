// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Pagination Component
// Reusable enterprise-style pagination footer
// ═══════════════════════════════════════════════════════════════════

import React from "react";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemName = "items",
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  if (totalItems === 0) {
    return null;
  }

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers
  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) {
      pages.push("...");
    }
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[var(--border)] bg-[var(--card-bg)] rounded-b-xl">
      <span className="text-xs text-[var(--foreground-secondary)]">
        Showing <span className="font-semibold text-[var(--foreground)]">{startIdx}–{endIdx}</span> of{" "}
        <span className="font-semibold text-[var(--foreground)]">{totalItems}</span> {itemName}
      </span>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 px-2.5 text-xs gap-1 select-none"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </Button>
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`ell-${idx}`} className="px-2 text-xs text-[var(--foreground-muted)] select-none">
                  ...
                </span>
              );
            }
            return (
              <Button
                key={`page-${p}`}
                variant={currentPage === p ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(p as number)}
                className={cn(
                  "h-8 w-8 text-xs p-0 select-none",
                  currentPage === p
                    ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
                    : "text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]"
                )}
              >
                {p}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 px-2.5 text-xs gap-1 select-none"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
