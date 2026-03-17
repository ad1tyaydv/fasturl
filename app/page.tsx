"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  IoCopyOutline,
  IoRefreshOutline,
  IoArrowForwardOutline,
  IoLinkOutline,
  IoQrCodeOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { ModeToggle } from "./components/toggleTheme";
import PricingSection from "./components/PricingSection";

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
      const res = await axios.post("/api/shortUrl", {
        url: originalUrl
      });

      const generatedShortUrl = res.data.shortUrl;
      setShortUrl(generatedShortUrl);
      setUrl(`${NEXT_DOMAIN}/${generatedShortUrl}`);

    } catch (error: any) {
      if (error.response?.status === 429) {
        if (!isLoggedIn) {
          setModalConfig({
            show: true,
            title: "Limit Reached",
            description: "Login to generate more links",
            buttonText: "Login Now",
            action: () => router.push("/auth/signin"),
            showPlans: false,
          });
        } else {
          slowScrollToPricing();
        }
      }
      console.log("Can't short url", error);

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
        showPlans: false,
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

    } catch (error: any) {
      if (error.response?.status === 429) {
        slowScrollToPricing();
      }
      console.log("Error while generating qr code", error);
    }
  };


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


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setIsLoggedIn(!!res.data.authenticated);

      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();

  }, [router]);


  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    setIsLoggedIn(false);
  };

  
  return (
    <div className="min-h-screen transition-colors duration-300 bg-background text-foreground relative">

      {modalConfig.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-500">
          <div
            className={`bg-card border border-border rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-500 ease-out animate-in slide-in-from-bottom-8 zoom-in-95
        ${modalConfig.showPlans ? 'max-w-5xl w-full' : 'max-w-sm w-full p-8'}`}
          >
            <button
              onClick={() => setModalConfig({ ...modalConfig, show: false })}
              className="absolute top-5 right-5 z-[110] p-2 bg-background/50 backdrop-blur-md hover:bg-accent rounded-full transition-colors border border-border cursor-pointer"
            >
              <IoCloseOutline size={24} />
            </button>
            {!modalConfig.showPlans && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{modalConfig.title}</h2>
                <p className="text-muted-foreground mb-6">{modalConfig.description}</p>
                <button 
                  onClick={modalConfig.action}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold cursor-pointer"
                >
                  {modalConfig.buttonText}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-border">
        <h1 className="text-lg font-three sm:text-xl font-bold">SHORTLY</h1>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {isLoggedIn ? (
            <button onClick={handleLogout} className="border font-one border-input px-4 py-1.5 rounded-md hover:bg-accent transition text-sm sm:text-base cursor-pointer">
              Logout
            </button>
          ) : (
            <button onClick={() => router.push("/auth/signin")} className="border font-one border-input px-4 py-1.5 rounded-md hover:bg-accent transition font-medium text-sm sm:text-base cursor-pointer">
              Login
            </button>
          )}
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center px-4 sm:px-6 pt-16 md:pt-24 pb-12">
        <div className="text-center max-w-3xl w-full mx-auto">
          <h1 className="text-3xl font-one sm:text-4xl md:text-5xl font-bold mb-4">
            Shorten Your <span className="text-red-500">Links</span> Instantly
          </h1>
          <p className="mb-8 font-two text-base sm:text-lg px-2 text-muted-foreground">
            Turn long and messy URLs into short, clean links you can easily share.
          </p>

          <div className={`flex flex-col sm:flex-row gap-3 border-2 rounded-xl p-2 sm:p-3 transition-colors shadow-sm bg-card ${shortUrl ? 'border-primary' : 'border-border'}`}>
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
                <button onClick={handleGenerateQr} className={`px-4 sm:px-5 py-3 rounded-lg flex items-center justify-center transition cursor-pointer ${showQr ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                  <IoQrCodeOutline size={22} />
                </button>
                <button onClick={copyToClipboard} className="flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium flex items-center justify-center gap-2 cursor-pointer">
                  <IoCopyOutline size={20} /> Copy
                </button>
                <button onClick={handleReset} className="px-4 sm:px-5 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition flex items-center justify-center cursor-pointer">
                  <IoRefreshOutline size={22} />
                </button>
              </div>
            ) : (
              <button onClick={() => handleShortUrl(url)} disabled={loading || !url} className="w-full sm:w-auto px-6 sm:px-10 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 font-medium text-base sm:text-lg cursor-pointer">
                {loading ? <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div> : "Shorten"}
              </button>
            )}
          </div>

          {showQr && typeof showQr === "string" && (
            <div className="mt-6 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-white p-4 rounded-xl shadow-lg border border-border">
                <img src={showQr} alt="QR Code" className="w-40 h-40 object-contain" />
              </div>
              <p className="mt-3 text-sm font-three">Your QR code is ready!</p>
            </div>
          )}

          {!isLoggedIn && (
            <div className="mt-4 flex font-two flex-col items-center justify-center text-sm sm:text-base md:text-xl text-muted-foreground">
              <p>You can only create 1 link/day</p>
              <button
                onClick={() => router.push("/auth/signin")}
                className="font-semibold font-two mt-1 hover:underline cursor-pointer text-foreground"
              >
                Login to create more
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col items-center justify-center px-4 sm:px-6 pb-12 border-b border-border">
        <div className="mt-2 w-full max-w-3xl flex flex-col items-center text-center">
          <h2 className="text-2xl font-three sm:text-3xl font-bold mb-3">Manage Your Links</h2>
          <button onClick={() => router.push('/urls')} className="w-full font-one sm:w-auto group flex justify-center items-center gap-2 border-2 border-input bg-background px-6 sm:px-8 py-3 rounded-lg transition font-semibold text-base sm:text-lg hover:bg-accent cursor-pointer">
            See all your short URLs <IoArrowForwardOutline size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <div ref={pricingRef}>
        <PricingSection />
      </div>

      {copied && (
        <div className="fixed font-two top-20 sm:top-24 left-1/2 -translate-x-1/2 mt-1 px-6 py-2 rounded-md shadow-lg text-xs sm:text-sm z-50 animate-bounce bg-primary text-primary-foreground">
          URL Copied!
        </div>
      )}

      {upgradeMsg && (
        <div className="fixed font-two bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full shadow-2xl text-sm sm:text-base z-50 animate-in slide-in-from-bottom-4 fade-in duration-300 bg-black text-white dark:bg-white dark:text-black font-bold border border-border">
          Upgrade to generate more!
        </div>
      )}
    </div>
  );
}