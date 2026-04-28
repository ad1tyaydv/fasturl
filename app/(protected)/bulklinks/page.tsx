"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
  IoFileTrayFullOutline,
  IoRocketOutline,
  IoRefreshOutline,
  IoCalendarOutline,
  IoHelpCircleOutline,
} from "react-icons/io5";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  CloudUploadIcon, Cancel01Icon, File02Icon,
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

import { useUser } from "@/app/components/userContext";

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
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [createdLinks, setCreatedLinks] = useState<any[]>([]);
  const [pastBulkLinks, setPastBulkLinks] = useState<any[]>([]);

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

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
    if (!userLoading) {
      if (!user) {
        router.push("/auth/signin");

      } else {
        fetchPastBulkLinks();
      }
    }
  }, [user, userLoading, router]);

  const fetchPastBulkLinks = async () => {
    try {
      const res = await axios.get("/api/shortUrl/bulkLinks/fetchBulkLinks");
      setPastBulkLinks(res.data.bulkLinks || res.data || []);
    } catch (error) {
      console.error("Failed to fetch past bulk links", error);
    }
  };


  const checkPlanAccess = () => {
    if ((user?.plan || "FREE") === "FREE") {
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

      let successMessage = `Successfully created ${res.data.count} short links!`;
      if (res.data.replacedCount > 0) {
        successMessage = `Created ${res.data.count} links. Note: ${res.data.replacedCount} custom URLs already existed, so random ones were assigned.`;
        toast.info(`${res.data.replacedCount} custom URLs already existed and were replaced with random ones.`);
      }

      setStatus({ type: "success", message: successMessage });
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
    if (!Array.isArray(createdLinks) || createdLinks.length === 0) {
      toast.error("No links available to export. Please generate links first.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Fasturl - Shortened Links Report", 14, 15);

    autoTable(doc, {
      head: [['#', 'Original URL', 'Short URL']],
    
      body: createdLinks?.map((l, i) => [
        i + 1,
        l.original || "N/A",
        `${NEXT_DOMAIN}/${l.short || l.shorturl}`
      ]),
      startY: 25,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [30, 30, 30] }
    });
    doc.save("Fasturl_Links.pdf");
  };

  const exportCSV = () => {
    if (!Array.isArray(createdLinks) || createdLinks.length === 0) {
      toast.error("No links available to export.");
      return;
    }

    const headers = "Original URL,Short URL\n";
    const rows = createdLinks.map(l =>
      `${l.original},${NEXT_DOMAIN}/${l.short || l.shorturl}`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Fasturl_Links.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <div className="flex flex-col items-center justify-center text-center py-12 px-6">
        <h1 className="text-3xl font-one sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight">
          Generate <span className="text-red-500">Thousands</span> of Links Instantly
        </h1>
        <p className="max-w-2xl font-one sm:text-lg text-muted-foreground">
          Transform your bulk data into high-quality, shareable short links and QR codes instantly.
        </p>
      </div>

      <main className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20 py-5">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:h-[540px]">

          <div className="w-full lg:w-[60%] xl:w-[65%] p-6 sm:p-8 border border-border rounded-2xl shadow-sm relative text-foreground flex flex-col h-full">
            <div className="mb-6 shrink-0 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Bulk Shorten Links</h2>
              <button 
                onClick={() => setShowHelpModal(true)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1"
              >
                <IoHelpCircleOutline size={20} />
              </button>
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
                      ${createdLinks.length > 0 ? 'border-border bg-secondary cursor-default' : file ? 'border-blue-500 bg-blue-500/10 cursor-pointer' : 'border-border hover:border-blue-500 cursor-pointer'}`}
                >
                  <input type="file" accept=".csv" hidden ref={fileInputRef} onChange={handleFileChange} disabled={createdLinks.length > 0} className="cursor-pointer" />

                  {file ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <HugeiconsIcon icon={File02Icon} size={30} className="text-blue-500" />
                        <div className="text-left">
                          <p className="font-semibold truncate max-w-[150px] sm:max-w-[200px] text-foreground text-lg">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      {!loading && (
                        <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="p-2 hover:bg-destructive/20 rounded-full text-destructive cursor-pointer transition-colors">
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
                      <HugeiconsIcon icon={CloudUploadIcon} size={35} className="mb-4 text-muted-foreground" />
                      <p className="text-center font-medium text-foreground">Click to upload your CSV</p>
                      <p className="text-center text-xs text-muted-foreground mt-1">Make sure it contains a column for URLs</p>
                    </>
                  )}
                </div>
              </div>

              <div className="shrink-0 mt-6 space-y-6">
                {file && !createdLinks.length && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-300 border-t border-border pt-6">
                    <div className="space-y-2">
                      <label className="text-sm font-three flex items-center gap-1">
                        Password <span className="text-muted-foreground font-three">(Optional)</span>
                      </label>
                      <div className="relative group">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          className="w-full p-3 bg-background font-three border border-border rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 text-foreground"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          {showPassword ? <HugeiconsIcon icon={ViewOffSlashIcon} /> : <HugeiconsIcon icon={ViewIcon} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-three flex items-center gap-1">
                        Set Expiry Date <span className="text-muted-foreground font-three">(Optional)</span>
                      </label>
                      <div className="relative group">
                        <input
                          type="date"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 text-foreground appearance-none cursor-pointer"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
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
                        ${!file || loading ? 'bg-secondary text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:opacity-90 hover:shadow-lg active:scale-[0.98]'}`}
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
                      user?.plan === "FREE" ? "Upgrade to Shorten Bulk" : "Shorten Links"
                    )}
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleGenerateMore}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all border border-border cursor-pointer"
                    >
                      <IoRefreshOutline size={18} />
                      Generate more links
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[40%] xl:w-[35%] p-6 sm:p-8 border border-border rounded-2xl shadow-sm relative text-foreground flex flex-col h-full">
            <div className="mb-6 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-one mb-2 text-foreground">Recent Bulk Links</h2>
              </div>
            </div>

            <div className="flex-1 flex flex-col w-full min-h-0">
              {pastBulkLinks.length > 0 ? (
                <>
                  <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-0">
                    {topFiveLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between py-3 px-4 border border-border/60 hover:bg-accent transition-colors group w-full rounded-xl gap-2"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                            <HugeiconsIcon icon={File02Icon} />
                          </div>
                          <div className="flex flex-col min-w-0 w-full">
                            {editingId === link.id ? (
                              <div className="flex items-center gap-2 w-full max-w-[200px]" onClick={(e) => e.stopPropagation()}>
                                <input
                                  autoFocus
                                  className="bg-background border border-border rounded px-2 py-0.5 text-sm font-semibold text-foreground focus:outline-none w-full"
                                  value={tempName}
                                  onChange={(e) => setTempName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleUpdateName(link.id, tempName);
                                    if (e.key === "Escape") setEditingId(null);
                                  }}
                                />
                                <button
                                  onClick={() => handleUpdateName(link.id, tempName)}
                                  className="text-green-500 hover:text-green-600 shrink-0 p-1 cursor-pointer"
                                >
                                  <HugeiconsIcon icon={Tick02Icon} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-foreground font-three text-base truncate tracking-wide">
                                {link.name || "Bulk Link"}
                              </span>
                            )}
                            <span className="text-muted-foreground font-one text-xs mt-0.5">
                              {getRelativeTime(link.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1 text-muted-foreground shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              if (!checkPlanAccess()) return;
                              setSelectedUrl(link);
                              setIsPasswordModalOpen(true);
                              setIsEditingPassword(!link.password);
                              setIsEditingExpiry(!link.expiresAt);
                            }}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer hover:text-foreground hover:bg-secondary`}
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
                            className="hover:text-foreground hover:bg-secondary p-1.5 rounded-md transition-colors cursor-pointer"
                            title="Edit Name"
                          >
                            <HugeiconsIcon icon={Edit03Icon} />
                          </button>

                          <button
                            onClick={() => handleDelete(link.id)}
                            disabled={deletingId === link.id}
                            className="hover:text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors cursor-pointer flex items-center justify-center min-w-[32px]"
                            title="Delete Bulk Job"
                          >
                            {deletingId === link.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                            ) : (
                              <HugeiconsIcon icon={Delete02Icon} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border shrink-0">
                    <button
                      onClick={() => router.push('/links?types=bulk')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-secondary hover:bg-accent border border-border rounded-xl transition-all group cursor-pointer"
                    >
                      <span className="font-semibold text-sm text-foreground/80 group-hover:text-foreground">Manage all links</span>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all"
                      />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full flex-1 border-2 border-dashed border-border rounded-xl py-20 text-muted-foreground bg-secondary/30">
                  <IoFileTrayFullOutline size={48} className="mb-4 opacity-50" />
                  <p className="font-medium text-lg">No links generated yet.</p>
                  <p className="text-sm opacity-70 mt-1">Upload a CSV file to see results here.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {showDownloadModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowDownloadModal(false)}
          />

          <div className="relative bg-background border border-border w-full max-w-[500px] min-h-[350px] rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">

            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={24} />
            </button>

            <div className="mb-10">
              <h3 className="text-foreground text-2xl font-bold mb-2">Export Results</h3>
              <p className="text-muted-foreground text-sm font-three">
                Your bulk links have been processed. Choose a format to save your data.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => { exportPDF(); setShowDownloadModal(false); }}
                className="group flex items-center justify-between p-5 rounded-xl bg-secondary/50 border border-border hover:border-destructive/50 hover:bg-secondary transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-destructive/10 rounded-lg text-destructive group-hover:scale-110 transition-transform">
                    <HugeiconsIcon icon={Pdf02Icon} size={28} />
                  </div>
                  <div className="text-left">
                    <span className="block text-foreground text-lg font-bold">PDF Document</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Professional Report</span>
                  </div>
                </div>
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => { exportCSV(); setShowDownloadModal(false); }}
                className="group flex items-center justify-between p-5 rounded-xl bg-secondary/50 border border-border hover:border-green-500/50 hover:bg-secondary transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg text-green-500 group-hover:scale-110 transition-transform">
                    <HugeiconsIcon icon={Csv02Icon} size={28} />
                  </div>
                  <div className="text-left">
                    <span className="block text-foreground text-lg font-bold">CSV Spreadsheet</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Excel Compatible</span>
                  </div>
                </div>
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isPasswordModalOpen && selectedUrl && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={closeAllModals}
        >
          <div
            className="bg-background shadow-2xl w-full max-w-lg p-6 sm:p-10 border border-border rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl sm:text-2xl font-three mb-8 text-center text-foreground">
              Add Link Protection
            </h3>

            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xl font-one text-foreground">
                    Password <span className="text-sm text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  {!isEditingPassword && selectedUrl.password && (
                    <button
                      onClick={() => { setIsEditingPassword(true); setPassword(""); }}
                      className="text-blue-500 hover:text-blue-600 cursor-pointer"
                    >
                      <HugeiconsIcon icon={Edit03Icon} />
                    </button>
                  )}
                </div>

                {!isEditingPassword && selectedUrl.password ? (
                  <div className="w-full p-3 border border-dashed border-border bg-secondary text-muted-foreground font-three italic rounded-lg text-sm">
                    Password is already configured
                  </div>
                ) : (
                  <div className="relative flex items-center border border-border bg-background focus-within:ring-1 focus-within:ring-blue-500 transition-colors rounded-lg overflow-hidden">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 bg-transparent text-foreground font-three focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-4 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? <HugeiconsIcon icon={ViewOffSlashIcon} /> : <HugeiconsIcon icon={ViewIcon} />}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xl font-one text-foreground">Set Expiry Date</label>
                  {!isEditingExpiry && selectedUrl.expiresAt && (
                    <button
                      onClick={() => { setIsEditingExpiry(true); setExpiryDate(""); }}
                      className="text-blue-500 hover:text-blue-600 cursor-pointer"
                    >
                      <HugeiconsIcon icon={Edit03Icon} />
                    </button>
                  )}
                </div>

                {!isEditingExpiry && selectedUrl.expiresAt ? (
                  <div className="w-full p-3 border border-dashed border-border bg-secondary text-muted-foreground font-three rounded-lg text-sm">
                    Expires on {new Date(selectedUrl.expiresAt).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="relative group">
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full p-3 border border-border bg-background text-foreground font-three focus:outline-none focus:border-blue-500 transition-colors rounded-lg cursor-pointer pr-12 appearance-none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      <IoCalendarOutline size={20} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeAllModals}
                className="cursor-pointer px-6 py-2.5 font-three text-sm bg-transparent text-foreground border border-border hover:bg-secondary rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPassword}
                className="bg-primary text-primary-foreground px-6 py-2.5 font-three text-sm hover:opacity-90 rounded-lg cursor-pointer active:scale-95 font-bold"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {showLimitModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer" onClick={() => setShowLimitModal(false)} />
          <div className="relative bg-background border border-border w-full max-w-[450px] rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
              <IoAlertCircleOutline size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">Limit Reached!</h3>
            <p className="text-muted-foreground mb-8 text-sm">
              You have reached your link generation limit for this month.
              Upgrade your plan to continue generating more short links.
            </p>
            <div className="flex flex-col w-full gap-3">
              <button
                onClick={() => router.push('/premium')}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 cursor-pointer shadow-md"
              >
                <IoRocketOutline size={20} />
                Upgrade Now
              </button>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full py-3 bg-secondary text-foreground rounded-xl font-bold cursor-pointer hover:bg-accent transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {showHelpModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer" onClick={() => setShowHelpModal(false)} />
          <div className="relative bg-background border border-border w-full max-w-[400px] rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <IoHelpCircleOutline size={30} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Bulk Shortening Instructions</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Upload your CSV file to generate shortened links instantly.
            </p>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition-colors shadow-md"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <Features isLoggedIn={!!user} userPlan={user?.plan || "FREE"} />
      <div className="w-full h-px bg-border my-12 shadow-sm"></div>
      <FaqSection />
      <TotalData />
      <Footer />
    </div>
  );
}