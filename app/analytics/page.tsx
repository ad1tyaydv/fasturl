"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  IoLinkOutline, IoGlobeOutline, IoPhonePortraitOutline, 
  IoHardwareChipOutline, IoShareSocialOutline, IoCompassOutline, 
  IoCloseOutline, IoArrowBackOutline, 
  IoArrowForwardOutline
} from "react-icons/io5";

import DashboardLayout from "../components/dashBoardComponent";
import { AnalyticsCardItem } from "../components/analyticsCard";


const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function AnalyticsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true); 
  const [selectedLink, setSelectedLink] = useState<any | null>(null);
  const [urls, setUrls] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");

        if (!res.data.authenticated) {
          router.push("/auth/signin");

        } else {
          setIsLoggedIn(true);

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
    checkAuth();

  }, [router]);

  
  const handleLinkAnalytics = async (linkId: string) => {
    setIsLoadingAnalytics(true);
    setAnalytics(null);

    try {
      const res = await axios.get("/api/analytics/link", {
        params: {
          linkId
        }
      });
      setAnalytics(res.data);

    } catch (error) {
      console.error("Failed to fetch analytics:", error);

    } finally {
      setIsLoadingAnalytics(false);
    }
  };


  const aggregatedCountries = useMemo(() => {
    if (!analytics?.countries) {
      return [];
    }

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


  return (
    <DashboardLayout isLoggedIn={isLoggedIn} handleLogout={() => {}}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {isPageLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground font-medium animate-pulse tracking-tight">
              Loading your analytics...
            </p>
          </div>
        ) : (
          <>
            {!selectedLink ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-8">
                  <h1 className="text-3xl font-one tracking-tight text-foreground">Link Analytics</h1>
                  <p className="text-muted-foreground font-three mt-2">Select a link to view detailed traffic performance.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {urls.length > 0 ? (
                    urls.map((url) => (
                      <div 
                        key={url.id} 
                        onClick={() => { setSelectedLink(url); handleLinkAnalytics(url.id); }} 
                        className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer relative group overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                            <IoLinkOutline size={22} />
                          </div>
                          <div className="bg-secondary px-2.5 py-1 rounded-full text-[10px] font-three uppercase tracking-wider text-secondary-foreground">
                            Clicks: {url.clicks || 0}
                          </div>
                        </div>
                        <h3 className="font-three text-lg truncate mb-1">{url.shorturl}</h3>
                        <p className="text-xs font-three text-muted-foreground truncate mb-6">{url.original}</p>
                        <div className="flex items-center gap-2 text-xs font-three text-primary uppercase">
                          Detailed Report <IoArrowForwardOutline className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl">
                      <p className="text-muted-foreground">No links found. Create one to see analytics!</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                <button 
                  onClick={() => setSelectedLink(null)} 
                  className="flex items-center gap-2 text-xl font-font-three text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
                >
                  <IoArrowBackOutline className="group-hover:-translate-x-1 text-xl transition-transform" /> Back
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-secondary/20 p-8 rounded-3xl border border-border/50">
                  <div className="space-y-4">
                    <div className="pb-2">
                      <span className="text-2xl font-three text-primary uppercase tracking-[0.2em]">
                        Active Analytics
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground font-three w-24">Short Link:</span>
                        <h2 className="text-xl font-two truncate max-w-[300px] md:max-w-md">
                          <a 
                            href={`https://${NEXT_DOMAIN}${selectedLink.shorturl}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 decoration-primary/30 underline-offset-4"
                          >
                            {NEXT_DOMAIN}{selectedLink.shorturl}
                          </a>
                        </h2>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground font-three w-24">Original:</span>
                        <p className="text-muted-foreground text-xl font-two truncate max-w-sm italic">
                          <a 
                            href={selectedLink.original} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="transition-colors text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 decoration-muted-foreground/30 underline-offset-4"
                          >
                            {selectedLink.original}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row items-baseline gap-3 md:justify-end">
                    <span className="text-xl font-three text-muted-foreground uppercase">
                      Total Clicks
                    </span>
                    <p className="text-3xl font-two text-foreground">
                      {selectedLink.clicks || 0}
                    </p>
                  </div>
                </div>

                {isLoadingAnalytics ? (
                  <div className="h-96 flex flex-col justify-center items-center gap-4 border border-border/40 rounded-3xl bg-card/30">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-muted-foreground font-medium animate-pulse">Loading traffic patterns...</p>
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
                    <AnalyticsCardItem 
                      title="Top Referrers" icon={<IoShareSocialOutline size={25}/>} 
                      data={analytics?.referrers || []} nameKey="referrer" colorOffset={1}
                      onExpand={() => openModal("Top Referrers", <IoShareSocialOutline size={25}/>, analytics?.referrers || [], "referrer")} 
                    />
                    <AnalyticsCardItem 
                      title="Browsers" icon={<IoCompassOutline size={25}/>}
                      data={analytics?.browsers || []} nameKey="browser" colorOffset={2}
                      onExpand={() => openModal("Browsers", <IoCompassOutline size={25}/>, analytics?.browsers || [], "browser")} 
                    />
                    <AnalyticsCardItem
                      title="Devices" icon={<IoPhonePortraitOutline size={25}/>} 
                      data={analytics?.devices || []} nameKey="devices" colorOffset={3}
                      onExpand={() => openModal("Devices", <IoPhonePortraitOutline size={25}/>, analytics?.devices || [], "devices")} 
                    />
                    <AnalyticsCardItem 
                      title="Operating Systems" icon={<IoHardwareChipOutline size={25}/>} 
                      data={analytics?.os || []} nameKey="os" colorOffset={4}
                      onExpand={() => openModal("Operating Systems", <IoHardwareChipOutline size={25}/>, analytics?.os || [], "os")} 
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-border flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-6 border-b border-border bg-secondary/10">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="text-primary">
                  {modalContent.icon}
                </span>
                <span className="font-one">{modalContent.title}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {modalContent.data.length > 0 ? (
                modalContent.data.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <span className="font-one">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-three text-foreground group-hover:text-primary transition-colors">
                        {item[modalContent.nameKey] || "Unknown"}
                      </span>
                    </div>
                    <span className="font-three text-sm bg-secondary px-3 py-1 rounded-lg">{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-center py-20 font-three text-muted-foreground">No data records found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}