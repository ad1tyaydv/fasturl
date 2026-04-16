"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/navbar";
import Premium from "@/app/components/premium";

type SidebarTab = "Subscription" | "Billing" | "Expires";
type UserTier = "free" | "essential" | "pro";

const TIER_META: Record<
  Exclude<UserTier, "free">,
  { label: string; color: string; bg: string; badge: string; features: string[] }
> = {
  essential: {
    label: "Essential",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    badge: "bg-blue-500/20 text-blue-300",
    features: ["Up to 500 links", "Basic analytics", "Custom slugs", "Email support"],
  },
  pro: {
    label: "Pro",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    badge: "bg-yellow-500/20 text-yellow-300",
    features: ["Unlimited links", "Advanced analytics", "Custom domains", "Priority support", "API access", "Bulk operations"],
  },
};

export default function PremiumPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = (searchParams.get("tab") as SidebarTab) ?? "Subscription";
  const [activeTab, setActiveTab] = useState<SidebarTab>(tabFromUrl);

  const [userTier, setUserTier] = useState<UserTier>("free"); 

  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 10,
    minutes: 24,
    seconds: 59,
  });

  // Sync tab from URL on param change
  useEffect(() => {
    const t = searchParams.get("tab") as SidebarTab;
    if (t) setActiveTab(t);
  }, [searchParams]);

  // Countdown timer — only runs when on Expires tab
  useEffect(() => {
    if (activeTab !== "Expires") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0)   { hours = 23; days--; }
        if (days < 0)    { days = 0; hours = 0; minutes = 0; seconds = 0; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);
    router.push(`/premium?tab=${tab}`, { scroll: false });
  };

  const navItems: { id: SidebarTab; label: string }[] = [
    { id: "Subscription", label: "Subscription" },
    { id: "Billing",      label: "Billing" },
    { id: "Expires",      label: "Expires In" },
  ];

  const tierMeta = userTier !== "free" ? TIER_META[userTier] : null;

  return (
    <div className="min-h-screen bg-[#141414] text-white transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex gap-0 items-stretch min-h-[calc(100vh-10rem)]">

          {/* ── Sidebar ───────────────────────────────────────────── */}
          <aside className="w-52 shrink-0 self-stretch border-r border-white/10">
            <div className="sticky top-24 pt-2 flex flex-col gap-0">

              {/* Section label */}
              <p className="px-6 pb-3 text-[11px] font-semibold uppercase tracking-widest text-white/30">
                Account
              </p>

              {/* Nav items */}
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`relative flex items-center px-6 py-2.5 text-sm font-medium transition-colors duration-150 text-left w-full
                      ${isActive ? "text-white" : "text-white/45 hover:text-white/80"}`}
                  >
                    {/* Left accent bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-white" />
                    )}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────────────── */}
          <section className="flex-1 min-w-0 px-8 py-2">

            {/* SUBSCRIPTION */}
            {activeTab === "Subscription" && (
              <>
                {tierMeta ? (
                  /* ── User is on a paid tier ── */
                  <div className="max-w-2xl">
                    <h2 className="text-xl font-semibold mb-1">Your Subscription</h2>
                    <p className="text-white/40 text-sm mb-8">You're currently on an active plan.</p>

                    {/* Current plan card */}
                    <div className={`rounded-2xl border p-6 mb-6 ${tierMeta.bg}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl font-bold ${tierMeta.color}`}>
                            {tierMeta.label}
                          </span>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${tierMeta.badge}`}>
                            Active
                          </span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${tierMeta.color} opacity-60`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                      </div>

                      {/* Features */}
                      <ul className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2">
                        {tierMeta.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 shrink-0 ${tierMeta.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleTabChange("Expires")}
                        className="px-4 py-2 text-sm rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors"
                      >
                        View expiry
                      </button>
                      <button className="px-4 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                        Cancel plan
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── Free user — show full upgrade UI ── */
                  <div className="w-full">
                    <Premium />
                  </div>
                )}
              </>
            )}

            {/* BILLING */}
            {activeTab === "Billing" && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-1">Billing</h2>
                <p className="text-white/40 text-sm mb-8">Manage your payment methods and invoices.</p>

                {/* Payment method */}
                <div className="rounded-xl border border-white/10 bg-[#1e1e1e] p-5 flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-7 rounded bg-white/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                      <p className="text-xs text-white/40">Expires 12/27</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/60">Default</span>
                </div>

                <button className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2 mb-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add payment method
                </button>

                {/* Invoices */}
                <h3 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider text-xs">Recent Invoices</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { date: "Mar 1, 2026", amount: "$9.99", status: "Paid" },
                    { date: "Feb 1, 2026", amount: "$9.99", status: "Paid" },
                    { date: "Jan 1, 2026", amount: "$9.99", status: "Paid" },
                  ].map((inv, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#1e1e1e] border border-white/10 text-sm">
                      <span className="text-white/50">{inv.date}</span>
                      <span className="font-medium">{inv.amount}</span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400">{inv.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXPIRES IN */}
            {activeTab === "Expires" && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-1">Expires In</h2>
                <p className="text-white/40 text-sm mb-10">Make sure to renew before time runs out.</p>

                <div className="flex gap-6">
                  {[
                    { value: timeLeft.days,    label: "days"  },
                    { value: timeLeft.hours,   label: "hours" },
                    { value: timeLeft.minutes, label: "min"   },
                    { value: timeLeft.seconds, label: "sec"   },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                      <div className="w-20 h-20 rounded-2xl bg-[#1e1e1e] border border-white/10 flex items-center justify-center">
                        <span
                          className="countdown font-mono text-3xl font-semibold"
                          style={{ "--value": value } as React.CSSProperties}
                          aria-live="polite"
                          aria-label={String(value)}
                        >
                          {value}
                        </span>
                      </div>
                      <span className="text-xs text-white/40 uppercase tracking-widest">{label}</span>
                    </div>
                  ))}
                </div>

                <button className="mt-10 px-6 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors">
                  Renew Plan
                </button>
              </div>
            )}

          </section>
        </div>
      </main>
    </div>
  );
}