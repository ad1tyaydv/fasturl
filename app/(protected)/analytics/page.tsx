"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  IoGlobeOutline, IoPhonePortraitOutline, 
  IoHardwareChipOutline, IoShareSocialOutline, IoCompassOutline, 
  IoCloseOutline, IoArrowBackOutline, IoLockClosedOutline
} from "react-icons/io5";

import Navbar from "../../components/navbar"; 
import { AnalyticsCardItem } from "../../components/analyticsCard";
import LinkAnalyticsTab from "../../components/linkAnalyticsTab";
import QRAnalyticsTab from "../../components/qrAnalyticsTab";
import { SkeletonLoader } from "@/app/loaders/links"; // Import the loader


const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function AnalyticsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"link" | "qr">("link");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tier, setTier] = useState("FREE");
  
  const [isPageLoading, setIsPageLoading] = useState(true); 
  
  const [selectedLink, setSelectedLink] = useState<any | null>(null);
  const [urls, setUrls] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);


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
          setUrls(urlRes.data.urls);
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


  const handleSelectLink = (url: any) => {
    setSelectedLink(url);
    handleLinkAnalytics(url.id);
  };


  const handleLinkAnalytics = async (linkId: string) => {
    setIsLoadingAnalytics(true);
    setAnalytics(null);
    try {
      const res = await axios.get("/api/analytics/link", {
        params: { linkId }
      });
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


  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    setIsLoggedIn(false);
    router.push("/auth/signin");
  };


  const premiumMetrics = [
    { title: "Top Referrers", icon: <IoShareSocialOutline size={25}/>, data: analytics?.referrers, key: "referrer", offset: 1 },
    { title: "Browsers", icon: <IoCompassOutline size={25}/>, data: analytics?.browsers, key: "browser", offset: 2 },
    { title: "Devices", icon: <IoPhonePortraitOutline size={25}/>, data: analytics?.devices, key: "devices", offset: 3 },
    { title: "Operating Systems", icon: <IoHardwareChipOutline size={25}/>, data: analytics?.os, key: "os", offset: 4 },
  ];


  return (
    <div className="min-h-screen bg-[#141414] text-white transition-colors duration-300">
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 py-10">
        {isPageLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            {!selectedLink ? (
              <div className="fade-in">
                <div className="mb-8 flex items-center gap-4">
                  <h1 
                    className={`text-3xl font-one tracking-tight cursor-pointer transition-colors ${viewMode === "link" ? "text-white" : "text-neutral-600 hover:text-white"}`}
                    onClick={() => setViewMode("link")}
                  >
                    Link Analytics
                  </h1>
                  <span className="text-3xl font-one text-neutral-700">/</span>
                  <h1 
                    className={`text-3xl font-one tracking-tight cursor-pointer transition-colors ${viewMode === "qr" ? "text-white" : "text-neutral-600 hover:text-white"}`}
                    onClick={() => setViewMode("qr")}
                  >
                    QR Analytics
                  </h1>
                </div>

                {viewMode === "link" ? (
                  <LinkAnalyticsTab urls={urls} onSelect={handleSelectLink} />
                ) : (
                  <QRAnalyticsTab urls={urls} onSelect={handleSelectLink} />
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
                        {viewMode === "link" ? "Link" : "QR"} Analytics
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                        <span className="text-xs uppercase tracking-widest text-neutral-500 font-three w-24">Short Link:</span>
                        <h2 className="text-xl font-two truncate max-w-[300px] md:max-w-md text-white">
                          {NEXT_DOMAIN}/{selectedLink.shorturl}
                        </h2>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                        <span className="text-xs uppercase tracking-widest text-neutral-500 font-three w-24">Original:</span>
                        <p className="text-neutral-400 text-xl font-two truncate max-w-sm italic">
                          {selectedLink.original}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row items-baseline gap-3 md:justify-end">
                    <span className="text-xl font-three text-neutral-500 uppercase">
                      Total {viewMode === "link" ? "Clicks" : "Visits"}
                    </span>
                    <p className="text-3xl font-two text-white">
                      {selectedLink.clicks || 0}
                    </p>
                  </div>
                </div>

                {isLoadingAnalytics ? (
                  <div className="h-96 flex flex-col justify-center items-center gap-4 border border-neutral-800 rounded-none bg-[#1c1c1c]/50">
                    <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-none animate-spin"></div>
                    <p className="text-neutral-400 font-medium">Loading traffic patterns...</p>
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