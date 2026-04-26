"use client";

import Navbar from "@/app/components/navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Analytics01Icon, ArrowRightDoubleIcon } from "@hugeicons/core-free-icons";


type CellValue = true | false | string;

interface ComparisonRow {
  label: string;
  free: CellValue;
  essential: CellValue;
  pro: CellValue;
}

interface ComparisonSection {
  title: string;
  rows: ComparisonRow[];
}

const COMPARISON_SECTIONS: ComparisonSection[] = [
  {
    title: "Links & QR Codes",
    rows: [
      { label: "Links per month", free: "100", essential: "10,000", pro: "40,000" },
      { label: "QR Codes per month", free: "30", essential: "300", pro: "2,000" },
    ],
  },
  {
    title: "Analytics & Tracking",
    rows: [
      { label: "Click tracking", free: true, essential: true, pro: true },
      { label: "Location", free: true, essential: true, pro: true },
      { label: "Browsers", free: false, essential: true, pro: true },
      { label: "OS details", free: false, essential: true, pro: true },
      { label: "Devices", free: false, essential: true, pro: true },
      { label: "Top referrers", free: false, essential: true, pro: true },
    ],
  },
  {
    title: "Advanced Features",
    rows: [
      { label: "Bulk create", free: false, essential: true, pro: true },
      { label: "Custom domains", free: false, essential: "4 domains", pro: "10 domains" },
      { label: "Custom URLs", free: false, essential: true, pro: true },
      { label: "API access", free: false, essential: false, pro: true },
      { label: "Security options", free: false, essential: true, pro: true },
    ],
  },
  {
    title: "Pricing",
    rows: [
      { label: "Price per month", free: "₹0", essential: "₹300", pro: "₹1,200" },
      { label: "Original price", free: "—", essential: "₹1,200", pro: "₹5,600" },
    ],
  },
];


function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-white/30 ml-auto transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function Cell({ value, tier }: { value: CellValue; tier: "free" | "essential" | "pro" }) {
  const colBg = tier === "essential" ? "bg-blue-500/5" : tier === "pro" ? "bg-yellow-500/5" : "";
  const checkColor = tier === "essential" ? "text-blue-400" : tier === "pro" ? "text-yellow-400" : "text-white/30";

  if (value === true) {
    return (
      <div className={`px-3 py-3.5 flex items-center justify-center ${colBg}`}>
        <CheckIcon className={`w-4 h-4 ${checkColor}`} />
      </div>
    );
  }

  if (value === false || value === "—") {
    return (
      <div className={`px-3 py-3.5 flex items-center justify-center text-white/20 text-lg ${colBg}`}>
        —
      </div>
    );
  }

  return (
    <div className={`px-3 py-3.5 flex items-center justify-center text-sm ${tier === "free" ? "text-white/50" : "text-white"} ${colBg}`}>
      {value}
    </div>
  );
}

function Section({ section }: { section: ComparisonSection }) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full border-t border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
      >
        <div className="px-5 py-3 flex items-center">
          <span className="text-sm font-semibold text-white/80">{section.title}</span>
          <ChevronIcon open={open} />
        </div>
      </button>

      {open && section.rows.map((row, i) => (
        <div
          key={row.label}
          className={`grid grid-cols-[2fr_1fr_1fr_1fr] border-t border-white/5 hover:bg-white/[0.04] transition-colors ${i % 2 !== 0 ? "bg-white/[0.015]" : ""}`}
        >
          <div className="px-5 py-3.5 text-sm text-white/60">{row.label}</div>
          <Cell value={row.free} tier="free" />
          <Cell value={row.essential} tier="essential" />
          <Cell value={row.pro} tier="pro" />
        </div>
      ))}
    </div>
  );
}

function UsageStat({ label, used, limit, colorClass }: { label: string; used: number; limit: number; colorClass: string }) {
  const percentage = Math.min((used / limit) * 100, 100);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{used.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-xs mb-1">Limit</p>
          <p className="text-sm font-medium text-white/60">{limit.toLocaleString()}</p>
        </div>
      </div>
      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}


export default function Premium() {
  const router = useRouter();
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loading, setLoading] = useState<"ESSENTIAL" | "PRO" | null>(null);
  
  const [plan, setPlan] = useState("FREE"); 
  const [planStartedAt, setPlanStartedAt] = useState("");
  const [planExpiresAt, setPlanExpiresAt] = useState("");
  const [totalLinksUsed, setTotalLinksUsed] = useState(0);
  const [totalQrCodesUsed, setTotalQrCodesUsed] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (!res.data.authenticated) {
          router.push("/auth/signin");
          return;
        }

        setPlan(res.data.plan || "FREE");
        setPlanStartedAt(res.data.planStartedAt || "");
        setPlanExpiresAt(res.data.planExpiresAt || "");
        setTotalLinksUsed(res.data.linksUsed || 0);
        setTotalQrCodesUsed(res.data.qrUsed || 0);

      } catch (err) {
        console.error("Auth check failed", err);
        router.push("/auth/signin");
      } finally {
        setIsInitialLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  async function handleCheckout(targetPlan: "ESSENTIAL" | "PRO") {
    try {
      setLoading(targetPlan);
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan: targetPlan }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.checkout_url;

    } catch (error) {
      console.error(error);
      alert("Unable to start checkout. Please try again.");
      
    } finally {
      setLoading(null);
    }
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center gap-4 h-[calc(100vh-80px)]">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
          <p className="text-neutral-500 text-sm font-medium tracking-wide">Syncing your account...</p>
        </div>
      </div>
    );
  }

  if (plan !== "FREE") {
    const isPro = plan === "PRO";
    const linkLimit = isPro ? 40000 : 10000;
    const qrLimit = isPro ? 2000 : 300;
    const planColor = isPro ? "from-yellow-400 to-amber-600" : "from-blue-400 to-blue-600";
    const planBorder = isPro ? "border-yellow-500/20" : "border-blue-500/20";
    const planBg = isPro ? "bg-yellow-500/5" : "bg-blue-500/5";

    return (
      <div className="min-h-screen bg-[#141414] text-white font-one">
        <Navbar />
        <main className="max-w-5xl mx-auto px-6 py-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black tracking-tight">Premium Dashboard</h1>
                <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Active
                </span>
              </div>
              <p className="text-neutral-500 text-lg">Manage your elite link shortening infrastructure.</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.open("mailto:fasturl@tutamail.com")}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-all"
              >
                Priority Support
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className={`lg:col-span-1 rounded-3xl border ${planBorder} ${planBg} p-8 relative overflow-hidden flex flex-col justify-between group`}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${planColor} opacity-10 blur-3xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`} />
              
              <div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-6">Current Tier</p>
                <h2 className={`text-6xl font-black mb-2 bg-gradient-to-r ${planColor} bg-clip-text text-transparent italic`}>
                  {plan}
                </h2>
                <div className="flex items-center gap-2 text-white/60 text-sm mb-8">
                  <span className="font-medium">Monthly Cycle</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-white/40">Renews in {planExpiresAt ? Math.ceil((new Date(planExpiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0} days</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40">Billing Period</span>
                    <span className="text-white/80 font-mono">Monthly</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40">Next Invoice</span>
                    <span className="text-white/80 font-mono">{planExpiresAt ? new Date(planExpiresAt).toLocaleDateString() : "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                {!isPro && (
                  <button 
                    onClick={() => handleCheckout("PRO")}
                    className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 group/btn"
                  >
                    Upgrade to PRO <HugeiconsIcon icon={ArrowRightDoubleIcon} size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                )}
                {isPro && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <p className="text-white/60 text-xs font-medium">You are on the highest tier.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UsageStat
                  label="Links Capacity"
                  used={totalLinksUsed}
                  limit={linkLimit}
                  colorClass={isPro ? "bg-yellow-500" : "bg-blue-500"}
                />
                <UsageStat
                  label="QR Engine"
                  used={totalQrCodesUsed}
                  limit={qrLimit}
                  colorClass={isPro ? "bg-yellow-400" : "bg-blue-400"}
                />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <HugeiconsIcon icon={Analytics01Icon} size={20} className="text-blue-400" />
                  Unlocked Capabilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                  {[
                    "Detailed Click Analytics",
                    "Advanced Geo-Tracking",
                    "Bulk URL Creation",
                    "Custom Branded Slugs",
                    "High-Speed Redirection",
                    isPro ? "Full Developer API Access" : "4 Custom Domains",
                    isPro ? "10 Custom Domains" : "Priority Support",
                    "Device & Browser Insights"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isPro ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        <CheckIcon className="w-3 h-3" />
                      </div>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div className="mt-16 text-center">
            <p className="text-white/20 text-sm mb-4">Want to see how your plan stacks up?</p>
            <button 
              onClick={() => {
                const el = document.getElementById('comparison');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-white/40 hover:text-white underline underline-offset-8 decoration-white/10 hover:decoration-white transition-all text-xs uppercase tracking-widest font-bold"
            >
              View Full Comparison
            </button>
          </div>
          
          <div id="comparison" className="mt-32 pt-20">
             <div className="mb-10 text-center">
                <h2 className="text-3xl font-black mb-2 tracking-tight">Full Plan Breakdown</h2>
                <p className="text-white/40 text-sm">Every detail of our infrastructure tiers.</p>
              </div>

              <div className="rounded-3xl border border-white/10 overflow-hidden bg-white/[0.01] backdrop-blur-3xl shadow-2xl">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-white/10 bg-[#1a1a1a]">
                  <div className="px-6 py-6 text-xs font-bold uppercase tracking-[0.2em] text-white/30">Infrastructure</div>
                  <div className="px-3 py-6 text-center text-sm font-bold text-white/50">Free</div>
                  <div className={`px-3 py-6 text-center text-sm font-bold ${!isPro ? 'text-blue-400 bg-blue-500/10' : 'text-blue-400/40'}`}>Essentials</div>
                  <div className={`px-3 py-6 text-center text-sm font-bold ${isPro ? 'text-yellow-400 bg-yellow-500/10' : 'text-yellow-400/40'}`}>Pro</div>
                </div>

                {COMPARISON_SECTIONS.map((section) => (
                  <Section key={section.title} section={section} />
                ))}
              </div>
          </div>

        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Unlock the Full Potential of FastURL</h1>
          <p className="text-white/40 text-base max-w-xl mx-auto">Stop guessing and start tracking. Deliver the insights you need to grow your digital presence.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-white/70">Free</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/50">Current</span>
            </div>
            <div className="text-3xl font-bold mb-1">₹0</div>
            <div className="text-xs text-white/30 mb-5">Perfect to get started</div>
            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {["100 links/month", "30 QR Codes/month", "Click tracking", "Location tracking"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/50">
                  <CheckIcon className="w-4 h-4 shrink-0 text-white/30" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl border border-white/10 text-sm text-white/40 font-medium cursor-not-allowed">
              Current Plan
            </button>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6 flex flex-col relative scale-105 shadow-2xl shadow-blue-500/10 z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[11px] font-semibold shadow-md whitespace-nowrap">
              ⭐ Recommended
            </div>
            <div className="flex items-center justify-between mb-4 pt-2">
              <span className="text-xl font-bold text-blue-400">Essentials</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300">Popular</span>
            </div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-sm line-through text-white/25">₹1,200</span>
              <span className="text-3xl font-bold">₹300<span className="text-base font-normal text-white/40">/mo</span></span>
            </div>
            <div className="text-xs text-white/30 mb-5">Most popular choice</div>
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
                <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckIcon className="w-4 h-4 shrink-0 text-blue-400" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout("ESSENTIAL")}
              disabled={loading !== null}
              className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading === "ESSENTIAL" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upgrade Now"}
            </button>
          </div>

          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-yellow-400">Pro</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300">Best value</span>
            </div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-sm line-through text-white/25">₹5,600</span>
              <span className="text-3xl font-bold">₹1,200<span className="text-base font-normal text-white/40">/mo</span></span>
            </div>
            <div className="text-xs text-white/30 mb-5">For power users</div>
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
                <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckIcon className="w-4 h-4 shrink-0 text-yellow-400" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout("PRO")}
              disabled={loading !== null}
              className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading === "PRO" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Go Pro"}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Compare plans</h2>
          <p className="text-white/30 text-sm">Full breakdown of features included in each tier.</p>
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.01]">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-white/10 bg-[#1a1a1a]">
            <div className="px-5 py-4 text-xs font-semibold uppercase tracking-widest text-white/30">Feature</div>
            <div className="px-3 py-4 text-center text-sm font-semibold text-white/50">Free</div>
            <div className="px-3 py-4 text-center text-sm font-semibold text-blue-400 bg-blue-500/5">Essentials</div>
            <div className="px-3 py-4 text-center text-sm font-semibold text-yellow-400 bg-yellow-500/5">Pro</div>
          </div>

          {COMPARISON_SECTIONS.map((section) => (
            <Section key={section.title} section={section} />
          ))}
        </div>

        <p className="mt-12 text-center text-white/30 text-sm">
          Have questions about our plans? <a href="mailto:fasturl@tutamail.com" className="text-blue-400 hover:underline">Contact support</a>
        </p>
      </main>
    </div>
  );
}