"use client";

import React, { useEffect, useState } from "react";
import { billingService } from "@/lib/services/billing.service";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Download, ExternalLink, Receipt, FileText } from "lucide-react";
import type { BillingStats, Invoice, Payment } from "@/lib/types";
import { EnterpriseFilterBar, FilterDefinition } from "@/components/ui/enterprise-filter-bar";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { useFilterStore } from "@/store/filter.store";

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BillingStats | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const { filters, setFilter } = useUrlFilters();
  const { hiddenColumns } = useFilterStore();
  const itemsPerPage = 6;
  const currentPage = Number(filters.page) || 1;

  const billingFilters: FilterDefinition[] = [
    {
      id: "status",
      label: "Status",
      type: "multi-select",
      options: [
        { label: "Paid", value: "PAID" },
        { label: "Pending", value: "PENDING" },
        { label: "Draft", value: "DRAFT" },
        { label: "Sent", value: "SENT" },
        { label: "Overdue", value: "OVERDUE" },
        { label: "Success", value: "SUCCESS" },
        { label: "Failed", value: "FAILED" },
        { label: "Refunded", value: "REFUNDED" }
      ]
    },
    {
      id: "method",
      label: "Payment Method",
      type: "multi-select",
      options: [
        { label: "Razorpay", value: "Razorpay" },
        { label: "UPI", value: "UPI" },
        { label: "Credit Card", value: "Credit Card" },
        { label: "Debit Card", value: "Debit Card" },
        { label: "Net Banking", value: "Net Banking" },
        { label: "Wallet", value: "Wallet" },
        { label: "Bank Transfer", value: "Bank Transfer" }
      ]
    },
    {
      id: "dateRange",
      label: "Date Range",
      type: "date-range"
    }
  ];

  const invoiceColumns = [
    { id: "invoice", label: "Invoice" },
    { id: "milestone", label: "Milestone" },
    { id: "issued", label: "Issued Date" },
    { id: "due", label: "Due Date" },
    { id: "amount", label: "Amount" },
    { id: "status", label: "Status" }
  ];

  const paymentColumns = [
    { id: "receipt", label: "Receipt" },
    { id: "invoice", label: "Invoice" },
    { id: "amount", label: "Amount" },
    { id: "method", label: "Method" },
    { id: "date", label: "Date" },
    { id: "status", label: "Status" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [st, invs, pays] = await Promise.all([
          billingService.getBillingDashboard(),
          billingService.getInvoices(),
          billingService.getPaymentHistory()
        ]);
        setStats(st);
        setInvoices(invs);
        setPayments(pays);
      } catch (error) {
        console.error("Error fetching billing data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePayNow = async (invoiceId: string) => {
    try {
      const order = await billingService.initiatePayment(invoiceId);
      // In real app, initialize Razorpay checkout here using order.orderId
      alert(`Razorpay checkout initialized for order ${order.orderId}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadInvoice = (id: string) => {
    billingService.downloadInvoicePdf(id);
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filters.search) {
      const search = String(filters.search).toLowerCase();
      if (!inv.invoiceNumber.toLowerCase().includes(search) && !inv.milestoneTitle.toLowerCase().includes(search)) return false;
    }
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      if (!filters.status.includes(inv.status)) return false;
    }
    if (filters.dateRange && typeof filters.dateRange === 'object') {
      const { from, to } = filters.dateRange as any;
      const docDate = new Date(inv.issuedDate).getTime();
      if (from && docDate < new Date(from).getTime()) return false;
      if (to && docDate > new Date(to).getTime()) return false;
    }
    return true;
  });

  const filteredPayments = payments.filter(pay => {
    if (filters.search) {
      const search = String(filters.search).toLowerCase();
      if (!pay.paymentNumber.toLowerCase().includes(search) && !pay.invoiceNumber.toLowerCase().includes(search)) return false;
    }
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      if (!filters.status.includes(pay.status)) return false;
    }
    if (filters.method && Array.isArray(filters.method) && filters.method.length > 0) {
      if (!filters.method.includes(pay.method)) return false;
    }
    if (filters.dateRange && typeof filters.dateRange === 'object') {
      const { from, to } = filters.dateRange as any;
      const docDate = new Date(pay.paidAt).getTime();
      if (from && docDate < new Date(from).getTime()) return false;
      if (to && docDate > new Date(to).getTime()) return false;
    }
    return true;
  });

  const currentInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalInvoicePages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const currentPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPaymentPages = Math.ceil(filteredPayments.length / itemsPerPage);

  if (loading || !stats) return <BillingSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Payments"
        description="Manage invoices, view payment history, and track milestone payments."
        icon={CreditCard}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Contract Value" value={`${stats.currency} ${stats.totalContractValue.toLocaleString()}`} />
        <StatCard title="Total Paid" value={`${stats.currency} ${stats.totalPaid.toLocaleString()}`} iconColor="text-success" />
        <StatCard title="Pending Amount" value={`${stats.currency} ${stats.pendingAmount.toLocaleString()}`} iconColor="text-info" />
        <StatCard title="Overdue" value={`${stats.currency} ${stats.overdueAmount.toLocaleString()}`} iconColor="text-danger" />
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm">
        <Tabs defaultValue="invoices" className="w-full">
          <div className="px-4 pt-4 border-b border-[var(--border)]">
            <TabsList className="bg-transparent border-0 p-0 justify-start h-auto">
              <TabsTrigger value="invoices" className="px-4 py-2">Invoices</TabsTrigger>
              <TabsTrigger value="history" className="px-4 py-2">Payment History</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="invoices" className="p-0 m-0">
            <div className="border-b border-[var(--border)] p-4">
              <EnterpriseFilterBar 
                moduleId="invoices"
                filters={billingFilters.filter(f => f.id !== 'method')}
                columns={invoiceColumns}
                searchPlaceholder="Search invoices or milestones..."
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  {!(hiddenColumns['invoices']?.includes('invoice')) && <TableHead>Invoice</TableHead>}
                  {!(hiddenColumns['invoices']?.includes('milestone')) && <TableHead>Project & Milestone</TableHead>}
                  {!(hiddenColumns['invoices']?.includes('issued')) && <TableHead>Issued Date</TableHead>}
                  {!(hiddenColumns['invoices']?.includes('due')) && <TableHead>Due Date</TableHead>}
                  {!(hiddenColumns['invoices']?.includes('amount')) && <TableHead>Amount</TableHead>}
                  {!(hiddenColumns['invoices']?.includes('status')) && <TableHead>Status</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentInvoices.length > 0 ? currentInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    {!(hiddenColumns['invoices']?.includes('invoice')) && <TableCell className="font-medium text-[var(--foreground)]">{invoice.invoiceNumber}</TableCell>}
                    {!(hiddenColumns['invoices']?.includes('milestone')) && (
                      <TableCell>
                        <p className="text-sm font-medium text-[var(--foreground)] truncate max-w-[200px]">{invoice.milestoneTitle}</p>
                        <p className="text-[10px] text-[var(--foreground-muted)]">{invoice.projectName}</p>
                      </TableCell>
                    )}
                    {!(hiddenColumns['invoices']?.includes('issued')) && <TableCell className="text-[var(--foreground-secondary)]">{new Date(invoice.issuedDate).toLocaleDateString()}</TableCell>}
                    {!(hiddenColumns['invoices']?.includes('due')) && <TableCell className="text-[var(--foreground-secondary)]">{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>}
                    {!(hiddenColumns['invoices']?.includes('amount')) && <TableCell className="font-medium text-[var(--foreground)]">{invoice.currency} {invoice.totalAmount.toLocaleString()}</TableCell>}
                    {!(hiddenColumns['invoices']?.includes('status')) && (
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDownloadInvoice(invoice.id)} title="Download PDF">
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status === 'PENDING' && (
                          <Button size="sm" className="h-8" onClick={() => handlePayNow(invoice.id)}>
                            Pay Now
                          </Button>
                        )}
                        {invoice.status === 'PAID' && (
                          <Button variant="outline" size="sm" className="h-8" title="View Receipt">
                            <Receipt className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-[var(--foreground-secondary)]">No invoices found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Pagination Footer */}
            {filteredInvoices.length > 0 && (
              <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 bg-[var(--background)]">
                <div className="text-xs text-[var(--foreground-muted)]">
                  Showing <span className="font-medium text-[var(--foreground)]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-[var(--foreground)]">{Math.min(currentPage * itemsPerPage, filteredInvoices.length)}</span> of <span className="font-medium text-[var(--foreground)]">{filteredInvoices.length}</span> Invoices
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setFilter('page', Math.max(currentPage - 1, 1))} disabled={currentPage === 1} className="h-8 text-xs">Previous</Button>
                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: totalInvoicePages }, (_, i) => i + 1).map((page) => (
                      <button key={page} onClick={() => setFilter('page', page)} className={`h-8 w-8 rounded-md text-xs font-medium transition-colors ${page === currentPage ? 'bg-[var(--foreground)] text-[var(--background)]' : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'}`}>{page}</button>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setFilter('page', Math.min(currentPage + 1, totalInvoicePages))} disabled={currentPage === totalInvoicePages} className="h-8 text-xs">Next</Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="p-0 m-0">
            <div className="border-b border-[var(--border)] p-4">
              <EnterpriseFilterBar 
                moduleId="payments"
                filters={billingFilters}
                columns={paymentColumns}
                searchPlaceholder="Search receipt or invoice..."
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  {!(hiddenColumns['payments']?.includes('receipt')) && <TableHead>Receipt</TableHead>}
                  {!(hiddenColumns['payments']?.includes('invoice')) && <TableHead>Invoice</TableHead>}
                  {!(hiddenColumns['payments']?.includes('amount')) && <TableHead>Amount</TableHead>}
                  {!(hiddenColumns['payments']?.includes('method')) && <TableHead>Method</TableHead>}
                  {!(hiddenColumns['payments']?.includes('date')) && <TableHead>Date</TableHead>}
                  {!(hiddenColumns['payments']?.includes('status')) && <TableHead>Status</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPayments.length > 0 ? currentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    {!(hiddenColumns['payments']?.includes('receipt')) && <TableCell className="font-medium text-[var(--foreground)]">{payment.paymentNumber}</TableCell>}
                    {!(hiddenColumns['payments']?.includes('invoice')) && <TableCell className="text-[var(--foreground-secondary)]">{payment.invoiceNumber}</TableCell>}
                    {!(hiddenColumns['payments']?.includes('amount')) && <TableCell className="font-medium text-[var(--foreground)]">{payment.currency} {payment.amount.toLocaleString()}</TableCell>}
                    {!(hiddenColumns['payments']?.includes('method')) && <TableCell className="text-[var(--foreground-secondary)]">{payment.method}</TableCell>}
                    {!(hiddenColumns['payments']?.includes('date')) && <TableCell className="text-[var(--foreground-secondary)]">{new Date(payment.paidAt).toLocaleDateString()}</TableCell>}
                    {!(hiddenColumns['payments']?.includes('status')) && (
                      <TableCell>
                        <StatusBadge status={payment.status} />
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => billingService.downloadReceipt(payment.id)}>
                        <ExternalLink className="h-4 w-4 text-[var(--foreground-secondary)]" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-[var(--foreground-secondary)]">No payments found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Pagination Footer */}
            {filteredPayments.length > 0 && (
              <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 bg-[var(--background)]">
                <div className="text-xs text-[var(--foreground-muted)]">
                  Showing <span className="font-medium text-[var(--foreground)]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-[var(--foreground)]">{Math.min(currentPage * itemsPerPage, filteredPayments.length)}</span> of <span className="font-medium text-[var(--foreground)]">{filteredPayments.length}</span> Payments
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setFilter('page', Math.max(currentPage - 1, 1))} disabled={currentPage === 1} className="h-8 text-xs">Previous</Button>
                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: totalPaymentPages }, (_, i) => i + 1).map((page) => (
                      <button key={page} onClick={() => setFilter('page', page)} className={`h-8 w-8 rounded-md text-xs font-medium transition-colors ${page === currentPage ? 'bg-[var(--foreground)] text-[var(--background)]' : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'}`}>{page}</button>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setFilter('page', Math.min(currentPage + 1, totalPaymentPages))} disabled={currentPage === totalPaymentPages} className="h-8 text-xs">Next</Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function BillingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[104px] w-full" />)}
      </div>
      <Skeleton className="h-[400px] w-full rounded-[var(--radius-lg)]" />
    </div>
  );
}
