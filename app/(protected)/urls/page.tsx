"use client";

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IoEyeOutline, IoEyeOffOutline, IoPencilOutline } from "react-icons/io5";
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
  password?: string;
  expiresAt?: string;
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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [customUrl, setCustomUrl] = useState("");
  const [password, setPassword] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingExpiry, setIsEditingExpiry] = useState(false);


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
          createdAt: qr.createdAt,
          password: qr.password,
          expiresAt: qr.expiresAt
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


  const handleDeleteLink = async (id: string) => {
    try {
      await axios.post(`/api/shortUrl/delete/${id}`);
      setData(data.filter((u) => u.id !== id));
      
    } catch (err) {
      console.log("Error deleting item:", err);
    }
  };


  const handleDeleteQR = async (id: string) => {
    try {
      await axios.post(`/api/qrCode/delete/${id}`);
      setData(data.filter((u) => u.id !== id));

    } catch (err) {
      console.log("Error deleting item:", err);
    }
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
    setIsPasswordModalOpen(false);
    setCustomUrl("");
    setPassword("");
    setExpiryDate("");
    setErrorMessage("");
    setShowPassword(false);
    setIsEditingPassword(false);
    setIsEditingExpiry(false);
  };


  const handleCustomUrlClick = () => {
    if (tier === "FREE" || tier === "ESSENTIAL") {
      router.push("/premium");

    } else {
      setIsCustomModalOpen(true);
    }
  };


  const handlePasswordProtectionClick = () => {
    if (tier !== "PRO" && tier !== "ULTRA") {
      router.push("/premium");
    } else {
      setIsPasswordModalOpen(true);
      setIsEditingPassword(!selectedUrl?.password);
      setIsEditingExpiry(!selectedUrl?.expiresAt);
    }
  };


const handleAddPassword = async () => {
    try {
      const finalPassword = isEditingPassword ? password : selectedUrl?.password;
      const finalExpiry = isEditingExpiry ? expiryDate : selectedUrl?.expiresAt;

      await axios.post("/api/shortUrl/passwordProtection", {
        shortUrlId: selectedUrl?.id,
        password: finalPassword,
        expiryDate: finalExpiry
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
      window.location.reload();

    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Custom URL with this name is already taken");
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
            <SavedLinks links={data} onSelect={setSelectedUrl} onDelete={handleDeleteLink} domain={NEXT_DOMAIN!} /> : 
            <SavedQrs qrs={data} onSelect={setSelectedUrl} onDelete={handleDeleteQR} domain={NEXT_DOMAIN!} />
        )}
      </div>

      {(selectedUrl || isCustomModalOpen || isPasswordModalOpen) && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-opacity duration-150"
          onClick={closeAllModals}
        >
          {selectedUrl && !isCustomModalOpen && !isPasswordModalOpen && (
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
                  <p className="text-[10px] sm:text-xs font-three uppercase tracking-widest mb-1 text-muted-foreground">
                    {view === "links" ? "TOTAL CLICKS" : "TOTAL SCANS"}
                  </p>
                  <p className="text-3xl sm:text-4xl font-one text-foreground">
                    {view === "links" ? (selectedUrl.clicks ?? 0) : (selectedUrl.scans ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-three uppercase tracking-widest mb-1 text-muted-foreground">CREATED AT</p>
                  <p className="text-base sm:text-lg font-two muted-foreground">
                    {selectedUrl.createdAt ? new Date(selectedUrl.createdAt).toLocaleString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : "Not Available"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                   {view === "links" && (
                    <>
                     <button 
                      onClick={handleCustomUrlClick}
                      className="flex-1 cursor-pointer px-4 py-2 font-three text-sm bg-black text-white hover:bg-black/80 transition-colors active:scale-95 border border-white/20 rounded-none"
                    >
                      Add Custom Short Url
                    </button>
                    <button 
                      onClick={handlePasswordProtectionClick}
                      className="flex-1 cursor-pointer px-4 py-2 font-three text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors active:scale-95 border border-border rounded-none"
                    >
                      Add Password Protection
                    </button>
                    </>
                   )}
                   {view === "qrs" && selectedUrl.qrImage && (
                    <button 
                      onClick={() => downloadQrAction(selectedUrl.qrImage!, selectedUrl.shorturl)}
                      className="cursor-pointer px-6 py-2 bg-primary text-primary-foreground font-three text-sm hover:bg-primary/90 transition-colors active:scale-95 rounded-none"
                    >
                      Download PNG
                    </button>
                  )}
                </div>
                
                <button 
                  onClick={closeAllModals}
                  className="w-full cursor-pointer px-8 py-2 font-three text-sm bg-secondary text-foreground hover:bg-secondary/80 transition-colors active:scale-95 border border-border rounded-none"
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
              <h3 className="text-xl sm:text-2xl font-three mb-8 text-center text-foreground">
                Add a custom short url to your link
              </h3>
              <div className="space-y-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xl font-one text-foreground">Current Short Url</label>
                  <div className="w-full p-3 border border-border bg-secondary/30 muted-foreground font-three rounded-none">
                    {NEXT_DOMAIN}/{selectedUrl.shorturl}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xl font-one text-foreground">Custom Short Url</label>
                  <div className={`flex items-center border ${errorMessage ? 'border-red-500' : 'border-border'} bg-background focus-within:ring-1 focus-within:ring-primary rounded-none`}>
                    <span className="pl-3 py-3 muted-foreground font-three bg-secondary/10 border-r border-border px-2">{NEXT_DOMAIN}/</span>
                    <input 
                      type="text"
                      maxLength={25}
                      placeholder="custom"
                      value={customUrl}
                      onChange={(e) => {
                        setCustomUrl(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
                        if (errorMessage) setErrorMessage("");
                      }}
                      className="flex-1 p-3 bg-transparent text-foreground font-three focus:outline-none"
                    />
                  </div>
                  {errorMessage ? <p className="text-lg text-red-500 font-two mt-1">{errorMessage}</p> : <p className="text-[10px] font-three muted-foreground uppercase tracking-widest">Max 25 characters</p>}
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={handleUpdateCustomUrl} className="cursor-pointer px-8 py-2 font-three text-sm border border-border hover:bg-secondary transition-colors active:scale-95 rounded-none">Update</button>
              </div>
            </div>
          )}

          {isPasswordModalOpen && selectedUrl && (
            <div 
              className="bg-background shadow-2xl w-full max-w-lg p-6 sm:p-10 cursor-default border border-border rounded-none" 
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl sm:text-2xl font-three mb-8 text-center text-foreground">
                Add Link Protection to your links
              </h3>
              
              <div className="space-y-6 mb-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xl font-one text-foreground">Password <span className="text-sm text-muted-foreground font-normal">(Optional)</span></label>
                    {!isEditingPassword && selectedUrl.password && (
                      <button 
                        onClick={() => { setIsEditingPassword(true); setPassword(""); }}
                        className="text-primary hover:text-primary/80 cursor-pointer"
                        title="Edit Password"
                      >
                        <IoPencilOutline size={18} />
                      </button>
                    )}
                  </div>
                  
                  {!isEditingPassword && selectedUrl.password ? (
                    <div className="w-full p-3 border border-dashed border-border bg-secondary/20 text-muted-foreground font-three italic">
                      Password is already added
                    </div>
                  ) : (
                    <div className="relative flex items-center border border-border bg-background focus-within:ring-1 focus-within:ring-primary rounded-none">
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
                        className="px-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
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
                        className="text-primary hover:text-primary/80 cursor-pointer"
                        title="Edit Expiry"
                      >
                        <IoPencilOutline size={18} />
                      </button>
                    )}
                  </div>

                  {!isEditingExpiry && selectedUrl.expiresAt ? (
                    <div className="w-full p-3 border border-dashed border-border bg-secondary/20 text-muted-foreground font-three">
                      Expiry date is already added to {new Date(selectedUrl.expiresAt).toLocaleDateString()}
                    </div>
                  ) : (
                    <input 
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full p-3 border border-border bg-background text-foreground font-three focus:outline-none focus:ring-1 focus:ring-primary rounded-none cursor-pointer"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={handleAddPassword} 
                  className="bg-black text-white px-8 py-2 font-three text-sm hover:bg-black/80 transition-colors rounded-none cursor-pointer"
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