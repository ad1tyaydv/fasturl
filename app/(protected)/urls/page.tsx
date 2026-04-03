"use client";

import axios from "axios";
import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { IoCheckmarkOutline } from "react-icons/io5";

import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Globe02Icon, Share05Icon, Delete02Icon, QrCodeIcon, Edit03Icon, MagicWand01Icon,
  CircleLock01Icon, Search02Icon, CircleUnlock01Icon, CopyCheckIcon,
  CopyIcon 
} from '@hugeicons/core-free-icons';

import Navbar from "../../components/navbar";
import BulkLinks from "../../components/bulkLinks";
import { SkeletonLoader } from "@/app/loaders/links";
import { FilterDropDown, FilterType } from "@/app/dropDown/urlsPageDropDown";
import PasswordProtectionModal from "@/app/modals/linkPasswordProtection";
import CustomUrlModal from "@/app/modals/customUrl";
import QRCodeModal from "@/app/modals/qrGenerate";


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


function AllUrlsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialView = searchParams.get("types") === "bulk" ? "bulk" : "links";
  const [view, setView] = useState<"links" | "bulk">(initialView);

  const [data, setData] = useState<any[]>([]);
  const [tier, setTier] = useState("FREE");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);


  const handleViewChange = (newView: "links" | "bulk") => {
    setView(newView);
    const newUrl = `${pathname}?types=${newView === "links" ? "link" : "bulk"}`;

    router.push(newUrl);
  };


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = view === "links" ? "/api/fetchUrls" : "/api/shortUrl/bulkLinks/fetchBulkLinks";

      const res = await axios.get(endpoint);
      const rawData = view === "links" ? res.data.urls : res.data.bulkLinks;
      setData(rawData || []);

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


  useEffect(() => {
    if (isLoggedIn) fetchData();

  }, [fetchData, isLoggedIn]);


  useEffect(() => {
    setCurrentPage(1);

  }, [view, searchQuery, statusFilter]);


  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrlId(id);
    toast.success("Link copied!");
    setTimeout(() => setCopiedUrlId(null), 2000);
  };


  const saveName = async (id: string) => {
    if (!tempName.trim()) {
      setEditingId(null);
      return;
    }

    try {
      await axios.post("/api/shortUrl/linkName", {
        linkId: id,
        name: tempName.trim(),
      });

      toast.success("Name updated!");
      fetchData();

    } catch {
      toast.error("Update failed");
    }

    setEditingId(null);
  };


  const handleLinkDelete = async (url: any) => {
    try {
      await axios.post(`/api/shortUrl/delete/${url.id}`);
      fetchData();

    } catch (error) {
      console.log("Error while deleting the link");
    }
  };


  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) =>
        view === "links"
          ? item.linkName?.toLowerCase().includes(q) || item.shorturl?.toLowerCase().includes(q)
          : (item.name || "Bulk link").toLowerCase().includes(q)
      );
    }


    const now = new Date();
    if (statusFilter === "protected") {
      result = result.filter((item) => !!item.isProtected);
      
    } else if (statusFilter === "today") {
      result = result.filter(
        (item) => new Date(item.createdAt).toDateString() === now.toDateString()
      );

    } else if (statusFilter === "7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      result = result.filter((item) => new Date(item.createdAt) >= sevenDaysAgo);

    } else if (statusFilter === "30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      result = result.filter((item) => new Date(item.createdAt) >= thirtyDaysAgo);
    }

    if (statusFilter === "most-clicked") {
      result.sort((a, b) => {
        const clicksA = view === "links" ? a.clicks || 0 : a.links?.reduce((acc: number, l: any) => acc + (l.clicks || 0), 0) || 0;
        const clicksB = view === "links" ? b.clicks || 0 : b.links?.reduce((acc: number, l: any) => acc + (l.clicks || 0), 0) || 0;
        return clicksB - clicksA;
      });

    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;

  }, [data, searchQuery, statusFilter, view]);


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Toaster position="bottom-center" />
      <Navbar />

      <main className="w-full max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-2xl sm:text-4xl font-one tracking-tight">
            <button
              onClick={() => handleViewChange("links")}
              className={`cursor-pointer transition-colors ${view === "links" ? "text-white" : "text-neutral-600 hover:text-neutral-400"}`}
            >
              Saved URLs
            </button>
            <span className="text-neutral-700">/</span>
            <button
              onClick={() => handleViewChange("bulk")}
              className={`cursor-pointer transition-colors ${view === "bulk" ? "text-white" : "text-neutral-600 hover:text-neutral-400"}`}
            >
              Bulk Links
            </button>
          </div>
          <span className="px-4 py-1.5 font-bold bg-[#1c1c1c] border border-neutral-700 rounded-lg text-sm">
            Total - {filteredData.length}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 mt-2">
          <div className="relative w-full sm:w-[400px]">
            <HugeiconsIcon icon={Search02Icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search links..."
              className="w-full pl-10 pr-3 py-3 bg-[#111111] font-three border border-neutral-800 rounded-lg text-white text-sm outline-none focus:border-neutral-600 transition-all" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
          <FilterDropDown value={statusFilter} onChange={(val: FilterType) => setStatusFilter(val)} />
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="fade-in">
            {view === "links" ? (
              <div className="flex flex-col w-full">
                {paginatedData.map((url: any) => (
                  <div key={url.id} className="flex items-center justify-between py-5 px-4 border-b border-neutral-800/60 hover:bg-[#1a1a1a] group transition-colors">
                    <div className="flex items-start gap-4 w-[40%] min-w-0 pr-4">
                      <div className="mt-1 w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                        <HugeiconsIcon icon={Globe02Icon} />
                      </div>
                      <div className="flex flex-col min-w-0 w-full">
                        {editingId === url.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              autoFocus 
                              className="bg-[#111111] border border-neutral-700 rounded px-2 py-1 text-white w-full outline-none" 
                              value={tempName} 
                              onChange={(e) => setTempName(e.target.value)} 
                              onKeyDown={(e) => e.key === "Enter" && saveName(url.id)} 
                            />
                            <button onClick={() => saveName(url.id)} className="text-green-500 cursor-pointer">
                              <IoCheckmarkOutline size={22} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-white font-one text-xl truncate tracking-wide">{url.linkName || "Untitled Link"}</span>
                        )}
                        <span className="text-neutral-500 font-three text-base truncate">{NEXT_DOMAIN}/{url.shorturl}</span>
                      </div>
                    </div>

                    <div className="hidden md:flex w-[10%] shrink-0">
                      {url.isProtected && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <HugeiconsIcon icon={CircleLock01Icon} size={15} />
                          <span className="text-[10px] uppercase tracking-widest font-one">Protected</span>
                        </div>
                      )}
                    </div>

                    <div className="w-[10%] flex flex-col">
                      <span className="text-white font-semibold">{url.clicks || 0} clicks</span>
                    </div>

                    <div className="flex items-center justify-end gap-3 text-neutral-400 w-[30%] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                      <button onClick={() => { setSelectedLink(url); setIsPasswordModalOpen(true); }} className={`p-2 rounded-md cursor-pointer transition-colors ${url.isProtected ? 'text-blue-500' : 'hover:text-white'}`}>
                        {url.isProtected ? <HugeiconsIcon icon={CircleLock01Icon} /> : <HugeiconsIcon icon={CircleUnlock01Icon} />}
                      </button>
                      <button onClick={() => { setSelectedLink(url); setIsCustomModalOpen(true); }} className="hover:text-white p-2 cursor-pointer">
                        <HugeiconsIcon icon={MagicWand01Icon} />
                      </button>
                      <button onClick={() => window.open(`${NEXT_DOMAIN}/${url.shorturl}`, '_blank')} className="hover:text-white p-2 cursor-pointer">
                        <HugeiconsIcon icon={Share05Icon} />
                      </button>
                      <button onClick={() => copyToClipboard(`${NEXT_DOMAIN}/${url.shorturl}`, url.id)} className={`p-2 cursor-pointer ${copiedUrlId === url.id ? "text-green-500" : "hover:text-white"}`}>
                        {copiedUrlId === url.id ? <HugeiconsIcon icon={CopyCheckIcon} /> : <HugeiconsIcon icon={CopyIcon} />}
                      </button>
                      <button onClick={() => { setSelectedLink(url); setIsQrModalOpen(true); }} className="hover:text-white p-2 cursor-pointer">
                        <HugeiconsIcon icon={QrCodeIcon} />
                      </button>
                      <button onClick={() => { setEditingId(url.id); setTempName(url.linkName || ""); }} className="hover:text-white p-2 cursor-pointer">
                        <HugeiconsIcon icon={Edit03Icon} />
                      </button>
                      <button onClick={() => handleLinkDelete(url)} className="hover:text-red-500 p-2 cursor-pointer">
                        <HugeiconsIcon icon={Delete02Icon} />
                      </button>
                    </div>

                    <div className="w-[10%] text-right text-neutral-500 text-sm font-medium">{getRelativeTime(url.createdAt)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <BulkLinks
                bulkLinks={paginatedData}
                onRefresh={fetchData}
                domain={NEXT_DOMAIN!}
                userPlan={tier}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-2 rounded-lg bg-neutral-800 disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="p-2 rounded-lg bg-neutral-800 disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <QRCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} selectedUrl={selectedLink} />
      <PasswordProtectionModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} selectedUrl={selectedLink} onSuccess={fetchData} />
      <CustomUrlModal isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)} selectedUrl={selectedLink} onSuccess={fetchData}/>
    </div>
  );
}

export default function AllUrlsPage() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <AllUrlsPageClient />
    </Suspense>
  )
}