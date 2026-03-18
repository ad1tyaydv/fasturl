"use client";

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/dashBoardComponent";
import SavedQrs from "../../components/savedQrs";
import SavedLinks from "../../components/savedLinks";

interface UrlItem {
  id: string;
  original: string;
  shorturl: string;
  clicks?: number;
  scans?: number; 
  qrImage?: string; 
  createdAt?: string;
}

const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function AllUrlsPage() {
  const router = useRouter();
  const [view, setView] = useState<"links" | "qrs">("links"); 
  const [data, setData] = useState<UrlItem[]>([]);
  const [tier, setTier] = useState("FREE");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<UrlItem | null>(null);
  
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    const checkTier = async () => {
      try {
        const res = await axios.get("api/auth/me");
        setTier(res.data.plan);

      } catch (err) {
        console.error("Tier check failed", err);
      }
    }
    checkTier();

  }, [])


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setData([]);
      const endpoint = view === "links" ? "/api/fetchUrls" : "/api/fetchQR";
      const res = await axios.get(endpoint);

      if (view === "links") {
        setData(res.data.urls.reverse());
      } else {
        const mappedQrs = res.data.qrs.map((qr: any) => ({
          id: qr.id,
          original: qr.longUrl,
          shorturl: qr.shortUrl,
          scans: qr.clicks,
          qrImage: qr.qrImage,
          createdAt: qr.createdAt
        }));
        setData(mappedQrs);
      }

    } catch (err) {
      console.error(`Error fetching ${view}:`, err);

    } finally {
      setLoading(false);
    }
  }, [view]);


  useEffect(() => {
    fetchData();

  }, [fetchData]);


  const downloadQrAction = (qrImage: string, name: string) => {
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `qr-${name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/shortUrl/delete${id}`);
      setData(data.filter((u) => u.id !== id));

    } catch (err) { console.log("Error deleting item:", err); }
  };


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setIsLoggedIn(!!res.data.authenticated);

      } catch { setIsLoggedIn(false); }
    };
    checkAuth();

  }, [router]);


  const closeAllModals = () => {
    setSelectedUrl(null);
    setIsCustomModalOpen(false);
    setCustomUrl("");
    setErrorMessage("");
  };


  const handleCustomUrlClick = () => {
    if (tier === "FREE" || tier === "ESSENTIAL") {
      router.push("/premium");

    } else {
      setIsCustomModalOpen(true);
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
      router.refresh(); 
      window.location.reload();

    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Custom url with this name is already taken");
      } else {
        console.log("Something went wrong", error);
      }
    }
  };

  
  return (
    <DashboardLayout isLoggedIn={isLoggedIn} handleLogout={async () => { await axios.post("/api/auth/logout"); router.push("/auth/signin"); }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-border pb-6">
          <div className="flex items-center gap-2 text-2xl sm:text-4xl font-one">
            <button 
              onClick={() => setView("links")} 
              className={`cursor-pointer transition-colors ${view === "links" ? "text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground"}`}
            >
              Saved URLs
            </button>
            <span className="text-muted-foreground/20">/</span>
            <button 
              onClick={() => setView("qrs")} 
              className={`cursor-pointer transition-colors ${view === "qrs" ? "text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground"}`}
            >
              Saved QRs
            </button>
          </div>
          <span className="px-3 py-1 text-base sm:text-xl font-three w-fit bg-secondary text-secondary-foreground border border-border">
            Total {view === "links" ? "Links" : "QRs"} - {data.length}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center mt-24">
            <div className="w-10 h-10 border-4 border-muted border-t-primary animate-spin"></div>
          </div>
        ) : (
          view === "links" ? 
            <SavedLinks links={data} onSelect={setSelectedUrl} onDelete={handleDelete} domain={NEXT_DOMAIN!} /> : 
            <SavedQrs qrs={data} onSelect={setSelectedUrl} />
        )}
      </div>

      {(selectedUrl || isCustomModalOpen) && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-opacity duration-150"
          onClick={closeAllModals}
        >
          {selectedUrl && !isCustomModalOpen && (
            <div 
              className="bg-background shadow-2xl w-full max-w-lg p-6 sm:p-10 cursor-default border border-border rounded-none" 
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl sm:text-2xl font-one mb-5 sm:mb-6 border-b border-border pb-4 text-foreground">
                {view === "links" ? "Link Details" : "QR Details"}
              </h3>

              {view === "qrs" && selectedUrl.qrImage && (
                <div className="flex justify-center mb-6 bg-white p-4 border border-border">
                  <img src={selectedUrl.qrImage} alt="QR" className="w-40 h-40 object-contain" />
                </div>
              )}

              <div className="space-y-5 sm:space-y-6 mb-6 sm:mb-8">
                <div>
                  <p className="text-[10px] sm:text-xs font-two uppercase tracking-widest mb-1 text-muted-foreground">
                    {view === "links" ? "TOTAL CLICKS" : "TOTAL SCANS"}
                  </p>
                  <p className="text-3xl sm:text-4xl font-one text-foreground">
                    {view === "links" ? (selectedUrl.clicks ?? 0) : (selectedUrl.scans ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-two uppercase tracking-widest mb-1 text-muted-foreground">CREATED AT</p>
                  <p className="text-base sm:text-lg font-two text-muted-foreground">
                    {selectedUrl.createdAt ? new Date(selectedUrl.createdAt).toLocaleString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : "Not Available"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center gap-3">
                <div className="flex gap-2">
                   {view === "links" && (
                     <button 
                      onClick={handleCustomUrlClick}
                      className="cursor-pointer px-4 py-2 border border-border font-one text-sm hover:bg-secondary transition-colors active:scale-95 text-foreground rounded-none"
                    >
                      Add Custom Short Url
                    </button>
                   )}
                   {view === "qrs" && selectedUrl.qrImage && (
                    <button 
                      onClick={() => downloadQrAction(selectedUrl.qrImage!, selectedUrl.shorturl)}
                      className="cursor-pointer px-6 py-2 bg-primary text-primary-foreground font-one text-sm hover:bg-primary/90 transition-colors active:scale-95 rounded-none"
                    >
                      Download PNG
                    </button>
                  )}
                </div>
                
                <button 
                  onClick={closeAllModals}
                  className="cursor-pointer px-8 py-2 font-one text-sm bg-black text-white hover:bg-black/80 transition-colors active:scale-95 border border-white/20 rounded-none"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {isCustomModalOpen && selectedUrl && (
            <div 
              className="bg-background shadow-2xl w-full max-w-lg p-6 sm:p-10 cursor-default border border-border rounded-none" 
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl sm:text-2xl font-one mb-8 text-center text-foreground">
                Add a custom short url to your link
              </h3>

              <div className="space-y-6 mb-8">
                <div className="space-y-2">
                  <label className="text-lg font-two text-foreground">Current Short Url</label>
                  <div className="w-full p-3 border border-border bg-secondary/30 text-muted-foreground font-two rounded-none">
                    {NEXT_DOMAIN}/{selectedUrl.shorturl}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-two text-foreground">Custom Short Url</label>
                  <div className={`flex items-center border ${errorMessage ? 'border-red-500' : 'border-border'} bg-background focus-within:ring-1 focus-within:ring-primary rounded-none`}>
                    <span className="pl-3 py-3 text-muted-foreground font-two bg-secondary/10 border-r border-border px-2">
                      {NEXT_DOMAIN}/
                    </span>
                    <input 
                      type="text"
                      maxLength={25}
                      placeholder="custom"
                      value={customUrl}
                      onChange={(e) => {
                        setCustomUrl(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
                        if (errorMessage) setErrorMessage(""); // Reset error when typing
                      }}
                      className="flex-1 p-3 bg-transparent text-foreground font-two focus:outline-none"
                    />
                  </div>
                  {errorMessage ? (
                    <p className="text-xs text-red-500 font-two mt-1 animate-pulse">
                      {errorMessage}
                    </p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Max 25 characters</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handleUpdateCustomUrl}
                  className="cursor-pointer px-8 py-2 font-one text-sm border border-border hover:bg-secondary transition-colors active:scale-95 text-foreground rounded-none"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}