"use client";

import axios from "axios";
import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { SearchIcon } from "lucide-react";
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PlusSignIcon,
  Link04Icon,
  File02Icon,
  QrCode01Icon
} from '@hugeicons/core-free-icons';

import Navbar from "../../components/navbar";
import UrlsPageSidebar from "@/app/components/linksPageSidebar";
import BulkLinks from "../../components/bulkLinks";
import QrCodes from "@/app/components/qrCodes";
import Links from "@/app/components/links";
import ApiLinks from "@/app/components/apiLinks";

import { FilterDropDown, FilterType } from "@/app/dropDown/linksDropDown";
import LinkPasswordProtectionModal from "@/app/modals/linkPasswordProtection";
import CustomUrlModal from "@/app/modals/customUrl";
import QRCodeGenerateModal from "@/app/modals/qrGenerate";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
import { BulkFilterDropDown, BulkFilterType } from "@/app/dropDown/bulkLinksDropDown";
import { QrFilterDropDown, QrFilterType } from "@/app/dropDown/qrLinksDropDown";


const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

const LinksSkeleton = () => (
  <div className="relative flex items-center justify-between py-5 px-4 border-b border-border/60 animate-pulse">
    <div className="flex items-start gap-4 w-[65%] md:w-[35%] min-w-0 pr-4">
      <div className="mt-1 w-8 h-8 rounded-full bg-secondary shrink-0" />
      <div className="flex flex-col gap-2.5 w-full">
        <div className="h-5 w-[140px] bg-secondary rounded-md" />
        <div className="h-4 w-[200px] bg-secondary/50 rounded-md" />
      </div>
    </div>
    <div className="hidden md:flex w-[15%] shrink-0 pr-4">
      <div className="h-6 w-20 bg-secondary/30 rounded-md" />
    </div>
    <div className="w-[20%] md:w-[20%] flex flex-col items-end md:items-start">
      <div className="h-5 w-12 bg-secondary/60 rounded" />
    </div>
    <div className="hidden md:block w-[10%] text-right">
      <div className="h-4 w-14 bg-secondary/40 rounded ml-auto" />
    </div>
  </div>
);

const QrSkeleton = () => (
  <div className="flex items-center py-8 px-5 border-b border-border/60 animate-pulse">
    <div className="shrink-0 mr-6 w-16 h-16 bg-secondary" />
    <div className="flex-1 flex flex-col gap-3">
      <div className="h-6 w-1/3 bg-secondary rounded" />
      <div className="h-4 w-1/2 bg-secondary rounded opacity-50" />
    </div>
    <div className="h-10 w-24 bg-secondary rounded-xl mr-8" />
    <div className="h-4 w-16 bg-secondary rounded" />
  </div>
);

const BulkSkeleton = () => (
  <div className="flex items-center py-5 px-4 border-b border-border/60 animate-pulse">
    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 mr-4">
      <HugeiconsIcon icon={File02Icon} />
    </div>
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-5 w-1/4 bg-secondary rounded" />
      <div className="h-4 w-1/3 bg-secondary rounded opacity-50" />
    </div>
    <div className="h-4 w-16 bg-secondary rounded ml-auto" />
  </div>
);

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

type LocalViewType = "links" | "bulk" | "api" | "qr";

function AllLinks() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [view, setView] = useState<LocalViewType>((searchParams.get("types") as LocalViewType) || "links");
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

  const handleViewChange = (newView: LocalViewType) => {
    setView(newView);
    router.push(`${pathname}?types=${newView}`);
  };

  const fetchData = useCallback(async () => {
    if (view === "api") return;
    try {
      setLoading(true);
      let endpoint = "";
      if (view === "bulk") endpoint = "/api/shortUrl/bulkLinks/fetchBulkLinks";
      else if (view === "qr") endpoint = "/api/fetchQR";
      else endpoint = "/api/fetchUrls";

      const res = await axios.get(endpoint);
      if (view === "bulk") setData(res.data.bulkLinks || []);
      else if (view === "qr") setData(res.data.qrs || []);
      else setData(res.data.urls || []);

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
        } else {
          router.push("/auth/signin");
        }

      } catch {
        router.push("/auth/signin");
      }
    };
    initAuth();

  }, [router]);


  useEffect(() => { if (isLoggedIn) fetchData(); }, [fetchData, isLoggedIn]);


  const filteredData = useMemo(() => {
    if (view === "api") return [];
    let result = [...data];

    if (statusFilter !== "all") {
      const now = new Date();
      result = result.filter((item) => {
        const itemDate = new Date(item.createdAt);

        switch (statusFilter) {
          case "today":
            return (
              itemDate.getDate() === now.getDate() &&
              itemDate.getMonth() === now.getMonth() &&
              itemDate.getFullYear() === now.getFullYear()
            );
          case "7days": {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            return itemDate >= sevenDaysAgo;
          }
          case "30days": {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(now.getDate() - 30);
            return itemDate >= thirtyDaysAgo;
          }
          case "protected":
            return item.password && item.password.trim() !== "";
          case "most-clicked":
            return true;
          default:
            return true;
        }
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => {
        if (view === "links") {
          return (
            item.linkName?.toLowerCase().includes(q) ||
            item.shorturl?.toLowerCase().includes(q) ||
            item.original?.toLowerCase().includes(q)
          );
        }
        if (view === "qr") {
          return (
            item.qrName?.toLowerCase().includes(q) ||
            item.shortUrl?.toLowerCase().includes(q) ||
            item.longUrl?.toLowerCase().includes(q)
          );
        }
        if (view === "bulk") {
          return (
            item.name?.toLowerCase().includes(q) ||
            item.links?.some((l: any) =>
              l.linkName?.toLowerCase().includes(q) ||
              l.shorturl?.toLowerCase().includes(q)
            )
          );
        }
        return false;
      });
    }

    if (statusFilter === "most-clicked") {
      result.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));

    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [data, searchQuery, view, statusFilter]);


  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden transition-colors duration-300">
      <Toaster position="bottom-center" />
      <Navbar />

      <div className="flex flex-col sm:flex-row flex-1 w-full max-w-[1600px] mx-auto overflow-hidden">
        <UrlsPageSidebar view={view} onViewChange={handleViewChange} />

        <main className="flex-1 w-full px-4 py-6 sm:px-10 sm:py-10 min-w-0 overflow-y-auto">
          <div className="hidden sm:flex sm:items-center justify-between gap-4 mb-8 border-b border-border pb-6">
            <div>
              <h1 className="text-4xl font-one tracking-tight">
                {view === "links" ? "My Links" : view === "bulk" ? "Bulk Links" : view === "qr" ? "QR Codes" : "API Requests"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {view === "api" ? "Links generated via your API keys." : "Track and manage your shortened URLs and assets."}
              </p>
            </div>

            {view !== "api" && (data.length > 0 || loading) && (
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 font-bold bg-secondary border border-border rounded-lg text-xs uppercase tracking-widest text-muted-foreground">
                  {loading ? "Loading..." : `Total - ${filteredData.length}`}
                </span>
              </div>
            )}
          </div>

          {view === "api" ? (
            <ApiLinks />
          ) : (
            <>
              {(data.length > 0 || loading) && !isDetailViewOpen && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 fade-in">
                  <div className="w-full sm:max-w-[450px] flex-1">
                    <ButtonGroup className="w-full shadow-sm">
                      <Input
                        placeholder={`Search ${view}...`}
                        className="bg-background border-border text-foreground focus-visible:ring-1 focus-visible:ring-ring h-11"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button variant="outline" className="bg-secondary border-border hover:bg-accent hover:text-accent-foreground h-11 px-4 cursor-pointer">
                        <SearchIcon className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </ButtonGroup>
                  </div>

                  {/* CONDITIONAL DROPDOWN RENDERING */}
                  <div className="w-full sm:w-auto flex justify-end">
                    {view === "bulk" ? (
                      <BulkFilterDropDown
                        value={statusFilter as BulkFilterType}
                        onChange={(val) => setStatusFilter(val)}
                      />
                    ) : view === "qr" ? (
                      <QrFilterDropDown
                        value={statusFilter as QrFilterType}
                        onChange={(val) => setStatusFilter(val)}
                      />
                    ) : (
                      <FilterDropDown
                        value={statusFilter}
                        onChange={(val: FilterType) => setStatusFilter(val)}
                      />
                    )}
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col w-full">
                  {[...Array(6)].map((_, i) => (
                    view === "qr" ? <QrSkeleton key={i} /> :
                      view === "bulk" ? <BulkSkeleton key={i} /> :
                        <LinksSkeleton key={i} />
                  ))}
                </div>
              ) : data.length === 0 ? (
                <div className="w-full py-24 px-4 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-secondary/30 mt-4 fade-in">
                  <div className="p-5 bg-secondary rounded-2xl border border-border mb-6">
                    <HugeiconsIcon
                      icon={view === "links" ? Link04Icon : view === "qr" ? QrCode01Icon : File02Icon}
                      className="w-12 h-12 text-muted-foreground"
                    />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-one mb-3 text-foreground text-center">
                    {view === "links" ? "Create your first link" : view === "qr" ? "No QR codes found" : "No bulk batches discovered"}
                  </h2>
                  <p className="text-muted-foreground font-three text-sm mb-10 text-center max-w-sm leading-relaxed">
                    {view === "links"
                      ? "Shorten your long URLs and track their performance with detailed analytics."
                      : view === "qr"
                        ? "Generate custom QR codes to bridge the gap between offline and online."
                        : "Group multiple links together into a single batch for easier management."}
                  </p>
                  <Button
                    onClick={() => router.push(view === "links" || view === "qr" ? "/" : "/bulk-create")}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-three px-6 py-4 rounded-xl flex items-center gap-2 text-lg transition-all shadow-md cursor-pointer"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} className="w-6 h-6" />
                    {view === "links" || view === "qr" ? "Create Now" : "Create Bulk Links"}
                  </Button>
                </div>
              ) : (
                <div className="fade-in">
                  {view === "links" && (
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
                  )}

                  {view === "bulk" && (
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

                  {view === "qr" && (
                    <QrCodes
                      qrCodes={paginatedData}
                      onRefresh={fetchData}
                      itemCount={filteredData.length}
                      router={router}
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
  return (
    <Suspense 
      fallback={
        <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex flex-col w-full p-10">
            <LinksSkeleton />
          </div>
        </div>
      }
    >
      <AllLinks />
    </Suspense>
  );
}