"use client";

import { useEffect, useState } from "react";
import { Download, CreditCard, CheckCircle2, XCircle, Clock } from "lucide-react";

type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: string | null;
  planType: string | null;
  createdAt: string;
  paymentId: string;
};

export default function BillingPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/billing/history");
        const data = await res.json();
        setPayments(data);
        
      } catch (err) {
        console.error(err);
        
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  const getPlanName = (amount: number) => {
    if (amount >= 1000 && amount <= 1500) return "PRO";
    if (amount >= 300 && amount <= 400) return "ESSENTIAL";
    return "TOP-UP";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full font-one animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing History</h1>
        <p className="text-muted-foreground mt-1">Manage your subscriptions and download invoices.</p>
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Upgraded to</th>
              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Amount</th>
              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Method</th>
              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Plan Type</th>
              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Upgraded at</th>
              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-accent/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500 text-xs font-bold border border-amber-500/20">
                      {getPlanName(p.amount)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-foreground font-medium">
                    {p.currency.toUpperCase()} {p.amount.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {p.status === "succeeded" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : p.status === "failed" ? (
                        <XCircle className="w-4 h-4 text-destructive" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500" />
                      )}
                      <span className={`text-sm capitalize ${
                        p.status === "succeeded" ? "text-emerald-600 dark:text-emerald-500" : 
                        p.status === "failed" ? "text-destructive" : "text-amber-600 dark:text-amber-500"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground/60" />
                      {p.method || "Standard"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground/60" />
                      {p.planType || "Standard"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    {new Date(p.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <a
                      href={`https://test.dodopayments.com/invoices/payments/${p.paymentId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-secondary hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-all"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center text-muted-foreground">
                  No payment history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}