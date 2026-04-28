"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "./userContext";
import { Loader2 } from "lucide-react";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

export default function Premium() {
  const router = useRouter();
  const { user, logout, loading: userLoading } = useUser();
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: string) => {
    try {
      setLoading(plan);
      const res = await axios.get("/api/auth/me");

      if (!res.data.authenticated) {
        router.push("/auth/signin");
        return;
      }

      const checkoutRes = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          plan: plan === "ESSENTIALS" ? "ESSENTIAL" : plan,
          billingPeriod: isAnnual ? "ANNUALLY" : "MONTHLY"
        }),
      });

      const data = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(data.error);
      window.location.href = data.checkout_url;

    } catch (error) {
      console.error(error);
      alert("Unable to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="max-w-6xl mx-auto px-4 py-12">

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            The Best URL Shortener with Analytics & Branded Links
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Stop guessing and start tracking with our professional link management platform. Unlock deep insights with real-time click tracking and geo-targeted redirects.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 mb-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-2">
              <span className="text-[10px] font-bold bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full uppercase tracking-wider">
                Save upto 38%
              </span>
              <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                Annually
              </span>
            </div>
            
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-12 h-6 rounded-full bg-secondary border border-border transition-colors duration-200 focus:outline-none cursor-pointer"
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-blue-500 transition-transform duration-200 ease-in-out ${
                  !isAnnual ? "translate-x-6" : ""
                }`}
              />
            </button>
            
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <div className="rounded-2xl border border-border bg-card p-8 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-bold text-foreground/70">Free Tool</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
                Current
              </span>
            </div>

            <div className="text-4xl font-bold mb-1">₹0</div>
            <div className="text-xs text-muted-foreground mb-8">
              Perfect for simple url shortening
            </div>

            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {[
                "100 short links/month",
                "30 dynamic QR codes/month",
                "Basic click tracking",
                "Standard link creator",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2.5 text-sm text-foreground/60"
                >
                  <CheckIcon className="w-4 h-4 shrink-0 text-muted-foreground/50" />
                  {f}
                </li>
              ))}
            </ul>

            <button className="w-full py-3 rounded-xl border border-border bg-secondary/50 text-sm text-muted-foreground font-medium cursor-default">
              Start Free
            </button>
          </div>

          <div className="rounded-2xl border-2 border-blue-500/50 bg-blue-500/[0.03] dark:bg-blue-500/10 p-8 flex flex-col relative shadow-xl shadow-blue-500/5">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[11px] font-semibold shadow-md whitespace-nowrap">
              ⭐ Recommended
            </div>

            <div className="flex items-center justify-between mb-6 pt-2">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Essentials
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300">
                Popular
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm line-through text-muted-foreground/50">
                {isAnnual ? "₹14,400" : "₹1,200"}
              </span>
              <span className="text-4xl font-bold">
                ₹{isAnnual ? "2,299" : "300"}
                <span className="text-base font-normal text-muted-foreground ml-1">
                  {isAnnual ? "/yr" : "/mo"}
                </span>
              </span>
            </div>

            <div className="text-xs text-muted-foreground mb-8">
              Advanced link analytics platform
            </div>

            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {[
                "10,000 links/month",
                "300 QR Codes/month",
                "Real-time click analytics",
                "Bulk url shortener tool",
                "Custom short links & slugs",
                "Branded links & Custom domains",
                "4 custom domains included",
                "Password protected links",
                "Link expiration tool",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2.5 text-sm text-foreground/80"
                >
                  <CheckIcon className="w-4 h-4 shrink-0 text-blue-500" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade("ESSENTIALS")}
              disabled={loading !== null}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
            >
              {loading === "ESSENTIALS" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upgrade to Essentials"}
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-bold text-amber-600 dark:text-yellow-400">
                Pro
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-yellow-300">
                Best value
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm line-through text-muted-foreground/50">
                {isAnnual ? "₹67,200" : "₹5,600"}
              </span>
              <span className="text-4xl font-bold">
                ₹{isAnnual ? "8,999" : "1,200"}
                <span className="text-base font-normal text-muted-foreground ml-1">
                  {isAnnual ? "/yr" : "/mo"}
                </span>
              </span>
            </div>

            <div className="text-xs text-muted-foreground mb-8">
              Enterprise link shortener suite
            </div>

            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {[
                "40,000 links/month",
                "2,000 QR Codes/month",
                "Advanced data analytics",
                "Batch link shortener access",
                "Branded short domains",
                "Link shortening api",
                "10 custom domains",
                "White label url shortener",
                "Priority Support 24/7",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2.5 text-sm text-foreground/80"
                >
                  <CheckIcon className="w-4 h-4 shrink-0 text-amber-500 dark:text-yellow-400" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade("PRO")}
              disabled={loading !== null}
              className="w-full py-3 rounded-xl bg-foreground text-background hover:opacity-90 text-sm font-semibold transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
            >
              {loading === "PRO" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upgrade to Pro"}
            </button>
          </div>

        </div>

        <p className="mt-16 text-center text-muted-foreground text-sm">
          Need help choosing?{" "}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=fasturl@tutamail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            Contact our team
          </a>
        </p>

      </main>
    </div>
  );
}