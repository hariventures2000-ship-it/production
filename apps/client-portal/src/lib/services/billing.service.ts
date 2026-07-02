// ═══════════════════════════════════════════════════════════════════
// MERVI CLIENT PORTAL — Billing Service
// Milestone-based billing with Razorpay integration
// ═══════════════════════════════════════════════════════════════════

import { get, post } from '@/lib/api-client';
import type { BillingStats, Invoice, Payment, RazorpayOrder, PaymentVerification } from '@/lib/types';
import { mockBillingStats, mockInvoices, mockPayments } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const billingService = {
  async getBillingDashboard(): Promise<BillingStats> {
    if (USE_MOCK) { await delay(300); return mockBillingStats; }
    return get<BillingStats>('/client/billing/dashboard');
  },

  async getInvoices(filters?: { status?: string }): Promise<Invoice[]> {
    if (USE_MOCK) {
      await delay(400);
      if (filters?.status) return mockInvoices.filter((i) => i.status === filters.status);
      return mockInvoices;
    }
    return get<Invoice[]>('/client/billing/invoices', filters);
  },

  async getInvoice(id: string): Promise<Invoice> {
    if (USE_MOCK) { await delay(300); return mockInvoices.find((i) => i.id === id) || mockInvoices[0]; }
    return get<Invoice>(`/client/billing/invoices/${id}`);
  },

  async initiatePayment(invoiceId: string): Promise<RazorpayOrder> {
    if (USE_MOCK) {
      await delay(500);
      const invoice = mockInvoices.find((i) => i.id === invoiceId);
      return { orderId: `order_mock_${Date.now()}`, amount: (invoice?.totalAmount || 0) * 100, currency: 'INR', key: 'rzp_test_mockkey' };
    }
    return post<RazorpayOrder>(`/client/billing/invoices/${invoiceId}/pay`);
  },

  async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<PaymentVerification> {
    if (USE_MOCK) {
      await delay(400);
      return { success: true, paymentId, message: 'Payment verified successfully' };
    }
    return post<PaymentVerification>('/client/billing/verify-payment', { orderId, paymentId, signature });
  },

  async getPaymentHistory(): Promise<Payment[]> {
    if (USE_MOCK) { await delay(300); return mockPayments; }
    return get<Payment[]>('/client/billing/payments');
  },

  async downloadInvoicePdf(id: string): Promise<void> {
    if (USE_MOCK) { alert('Mock: Invoice PDF download'); return; }
    const res = await get<{ url: string }>(`/client/billing/invoices/${id}/pdf`);
    if (res?.url) window.open(res.url, '_blank');
  },

  async downloadReceipt(paymentId: string): Promise<void> {
    if (USE_MOCK) { alert('Mock: Receipt download'); return; }
    const res = await get<{ url: string }>(`/client/billing/receipts/${paymentId}`);
    if (res?.url) window.open(res.url, '_blank');
  },
};
