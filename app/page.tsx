"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  IoCopyOutline,
  IoRefreshOutline,
  IoArrowForwardOutline,
  IoQrCodeOutline,
  IoCloseOutline,
} from "react-icons/io5";
import Navbar from "./components/navbar";
import PricingSection from "./components/PricingSection";
import TotalData from "./components/totalData";

const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function Dashboard() {
  const router = useRouter();
  const pricingRef = useRef<HTMLDivElement>(null);

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState<string | boolean>(false);
  const [upgradeMsg, setUpgradeMsg] = useState(false);


  const [stats, setStats] = useState({ links: 0, qrs: 0, clicks: 0 });

  const [modalConfig, setModalConfig] = useState<{
    show: boolean;
    title: string;
    description: string;
    buttonText: string;
    action: () => void;
    showPlans?: boolean;
  }>({
    show: false,
    title: "",
    description: "",
    buttonText: "",
    action: () => { },
    showPlans: false,
  });


  const slowScrollToPricing = () => {
    if (pricingRef.current) {
      const targetPosition = pricingRef.current.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1200;
      let start: number | null = null;

      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        const easing = percentage < 0.5 
          ? 4 * percentage * percentage * percentage 
          : 1 - Math.pow(-2 * percentage + 2, 3) / 2;

        window.scrollTo(0, startPosition + distance * easing);
        if (progress < duration) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    }
    setUpgradeMsg(true);
    setTimeout(() => setUpgradeMsg(false), 3000);
  };


  const handleShortUrl = async (originalUrl: string) => {
    if (!originalUrl) return;

    try {
      setLoading(true);
      const res = await axios.post("/api/shortUrl", { url: originalUrl });

      const generatedShortUrl = res.data.shortUrl;

      setShortUrl(generatedShortUrl);
      setUrl(`${NEXT_DOMAIN}/${generatedShortUrl}`);

      fetchUserStats();

    } catch (error: any) {
      if (error.response?.status === 429) {
        if (!isLoggedIn) {
          setModalConfig({
            show: true,
            title: "Limit Reached",
            description: "Login to generate more links",
            buttonText: "Login Now",
            action: () => router.push("/auth/signin"),
          });

        } else {
          slowScrollToPricing();
        }
      }

    } finally {
      setLoading(false);
    }
  };


  const handleGenerateQr = async () => {
    if (!isLoggedIn) {
      setModalConfig({
        show: true,
        title: "Login Required",
        description: "Login to generate more QR codes",
        buttonText: "Login Now",
        action: () => router.push("/auth/signin"),
      });
      return;
    }

    if (typeof showQr === "string") {
      setShowQr(false);
      return;
    }

    try {
      const res = await axios.post("/api/qrCode", {
        shortUrl: shortUrl,
        longUrl: url
      });

      setShowQr(res.data.qrImage);

      fetchUserStats();

    } catch (error: any) {
      if (error.response?.status === 429) slowScrollToPricing();
    }
  };


  const fetchUserStats = async () => {
    try {
      const res = await axios.get("/api/totalData"); 
      setStats({
        links: res.data.totalLinks || 0,
        qrs: res.data.totalQrs || 0,
        clicks: res.data.totalClicks || 0
      });
      
    } catch (e) {
      console.log("Stats not available yet");
    }
  };


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        const authenticated = !!res.data.authenticated;
        setIsLoggedIn(authenticated);
        if (authenticated) fetchUserStats();

      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();

  }, [router]);


  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const handleReset = () => {
    setShortUrl("");
    setUrl("");
    setShowQr(false);
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && url && !shortUrl && !loading) {
      handleShortUrl(url);
    }
  };


  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    setIsLoggedIn(false);
    setShortUrl("");
    setUrl("");
    setStats({ links: 0, qrs: 0, clicks: 0 });
  };


  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      {modalConfig.show && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 transition-opacity duration-150" onClick={() => setModalConfig({ ...modalConfig, show: false })}>
          <div className="bg-card border border-border rounded-none shadow-2xl relative p-8 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalConfig({ ...modalConfig, show: false })} className="absolute top-5 right-5 p-2 hover:bg-accent border border-border cursor-pointer bg-background">
              <IoCloseOutline size={24} />
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 font-one">{modalConfig.title}</h2>
              <p className="text-muted-foreground mb-6 font-two">{modalConfig.description}</p>
              <button onClick={modalConfig.action} className="w-full py-3 bg-primary text-primary-foreground font-semibold cursor-pointer hover:bg-primary/90">
                {modalConfig.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="flex flex-col items-center justify-center px-4 sm:px-6 pt-16 md:pt-24 pb-12">
        <div className="text-center max-w-3xl w-full mx-auto">
          <h1 className="text-3xl font-one sm:text-4xl md:text-5xl font-bold mb-4">
            Shorten Your <span className="text-red-500">Links</span> Instantly
          </h1>
          <p className="mb-8 font-one text-base sm:text-lg text-muted-foreground">
            Turn long and messy URLs into short, clean links you can easily share.
          </p>

          <div className={`flex flex-col sm:flex-row gap-3 border-2 rounded-none p-2 sm:p-3 transition-colors shadow-sm bg-card ${shortUrl ? 'border-primary' : 'border-border'}`}>
            <input
              type="text"
              placeholder="Paste your long URL here..."
              className="flex-1 w-full outline-none font-one px-3 sm:px-4 py-3 bg-transparent text-base sm:text-lg"
              value={url}
              onChange={(e) => { setUrl(e.target.value); if (shortUrl) setShortUrl(""); }}
              onKeyDown={handleKeyDown}
            />
            {shortUrl ? (
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={handleGenerateQr} className={`px-4 sm:px-5 py-3 rounded-none flex items-center justify-center cursor-pointer ${showQr ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                  <IoQrCodeOutline size={22} />
                </button>
                <button onClick={copyToClipboard} className="flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-none bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 cursor-pointer">
                  <IoCopyOutline size={20} /> Copy
                </button>
                <button onClick={handleReset} className="px-4 sm:px-5 py-3 rounded-none bg-secondary text-secondary-foreground flex items-center justify-center cursor-pointer">
                  <IoRefreshOutline size={22} />
                </button>
              </div>
            ) : (
              <button onClick={() => handleShortUrl(url)} disabled={loading || !url} className="w-full sm:w-auto px-6 sm:px-10 py-3 bg-primary text-primary-foreground disabled:opacity-50 font-medium text-lg cursor-pointer">
                {loading ? <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div> : "Shorten"}
              </button>
            )}
          </div>

          {showQr && typeof showQr === "string" && (
            <div className="mt-6 flex flex-col items-center">
              <div className="bg-white p-4 rounded-none shadow-lg border border-border">
                <img src={showQr} alt="QR Code" className="w-40 h-40 object-contain" />
              </div>
              <p className="mt-3 text-sm font-three">Your QR code is ready!</p>
            </div>
          )}

          {!isLoggedIn && (
            <div className="mt-4 font-one text-xl text-muted-foreground">
              <p>You can only create 1 link/day</p>
              <button 
                onClick={() => router.push("/auth/signin")}
                className="font-one mt-1 underline cursor-pointer text-foreground">
                Login to create more
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col items-center justify-center px-4 sm:px-6 pb-12 border-b border-border">
        <div className="mt-2 w-full max-w-3xl flex flex-col items-center text-center">
          <h2 className="text-2xl font-three sm:text-3xl font-bold mb-3">Manage Your Links</h2>
          <button 
            onClick={() => router.push('/urls')} 
            className="w-full font-one sm:w-auto group flex justify-center items-center gap-2 border-2 border-input bg-background px-6 sm:px-8 py-3 rounded-none transition font-semibold text-lg hover:bg-accent cursor-pointer">
            See all your short URLs <IoArrowForwardOutline size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <div ref={pricingRef}>
        <PricingSection />
      </div>

      {copied && (
        <div className="fixed font-two top-20 sm:top-24 left-1/2 -translate-x-1/2 px-6 py-2 shadow-lg text-sm z-50 bg-primary text-primary-foreground rounded-none">
          URL Copied!
        </div>
      )}

      {upgradeMsg && (
        <div className="fixed font-two bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 shadow-2xl z-50 bg-black text-white dark:bg-white dark:text-black font-bold border border-border rounded-none">
          Upgrade to generate more!
        </div>
      )}

      <div className="w-full h-px bg-gray-300"></div>

      {isLoggedIn && (
        <TotalData 
          totalLinks={stats.links} 
          totalQrs={stats.qrs} 
          totalClicks={stats.clicks} 
        />
      )}

    </div>
  );
}