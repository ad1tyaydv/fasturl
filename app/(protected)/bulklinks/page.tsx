"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { 
  IoCloudUploadOutline, 
  IoDocumentTextOutline, 
  IoCloseOutline, 
  IoCheckmarkCircleOutline, 
  IoAlertCircleOutline,
  IoDownloadOutline,
  IoFileTrayFullOutline,
  IoRocketOutline,
  IoRefreshOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoCalendarOutline
} from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "../../components/navbar";
import { Skeleton } from "@/components/ui/skeleton"; // Added Skeleton import


export default function BulkCreateLinks() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [createdLinks, setCreatedLinks] = useState<any[]>([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [userPlan, setUserPlan] = useState<string>("FREE");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [password, setPassword] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        const authenticated = !!res.data.authenticated;
        setIsLoggedIn(authenticated);
        
        if (authenticated) {
          setUserPlan(res.data.plan || "FREE");
          localStorage.setItem("plan", res.data.plan || "FREE");
        }

      } catch {
        setIsLoggedIn(false);

      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();

  }, [router]);


  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("plan");
      setIsLoggedIn(false);
      router.push("/auth/signin");

    } catch (error) {
      console.error("Logout failed", error);
    }
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
    if (userPlan === "FREE") {
      router.push("/premium");
      return;
    }

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

      setStatus({
        type: "success",
        message: `Successfully created ${res.data.success.length} short links!` 
      });
      setCreatedLinks(res.data.success || []);
      setFile(null);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "";
      if (errorMessage.toLowerCase().includes("limit") || error.response?.status === 403) {
        setShowLimitModal(true);
      }
      setStatus({ 
        type: "error", 
        message: errorMessage || "Failed to process bulk upload." 
      });

    } finally {
      setLoading(false);
    }
  };


  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Shortly - Shortened Links", 14, 15);
    autoTable(doc, {
      head: [['#', 'Original URL', 'Short URL']],
      body: createdLinks.map((l, i) => [i + 1, l.original, l.short]),
      startY: 20,
    });
    doc.save("links.pdf");
  };


  const exportCSV = () => {
    const headers = "Original URL,Short URL\n";
    const rows = createdLinks.map(l => `${l.original},${l.short}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'links.csv';
    a.click();
  };


  return (
    <div className="min-h-screen bg-[#141414] text-white transition-colors duration-300">
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <main className="py-12 px-4 sm:px-8">
        {authLoading ? (
          /* Seamless skeleton loader mimicking the bulk card */
          <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-[#1c1c1c] border border-neutral-800 rounded-2xl shadow-sm w-full">
            <div className="mb-8 space-y-3">
              <Skeleton className="h-8 w-1/2 max-w-[250px] bg-neutral-800" />
              <Skeleton className="h-4 w-3/4 max-w-[400px] bg-neutral-800" />
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <Skeleton className="h-[220px] w-full rounded-xl bg-neutral-800" />
              </div>
              <Skeleton className="h-14 w-full rounded-xl bg-neutral-800" />
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-[#1c1c1c] border border-neutral-800 rounded-2xl shadow-sm relative text-white transition-colors duration-200">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2 text-white">Bulk Shorten Links</h2>
              <p className="text-neutral-400 text-sm">
                Upload your CSV file to generate shortened links instantly.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <div 
                  onClick={() => !createdLinks.length && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-200 relative
                    ${createdLinks.length > 0 ? 'border-neutral-800 bg-[#1a1a1a] cursor-default' : file ? 'border-blue-500 bg-blue-500/10 cursor-pointer' : 'border-neutral-700 hover:border-blue-500 cursor-pointer'}`}
                >
                  <input type="file" accept=".csv" hidden ref={fileInputRef} onChange={handleFileChange} disabled={createdLinks.length > 0} className="cursor-pointer" />
                  
                  {file ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <IoDocumentTextOutline size={44} className="text-blue-500" />
                        <div className="text-left">
                          <p className="font-semibold truncate max-w-[200px] sm:max-w-[350px] text-white text-lg">{file.name}</p>
                          <p className="text-sm text-neutral-400">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      {!loading && (
                        <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="p-2 hover:bg-red-500/20 rounded-full text-red-500 cursor-pointer transition-colors">
                          <IoCloseOutline size={32} />
                        </button>
                      )}
                    </div>
                  ) : createdLinks.length > 0 ? (
                    <div className="flex flex-col items-center gap-2 text-green-500">
                      <IoCheckmarkCircleOutline size={48} />
                      <p className="font-medium text-lg">File Processed Successfully</p>
                    </div>
                  ) : (
                    <>
                      <IoCloudUploadOutline size={48} className="text-neutral-500 mb-4" />
                      <p className="text-center font-medium text-white">Click to upload your CSV</p>
                    </>
                  )}
                </div>
              </div>

              {file && !createdLinks.length && (
                <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-300 border-t border-neutral-800 pt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      Password <span className="text-neutral-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full p-3 bg-[#111111] border border-neutral-700 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      Set Expiry Date <span className="text-neutral-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative group">
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full p-3 bg-[#111111] border border-neutral-700 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 text-white appearance-none cursor-pointer [color-scheme:dark]"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                        <IoCalendarOutline size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {status && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border ${
                  status.type === "success" 
                    ? "bg-green-500/10 text-green-500 border-green-500/30" 
                    : "bg-red-500/10 text-red-500 border-red-500/30"
                }`}>
                  {status.type === "success" ? <IoCheckmarkCircleOutline size={20} /> : <IoAlertCircleOutline size={20} />}
                  <p className="text-sm font-semibold">{status.message}</p>
                </div>
              )}

              {createdLinks.length > 0 && (
                <div className="flex justify-center">
                  <button 
                    onClick={handleGenerateMore}
                    className="flex items-center gap-2 px-7 py-4 text-sm font-bold text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all border border-blue-500/20 cursor-pointer"
                  >
                    <IoRefreshOutline size={18} />
                    Generate More Links
                  </button>
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
                        <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin rounded-full" />
                        <span>Processing...</span>
                      </div>
                      <span className="text-[10px] font-normal opacity-80 uppercase tracking-widest mt-1">This may take some time, Please wait</span>
                    </>
                  ) : (
                    userPlan === "FREE" ? "Upgrade to Shorten Bulk" : "Shorten Links"
                  )}
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setShowDownloadModal(true)} 
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    <IoDownloadOutline size={20} /> Download
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 cursor-pointer" onClick={() => setShowDownloadModal(false)} />
          <div className="relative bg-[#1c1c1c] border border-neutral-800 w-full max-w-[320px] rounded-xl p-5 shadow-2xl transition-none">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-white">Download As</h3>
              <button onClick={() => setShowDownloadModal(false)} className="text-neutral-400 hover:text-white cursor-pointer transition-colors">
                <IoCloseOutline size={22} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { exportPDF(); setShowDownloadModal(false); }} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 hover:bg-[#2a2a2a] transition-colors text-left cursor-pointer group">
                <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform"><IoDocumentTextOutline size={18} /></div>
                <span className="text-sm font-medium text-white">PDF Document</span>
              </button>
              <button onClick={() => { exportCSV(); setShowDownloadModal(false); }} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 hover:bg-[#2a2a2a] transition-colors text-left cursor-pointer group">
                <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform"><IoFileTrayFullOutline size={18} /></div>
                <span className="text-sm font-medium text-white">CSV Spreadsheet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showLimitModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 cursor-pointer" onClick={() => setShowLimitModal(false)} />
          <div className="relative bg-[#1c1c1c] border border-neutral-800 w-full max-w-[450px] rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center animate-none transition-colors">
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
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all cursor-pointer"
              >
                <IoRocketOutline size={20} />
                Upgrade Now
              </button>
              <button 
                onClick={() => setShowLimitModal(false)}
                className="w-full py-3 bg-[#2a2a2a] text-white rounded-xl font-bold cursor-pointer transition-colors hover:bg-[#333333]"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}