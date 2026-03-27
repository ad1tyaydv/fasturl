"use client";

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  IoEyeOutline, IoEyeOffOutline, IoPencilOutline, IoCloseOutline, IoCalendarOutline 
} from "react-icons/io5";

import Navbar from "../../components/navbar"; 
import SavedLinks from "../../components/savedLinks";
import BulkLinks from "../../components/bulkLinks";
import { SkeletonLoader } from "@/app/loaders/links";
import { Skeleton } from "@/components/ui/skeleton";

interface UrlItem {
  id: string;
  original: string;
  shorturl: string;
  name?: string;
  clicks?: number;
  scans?: number;
  qrImage?: string;
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

  const [customUrl, setCustomUrl] = useState("");
  const [password, setPassword] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingExpiry, setIsEditingExpiry] = useState(false);


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = view === "links" ? "/api/fetchUrls" : "/api/shortUrl/bulkLinks/fetchBulkLinks";
      const res = await axios.get(endpoint);
      
      if (view === "links") {
        setData(res.data.urls?.reverse() || []);
      } else {
        setData(res.data.bulkLinks?.reverse() || res.data?.reverse() || []);
      }

    } catch (err) {
      console.error(`Error fetching ${view}:`, err);
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
        
      } catch (error) {
        console.error("Initialization failed", error);
        setIsLoggedIn(false);
        router.push("/auth/signin");
      }
    };
    initAuth();

  }, [router]);


  useEffect(() => {
    if (isLoggedIn) fetchData();

  }, [fetchData, isLoggedIn, view]);


  const handleUpdateName = async (id: string, newName: string) => {
    setUpdatingLinkId(id);
    try {
      await axios.post("/api/shortUrl/linkName", { linkId: id, name: newName });
      setData((prev) => prev.map((link) => (link.id === id ? { ...link, name: newName } : link)));

    } catch (err) {
      console.error("Failed to update name:", err);

    } finally {
      setUpdatingLinkId(null);
    }
  };


  const handleDeleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    try {
      await axios.post(`/api/shortUrl/delete/${id}`);
      setData(data.filter((u) => u.id !== id));
      setSelectedUrl(null);

    } catch (err) {
      console.log("Error deleting item:", err);
    }
  };


  const handleOpenCustomUrlModal = (url: UrlItem) => {
    if (tier === "FREE" || tier === "ESSENTIAL") {
      router.push("/premium");
    } else {
      setSelectedUrl(url);
      setIsCustomModalOpen(true);
    }
  };


  const handleOpenPasswordModal = (url: UrlItem) => {
    if (tier !== "PRO" && tier !== "ULTRA") {
      router.push("/premium");
    } else {
      setSelectedUrl(url);
      setIsPasswordModalOpen(true);
      setIsEditingPassword(!url.password);
      setIsEditingExpiry(!url.expiresAt);
    }
  };


  const closeAllModals = () => {
    setSelectedUrl(null);
    setIsCustomModalOpen(false);
    setIsPasswordModalOpen(false);
    setCustomUrl("");
    setPassword("");
    setExpiryDate("");
    setErrorMessage("");
    setShowPassword(false);
    setIsEditingPassword(false);
    setIsEditingExpiry(false);
  };


  const handleAddPassword = async () => {
    try {
      const finalPassword = isEditingPassword ? password : selectedUrl?.password;
      const finalExpiry = isEditingExpiry ? expiryDate : selectedUrl?.expiresAt;
      await axios.post("/api/shortUrl/passwordProtection", {
        shortUrlId: selectedUrl?.id,
        password: finalPassword,
        expiryDate: finalExpiry,
      });
      alert("Protection Updated successfully");
      fetchData();
      closeAllModals();

    } catch (error) {
      console.log("Update failed", error);
    }
  };


  const handleUpdateCustomUrl = async () => {
    setErrorMessage("");
    try {
      await axios.post("/api/shortUrl/customUrl", {
        shortUrl: selectedUrl?.id,
        customUrl: customUrl,
      });
      closeAllModals();
      fetchData();

    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Custom URL with this name is already taken");
      } else {
        console.log("Something went wrong", error);
      }
    }
  };


  return (
    <div className="min-h-screen bg-[#141414] text-white transition-colors duration-300">
      <Navbar />

      <main className="w-full max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-2xl sm:text-4xl font-one tracking-tight">
            <button
              onClick={() => { if (view !== "links") { setLoading(true); setView("links"); } }}
              className={`cursor-pointer font-one transition-colors ${view === "links" ? "text-white" : "text-neutral-600 hover:text-white"}`}
            >
              Saved URLs
            </button>
            <span className="text-neutral-700">/</span>
            <button
              onClick={() => { if (view !== "bulk") { setLoading(true); setView("bulk"); } }}
              className={`cursor-pointer font-one transition-colors ${view === "bulk" ? "text-white" : "text-neutral-600 hover:text-white"}`}
            >
              Bulk Links
            </button>
          </div>
          
          <div className="flex justify-end">
            {loading ? (
              <Skeleton className="h-[36px] w-[140px] bg-neutral-800 rounded-lg" />
            ) : (
              <span className="px-4 py-1.5 text-sm sm:text-base font-bold font-three bg-[#1c1c1c] text-white border border-neutral-700 rounded-lg">
                Total {view === "links" ? "Links" : "Bulk Links"} - {data.length}
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="fade-in">
            {view === "links" ? (
              <SavedLinks
                links={data}
                onDelete={handleDeleteLink}
                domain={NEXT_DOMAIN!}
                onUpdateName={handleUpdateName}
                updatingLinkId={updatingLinkId}
                onOpenPasswordModal={handleOpenPasswordModal}
                onOpenCustomUrlModal={handleOpenCustomUrlModal}
              />
            ) : (
              <BulkLinks
                bulkLinks={data}
                onRefresh={fetchData}
                domain={NEXT_DOMAIN!}
                userPlan={tier}
              />
            )}
          </div>
        )}
      </main>

      {(isCustomModalOpen || isPasswordModalOpen) && selectedUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 transition-opacity duration-150"
          onClick={closeAllModals}
        >
          {isCustomModalOpen && (
            <div
              className="bg-[#1c1c1c] shadow-2xl w-full max-w-lg p-6 sm:p-10 cursor-default border border-neutral-800 rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl sm:text-2xl font-three mb-8 text-center text-white">
                Add a custom short url to your link
              </h3>
              <div className="space-y-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xl font-one text-white">Current Short Url</label>
                  <div className="w-full p-3 border border-neutral-800 bg-[#111111] text-neutral-400 font-three rounded-lg">
                    {NEXT_DOMAIN}/{selectedUrl.shorturl}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xl font-one text-white">Custom Short Url</label>
                  <div className={`flex items-center border ${errorMessage ? "border-red-500" : "border-neutral-700"} bg-[#111111] focus-within:border-blue-500 transition-colors rounded-lg overflow-hidden`}>
                    <span className="pl-3 py-3 text-neutral-500 font-three bg-[#1a1a1a] border-r border-neutral-700 px-3">
                      {NEXT_DOMAIN}/
                    </span>
                    <input
                      type="text"
                      maxLength={25}
                      placeholder="custom"
                      value={customUrl}
                      onChange={(e) => {
                        setCustomUrl(e.target.value.replace(/[^a-zA-Z0-9]/g, ""));
                        if (errorMessage) setErrorMessage("");
                      }}
                      className="flex-1 p-3 bg-transparent text-white font-three focus:outline-none"
                    />
                  </div>
                  {errorMessage ? (
                    <p className="text-sm text-red-500 font-two mt-1">{errorMessage}</p>
                  ) : (
                    <p className="text-[10px] font-three text-neutral-500 uppercase tracking-widest mt-1">
                      Max 25 characters
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeAllModals}
                  className="cursor-pointer px-6 py-2.5 font-three text-sm bg-transparent text-white border border-neutral-700 hover:bg-[#2a2a2a] transition-colors rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCustomUrl}
                  className="cursor-pointer px-6 py-2.5 font-three text-sm bg-white text-black hover:bg-gray-200 transition-colors active:scale-95 rounded-lg font-bold"
                >
                  Update
                </button>
              </div>
            </div>
          )}

          {isPasswordModalOpen && (
            <div
              className="bg-[#1c1c1c] shadow-2xl w-full max-w-lg p-6 sm:p-10 cursor-default border border-neutral-800 rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl sm:text-2xl font-three mb-8 text-center text-white">
                Add Link Protection
              </h3>
              <div className="space-y-6 mb-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xl font-one text-white">
                      Password <span className="text-sm text-neutral-500 font-normal">(Optional)</span>
                    </label>
                    {!isEditingPassword && selectedUrl.password && (
                      <button
                        onClick={() => { setIsEditingPassword(true); setPassword(""); }}
                        className="text-blue-500 hover:text-blue-400 cursor-pointer transition-colors"
                        title="Edit Password"
                      >
                        <IoPencilOutline size={18} />
                      </button>
                    )}
                  </div>

                  {!isEditingPassword && selectedUrl.password ? (
                    <div className="w-full p-3 border border-dashed border-neutral-700 bg-[#1a1a1a] text-neutral-400 font-three italic rounded-lg">
                      Password is already configured
                    </div>
                  ) : (
                    <div className="relative flex items-center border border-neutral-700 bg-[#111111] focus-within:border-blue-500 transition-colors rounded-lg overflow-hidden">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 bg-transparent text-white font-three focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="px-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xl font-one text-white">Set Expiry Date</label>
                    {!isEditingExpiry && selectedUrl.expiresAt && (
                      <button
                        onClick={() => { setIsEditingExpiry(true); setExpiryDate(""); }}
                        className="text-blue-500 hover:text-blue-400 cursor-pointer transition-colors"
                        title="Edit Expiry"
                      >
                        <IoPencilOutline size={18} />
                      </button>
                    )}
                  </div>

                  {!isEditingExpiry && selectedUrl.expiresAt ? (
                    <div className="w-full p-3 border border-dashed border-neutral-700 bg-[#1a1a1a] text-neutral-400 font-three rounded-lg">
                      Expires on {new Date(selectedUrl.expiresAt).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="relative group">
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full p-3 border border-neutral-700 bg-[#111111] text-white font-three focus:outline-none focus:border-blue-500 transition-colors rounded-lg cursor-pointer [color-scheme:dark] pr-12 appearance-none"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                        <IoCalendarOutline size={20} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeAllModals}
                  className="cursor-pointer px-6 py-2.5 font-three text-sm bg-transparent text-white border border-neutral-700 hover:bg-[#2a2a2a] transition-colors rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPassword}
                  className="bg-white text-black px-6 py-2.5 font-three text-sm hover:bg-gray-200 transition-colors rounded-lg cursor-pointer active:scale-95 font-bold"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}