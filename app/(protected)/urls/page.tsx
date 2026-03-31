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
import { FilterType } from "@/app/dropDown/urlsPageDropDown";

const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function AllUrlsPage() {
  const router = useRouter();

  const [view, setView] = useState<"links" | "bulk">("links");

  const [data, setData] = useState<any[]>([]);
  const [tier, setTier] = useState("FREE");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const handleViewChange = (newView: "links" | "bulk") => {
    setView(newView);
  };


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint =
        view === "links"
          ? "/api/fetchUrls"
          : "/api/shortUrl/bulkLinks/fetchBulkLinks";

      const res = await axios.get(endpoint);
      const rawData =
        view === "links" ? res.data.urls : res.data.bulkLinks;

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


  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      result = result.filter((item) =>
        view === "links"
          ? item.linkName?.toLowerCase().includes(q) ||
            item.shorturl?.toLowerCase().includes(q)
          : (item.name || "Bulk link")
              .toLowerCase()
              .includes(q)
      );
    }

    const now = new Date();

    if (statusFilter === "protected") {
      result = result.filter((item) => !!item.password);
    } else if (statusFilter === "today") {
      result = result.filter(
        (item) =>
          new Date(item.createdAt).toDateString() ===
          now.toDateString()
      );
    } else if (statusFilter === "7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);

      result = result.filter(
        (item) => new Date(item.createdAt) >= sevenDaysAgo
      );
    } else if (statusFilter === "30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      result = result.filter(
        (item) => new Date(item.createdAt) >= thirtyDaysAgo
      );
    }

    if (statusFilter === "most-clicked") {
      result.sort((a, b) => {
        const clicksA =
          view === "links"
            ? a.clicks || 0
            : a.links?.reduce(
                (acc: number, l: any) =>
                  acc + (l.clicks || 0),
                0
              ) || 0;

        const clicksB =
          view === "links"
            ? b.clicks || 0
            : b.links?.reduce(
                (acc: number, l: any) =>
                  acc + (l.clicks || 0),
                0
              ) || 0;

        return clicksB - clicksA;
      });
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }
    return result;

  }, [data, searchQuery, statusFilter, view]);


  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  );


  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Toaster position="bottom-center" />

      <Navbar />

      <main className="w-full max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-2xl sm:text-4xl font-one tracking-tight">
            <button
              onClick={() =>
                handleViewChange("links")
              }
              className={`cursor-pointer transition-colors ${
                view === "links"
                  ? "text-white"
                  : "text-neutral-600 hover:text-neutral-400"
              }`}
            >
              Saved URLs
            </button>

            <span className="text-neutral-700">
              /
            </span>

            <button
              onClick={() =>
                handleViewChange("bulk")
              }
              className={`cursor-pointer transition-colors ${
                view === "bulk"
                  ? "text-white"
                  : "text-neutral-600 hover:text-neutral-400"
              }`}
            >
              Bulk Links
            </button>
          </div>

          <span className="px-4 py-1.5 font-bold bg-[#1c1c1c] border border-neutral-700 rounded-lg text-sm">
            Total - {filteredData.length}
          </span>
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : (
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
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      (prev) => prev - 1
                    )
                  }
                  className="p-2 rounded-lg bg-neutral-800 disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>

                <span>
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) => prev + 1
                    )
                  }
                  className="p-2 rounded-lg bg-neutral-800 disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}