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

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BillingStats | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Project & Milestone</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length > 0 ? invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium text-[var(--foreground)]">{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-[var(--foreground)] truncate max-w-[200px]">{invoice.milestoneTitle}</p>
                      <p className="text-[10px] text-[var(--foreground-secondary)]">{invoice.projectName}</p>
                    </TableCell>
                    <TableCell className="text-[var(--foreground-secondary)]">{new Date(invoice.issuedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-[var(--foreground-secondary)]">{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium text-[var(--foreground)]">{invoice.currency} {invoice.totalAmount.toLocaleString()}</TableCell>
                    <TableCell><StatusBadge status={invoice.status} /></TableCell>
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
          </TabsContent>

          <TabsContent value="history" className="p-0 m-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Invoice Ref</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length > 0 ? payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-[var(--foreground-secondary)]">{new Date(payment.paidAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-mono text-xs">{payment.razorpayPaymentId || payment.paymentNumber}</TableCell>
                    <TableCell className="text-[var(--foreground-secondary)]">{payment.invoiceNumber}</TableCell>
                    <TableCell className="text-[var(--foreground-secondary)]">{payment.method}</TableCell>
                    <TableCell className="font-medium text-[var(--foreground)]">{payment.currency} {payment.amount.toLocaleString()}</TableCell>
                    <TableCell><StatusBadge status={payment.status} /></TableCell>
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
