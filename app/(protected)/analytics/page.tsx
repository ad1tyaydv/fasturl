"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  IoGlobeOutline, IoPhonePortraitOutline, 
  IoHardwareChipOutline, IoShareSocialOutline, IoCompassOutline, 
  IoCloseOutline, IoArrowBackOutline, IoLockClosedOutline,
  IoChevronForwardOutline, IoChevronBackOutline
} from "react-icons/io5";

import Navbar from "../../components/navbar"; 
import { AnalyticsCardItem } from "../../components/analyticsCard";
import { SkeletonLoader } from "@/app/loaders/links"; 

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";


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


export function SkeletonForm() {
  return (
    <div className="flex w-full flex-col gap-7 p-6 rounded-2xl border border-neutral-800 bg-[#1c1c1c]">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-20 bg-neutral-800" />
        <Skeleton className="h-8 w-full bg-neutral-800" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-24 bg-neutral-800" />
        <Skeleton className="h-8 w-full bg-neutral-800" />
      </div>
      <Skeleton className="h-8 w-24 bg-neutral-800" />
    </div>
  );
}


export default function AnalyticsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tier, setTier] = useState("FREE");
  
  const [isPageLoading, setIsPageLoading] = useState(true); 
  
  const [selectedLink, setSelectedLink] = useState<any | null>(null);
  const [urls, setUrls] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (!res.data.authenticated) {
          router.push("/auth/signin");
        } else {
          setIsLoggedIn(true);
          setTier(res.data.plan || "FREE");
          const urlRes = await axios.get("/api/fetchUrls");
          setUrls(urlRes.data.urls.reverse());
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
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };

  }, [isModalOpen]);


  const filteredUrls = useMemo(() => {
    if (timeFilter === "lifetime") return urls;

    const now = new Date();
    const filterDate = new Date();

    if (timeFilter === "today") {
      filterDate.setHours(0, 0, 0, 0);
    } else if (timeFilter === "7days") {
      filterDate.setDate(now.getDate() - 7);
    } else if (timeFilter === "30days") {
      filterDate.setDate(now.getDate() - 30);
    }

    return urls.filter(url => {
      const created = new Date(url.createdAt); 
      return created >= filterDate;
    });

  }, [urls, timeFilter]);


  const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);
  

  const paginatedUrls = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUrls.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUrls, currentPage]);


  useEffect(() => {
    setCurrentPage(1);

  }, [timeFilter]);


  const handleSelectLink = (url: any) => {
    setSelectedLink(url);
    handleLinkAnalytics(url.id);
  };

  const handleLinkAnalytics = async (linkId: string) => {
    setIsLoadingAnalytics(true);
    setAnalytics(null);
    try {
      const res = await axios.get("/api/analytics/link", { params: { linkId } });
      setAnalytics(res.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };


  const aggregatedCountries = useMemo(() => {
    if (!analytics?.countries) return [];
    const map = new Map<string, number>();
    analytics.countries.forEach((c: any) => {
      map.set(c.country, (map.get(c.country) || 0) + c.count);
    });

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


  const handleLinkClick = (e: React.MouseEvent, urlPath: string) => {
    e.stopPropagation();
    if (!urlPath) return;
    const finalUrl = urlPath.startsWith('http') ? urlPath : `https://${urlPath}`;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };
  
  
  return (
    <div className="min-h-screen bg-[#141414] text-white transition-colors duration-300">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        {isPageLoading ? (
          <div className="w-full fade-in pt-8">
             <SkeletonLoader />
          </div>
        ) : (
          <>
            {!selectedLink ? (
              <div className="fade-in">
                
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
                  <h1 className="text-2xl sm:text-3xl font-one tracking-tight text-white">
                    Link Analytics
                  </h1>

                  <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as TimeFilter)}>
                    <SelectTrigger className="w-[180px] bg-[#1a1a1a] border-neutral-800 text-white font-three focus:ring-1 focus:ring-blue-500 rounded-lg">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-neutral-800 text-white font-three rounded-lg">
                      <SelectItem value="today" className="text-neutral-200 focus:bg-[#2a2a2a] focus:text-white data-[state=checked]:text-white cursor-pointer">Created Today</SelectItem>
                      <SelectItem value="7days" className="text-neutral-200 focus:bg-[#2a2a2a] focus:text-white data-[state=checked]:text-white cursor-pointer">Last 7 Days</SelectItem>
                      <SelectItem value="30days" className="text-neutral-200 focus:bg-[#2a2a2a] focus:text-white data-[state=checked]:text-white cursor-pointer">Last 30 Days</SelectItem>
                      <SelectItem value="lifetime" className="text-neutral-200 focus:bg-[#2a2a2a] focus:text-white data-[state=checked]:text-white cursor-pointer">Lifetime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filteredUrls.length > 0 ? (
                  <div className="flex flex-col rounded-xl overflow-hidden">
                    {paginatedUrls.map((url, index) => (
                      <div
                        key={url.id || index}
                        onClick={() => handleSelectLink(url)}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-5 px-4 border-b border-neutral-800 last:border-0 hover:bg-[#1a1a1a] transition-colors cursor-pointer group gap-4 sm:gap-0"
                      >
                        <div className="flex items-center gap-4 w-full sm:w-[50%] overflow-hidden">
                          <div className="w-10 h-10 rounded-full bg-[#1c2a3a] text-blue-400 flex items-center justify-center shrink-0">
                            <IoGlobeOutline size={20} />
                          </div>
                          <div className="flex flex-col overflow-hidden w-full">
                            <span className="font-bold text-white font-three text-base truncate">
                              {url.title || url.name || "Untitled Link"}
                            </span>
                            <span 
                              onClick={(e) => handleLinkClick(e, url.original || `${NEXT_DOMAIN}/${url.shorturl}`)}
                              className="text-sm text-neutral-400 font-three truncate mt-0.5 hover:text-blue-400 hover:underline transition-colors relative z-10 inline-block w-fit cursor-pointer"
                            >
                              {url.original || `${NEXT_DOMAIN}/${url.shorturl}`}
                            </span>
                          </div>
                        </div>

                        <div className="w-full sm:w-[20%] pl-14 sm:pl-0">
                          <span className="text-sm text-white font-three">
                            {url.clicks === 1 ? "1 click" : `${url.clicks || 0} clicks`}
                          </span>
                        </div>

                        <div className="w-full sm:w-[20%] pl-14 sm:pl-0 sm:text-right">
                          <span className="text-sm text-neutral-400 font-three">
                            {getTimeAgo(url.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-neutral-500 font-three border border-dashed border-neutral-800 rounded-lg mt-4">
                    No links found for this timeframe.
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-4 font-three">
                    <button
                      onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.max(1, p - 1)); }}
                      disabled={currentPage === 1}
                      className="p-2 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <IoChevronBackOutline size={20} />
                    </button>
                    
                    <span className="text-sm text-neutral-400">
                      Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
                    </span>

                    <button
                      onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                      disabled={currentPage === totalPages}
                      className="p-2 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <IoChevronForwardOutline size={20} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <button 
                  onClick={() => setSelectedLink(null)} 
                  className="flex items-center gap-2 text-xl font-three text-neutral-400 hover:text-blue-500 transition-colors cursor-pointer group"
                >
                  <IoArrowBackOutline /> Back
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#1a1a1a] p-8 rounded-none border border-neutral-800">
                  <div className="space-y-4">
                    <div className="pb-2">
                      <span className="text-2xl font-three text-blue-500 uppercase tracking-[0.2em]">
                        Link Analytics
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                        <span className="text-xs uppercase tracking-widest text-neutral-500 font-one w-24">Short Link:</span>
                        <h2 
                          onClick={(e) => handleLinkClick(e, `${NEXT_DOMAIN}/${selectedLink.shorturl}`)}
                          className="text-xl font-three truncate max-w-[300px] md:max-w-md text-white hover:text-blue-400 hover:underline cursor-pointer transition-colors"
                        >
                          {NEXT_DOMAIN}/{selectedLink.shorturl}
                        </h2>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                        <span className="text-xs uppercase tracking-widest text-neutral-500 font-one w-24">Original:</span>
                        <p 
                          onClick={(e) => handleLinkClick(e, selectedLink.original)}
                          className="text-neutral-400 text-xl font-three truncate max-w-sm italic hover:text-blue-400 hover:underline cursor-pointer transition-colors"
                        >
                          {selectedLink.original}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row items-baseline gap-3 md:justify-end">
                    <span className="text-xl font-three text-neutral-500 uppercase">
                      Total Clicks
                    </span>
                    <p className="text-3xl font-two text-white">
                      {selectedLink.clicks || 0}
                    </p>
                  </div>
                </div>

                {isLoadingAnalytics ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                    <SkeletonForm />
                    <SkeletonForm />
                    <SkeletonForm />
                    <SkeletonForm />
                    <SkeletonForm />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 font-three md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                    <AnalyticsCardItem 
                      title="Locations" 
                      icon={<IoGlobeOutline size={25}/>} 
                      data={aggregatedCountries} 
                      nameKey="country" 
                      onExpand={() => openModal("Locations", <IoGlobeOutline size={25}/>, aggregatedCountries, "country")} 
                    />

                    {premiumMetrics.map((item, index) => (
                      <div key={index} className="relative group">
                        <AnalyticsCardItem 
                          title={item.title} 
                          icon={item.icon} 
                          data={item.data || []} 
                          nameKey={item.key} 
                          colorOffset={item.offset}
                          onExpand={() => tier !== "FREE" && openModal(item.title, item.icon, item.data || [], item.key)} 
                        />
                        
                        {tier === "FREE" && (
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-[2px] rounded-none border border-neutral-800 transition-opacity duration-150">
                            <div className="flex flex-col items-center gap-4 p-6 bg-[#1c1c1c] border border-neutral-800 rounded-none shadow-2xl">
                              <div className="p-3 bg-blue-500/10 rounded-none text-blue-500">
                                <IoLockClosedOutline size={24} />
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-neutral-400 font-three uppercase tracking-widest">Upgrade to see {item.title}</p>
                              </div>
                              <button 
                                onClick={() => router.push("/premium")}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-none font-one text-sm transition-colors active:scale-95 cursor-pointer border border-transparent"
                              >
                                Unlock Now
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {isModalOpen && modalContent && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 transition-opacity duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-[#1c1c1c] w-full max-w-lg rounded-none shadow-2xl overflow-hidden border border-neutral-800 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-neutral-800 bg-[#141414]">
              <h3 className="text-xl font-bold flex items-center gap-3 text-white">
                <span className="text-blue-500">{modalContent.icon}</span>
                <span className="font-one">{modalContent.title}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-none hover:bg-[#2a2a2a] text-neutral-400 hover:text-white transition-colors cursor-pointer">
                <IoCloseOutline size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {modalContent.data.length > 0 ? (
                modalContent.data.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center group">
                    <div className="flex items-center gap-4 text-white">
                      <span className="font-one text-neutral-500">{String(index + 1).padStart(2, '0')}</span>
                      <span className="font-three group-hover:text-blue-500 transition-colors">
                        {item[modalContent.nameKey] || "Unknown"}
                      </span>
                    </div>
                    <span className="font-three text-sm bg-[#2a2a2a] px-3 py-1 rounded-none text-white">{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-center py-20 font-three text-neutral-500">No data records found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}