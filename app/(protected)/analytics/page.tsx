"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
import { 
  IoGlobeOutline, IoPhonePortraitOutline, 
  IoHardwareChipOutline, IoShareSocialOutline, IoCompassOutline, 
  IoCloseOutline, IoArrowBackOutline, IoLockClosedOutline,
  IoChevronForwardOutline, IoChevronBackOutline, IoFileTrayFullOutline
} from "react-icons/io5";

import Navbar from "../../components/navbar"; 
import { AnalyticsCardItem } from "../../components/linkAnalyticsCard";
import { SkeletonLoader } from "@/app/loaders/links"; 
import { AnalyticsFilter, SortOrder } from "@/app/dropDown/filterDropDown";
import { TimeFilterDropDown } from "@/app/dropDown/timeFilterDropDown";

const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

type TimeFilter = "today" | "7days" | "30days" | "lifetime";

const getTimeAgo = (dateString: string) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
};

function AnalyticsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentView = (searchParams.get("view") as "links" | "bulk") || "links";
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tier, setTier] = useState("FREE");
  const [view, setView] = useState<"links" | "bulk">(currentView);
  const [isPageLoading, setIsPageLoading] = useState(true); 
  const [selectedLink, setSelectedLink] = useState<any | null>(null);
  const [urls, setUrls] = useState<any[]>([]);
  const [bulkLinks, setBulkLinks] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    setView(currentView);

  }, [currentView]);


  const handleViewChange = (newView: "links" | "bulk") => {
    setView(newView);
    setSelectedLink(null);

    router.push(`?view=${newView}`, { scroll: false });
  };


  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (!res.data.authenticated) {
          router.push("/auth/signin");
        } else {
          setIsLoggedIn(true);
          setTier(res.data.plan || "FREE");
          const [urlRes, bulkRes] = await Promise.all([
            axios.get("/api/fetchUrls"),
            axios.get("/api/shortUrl/bulkLinks/fetchBulkLinks")
          ]);

          setUrls(urlRes.data.urls || []);
          setBulkLinks(bulkRes.data.bulkLinks || []);
        }

      } catch (error) {
        console.error("Auth check failed", error);
        router.push("/auth/signin");

      } finally {
        setIsPageLoading(false);
      }
    };
    checkAuthAndFetch();

  }, [router]);

  
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };

  }, [isModalOpen]);


  const getBulkTotalClicks = (item: any) => {
    if (view === "links") return item.clicks || 0;
    if (!item.links) return 0;
    return item.links.reduce((acc: number, link: any) => acc + (link.clicks || 0), 0);
  };

  
  const filteredData = useMemo(() => {
    let result = view === "links" ? [...urls] : [...bulkLinks];

    if (timeFilter !== "lifetime") {
      const filterDate = new Date();
      if (timeFilter === "today") filterDate.setHours(0, 0, 0, 0);
      else if (timeFilter === "7days") filterDate.setDate(filterDate.getDate() - 7);
      else if (timeFilter === "30days") filterDate.setDate(filterDate.getDate() - 30);
      result = result.filter(item => new Date(item.createdAt) >= filterDate);
    }

    result.sort((a, b) => {
      const clicksA = getBulkTotalClicks(a);
      const clicksB = getBulkTotalClicks(b);
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();

      if (sortOrder === "most") return clicksB - clicksA;
      if (sortOrder === "least") return clicksA - clicksB;
      if (sortOrder === "oldest") return timeA - timeB;
      return timeB - timeA;
    });

    return result;

  }, [urls, bulkLinks, timeFilter, sortOrder, view]);


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);


  useEffect(() => { setCurrentPage(1); }, [timeFilter, view, sortOrder]);


  const handleSelectLink = (item: any) => {
    setSelectedLink({ ...item, totalCalculatedClicks: getBulkTotalClicks(item) });
    handleLinkAnalytics(item.id);
  };


  const handleLinkAnalytics = async (id: string) => {
    setIsLoadingAnalytics(true);
    setAnalytics(null);


    try {
      const endpoint = view === "links" ? "/api/analytics/link" : "/api/analytics/bulkLinks";
      const res = await axios.get(endpoint, { params: { linkId: id } });
      setAnalytics(res.data);
      
    } catch (error) { console.error(error); } finally { setIsLoadingAnalytics(false); }
  };


  const aggregatedCountries = useMemo(() => {
    if (!analytics?.countries) return [];
    const map = new Map<string, number>();
    analytics.countries.forEach((c: any) => map.set(c.country, (map.get(c.country) || 0) + c.count));

    return Array.from(map.entries()).map(([country, count]) => ({ country, count }));
  }, [analytics]);


  const openModal = (title: string, icon: React.ReactNode, data: any[], nameKey: string) => {
    setModalContent({ title, icon, data, nameKey });
    setIsModalOpen(true);
  };


  const premiumMetrics = [
    { title: "Top Referrers", icon: <IoShareSocialOutline size={25}/>, data: analytics?.referrers, key: "referrer", offset: 1 },
    { title: "Browsers", icon: <IoCompassOutline size={25}/>, data: analytics?.browsers, key: "browser", offset: 2 },
    { title: "Devices", icon: <IoPhonePortraitOutline size={25}/>, data: analytics?.devices, key: "devices", offset: 3 },
    { title: "Operating Systems", icon: <IoHardwareChipOutline size={25}/>, data: analytics?.os, key: "os", offset: 4 },
  ];


  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        {isPageLoading ? <SkeletonLoader /> : (
          <>
            {!selectedLink ? (
              <div className="fade-in">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
                  <div className="flex items-center gap-2 text-2xl sm:text-3xl font-one tracking-tight">
                    {/* Updated onClick handlers */}
                    <button 
                      onClick={() => handleViewChange("links")} 
                      className={`cursor-pointer transition-colors ${view === "links" ? "text-white" : "text-neutral-600 hover:text-neutral-400"}`}
                    >
                      Link Analytics
                    </button>
                    <span className="text-neutral-700">/</span>
                    <button 
                      onClick={() => handleViewChange("bulk")} 
                      className={`cursor-pointer transition-colors ${view === "bulk" ? "text-white" : "text-neutral-600 hover:text-neutral-400"}`}
                    >
                      Bulk link Analytics
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <AnalyticsFilter sortOrder={sortOrder} setSortOrder={setSortOrder} />
                    <TimeFilterDropDown value={timeFilter} onChange={setTimeFilter} />
                  </div>
                </div>

                {filteredData.length > 0 ? (
                  <div className="flex flex-col rounded-xl overflow-hidden">
                    {paginatedData.map((item, idx) => (
                      <div key={item.id || idx} onClick={() => handleSelectLink(item)} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-5 px-4 border-b border-neutral-800 hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4 w-full sm:w-[50%] overflow-hidden">
                          <div className="w-10 h-10 rounded-full bg-[#1c2a3a] text-blue-400 flex items-center justify-center shrink-0">
                            {view === "links" ? <IoGlobeOutline size={20} /> : <IoFileTrayFullOutline size={20} />}
                          </div>
                          <div className="flex flex-col overflow-hidden w-full">
                            <span className="font-bold text-white font-three truncate">{view === "links" ? (item.title || item.name || "Untitled Link") : (item.name || "Untitled Batch")}</span>
                            <span className="text-sm text-neutral-400 font-three truncate">{view === "links" ? (item.original || `${NEXT_DOMAIN}/${item.shorturl}`) : `${item.links?.length || 0} links`}</span>
                          </div>
                        </div>
                        <div className="w-full sm:w-[20%] pl-14 sm:pl-0"><span className="text-sm text-white font-three">{getBulkTotalClicks(item)} clicks</span></div>
                        <div className="w-full sm:w-[20%] pl-14 sm:pl-0 sm:text-right"><span className="text-sm text-neutral-400 font-three">{getTimeAgo(item.createdAt)}</span></div>
                      </div>
                    ))}
                  </div>
                ) : <div className="py-12 text-center text-neutral-500 font-three border border-dashed border-neutral-800 rounded-lg mt-4">No records found.</div>}

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-full bg-[#1a1a1a] border border-neutral-800 text-neutral-400 disabled:opacity-50"><IoChevronBackOutline size={20}/></button>
                    <span className="text-sm text-neutral-400 font-three">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-full bg-[#1a1a1a] border border-neutral-800 text-neutral-400 disabled:opacity-50"><IoChevronForwardOutline size={20}/></button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <button onClick={() => setSelectedLink(null)} className="flex items-center gap-2 text-xl font-three text-neutral-400 hover:text-blue-500 transition-colors"><IoArrowBackOutline /> Back</button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#1a1a1a] p-8 border border-neutral-800">
                  <div className="space-y-4">
                    <span className="text-2xl font-three text-blue-500 uppercase tracking-widest">{view === "links" ? "Link Analytics" : "Batch Analytics"}</span>
                    <div className="space-y-2">
                      <h2 className="text-xl font-three text-white truncate max-w-md">{view === "links" ? `${NEXT_DOMAIN}/${selectedLink.shorturl}` : selectedLink.name}</h2>
                      <p className="text-neutral-400 font-three truncate italic">{view === "links" ? selectedLink.original : `${selectedLink.links?.length} links`}</p>
                    </div>
                  </div>
                  <div className="flex flex-row items-baseline gap-3"><span className="text-xl font-three text-neutral-500 uppercase">Total Clicks</span><p className="text-3xl font-two text-white">{selectedLink.totalCalculatedClicks}</p></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                  <AnalyticsCardItem title="Locations" icon={<IoGlobeOutline size={25}/>} data={aggregatedCountries} nameKey="country" onExpand={() => openModal("Locations", <IoGlobeOutline size={25}/>, aggregatedCountries, "country")} />
                  {premiumMetrics.map((item, idx) => (
                    <div key={idx} className="relative group">
                      <AnalyticsCardItem title={item.title} icon={item.icon} data={item.data || []} nameKey={item.key} onExpand={() => tier !== "FREE" && openModal(item.title, item.icon, item.data || [], item.key)} />
                      {tier === "FREE" && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-[2px]">
                          <div className="p-6 bg-[#1c1c1c] border border-neutral-800 text-center space-y-4">
                            <IoLockClosedOutline size={24} className="mx-auto text-blue-500" />
                            <p className="text-xs text-neutral-400 font-three uppercase">Upgrade to see {item.title}</p>
                            <button onClick={() => router.push("/premium")} className="w-full bg-blue-600 text-white py-2 px-6 font-one text-sm transition-colors">Unlock Now</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal logic remains same */}
      {isModalOpen && modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80" onClick={() => setIsModalOpen(false)}>
          <div className="bg-[#1c1c1c] w-full max-w-lg border border-neutral-800 flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-neutral-800 bg-[#141414]">
              <h3 className="text-xl font-bold flex items-center gap-3 text-white">{modalContent.icon} <span className="font-one">{modalContent.title}</span></h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400"><IoCloseOutline size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {modalContent.data.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center group">
                  <span className="font-three text-white">{item[modalContent.nameKey]}</span>
                  <span className="font-three text-sm bg-[#2a2a2a] px-3 py-1 text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <AnalyticsPageClient />
    </Suspense>
  );
}