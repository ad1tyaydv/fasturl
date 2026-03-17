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
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<UrlItem | null>(null);

  
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


  return (
    <DashboardLayout isLoggedIn={isLoggedIn} handleLogout={async () => { await axios.post("/api/auth/logout"); router.push("/auth/signin"); }}>
      <div className="max-w-4xl mx-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-border pb-6">
          <div className="flex items-center gap-2 text-2xl sm:text-4xl font-one">
            <button 
              onClick={() => setView("links")} 
              className={`cursor-pointer transition-all duration-200 ${view === "links" ? "text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground"}`}
            >
              Saved URLs
            </button>
            <span className="text-muted-foreground/20">/</span>
            <button 
              onClick={() => setView("qrs")} 
              className={`cursor-pointer transition-all duration-200 ${view === "qrs" ? "text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground"}`}
            >
              Saved QRs
            </button>
          </div>
          <span className="px-3 rounded-xl py-1 text-base sm:text-xl font-three w-fit bg-secondary text-secondary-foreground border border-border">
            Total {view === "links" ? "Links" : "QRs"} - {data.length}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center mt-24">
            <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          view === "links" ? 
            <SavedLinks links={data} onSelect={setSelectedUrl} onDelete={handleDelete} domain={NEXT_DOMAIN!} /> : 
            <SavedQrs qrs={data} onSelect={setSelectedUrl} />
        )}
      </div>

      {selectedUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-pointer animate-in fade-in"
          onClick={() => setSelectedUrl(null)}
        >
          <div 
            className="bg-background rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 cursor-default border border-border animate-in zoom-in-95 slide-in-from-bottom-2 duration-200" 
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl sm:text-2xl font-one mb-5 sm:mb-6 border-b border-border pb-4 text-foreground">
              {view === "links" ? "Link Details" : "QR Details"}
            </h3>

            {view === "qrs" && selectedUrl.qrImage && (
              <div className="flex justify-center mb-6 bg-white p-4 rounded-xl border border-border">
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

            <div className="flex justify-end gap-3">
              {view === "qrs" && selectedUrl.qrImage && (
                <button 
                  onClick={() => downloadQrAction(selectedUrl.qrImage!, selectedUrl.shorturl)}
                  className="cursor-pointer px-6 py-2 rounded-lg bg-primary text-primary-foreground font-one text-sm hover:bg-primary/90 transition-all active:scale-95"
                >
                  Download PNG
                </button>
              )}
              <button 
                onClick={() => setSelectedUrl(null)}
                className="cursor-pointer px-8 py-2 rounded-lg font-one text-sm bg-black text-white hover:bg-black/80 transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}