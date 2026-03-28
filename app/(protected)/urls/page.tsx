"use client";

import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Navbar from "../../components/navbar"; 
import SavedLinks from "../../components/savedLinks";
import BulkLinks from "../../components/bulkLinks";
import { SkeletonLoader } from "@/app/loaders/links";


const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function AllUrlsPage() {
  const router = useRouter();
  const [view, setView] = useState<"links" | "bulk">("links");
  const [data, setData] = useState<any[]>([]);
  const [tier, setTier] = useState("FREE");
  const [loading, setLoading] = useState(true); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "protected">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = view === "links" ? "/api/fetchUrls" : "/api/shortUrl/bulkLinks/fetchBulkLinks";
      const res = await axios.get(endpoint);
      const rawData = view === "links" ? res.data.urls : res.data.bulkLinks;

      const sortedData = [...(rawData || [])].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setData(sortedData);

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

      } catch (error) {
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

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const query = searchQuery.toLowerCase();
      const nameMatch = view === "links" 
        ? (item.linkName?.toLowerCase().includes(query) || item.shorturl?.toLowerCase().includes(query))
        : (item.name || "Bulk link").toLowerCase().includes(query);
      
      const statusMatch = statusFilter === "all" ? true : !!item.password;
      return nameMatch && statusMatch;
    });

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
                onClick={() => setView("links")} 
                className={`cursor-pointer transition-colors ${view === "links" ? "text-white" : "text-neutral-600 hover:text-neutral-400"}`}
            >
                Saved URLs
            </button>
            <span className="text-neutral-700">/</span>
            <button 
                onClick={() => setView("bulk")} 
                className={`cursor-pointer transition-colors ${view === "bulk" ? "text-white" : "text-neutral-600 hover:text-neutral-400"}`}
            >
                Bulk Links
            </button>
          </div>
          <span className="px-4 py-1.5 font-bold bg-[#1c1c1c] border border-neutral-700 rounded-lg text-sm">
            Total - {filteredData.length}
          </span>
        </div>

        {loading ? <SkeletonLoader /> : (
          <div className="fade-in">
            {view === "links" ? (
              <SavedLinks 
                links={paginatedData} 
                domain={NEXT_DOMAIN!} 
                onRefresh={fetchData} 
                userTier={tier}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
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
              <div className="flex items-center justify-center gap-8 mt-12 pb-10">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1} 
                  className="p-2 border border-neutral-700 rounded-full disabled:opacity-20 hover:bg-neutral-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={24}/>
                </button>
                <span className="text-neutral-400 font-medium">
                  Page <span className="text-white">{currentPage}</span> of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages} 
                  className="p-2 border border-neutral-700 rounded-full disabled:opacity-20 hover:bg-neutral-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight size={24}/>
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}