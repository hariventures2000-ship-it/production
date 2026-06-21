"use client";

import React, { useState, useEffect } from "react";
import { get, post } from "@/lib/api-client";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Badge, Button
} from "@hariventure/ui";
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
          // Razorpay automatically sends webhook to backend.
          // We can just refetch data here to update UI.
          fetchData();
          alert('Payment Successful!');
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
      const url = await get<string>(`/client/billing/receipts/${paymentId}`);
      if (url) {
        // Build full URL if relative
        const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${url}`;
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
    <div className="max-w-6xl mx-auto space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Billing & Payments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your invoices and payment history.</p>
        </div>
        
        <Card className="bg-indigo-600 text-white border-none shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-indigo-500 rounded-full">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total Outstanding</p>
              <p className="text-2xl font-bold">₹{totalOutstanding.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outstanding Invoices Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Clock className="h-5 w-5 text-amber-500"/> Outstanding Invoices</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading invoices...</div>
            ) : invoices.filter(i => i.status === 'PENDING' || i.status === 'OVERDUE').length === 0 ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
                <p>You have no outstanding invoices. Great job!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {invoices.filter(i => i.status === 'PENDING' || i.status === 'OVERDUE').map(invoice => (
                  <div key={invoice._id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-slate-500">{invoice.invoiceNumber}</span>
                        <h4 className="font-semibold text-slate-900">{invoice.title}</h4>
                        <Badge variant={invoice.status === 'OVERDUE' ? 'destructive' : 'warning'}>{invoice.status}</Badge>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-1">{invoice.description}</p>
                      <p className="text-xs text-slate-400 mt-1">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-slate-900">{invoice.currency} {invoice.amount.toLocaleString()}</span>
                      <Button size="sm" onClick={() => handlePay(invoice._id)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        Pay Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment History & Receipts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5 text-indigo-500"/> Payment History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading history...</div>
            ) : payments.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No payment history available.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {payments.map(payment => (
                  <div key={payment._id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-slate-500">{payment.paymentNumber}</span>
                        <Badge variant={payment.status === 'SUCCESS' ? 'success' : payment.status === 'FAILED' ? 'destructive' : 'secondary'}>
                          {payment.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-slate-900">{payment.currency} {payment.amount.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 mt-1">Date: {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'Processing'}</p>
                    </div>
                    {payment.status === 'SUCCESS' && payment.receiptUrl && (
                      <Button variant="outline" size="sm" onClick={() => handleDownloadReceipt(payment._id)} className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                        <Download className="h-4 w-4 mr-2" /> Receipt
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
