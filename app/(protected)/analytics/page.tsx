"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Loader2, BarChart3, Search, Lock } from "lucide-react";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  AnalyticsUpIcon, Search01Icon, QrCodeIcon }
  from '@hugeicons/core-free-icons';

import Navbar from "@/app/components/navbar";
import ClicksAnalytics from "@/app/components/analytics/clicks";
import BrowserAnalytics from "@/app/components/analytics/browsers";
import DeviceListAnalytics from "@/app/components/analytics/devices";
import CountryAnalytics from "@/app/components/analytics/location";
import OSAnalytics from "@/app/components/analytics/os";
import ReferrerAnalytics from "@/app/components/analytics/referrers";

import { AnalyticsDropDown } from "@/app/dropDown/analyticsDropDown";


const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN!;

function PremiumBlock({ children, isFree }: { children: React.ReactNode, isFree: boolean }) {
  return (
    <div className="relative flex w-full bg-black border border-neutral-800 rounded-xl p-4 min-h-[400px] overflow-hidden">
      {isFree && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[6px]">
          <div className="p-3 bg-neutral-900 rounded-full mb-3 border border-neutral-800">
            <Lock className="w-6 h-6 text-neutral-400" />
          </div>
          <h3 className="text-white font-medium text-lg mb-1">Detailed Analytics Locked</h3>
          <p className="text-neutral-400 text-sm mb-5 text-center px-4">
            Upgrade your plan to see deeper insights.
          </p>
          <Link href="/premium">
            <button className="px-5 py-2 bg-white text-black font-medium rounded-lg text-sm hover:bg-neutral-200 transition-colors cursor-pointer">
              Upgrade to Premium
            </button>
          </Link>
        </div>
      )}
      <div className={`w-full h-full transition-all duration-300 ${isFree ? 'opacity-30 blur-[4px] pointer-events-none select-none' : ''}`}>
        {children}
      </div>
    </div>
  );
}


export default function AnalyticsPage() {
  const [urls, setUrls] = useState<any[]>([]);
  const [tier, setTier] = useState<string>("FREE");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [fetchingStats, setFetchingStats] = useState(false);
  

  const [days, setDays] = useState<number>(7);

  useEffect(() => {
    async function init() {
      try {

        const [authRes, urlsRes] = await Promise.all([
          fetch("/api/auth/me").catch(() => null),
          fetch("/api/fetchUrls").catch(() => null)
        
        ]);


        if (authRes && authRes.ok) {
          const authData = await authRes.json();
          setTier(authData.plan || "FREE");
        
        }


        if (urlsRes && urlsRes.ok) {
          const data = await urlsRes.json();
          setUrls(data.urls || []);
        }

      } catch (e) {
        console.error("Initialization error:", e);

      } finally {
        setLoading(false);
      }
    }
    init();

  }, []);


  const filteredUrls = useMemo(() => {
    const filtered = urls.filter((url) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        url.shorturl?.toLowerCase().includes(searchLower) ||
        url.original?.toLowerCase().includes(searchLower)
      );
    });


    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

  }, [urls, searchQuery]);


  const handleLinkClick = async (linkId: string) => {
    setFetchingStats(true);
    setSelectedLink(linkId);
    try {
      const res = await fetch("/api/analytics/link", {
        method: "POST",
        body: JSON.stringify({ linkId }),
      });
      const data = await res.json();
      setAnalyticsData(data);

    } catch (err) {
      console.error(err);

    } finally {
      setFetchingStats(false);
    }
  };


  const isFree = tier === "FREE";


  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {loading ? (
          <div className="flex flex-1 items-center justify-center bg-black">
            <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
          </div>
        ) : (
          <>
            <aside className="w-80 border-r border-neutral-900 flex flex-col bg-black shrink-0">
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Your Links</h2>
                  <p className="text-[11px] text-neutral-500 uppercase tracking-widest mt-1">
                    {filteredUrls.length} links found
                  </p>
                </div>

                <div className="relative group">
                  <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text"
                    placeholder="Search by name, url, slug"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-neutral-600"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar cursor-pointer">
                {filteredUrls.map((url) => (
                  <button
                    key={url.id}
                    onClick={() => handleLinkClick(url.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 group ${
                      selectedLink === url.id 
                      ? "bg-blue-600 text-white"
                      : "hover:bg-neutral-900 hover:text-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedLink === url.id ? "bg-white" : "bg-neutral-700"}`} />
                      <div className="flex flex-col truncate cursor-pointer">
                        <span className="truncate text-sm font-medium">{DOMAIN}/{url.shorturl}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <main className="flex-1 overflow-y-auto bg-[#050505]">
              {!selectedLink ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-600">
                  <HugeiconsIcon icon={AnalyticsUpIcon} size={40}/>
                  <p className="text-sm mt-4">Click a link on the left to see performance</p>
                </div>
              ) : (
                <div className="p-10 max-w-[1400px] mx-auto space-y-10">
                  
                  <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-4xl font-three tracking-tight cursor-pointer">Link Analytics Dashboard</h1>
                    <AnalyticsDropDown days={days} setDays={setDays} />
                  </header>

                  <section className="relative rounded-xl border border-neutral-800 bg-[#0a0a0a] overflow-hidden">
                     {fetchingStats && (
                       <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                          <Loader2 className="animate-spin text-blue-500" />
                       </div>
                     )}
                     <ClicksAnalytics data={analyticsData?.clicks} days={days} />
                  </section>

                  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PremiumBlock isFree={isFree}>
                      <CountryAnalytics data={analyticsData?.countries} days={days} />
                    </PremiumBlock>
                    
                    <PremiumBlock isFree={isFree}>
                      <BrowserAnalytics data={analyticsData?.browsers} days={days} />
                    </PremiumBlock>
                    
                    <PremiumBlock isFree={isFree}>
                      <DeviceListAnalytics data={analyticsData?.devices} days={days} />
                    </PremiumBlock>
                  </section>

                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                    <PremiumBlock isFree={isFree}>
                      <OSAnalytics data={analyticsData?.os} days={days} />
                    </PremiumBlock>
                    
                    <PremiumBlock isFree={isFree}>
                      <ReferrerAnalytics data={analyticsData?.referrers} days={days} />
                    </PremiumBlock>
                  </section>
                </div>
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
}