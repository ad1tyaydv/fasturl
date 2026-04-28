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
        <div className="w-8 h-8 border-2 border-[#1D9BF0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-three font-bold tracking-tight text-white">Billing History</h1>
        <p className="text-neutral-400 mt-1">Manage your subscriptions and download invoices.</p>
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-neutral-800 bg-[#141414]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 bg-[#1e1e1e]/50">
              <th className="px-6 py-4 text-sm font-semibold text-neutral-300">Upgraded to</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-300">Amount</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-300">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-300">Method</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-300">Plan Type</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-300">Upgraded at</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-300 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#1e1e1e]/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">
                      {getPlanName(p.amount)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-white font-medium">
                    {p.currency.toUpperCase()} {p.amount.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {p.status === "succeeded" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : p.status === "failed" ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className={`text-sm capitalize ${
                        p.status === "succeeded" ? "text-green-500" : 
                        p.status === "failed" ? "text-red-500" : "text-yellow-500"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-neutral-400 text-sm">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-neutral-500" />
                      {p.method || "Standard"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-neutral-400 text-sm">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-neutral-500" />
                      {p.planType || "Standard"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-neutral-400 text-sm">
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
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all border border-neutral-700"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-neutral-500">
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