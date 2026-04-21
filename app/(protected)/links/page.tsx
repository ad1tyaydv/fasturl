"use client";

import axios from "axios";
import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { HugeiconsIcon } from '@hugeicons/react';
import { Search02Icon, PlusSignIcon, Link04Icon, File02Icon } from '@hugeicons/core-free-icons';

import Navbar from "../../components/navbar";
import UrlsPageSidebar from "@/app/components/linksPageSidebar";
import BulkLinks from "../../components/bulkLinks";
import Links from "@/app/components/links";
import ApiLinks from "@/app/components/apiLinks";

import { SkeletonLoader } from "@/app/loaders/links";
import { FilterDropDown, FilterType } from "@/app/dropDown/urlsPageDropDown";
import LinkPasswordProtectionModal from "@/app/modals/linkPasswordProtection";
import CustomUrlModal from "@/app/modals/customUrl";
import QRCodeGenerateModal from "@/app/modals/qrGenerate";
import { Button } from "@/components/ui/button";

const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

const getRelativeTime = (dateString?: string) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return date.toLocaleDateString();
};

type ViewType = "links" | "bulk" | "api";

function AllLinks() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [view, setView] = useState<ViewType>((searchParams.get("types") as ViewType) || "links");
  const [data, setData] = useState<any[]>([]);
  const [tier, setTier] = useState("FREE");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    router.push(`${pathname}?types=${newView}`);
  };

  const fetchData = useCallback(async () => {
    if (view === "api") return;
    try {
      setLoading(true);
      const endpoint = view === "bulk" ? "/api/shortUrl/bulkLinks/fetchBulkLinks" : "/api/fetchUrls";
      const res = await axios.get(endpoint);
      setData((view === "bulk" ? res.data.bulkLinks : res.data.urls) || []);
    } catch (err) {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [view]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (res.data.authenticated) {
          setIsLoggedIn(true);
          setTier(res.data.plan || "FREE");
        } else router.push("/auth/signin");
      } catch { router.push("/auth/signin"); }
    };
    initAuth();
  }, [router]);

  useEffect(() => { if (isLoggedIn) fetchData(); }, [fetchData, isLoggedIn]);

  const filteredData = useMemo(() => {
    if (view === "api") return [];
    let result = [...data];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item =>
        view === "links"
          ? (item.linkName?.toLowerCase().includes(q) || item.shorturl?.toLowerCase().includes(q))
          : (item.name || "").toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [data, searchQuery, view]);

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="h-screen bg-[#141414] text-white flex flex-col overflow-hidden">
      <Toaster position="bottom-center" />
      <Navbar />

      <div className="flex flex-col sm:flex-row flex-1 w-full max-w-[1600px] mx-auto overflow-hidden">
        <UrlsPageSidebar view={view} onViewChange={handleViewChange} />

        <main className="flex-1 w-full px-4 py-6 sm:px-10 sm:py-10 min-w-0 overflow-y-auto">
          {/* Header Section */}
          <div className="hidden sm:flex sm:items-center justify-between gap-4 mb-8 border-b border-neutral-800 pb-6">
            <div>
              <h1 className="text-4xl font-one tracking-tight">
                {view === "links" ? "My Links" : view === "bulk" ? "Bulk Links" : "API Requests"}
              </h1>
              <p className="text-neutral-500 text-sm mt-1">
                {view === "api" ? "Links generated via your API keys." : "Track and manage your shortened URLs."}
              </p>
            </div>

            {view !== "api" && data.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 font-bold bg-neutral-900 border border-neutral-800 rounded-lg text-xs uppercase tracking-widest text-neutral-400">
                  Total - {filteredData.length}
                </span>
              </div>
            )}
          </div>

          {view === "api" ? (
            <ApiLinks />
          ) : (
            <>
              {/* Search & Filter - Only show if data exists or user is searching */}
              {data.length > 0 && !isDetailViewOpen && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 fade-in">
                  <div className="relative w-full sm:max-w-[450px] flex-1">
                    <HugeiconsIcon icon={Search02Icon} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search links..."
                      className="w-full pl-11 pr-4 py-3 bg-[#111111] border border-neutral-800 rounded-xl text-white text-sm outline-none focus:border-neutral-600 transition-all shadow-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="w-full sm:w-auto flex justify-end">
                    <FilterDropDown value={statusFilter} onChange={(val: FilterType) => setStatusFilter(val)} />
                  </div>
                </div>
              )}

              {loading ? <SkeletonLoader /> : data.length === 0 ? (
                /* EMPTY STATE UI - Dotted Rectangle */
                <div className="w-full py-24 px-4 flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 rounded-3xl bg-[#1c1c1c]/30 mt-4 fade-in">
                  <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 mb-6">
                    <HugeiconsIcon 
                        icon={view === "links" ? Link04Icon : File02Icon} 
                        className="w-12 h-12 text-neutral-500" 
                    />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-one mb-3 text-white text-center">
                    {view === "links" ? "Create your first link" : "No bulk batches discovered"}
                  </h2>
                  <p className="text-neutral-500 font-three text-sm mb-10 text-center max-w-sm leading-relaxed">
                    {view === "links" 
                        ? "Shorten your long URLs and track their performance with detailed analytics." 
                        : "Group multiple links together into a single batch for easier management."}
                  </p>
                  <Button 
                    onClick={() => router.push(view === "links" ? "/" : "/bulk-create")} 
                    className="bg-white text-black hover:bg-neutral-200 font-three px-6 py-4 rounded-xl flex items-center gap-2 text-lg transition-all"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} className="w-6 h-6" /> 
                    {view === "links" ? "Shorten Now" : "Create Bulk Links"}
                  </Button>
                </div>
              ) : (
                <div className="fade-in">
                  {view === "links" ? (
                    <div className="flex flex-col w-full">
                      {paginatedData.map((url) => (
                        <Links
                          key={url.id}
                          url={url}
                          nextDomain={NEXT_DOMAIN}
                          onRefresh={fetchData}
                          onOpenQr={(u) => { setSelectedLink(u); setIsQrModalOpen(true); }}
                          onOpenPassword={(u) => { setSelectedLink(u); setIsPasswordModalOpen(true); }}
                          onOpenCustom={(u) => { setSelectedLink(u); setIsCustomModalOpen(true); }}
                          getRelativeTime={getRelativeTime}
                          router={router}
                          userPlan={tier}
                        />
                      ))}
                    </div>
                  ) : (
                    <BulkLinks
                      bulkLinks={paginatedData}
                      onRefresh={fetchData}
                      domain={NEXT_DOMAIN!}
                      userTier={tier}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      statusFilter={statusFilter}
                      setStatusFilter={setStatusFilter}
                      setIsDetailViewOpen={setIsDetailViewOpen}
                      itemCount={filteredData.length}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <QRCodeGenerateModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} selectedUrl={selectedLink} />
      <LinkPasswordProtectionModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} selectedUrl={selectedLink} onSuccess={fetchData} />
      <CustomUrlModal isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)} selectedUrl={selectedLink} onSuccess={fetchData} />
    </div>
  );
}

export default function AllLinksPage() {
  return <Suspense fallback={<SkeletonLoader />}><AllLinks /></Suspense>;
}