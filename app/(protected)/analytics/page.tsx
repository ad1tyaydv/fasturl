
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  AnalyticsUpIcon, Search01Icon, File02Icon,
  Edit03Icon, ArrowLeft01Icon
} from '@hugeicons/core-free-icons';

import Navbar from "@/app/components/navbar";
import { useUser } from "@/app/components/userContext";
import ClicksAnalytics from "@/app/components/analytics/clicks";
import BrowserAnalytics from "@/app/components/analytics/browsers";
import DeviceAnalytics from "@/app/components/analytics/devices";
import LocationAnalytics from "@/app/components/analytics/location";
import OSAnalytics from "@/app/components/analytics/os";
import ReferrerAnalytics from "@/app/components/analytics/referrers";
import { AnalyticsDropDown } from "@/app/dropDown/analyticsDropDown";
import { AnalyticsTypeToggle, AnalyticsType } from "@/app/dropDown/analyticsTypeDropDown";


const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN!;

function PremiumBlock({ children, isFree, isLoading }: { children: React.ReactNode; isFree: boolean; isLoading?: boolean }) {
  return (
    <div className="relative flex w-full bg-card border border-border rounded-xl p-4 min-h-[400px] overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-background/40 backdrop-blur-[2px] flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-500" />
        </div>
      )}
      {isFree && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[6px]">
          <div className="p-3 bg-secondary rounded-full mb-3 border border-border">
            <HugeiconsIcon icon={Edit03Icon} className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-foreground font-medium text-lg mb-1">Detailed Analytics Locked</h3>
          <p className="text-muted-foreground text-sm mb-5 text-center px-4">Upgrade your plan to see deeper insights.</p>
          <Link href="/premium">
            <button className="px-5 py-2 bg-primary text-primary-foreground font-medium rounded-lg text-sm hover:opacity-90 transition-colors cursor-pointer">Upgrade to Premium</button>
          </Link>
        </div>
      )}
      <div className={`w-full h-full transition-all duration-300 ${isFree ? "opacity-30 blur-[4px] pointer-events-none select-none" : ""}`}>
        {children}
      </div>
    </div>
  );
}



export default function AnalyticsPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  const [analyticsType, setAnalyticsType] = useState<AnalyticsType>("links");
  const [isChangingType, setIsChangingType] = useState(false);

  const [urls, setUrls] = useState<any[]>([]);
  const [bulkBatches, setBulkBatches] = useState<any[]>([]);
  const [tier, setTier] = useState<string>("FREE");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingStats, setFetchingStats] = useState(false);
  const [days, setDays] = useState<number>(7);


  const fetchAnalytics = async (id: string, type: AnalyticsType, currentDays: number) => {
    setFetchingStats(true);
    try {
      const endpoint = type === "links" ? "/api/analytics/link" : "/api/analytics/bulkLinks";
      const payload = type === "links" ? { linkId: id, days: currentDays } : { batchId: id, days: currentDays };

      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setAnalyticsData(data);

    } catch (err) {
      console.error("Something went wrong");

    } finally {
      setFetchingStats(false);
    }
  };


  useEffect(() => {
    if (selectedId) {
      fetchAnalytics(selectedId, analyticsType, days);
    }
  }, [days]);


  useEffect(() => {
    if (userLoading) {
      return;
    }

    if (!user) {
      router.replace("/auth/signin");
    }

  }, [user, userLoading]);


  useEffect(() => {
    if (user) {
      setTier(user.plan || "FREE");
    }
  }, [user]);


  useEffect(() => {
    async function init() {
      try {
        const [urlsRes, bulkRes] = await Promise.all([
          fetch("/api/fetchUrls").catch(() => null),
          fetch("/api/shortUrl/bulkLinks/fetchBulkLinks").catch(() => null),
        ]);

        let fetchedUrls = [];
        if (urlsRes?.ok) {
          const data = await urlsRes.json();
          fetchedUrls = data.urls || [];
          setUrls(fetchedUrls);
        }

        let fetchedBulk = [];
        if (bulkRes?.ok) {
          const data = await bulkRes.json();
          fetchedBulk = data.bulkLinks || [];
          setBulkBatches(fetchedBulk);
        }

        const search = window.location.search;
        if (search.startsWith("?=")) {
          const fullValue = search.substring(2);
          const [typePart, idPart] = fullValue.split("/");

          let currentType: AnalyticsType = "links";
          if (typePart === "bulkanalytics") {
            currentType = "bulk";
            setAnalyticsType("bulk");

          } else {
            setAnalyticsType("links");
          }

          if (idPart) {
            const items = typePart === "bulkanalytics" ? fetchedBulk : fetchedUrls;
            const item = items.find((i: any) =>
              typePart === "bulkanalytics" ? i.id === idPart : i.shorturl === idPart
            );

            if (item) {
              setSelectedId(item.id);
              fetchAnalytics(item.id, currentType, days);
            }
          }
        }
      } catch (e) {
        console.error("Initialization error");

      } finally {
        setLoading(false);
      }
    }

    if (user) {
      init();
    }

  }, [user]);


  const handleTypeChange = (newType: AnalyticsType) => {
    setIsChangingType(true);
    setTimeout(() => {
      setAnalyticsType(newType);
      setSelectedId(null);
      setAnalyticsData(null);
      setIsChangingType(false);

      const typeStr = newType === "links" ? "linkanalytics" : "bulkanalytics";
      router.push(`/analytics?=${typeStr}`, { scroll: false });
    }, 1000);
  };


  const filteredItems = useMemo(() => {
    const items = analyticsType === "links" ? urls : bulkBatches;
    const searchLower = searchQuery.toLowerCase();

    return items.filter((item) => {
      if (analyticsType === "links") {
        return item.shorturl?.toLowerCase().includes(searchLower) || item.linkName?.toLowerCase().includes(searchLower);
      }
      return item.name?.toLowerCase().includes(searchLower);
    }).sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  }, [urls, bulkBatches, searchQuery, analyticsType]);


  const handleItemClick = (item: any) => {
    setSelectedId(item.id);
    fetchAnalytics(item.id, analyticsType, days);

    const typeStr = analyticsType === "links" ? "linkanalytics" : "bulkanalytics";
    const identifier = analyticsType === "links" ? item.shorturl : item.id;
    router.push(`/analytics?=${typeStr}/${identifier}`, { scroll: false });
  };


  const isFree = tier === "FREE";


  const getDomain = (urlStr: string) => {
    try { return new URL(urlStr).hostname.replace("www.", ""); } catch { return ""; }
  };


  const getLogo = (urlStr: string) => {
    const domain = getDomain(urlStr);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  };


  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans selection:bg-blue-500/30 overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden bg-background relative">

        <AnimatePresence>
          {isChangingType && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[150] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md"
            >
              <div className="relative">
                <Loader2 className="w-12 h-12 text-foreground animate-spin" />
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
              </div>
              <p className="mt-4 text-muted-foreground text-xs font-bold tracking-widest uppercase animate-pulse">Switching Analytics...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {userLoading || (loading && user) ? (
          <div className="flex flex-1 items-center justify-center bg-background">
            <Loader2 className="animate-spin text-foreground w-8 h-8" />
          </div>
        ) : !user ? null : (
          <>
            <aside className={`border-r border-border flex-col bg-background shrink-0 ${selectedId ? 'hidden md:flex md:w-80' : 'flex w-full md:w-80'}`}>
              <div className="p-6 space-y-4">
                <div className="relative group">
                  <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder={`Search ${analyticsType}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar cursor-pointer">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 group cursor-pointer ${selectedId === item.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "hover:bg-secondary"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${selectedId === item.id ? "bg-white/20" : "bg-secondary"}`}>
                        {analyticsType === "links" ? (
                          <img src={getLogo(item.original)} alt="logo" className="w-4 h-4 rounded-full" />
                        ) : (
                          <HugeiconsIcon icon={File02Icon} size={14} />
                        )}
                      </div>
                      <span className="truncate text-sm font-medium">
                        {analyticsType === "links" ? `${DOMAIN}/${item.shorturl}` : (item.name || "Untitled Batch")}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <main className={`flex-1 overflow-y-auto bg-background ${!selectedId ? 'hidden md:block' : 'block'}`}>
              <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-8 md:space-y-10">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col items-start gap-4">
                    {selectedId && (
                      <button onClick={() => setSelectedId(null)} className="md:hidden flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" /> Back
                      </button>
                    )}

                    <AnalyticsTypeToggle value={analyticsType} onChange={handleTypeChange} />
                  </div>
                  {selectedId && <AnalyticsDropDown days={days} setDays={setDays} />}
                </header>

                {!selectedId ? (
                  <div className="h-[60vh] flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-3xl bg-secondary/10">
                    <HugeiconsIcon icon={AnalyticsUpIcon} size={48} className="opacity-20 mb-4" />
                    <p className="text-sm font-medium">Select a {analyticsType === "links" ? "link" : "batch"} from the sidebar to view data</p>
                  </div>
                ) : (
                  <>
                    <section className="relative rounded-xl border border-border bg-card overflow-hidden shadow-2xl">
                      {fetchingStats && (
                        <div className="absolute inset-0 z-50 bg-background/40 backdrop-blur-[2px] flex items-center justify-center">
                          <Loader2 className="animate-spin text-blue-500" />
                        </div>
                      )}
                      <ClicksAnalytics data={analyticsData?.clicks} days={days} />
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <PremiumBlock isFree={isFree} isLoading={fetchingStats}>
                        <LocationAnalytics data={analyticsData?.countries} days={days} />
                      </PremiumBlock>
                      <PremiumBlock isFree={isFree} isLoading={fetchingStats}>
                        <BrowserAnalytics data={analyticsData?.browsers} days={days} />
                      </PremiumBlock>
                      <PremiumBlock isFree={isFree} isLoading={fetchingStats}>
                        <DeviceAnalytics data={analyticsData?.devices} days={days} />
                      </PremiumBlock>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                      <PremiumBlock isFree={isFree} isLoading={fetchingStats}>
                        <OSAnalytics data={analyticsData?.os} days={days} />
                      </PremiumBlock>
                      <PremiumBlock isFree={isFree} isLoading={fetchingStats}>
                        <ReferrerAnalytics data={analyticsData?.referrers} days={days} />
                      </PremiumBlock>
                    </section>
                  </>
                )}
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );
}
