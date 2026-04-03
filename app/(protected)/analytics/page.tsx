"use client";

import { useEffect, useState, useMemo } from "react";
import { Loader2, BarChart3, Search } from "lucide-react";
import Navbar from "@/app/components/navbar";

import ClicksAnalytics from "@/app/components/analytics/clicks";
import BrowserAnalytics from "@/app/components/analytics/browsers";
import DeviceListAnalytics from "@/app/components/analytics/devices";
import CountryAnalytics from "@/app/components/analytics/location";
import OSAnalytics from "@/app/components/analytics/os";
import ReferrerAnalytics from "@/app/components/analytics/referrers";


const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN!;

export default function AnalyticsPage() {
  const [urls, setUrls] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingStats, setFetchingStats] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/fetchUrls");
        const data = await res.json();
        setUrls(data.urls || []);

      } catch (e) {
        console.error(e);

      } finally {
        setLoading(false);
      }
    }
    init();

  }, []);


  const filteredUrls = useMemo(() => {
    return urls.filter((url) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        url.shorturl?.toLowerCase().includes(searchLower) ||
        url.original?.toLowerCase().includes(searchLower)
      );
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


  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-black">
      <Loader2 className="animate-spin text-blue-500" />
    </div>
  );

  
  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 border-r border-neutral-900 flex flex-col bg-black shrink-0">
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Your Links</h2>
              <p className="text-[11px] text-neutral-500 uppercase tracking-widest mt-1">
                {filteredUrls.length} links found
              </p>
            </div>

            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search by name, slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-neutral-600"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
            {filteredUrls.map((url) => (
              <button
                key={url.id}
                onClick={() => handleLinkClick(url.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 group ${
                  selectedLink === url.id 
                  ? "bg-blue-600 text-white" 
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
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
              <BarChart3 size={48} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="text-sm">Click a link on the left to see performance</p>
            </div>
          ) : (
            <div className="p-10 max-w-[1400px] mx-auto space-y-10">
              <header>
                <h1 className="text-4xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-neutral-500 mt-2 text-lg">Deep dive into your link performance</p>
              </header>

              <section className="relative rounded-xl border border-neutral-800 bg-[#0a0a0a] overflow-hidden">
                 {fetchingStats && (
                   <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                      <Loader2 className="animate-spin text-blue-500" />
                   </div>
                 )}
                 <ClicksAnalytics data={analyticsData?.clicks} />
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex w-full bg-black border border-neutral-800 rounded-xl p-4 min-h-[400px]">
                  <CountryAnalytics data={analyticsData?.countries} />
                </div>
                <div className="flex w-full bg-black border border-neutral-800 rounded-xl p-4 min-h-[400px]">
                  <BrowserAnalytics data={analyticsData?.browsers} />
                </div>
                <div className="flex w-full bg-black border border-neutral-800 rounded-xl p-4 min-h-[400px]">
                  <DeviceListAnalytics data={analyticsData?.devices} />
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                <div className="flex w-full bg-black border border-neutral-800 rounded-xl p-4 min-h-[400px]">
                  <OSAnalytics data={analyticsData?.os} />
                </div>
                <div className="flex w-full bg-black border border-neutral-800 rounded-xl p-4 min-h-[400px]">
                  <ReferrerAnalytics data={analyticsData?.referrers} />
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}