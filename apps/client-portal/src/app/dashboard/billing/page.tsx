"use client";

import React, { useState, useEffect } from "react";
import { get, post } from "@/lib/api-client";
import { CreditCard, FileText, Download, CheckCircle2, Clock } from "lucide-react";
import Script from "next/script";

export default function ClientBillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [invData, payData] = await Promise.all([
        get<any[]>('/client/billing/invoices'),
        get<any[]>('/client/billing/payments')
      ]);
      setInvoices(invData);
      setPayments(payData);
    } catch (err) {
      console.error("Failed to fetch billing data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePay = async (invoiceId: string) => {
    try {
      const res = await post<{ orderId: string, amount: number, currency: string, key: string }>(`/client/billing/invoices/${invoiceId}/pay`, {});
      
      const options = {
        key: res.key,
        amount: res.amount,
        currency: res.currency,
        name: "Hariventure Enterprise",
        description: "Invoice Payment",
        order_id: res.orderId,
        handler: function (response: any) {
          // Razorpay callback success
          fetchData();
          alert('Payment Completed Successfully!');
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert('Payment Failed: ' + response.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error("Failed to initiate payment", err);
      alert('Could not initiate payment. Please try again.');
    }
  };

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      const downloadPath = await get<string>(`/client/billing/receipts/${paymentId}`);
      if (downloadPath) {
        const fullUrl = downloadPath.startsWith('http') ? downloadPath : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${downloadPath}`;
        window.open(fullUrl, '_blank');
      }
    } catch (err) {
      console.error("Failed to download receipt", err);
      alert('Receipt not yet available. Please wait a few moments after payment.');
    }
  };

  const totalOutstanding = invoices
    .filter(i => i.status === 'PENDING' || i.status === 'OVERDUE')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Billing & Payments</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your invoices and payment history.</p>
        </div>
        
        <div className="bg-indigo-600 text-white rounded-2xl p-5 shadow-lg border border-indigo-500/20 flex items-center gap-4">
          <div className="p-3 bg-indigo-500 rounded-xl">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider">Total Outstanding</p>
            <p className="text-2xl font-extrabold mt-0.5">₹{totalOutstanding.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outstanding Invoices Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500"/>
            <h3 className="font-extrabold text-white text-base">Outstanding Invoices</h3>
          </div>
          <div className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading invoices...</div>
            ) : invoices.filter(i => i.status === 'PENDING' || i.status === 'OVERDUE').length === 0 ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-3" />
                <p className="text-sm font-semibold">You have no outstanding invoices. Great job!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-850">
                {invoices.filter(i => i.status === 'PENDING' || i.status === 'OVERDUE').map(invoice => (
                  <div key={invoice.id} className="p-5 hover:bg-slate-850/10 flex items-center justify-between transition-colors">
                    <div className="min-w-0 flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-mono text-[10px] font-bold text-slate-550 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{invoice.invoiceNumber}</span>
                        <h4 className="font-bold text-white text-sm truncate">{invoice.title}</h4>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide ${invoice.status === 'OVERDUE' ? 'bg-red-500/10 text-red-400 border border-red-550/10' : 'bg-amber-500/10 text-amber-400 border border-amber-550/10'}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{invoice.description}</p>
                      <p className="text-[10px] text-slate-500 mt-2 font-medium">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2.5 shrink-0">
                      <span className="font-extrabold text-white text-base">{invoice.currency} {invoice.amount.toLocaleString()}</span>
                      <button 
                        onClick={() => handlePay(invoice.id)} 
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md active:scale-[0.97] cursor-pointer"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment History & Receipts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-400"/>
            <h3 className="font-extrabold text-white text-base">Payment History</h3>
          </div>
          <div className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading history...</div>
            ) : payments.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No payment history available.
              </div>
            ) : (
              <div className="divide-y divide-slate-850">
                {payments.map(payment => (
                  <div key={payment.id} className="p-5 hover:bg-slate-850/10 flex items-center justify-between transition-colors">
                    <div className="min-w-0 flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-mono text-[10px] font-bold text-slate-550 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{payment.paymentNumber}</span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide ${payment.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-550/10' : payment.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border border-red-550/10' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}>
                          {payment.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white">{payment.currency} {payment.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500 mt-2 font-medium">Date: {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'Processing'}</p>
                    </div>
                    {payment.status === 'SUCCESS' && (
                      <button 
                        onClick={() => handleDownloadReceipt(payment.id)} 
                        className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-indigo-400 hover:text-white border border-slate-800 hover:border-indigo-500/40 rounded-xl flex items-center gap-2 transition-all cursor-pointer font-bold text-xs"
                      >
                        <Download className="h-4 w-4" /> Receipt
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
