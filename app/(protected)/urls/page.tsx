"use client";

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/navbar"; 
import SavedLinks from "../../components/savedLinks";
import BulkLinks from "../../components/bulkLinks";
import PasswordProtectionModal from "@/app/modals/passwordProtection";
import CustomUrlModal from "@/app/modals/customUrl";
import { SkeletonLoader } from "@/app/loaders/links";
import { Skeleton } from "@/components/ui/skeleton";

interface UrlItem {
  id: string;
  original: string;
  shorturl: string;
  name?: string;
  clicks?: number;
  createdAt?: string;
  password?: string;
  expiresAt?: string;
}

const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function AllUrlsPage() {
  const router = useRouter();
  const [view, setView] = useState<"links" | "bulk">("links");
  const [data, setData] = useState<UrlItem[]>([]);
  const [tier, setTier] = useState("FREE");
  const [loading, setLoading] = useState(true); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [updatingLinkId, setUpdatingLinkId] = useState<string | null>(null);

  const [selectedUrl, setSelectedUrl] = useState<UrlItem | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = view === "links" ? "/api/fetchUrls" : "/api/shortUrl/bulkLinks/fetchBulkLinks";
      const res = await axios.get(endpoint);
      setData(view === "links" ? res.data.urls?.reverse() : res.data.bulkLinks?.reverse());

    } catch (err) {
      console.error(err);
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


  const handleUpdateName = async (id: string, newName: string) => {
    setUpdatingLinkId(id);
    try {
      await axios.post("/api/shortUrl/linkName", { linkId: id, name: newName });
      setData((prev) => prev.map((link) => (link.id === id ? { ...link, name: newName } : link)));

    } catch (err) {
      console.error(err);

    } finally {
      setUpdatingLinkId(null);
    }
  };


  const handleOpenCustomUrlModal = (url: UrlItem) => {
    if (tier === "FREE" || tier === "ESSENTIAL") router.push("/premium");
    else { setSelectedUrl(url); setIsCustomModalOpen(true); }
  };


  const handleOpenPasswordModal = (url: UrlItem) => {
    if (tier !== "PRO" && tier !== "ULTRA") router.push("/premium");
    else { setSelectedUrl(url); setIsPasswordModalOpen(true); }
  };


  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />
      <main className="w-full max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-2xl sm:text-4xl font-one tracking-tight">
            <button onClick={() => setView("links")} className={`cursor-pointer ${view === "links" ? "text-white" : "text-neutral-600"}`}>Saved URLs</button>
            <span className="text-neutral-700">/</span>
            <button onClick={() => setView("bulk")} className={`cursor-pointer ${view === "bulk" ? "text-white" : "text-neutral-600"}`}>Bulk Links</button>
          </div>
          {loading ? <Skeleton className="h-[36px] w-[140px] bg-neutral-800 rounded-lg" /> : (
            <span className="px-4 py-1.5 font-bold bg-[#1c1c1c] border border-neutral-700 rounded-lg">Total - {data.length}</span>
          )}
        </div>

        {loading ? <SkeletonLoader /> : (
          <div className="fade-in">
            {view === "links" ? (
              <SavedLinks links={data} domain={NEXT_DOMAIN!} updatingLinkId={updatingLinkId} onUpdateName={handleUpdateName} onDelete={fetchData} onOpenPasswordModal={handleOpenPasswordModal} onOpenCustomUrlModal={handleOpenCustomUrlModal} />
            ) : (
              <BulkLinks bulkLinks={data} onRefresh={fetchData} domain={NEXT_DOMAIN!} userPlan={tier} />
            )}
          </div>
        )}
      </main>

      <PasswordProtectionModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        selectedUrl={selectedUrl} 
        onSuccess={fetchData}
      />

      <CustomUrlModal 
        isOpen={isCustomModalOpen} 
        onClose={() => setIsCustomModalOpen(false)} 
        selectedUrl={selectedUrl} 
        onSuccess={fetchData} 
        domain={NEXT_DOMAIN!} 
      />
    </div>
  );
}