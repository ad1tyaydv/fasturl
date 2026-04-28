"use client";

import Navbar from "@/app/components/navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Analytics01Icon, ArrowRightDoubleIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";


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
      className={`w-4 h-4 text-muted-foreground/50 ml-auto transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function Cell({ value, tier }: { value: CellValue; tier: "free" | "essential" | "pro" }) {
  const colBg = tier === "essential" ? "bg-blue-500/[0.03] dark:bg-blue-500/[0.05]" : tier === "pro" ? "bg-yellow-500/[0.03] dark:bg-yellow-500/[0.05]" : "";
  const checkColor = tier === "essential" ? "text-blue-500" : tier === "pro" ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground/30";

  if (value === true) {
    return (
      <div className={`px-3 py-3.5 flex items-center justify-center ${colBg}`}>
        <CheckIcon className={`w-4 h-4 ${checkColor}`} />
      </div>
    );
  }

  if (value === false || value === "—") {
    return (
      <div className={`px-3 py-3.5 flex items-center justify-center text-muted-foreground/20 text-lg ${colBg}`}>
        —
      </div>
    );
  }

  return (
    <div className={`px-3 py-3.5 flex items-center justify-center text-sm ${tier === "free" ? "text-muted-foreground" : "text-foreground font-medium"} ${colBg}`}>
      {value}
    </div>
  );
}

function Section({ section }: { section: ComparisonSection }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer outline-none focus:bg-secondary/60"
      >
        <div className="px-5 py-3 flex items-center">
          <span className="text-sm font-bold uppercase tracking-wider text-foreground/70">{section.title}</span>
          <ChevronIcon open={open} />
        </div>
      </button>

      {open && section.rows.map((row, i) => (
        <div
          key={row.label}
          className={`grid grid-cols-[2fr_1fr_1fr_1fr] border-t border-border/50 hover:bg-accent/30 transition-colors ${i % 2 !== 0 ? "bg-accent/10" : ""}`}
        >
          <div className="px-5 py-3.5 text-sm text-muted-foreground">{row.label}</div>
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
    <div className="bg-secondary/30 border border-border rounded-2xl p-5 group hover:border-border/80 transition-all duration-300">
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1 group-hover:text-foreground/80 transition-colors">{label}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">{used.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground/60 text-xs mb-1">Limit</p>
          <p className="text-sm font-medium text-muted-foreground">{limit.toLocaleString()}</p>
        </div>
      </div>
      <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
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
  const [isAnnual, setIsAnnual] = useState(true);
  
  const [plan, setPlan] = useState("FREE"); 
  const [planType, setPlanType] = useState("monthly");
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
        setPlanType(res.data.planType || "monthly");
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
        body: JSON.stringify({ 
          plan: targetPlan,
          billingPeriod: isAnnual ? "ANNUALLY" : "MONTHLY"
        }),
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
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <div className="flex flex-col items-center justify-center gap-4 h-[calc(100vh-80px)]">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground text-sm font-medium tracking-wide">Syncing your account...</p>
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
      <div className="min-h-screen bg-background text-foreground font-one transition-colors duration-300">
        <Navbar />
        <main className="max-w-5xl mx-auto px-6 py-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black tracking-tight text-foreground">Premium Dashboard</h1>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>
              <p className="text-muted-foreground text-lg font-medium">Manage your elite link shortening infrastructure.</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.open("mailto:fasturl@tutamail.com")}
                className="px-5 py-2.5 rounded-xl bg-secondary border border-border text-sm font-semibold hover:bg-accent transition-all cursor-pointer shadow-sm active:scale-95 text-foreground"
              >
                Support
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            
            <div className={`lg:col-span-1 rounded-3xl border ${planBorder} ${planBg} p-8 relative overflow-hidden flex flex-col justify-between group transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-black/20`}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${planColor} opacity-10 blur-3xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity duration-700`} />
              
              <div className="relative z-10">
                <p className="text-muted-foreground/60 text-[15px] font-bold uppercase tracking-[0.25em] mb-6">Current Tier</p>
                <h2 className={`text-3xl sm:text-4xl lg:text-4xl font-black mb-2 bg-gradient-to-r ${planColor} bg-clip-text text-transparent italic break-words leading-tight tracking-tighter`}>
                  {plan}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-8 font-medium">
                  <span className="capitalize">{planType} Cycle</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-muted-foreground/60">Renews in {planExpiresAt ? Math.ceil((new Date(planExpiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0} days</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground/60">Billing Period</span>
                    <span className="text-foreground font-mono capitalize">{planType}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground/60">Next Invoice</span>
                    <span className="text-foreground font-mono">{planExpiresAt ? new Date(planExpiresAt).toLocaleDateString() : "N/A"}</span>
                  </div>
                </div>
              </div>

              {isPro && (
                <div className="relative z-10 pt-6 border-t border-border mt-6">
                  <div className="p-4 rounded-2xl bg-secondary/30 border border-border text-center flex items-center gap-3">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="text-yellow-600 dark:text-yellow-400" />
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Maximum Tier Unlocked</p>
                  </div>
                </div>
              )}
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

              <div className="bg-secondary/10 border border-border rounded-3xl p-8 group hover:border-border/60 transition-all duration-500 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 tracking-tight text-foreground">
                  <HugeiconsIcon icon={Analytics01Icon} size={20} className={isPro ? "text-yellow-600 dark:text-yellow-400" : "text-blue-500"} />
                  Unlocked Capabilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12">
                  {[
                    "Detailed Click Analytics",
                    "Advanced Geo-Tracking",
                    "Bulk URL Creation",
                    "Custom Branded Slugs",
                    "High-Speed Redirection",
                    isPro ? "Full Developer API Access" : "4 Custom Domains",
                    isPro ? "10 Custom Domains" : "Support",
                    "Device & Browser Insights"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground group/item">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-300 group-hover/item:scale-110 ${isPro ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' : 'bg-blue-500/10 text-blue-500'}`}>
                        <CheckIcon className="w-3 h-3" />
                      </div>
                      <span className="group-hover/item:text-foreground transition-colors">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {!isPro && (
            <div className="mt-12 p-8 rounded-3xl bg-secondary/10 border border-border animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 shadow-sm">
              <div className="max-w-xl mx-auto flex flex-col items-center text-center">
                <h3 className="text-2xl font-black mb-2 tracking-tight italic text-foreground">Want To Level Up?</h3>
                <p className="text-muted-foreground text-sm mb-8">Switch to the Pro tier for maximum limits and full API access.</p>

                <div className="w-full flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                      <span>Select Upgrade Cycle</span>
                      <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full animate-pulse">Save upto 38%</span>
                    </div>
                    <div className="relative grid grid-cols-2 gap-1 p-1.5 bg-secondary rounded-2xl border border-border">
                      <button
                        onClick={() => setIsAnnual(false)}
                        className={`relative z-10 py-3 text-[15px] font-black rounded-xl transition-all duration-300 ${!isAnnual ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'} cursor-pointer`}
                      >
                        MONTHLY
                      </button>
                      <button
                        onClick={() => setIsAnnual(true)}
                        className={`relative z-10 py-3 text-[15px] font-black rounded-xl transition-all duration-300 ${isAnnual ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'} cursor-pointer`}
                      >
                        ANNUALLY
                      </button>
                      <div 
                        className={`absolute top-1.5 left-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-xl transition-all duration-300 ease-out shadow-lg ${isAnnual ? 'translate-x-full' : 'translate-x-0'}`}
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => handleCheckout("PRO")}
                    disabled={loading === "PRO"}
                    className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.99] transition-all shadow-xl flex flex-col items-center justify-center gap-0.5 group/btn cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2">
                      {loading === "PRO" ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Upgrade to PRO <HugeiconsIcon icon={ArrowRightDoubleIcon} size={18} className="group-hover/btn:translate-x-1 transition-transform" /></>}
                    </span>
                    <span className="text-[15px] font-black tracking-tight opacity-80 group-hover:opacity-100 transition-opacity">
                      {isAnnual ? "₹8,999 / year" : "₹1,200 / month"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-16 text-center animate-in fade-in duration-1000 delay-500">
            <p className="text-muted-foreground/40 text-sm mb-4">Want to see how your plan stacks up?</p>
            <button 
              onClick={() => {
                const el = document.getElementById('comparison');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-muted-foreground hover:text-foreground underline underline-offset-8 decoration-border hover:decoration-primary transition-all text-xs uppercase tracking-widest font-bold cursor-pointer"
            >
              View Full Comparison
            </button>
          </div>
          
          <div id="comparison" className="mt-32 pt-20 border-t border-border">
             <div className="mb-12 text-center">
                <h2 className="text-4xl font-black mb-3 tracking-tighter text-foreground">Full Plan Breakdown</h2>
                <p className="text-muted-foreground text-base max-w-md mx-auto">Compare features across our high-performance infrastructure tiers.</p>
              </div>

              <div className="rounded-3xl border border-border overflow-hidden bg-background shadow-2xl">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-border bg-secondary/50">
                  <div className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Infrastructure</div>
                  <div className="px-3 py-6 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Free</div>
                  <div className={`px-3 py-6 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${plan === 'ESSENTIAL' ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10' : 'text-blue-500/40'}`}>Essentials</div>
                  <div className={`px-3 py-6 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${plan === 'PRO' ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10' : 'text-yellow-500/40'}`}>Pro</div>
                </div>

                {COMPARISON_SECTIONS.map((section) => (
                  <Section 
                    key={section.title} 
                    section={{
                      ...section,
                      rows: section.rows.map(row => {
                        if (section.title === "Pricing") {
                          if (row.label === "Price per month" || row.label === "Price per year") {
                            return {
                              ...row,
                              label: isAnnual ? "Price per year" : "Price per month",
                              essential: isAnnual ? "₹2,299" : "₹300",
                              pro: isAnnual ? "₹8,999" : "₹1,200"
                            };
                          }
                          if (row.label === "Original price") {
                            return {
                              ...row,
                              essential: isAnnual ? "₹14,400" : "₹1,200",
                              pro: isAnnual ? "₹67,200" : "₹5,600"
                            };
                          }
                        }
                        return row;
                      })
                    }} 
                  />
                ))}
              </div>
          </div>

        </main>
      </div>
    );
  }

  // --- RENDER FOR FREE USERS ---
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 tracking-tight text-foreground">Unlock the Full Potential of FastURL</h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">Stop guessing and start tracking. Deliver the insights you need to grow your digital presence.</p>
        </div>

        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <span className="text-[10px] font-bold bg-green-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-foreground/70">Free</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">Current</span>
            </div>
            <div className="text-3xl font-bold mb-1 text-foreground">₹0</div>
            <div className="text-xs text-muted-foreground mb-5">Perfect to get started</div>
            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {["100 links/month", "30 QR Codes/month", "Click tracking", "Location tracking"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckIcon className="w-4 h-4 shrink-0 text-muted-foreground/40" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl border border-border bg-secondary/50 text-sm text-muted-foreground font-medium cursor-not-allowed">
              Current Plan
            </button>
          </div>

          <div className="rounded-2xl border border-blue-600/30 bg-blue-600/5 dark:bg-blue-600/10 p-6 flex flex-col relative scale-105 shadow-2xl shadow-blue-600/10 z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[11px] font-semibold shadow-md whitespace-nowrap">
              ⭐ Recommended
            </div>
            <div className="flex items-center justify-between mb-4 pt-2">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Essentials</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-600/20 text-blue-700 dark:text-blue-300">Popular</span>
            </div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-sm line-through text-muted-foreground/30">{isAnnual ? "₹14,400" : "₹1,200"}</span>
              <span className="text-3xl font-bold text-foreground">₹{isAnnual ? "2,299" : "300"}<span className="text-base font-normal text-muted-foreground">{isAnnual ? "/yr" : "/mo"}</span></span>
            </div>
            <div className="text-xs text-muted-foreground mb-5">Most popular choice</div>
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
                <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckIcon className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout("ESSENTIAL")}
              disabled={loading !== null}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer shadow-lg shadow-blue-600/20"
            >
              {loading === "ESSENTIAL" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upgrade Now"}
            </button>
          </div>

          <div className="rounded-2xl border border-yellow-600/30 bg-yellow-600/5 dark:bg-yellow-600/10 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">Pro</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-yellow-600/20 text-yellow-700 dark:text-yellow-300">Best value</span>
            </div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-sm line-through text-muted-foreground/30">{isAnnual ? "₹67,200" : "₹5,600"}</span>
              <span className="text-3xl font-bold text-foreground">₹{isAnnual ? "8,999" : "1,200"}<span className="text-base font-normal text-muted-foreground">{isAnnual ? "/yr" : "/mo"}</span></span>
            </div>
            <div className="text-xs text-muted-foreground mb-5">For power users</div>
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
                <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckIcon className="w-4 h-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout("PRO")}
              disabled={loading !== null}
              className="w-full py-3 rounded-xl bg-foreground text-background hover:opacity-90 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer shadow-lg"
            >
              {loading === "PRO" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Go Pro"}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1 text-foreground">Compare plans</h2>
          <p className="text-muted-foreground text-sm">Full breakdown of features included in each tier.</p>
        </div>

        <div className="rounded-2xl border border-border overflow-hidden bg-background shadow-sm">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-border bg-secondary/50">
            <div className="px-5 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Feature</div>
            <div className="px-3 py-4 text-center text-sm font-semibold text-muted-foreground">Free</div>
            <div className="px-3 py-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-600/5">Essentials</div>
            <div className="px-3 py-4 text-center text-sm font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-600/5">Pro</div>
          </div>

          {COMPARISON_SECTIONS.map((section) => (
            <div key={section.title}>
              <Section 
                section={{
                  ...section,
                  rows: section.rows.map(row => {
                    if (section.title === "Pricing") {
                      if (row.label === "Price per month" || row.label === "Price per year") {
                        return {
                          ...row,
                          label: isAnnual ? "Price per year" : "Price per month",
                          essential: isAnnual ? "₹2,299" : "₹300",
                          pro: isAnnual ? "₹8,999" : "₹1,200"
                        };
                      }
                      if (row.label === "Original price") {
                        return {
                          ...row,
                          essential: isAnnual ? "₹14,400" : "₹1,200",
                          pro: isAnnual ? "₹67,200" : "₹5,600"
                        };
                      }
                    }
                    return row;
                  })
                }} 
              />
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-muted-foreground text-sm">
          Have questions about our plans? <a href="mailto:fasturl@tutamail.com" className="text-blue-500 hover:underline font-medium">Contact support</a>
        </p>
      </main>
    </div>
  );
}
