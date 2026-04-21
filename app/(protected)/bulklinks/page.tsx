"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  IoCloseOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
  IoFileTrayFullOutline,
  IoRocketOutline,
  IoRefreshOutline,
  IoCalendarOutline,
} from "react-icons/io5";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  CloudUploadIcon, Download02Icon, Cancel01Icon, File02Icon,
  Calendar03Icon, ArrowRight01Icon, Delete02Icon,
  Edit03Icon, CircleLock01Icon, CircleUnlock01Icon, ViewIcon, ViewOffSlashIcon,
  Pdf02Icon, Csv02Icon, Tick02Icon
} from '@hugeicons/core-free-icons';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "../../components/navbar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Features from "@/app/components/features";
import FaqSection from "@/app/components/faqSection";
import TotalData from "@/app/components/totalData";
import Footer from "@/app/components/footer";

const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

const getRelativeTime = (dateString?: string) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

export default function BulkCreateLinks() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [createdLinks, setCreatedLinks] = useState<any[]>([]);
  const [pastBulkLinks, setPastBulkLinks] = useState<any[]>([]);

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [userPlan, setUserPlan] = useState<string>("FREE");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [password, setPassword] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [selectedUrl, setSelectedUrl] = useState<any | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingExpiry, setIsEditingExpiry] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        
        if (!res.data.authenticated) {
          router.push("/auth/signin");
          return;
        }

        setIsLoggedIn(true);
        setUserPlan(res.data.plan || "FREE");
        localStorage.setItem("plan", res.data.plan || "FREE");
        await fetchPastBulkLinks();

      } catch (error) {
        router.push("/auth/signin");
      } finally {

      }
    };
    checkAuth();
  }, [router]);

  const fetchPastBulkLinks = async () => {
    try {
      const res = await axios.get("/api/shortUrl/bulkLinks/fetchBulkLinks");
      setPastBulkLinks(res.data.bulkLinks || res.data || []);
    } catch (error) {
      console.error("Failed to fetch past bulk links", error);
    }
  };


  const checkPlanAccess = () => {
    if (userPlan === "FREE") {
      router.push("/premium");
      return false;
    }
    return true;
  };


  const handleGenerateMore = () => {
    setFile(null);
    setStatus(null);
    setCreatedLinks([]);
    setPassword("");
    setExpiryDate("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setStatus(null);
      setCreatedLinks([]);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleUpload = async () => {
    if (!checkPlanAccess()) return;

    if (!file) return;

    if (expiryDate) {
      const selected = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        setStatus({ type: "error", message: "Invalid Date: Expiry cannot be in the past." });
        return;
      }
    }

    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);
    if (password) formData.append("password", password);
    if (expiryDate) formData.append("expiryDate", expiryDate);

    try {
      const res = await axios.post("/api/shortUrl/bulkLinks", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus({ type: "success", message: `Successfully created ${res.data.count} short links!` });
      setCreatedLinks(res.data.success || []);
      await fetchPastBulkLinks();
      setFile(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "";
      if (errorMessage.toLowerCase().includes("limit") || error.response?.status === 403) {
        setShowLimitModal(true);
      }
      setStatus({ type: "error", message: errorMessage || "Failed to process bulk upload." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async (id: string, newName: string) => {
    if (!checkPlanAccess()) return;
    if (!newName.trim()) return;

    try {
      await axios.post("/api/shortUrl/bulkLinks/updateName", { linkId: id, name: newName });
      setPastBulkLinks((prev) =>
        prev.map((link) => (link.id === id ? { ...link, name: newName } : link))
      );
    } catch (err) {
      console.error("Failed to update name:", err);
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.post(`/api/shortUrl/bulkLinks/delete/${id}`);
      setPastBulkLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (error) {
      console.error("Failed to delete bulk links", error);
    } finally {
      setDeletingId(null);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Fasturl - Shortened Links", 14, 15);
    autoTable(doc, {
      head: [['#', 'Original URL', 'Short URL']],
      body: createdLinks.map((l, i) => [i + 1, l.original, `${NEXT_DOMAIN}/${l.short}`]),
      startY: 20,
    });
    doc.save("links.pdf");
  };

  const exportCSV = () => {
    const headers = "Original URL,Short URL\n";
    const rows = createdLinks.map(l => `${l.original},${NEXT_DOMAIN}/${l.short}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'links.csv';
    a.click();
  };

  const closeAllModals = () => {
    setSelectedUrl(null);
    setIsPasswordModalOpen(false);
    setPassword("");
    setExpiryDate("");
    setShowPassword(false);
    setIsEditingPassword(false);
    setIsEditingExpiry(false);
  };

  const handleAddPassword = async () => {
    try {
      const finalPassword = isEditingPassword ? password : selectedUrl?.password;
      const finalExpiry = isEditingExpiry ? expiryDate : selectedUrl?.expiresAt;
      await axios.post("/api/shortUrl/bulkLinks/passwordProtection", {
        bulkLinkId: selectedUrl?.id,
        password: finalPassword,
        expiryDate: finalExpiry,
      });
      toast.success("Protection Updated successfully");
      await fetchPastBulkLinks();
      closeAllModals();
    } catch (error) {
      console.log("Update failed");
    }
  };

  const topFiveLinks = pastBulkLinks.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#141414] text-white transition-colors duration-300">
      <Navbar />

      <div className="flex flex-col items-center justify-center text-center py-12 px-6">
        <h1 className="text-3xl font-one sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">
          Generate <span className="text-red-500">Thousands</span> of Links Instantly
        </h1>
        <p className="max-w-2xl font-one sm:text-lg text-neutral-400">
          Transform your bulk data into high-quality, shareable short links and QR codes instantly.
        </p>
      </div>

      <main className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20 py-5">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:h-[540px]">

          <div className="w-full lg:w-[60%] xl:w-[65%] p-6 sm:p-8 border border-neutral-800 rounded-2xl shadow-sm relative text-white flex flex-col h-full">
            <div className="mb-6 shrink-0">
              <h2 className="text-2xl font-bold mb-2 text-white">Bulk Shorten Links</h2>
              <p className="text-neutral-400 text-sm">
                Upload your CSV file to generate shortened links instantly.
              </p>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 flex flex-col gap-3 min-h-0">
                <div
                  onClick={() => {
                    if (!createdLinks.length) {
                        fileInputRef.current?.click();
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-6 flex-1 flex flex-col items-center justify-center transition-all duration-200 relative
                      ${createdLinks.length > 0 ? 'border-neutral-800 bg-[#1a1a1a] cursor-default' : file ? 'border-blue-500 bg-blue-500/10 cursor-pointer' : 'border-neutral-700 hover:border-blue-500 cursor-pointer'}`}
                >
                  <input type="file" accept=".csv" hidden ref={fileInputRef} onChange={handleFileChange} disabled={createdLinks.length > 0} className="cursor-pointer" />

                  {file ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <HugeiconsIcon icon={File02Icon} size={30} className="text-blue-500" />
                        <div className="text-left">
                          <p className="font-semibold truncate max-w-[150px] sm:max-w-[200px] text-white text-lg">{file.name}</p>
                          <p className="text-sm text-neutral-400">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      {!loading && (
                        <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="p-2 hover:bg-red-500/20 rounded-full text-red-500 cursor-pointer transition-colors">
                          <HugeiconsIcon icon={Cancel01Icon} />
                        </button>
                      )}
                    </div>
                  ) : createdLinks.length > 0 ? (
                    <div className="flex flex-col items-center text-center gap-2 text-green-500">
                      <IoCheckmarkCircleOutline size={48} />
                      <p className="font-medium text-lg">Processed Successfully</p>
                    </div>
                  ) : (
                    <>
                      <HugeiconsIcon icon={CloudUploadIcon} size={35} className="mb-4" />
                      <p className="text-center font-medium text-white">Click to upload your CSV</p>
                      <p className="text-center text-xs text-neutral-500 mt-1">Make sure it contains a column for URLs</p>
                    </>
                  )}
                </div>
              </div>

              <div className="shrink-0 mt-6 space-y-6">
                {file && !createdLinks.length && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-300 border-t border-neutral-800 pt-6">
                    <div className="space-y-2">
                      <label className="text-sm font-three flex items-center gap-1">
                        Password <span className="text-neutral-500 font-three">(Optional)</span>
                      </label>
                      <div className="relative group">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          className="w-full p-3 bg-[#111111] font-three border border-neutral-700 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                        >
                          {showPassword ? <HugeiconsIcon icon={ViewOffSlashIcon} /> : <HugeiconsIcon icon={ViewIcon} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-three flex items-center gap-1">
                        Set Expiry Date <span className="text-neutral-500 font-three">(Optional)</span>
                      </label>
                      <div className="relative group">
                        <input
                          type="date"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="w-full p-3 bg-[#111111] border border-neutral-700 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 text-white appearance-none cursor-pointer [color-scheme:dark]"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                          <HugeiconsIcon icon={Calendar03Icon} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {status && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 border ${status.type === "success"
                    ? "bg-green-500/10 text-green-500 border-green-500/30"
                    : "bg-red-500/10 text-red-500 border-red-500/30"
                    }`}>
                    {status.type === "success" ? <IoCheckmarkCircleOutline size={20} /> : <IoAlertCircleOutline size={20} />}
                    <p className="text-sm font-semibold">{status.message}</p>
                  </div>
                )}

                {createdLinks.length === 0 ? (
                  <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className={`w-full py-4 rounded-xl font-bold transition-all flex flex-col items-center justify-center cursor-pointer
                        ${!file || loading ? 'bg-[#2a2a2a] text-neutral-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] text-white'}`}
                  >
                    {loading ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </div>
                        <span className="text-[10px] font-three opacity-80 uppercase tracking-widest mt-1">This may take some time, Please wait</span>
                      </>
                    ) : (
                      userPlan === "FREE" ? "Upgrade to Shorten Bulk" : "Shorten Links"
                    )}
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setShowDownloadModal(true)}
                      className="w-full py-4 bg-blue-600 text-white rounded-xl font-three flex items-center justify-center gap-2 hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-600/20"
                    >
                      <HugeiconsIcon icon={Download02Icon} /> Download Results
                    </button>

                    <button
                      onClick={handleGenerateMore}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-xl transition-all border border-neutral-800 cursor-pointer"
                    >
                      <IoRefreshOutline size={18} />
                      Generate more links
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[40%] xl:w-[35%] p-6 sm:p-8 border border-neutral-800 rounded-2xl shadow-sm relative text-white flex flex-col h-full">
            <div className="mb-6 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-one mb-2 text-white">Recent Bulk Links</h2>
              </div>
            </div>

            <div className="flex-1 flex flex-col w-full min-h-0">
              {pastBulkLinks.length > 0 ? (
                <>
                  <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-0">
                    {topFiveLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between py-3 px-4 border border-neutral-800/60 hover:bg-[#1a1a1a] transition-colors group w-full rounded-xl gap-2"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                            <HugeiconsIcon icon={File02Icon} />
                          </div>
                          <div className="flex flex-col min-w-0 w-full">
                            {editingId === link.id ? (
                              <div className="flex items-center gap-2 w-full max-w-[200px]" onClick={(e) => e.stopPropagation()}>
                                <input
                                  autoFocus
                                  className="bg-[#111111] border border-neutral-700 rounded px-2 py-0.5 text-sm font-semibold text-white focus:outline-none w-full"
                                  value={tempName}
                                  onChange={(e) => setTempName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleUpdateName(link.id, tempName);
                                    if (e.key === "Escape") setEditingId(null);
                                  }}
                                />
                                <button
                                  onClick={() => handleUpdateName(link.id, tempName)}
                                  className="text-green-500 hover:text-green-400 shrink-0 p-1 cursor-pointer"
                                >
                                  <HugeiconsIcon icon={Tick02Icon} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-white font-three text-base truncate tracking-wide">
                                {link.name || "Bulk Link"}
                              </span>
                            )}
                            <span className="text-neutral-500 font-one text-xs mt-0.5">
                              {getRelativeTime(link.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1 text-neutral-300 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              if (!checkPlanAccess()) return;
                              setSelectedUrl(link);
                              setIsPasswordModalOpen(true);
                              setIsEditingPassword(!link.password);
                              setIsEditingExpiry(!link.expiresAt);
                            }}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer hover:text-white hover:bg-neutral-800`}
                            title="Password Protection"
                          >
                            {link.password ? (
                              <HugeiconsIcon icon={CircleLock01Icon} className="text-blue-500" />
                            ) : (
                              <HugeiconsIcon icon={CircleUnlock01Icon} />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              if (!checkPlanAccess()) return;
                              setEditingId(link.id);
                              setTempName(link.name || "Bulk Link");
                            }}
                            className="hover:text-white hover:bg-neutral-800 p-1.5 rounded-md transition-colors cursor-pointer"
                            title="Edit Name"
                          >
                            <HugeiconsIcon icon={Edit03Icon} />
                          </button>

                          <button
                            onClick={() => handleDelete(link.id)}
                            disabled={deletingId === link.id}
                            className="hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors cursor-pointer flex items-center justify-center min-w-[32px]"
                            title="Delete Bulk Job"
                          >
                            {deletingId === link.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                            ) : (
                              <HugeiconsIcon icon={Delete02Icon} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-800 shrink-0">
                    <button
                      onClick={() => router.push('/links?types=bulk')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-[#1c1c1c] hover:bg-[#252525] border border-neutral-800 rounded-xl transition-all group cursor-pointer"
                    >
                      <span className="font-semibold text-sm text-neutral-300 group-hover:text-white">Manage all links</span>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all"
                      />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full flex-1 border-2 border-dashed border-neutral-800 rounded-xl py-20 text-neutral-500 bg-[#1a1a1a]/50">
                  <IoFileTrayFullOutline size={48} className="mb-4 text-neutral-700" />
                  <p className="font-medium text-lg text-neutral-400">No links generated yet.</p>
                  <p className="text-sm text-neutral-600 mt-1">Upload a CSV file to see results here.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 cursor-pointer" onClick={() => setShowDownloadModal(false)} />
          <div className="relative bg-[#1c1c1c] border border-neutral-800 w-full max-w-[320px] rounded-xl p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-white">Download As</h3>
              <button onClick={() => setShowDownloadModal(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                <IoCloseOutline size={22} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { exportPDF(); setShowDownloadModal(false); }} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 hover:bg-[#2a2a2a] transition-colors text-left cursor-pointer group">
                <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform"><HugeiconsIcon icon={Pdf02Icon} /></div>
                <span className="text-sm font-medium text-white">PDF Document</span>
              </button>
              <button onClick={() => { exportCSV(); setShowDownloadModal(false); }} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 hover:bg-[#2a2a2a] transition-colors text-left cursor-pointer group">
                <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform"><HugeiconsIcon icon={Csv02Icon} /></div>
                <span className="text-sm font-medium text-white">CSV Spreadsheet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isPasswordModalOpen && selectedUrl && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4"
          onClick={closeAllModals}
        >
          <div
            className="bg-[#1c1c1c] shadow-2xl w-full max-w-lg p-6 sm:p-10 border border-neutral-800 rounded-xl"
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
                      className="text-blue-500 hover:text-blue-400 cursor-pointer"
                    >
                      <HugeiconsIcon icon={Edit03Icon} />
                    </button>
                  )}
                </div>

                {!isEditingPassword && selectedUrl.password ? (
                  <div className="w-full p-3 border border-dashed border-neutral-700 bg-[#1a1a1a] text-neutral-400 font-three italic rounded-lg text-sm">
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
                      className="px-4 text-neutral-500 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <HugeiconsIcon icon={ViewOffSlashIcon} /> : <HugeiconsIcon icon={ViewIcon} />}
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
                      className="text-blue-500 hover:text-blue-400 cursor-pointer"
                    >
                      <HugeiconsIcon icon={Edit03Icon} />
                    </button>
                  )}
                </div>

                {!isEditingExpiry && selectedUrl.expiresAt ? (
                  <div className="w-full p-3 border border-dashed border-neutral-700 bg-[#1a1a1a] text-neutral-400 font-three rounded-lg text-sm">
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
                className="cursor-pointer px-6 py-2.5 font-three text-sm bg-transparent text-white border border-neutral-700 hover:bg-[#2a2a2a] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPassword}
                className="bg-white text-black px-6 py-2.5 font-three text-sm hover:bg-gray-200 rounded-lg cursor-pointer active:scale-95 font-bold"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {showLimitModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 cursor-pointer" onClick={() => setShowLimitModal(false)} />
          <div className="relative bg-[#1c1c1c] border border-neutral-800 w-full max-w-[450px] rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
              <IoAlertCircleOutline size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Limit Reached!</h3>
            <p className="text-neutral-400 mb-8 text-sm">
              You have reached your link generation limit for this month.
              Upgrade your plan to continue generating more short links.
            </p>
            <div className="flex flex-col w-full gap-3">
              <button
                onClick={() => router.push('/premium')}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 cursor-pointer"
              >
                <IoRocketOutline size={20} />
                Upgrade Now
              </button>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full py-3 bg-[#2a2a2a] text-white rounded-xl font-bold cursor-pointer hover:bg-[#333333]"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <Features isLoggedIn={isLoggedIn} userPlan={userPlan} />
      <div className="w-full h-px bg-neutral-800/50 my-12 shadow-sm"></div>
      <FaqSection />
      <TotalData />
      <Footer />
    </div>
  );
}