"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoCloseOutline } from "react-icons/io5";

import { HugeiconsIcon } from '@hugeicons/react';
import { 
  QrCodeIcon, CopyIcon, Refresh04Icon, Download01Icon 
} from '@hugeicons/core-free-icons';

import Navbar from "./components/navbar";
import PricingSection from "./components/PricingSection";
import TotalData from "./components/totalData";
import ShortlyFeatures from "./components/features";
import FaqSection from "./components/faqSection";
import Footer from "./components/footer";


const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function Dashboard() {
  const router = useRouter();
  const pricingRef = useRef<HTMLDivElement>(null);

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPlan, setUserPlan] = useState("FREE");
  const [linksLeft, setLinksLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState<string | boolean>(false);
  const [upgradeMsg, setUpgradeMsg] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [modalConfig, setModalConfig] = useState<{
    show: boolean;
    title: string;
    description: string;
    buttonText: string;
    action: () => void;
  }>({
    show: false,
    title: "",
    description: "",
    buttonText: "",
    action: () => { },
  });


  const slowScrollToPricing = () => {
    if (pricingRef.current) {
      pricingRef.current.scrollIntoView({ behavior: "smooth" });
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

    } catch (error: any) {
      if (error.response?.status === 429) slowScrollToPricing();
    }
  };


  const downloadQrCode = () => {
    if (typeof showQr === "string") {
      const link = document.createElement("a");
      link.href = showQr;
      link.download = `qrcode-${shortUrl || "link"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        const count = await axios.get("/api/shortUrl/linksLeft")
        const authenticated = !!res.data.authenticated;
        setIsLoggedIn(authenticated);
        setLinksLeft(count.data.linksLeft);

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

  
  return (
    <div className="min-h-screen bg-[#141414] text-white relative transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      {modalConfig.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 transition-opacity duration-150 cursor-pointer" onClick={() => setModalConfig({ ...modalConfig, show: false })}>
          <div className="bg-[#1c1c1c] border border-neutral-800 rounded-none shadow-2xl relative p-8 max-w-sm w-full cursor-default" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalConfig({ ...modalConfig, show: false })} className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white hover:bg-[#2a2a2a] border border-transparent cursor-pointer bg-transparent transition-colors">
              <IoCloseOutline size={24} />
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-one font-bold mb-2 text-white">{modalConfig.title}</h2>
              <p className="text-neutral-400 mb-6 font-two">{modalConfig.description}</p>
              <button onClick={modalConfig.action} className="w-full py-3 bg-white text-black font-semibold cursor-pointer hover:bg-gray-200 transition-colors rounded-none">
                {modalConfig.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="flex flex-col items-center justify-center px-4 sm:px-6 pt-16 md:pt-24 pb-12">
        <div className="text-center max-w-3xl w-full mx-auto">
          <h1 className="text-3xl font-one sm:text-4xl md:text-5xl font-bold mb-4 pt-12 text-white">
            <span className="relative inline-block">
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-lg sm:text-xl md:text-5xl text-white">
                Track
              </span>
              <span className="relative after:content-[''] after:absolute after:left-0 after:top-[55%] after:w-full after:h-[3px] after:bg-red-500">
                Shorten
              </span>
            </span> Your <span className="text-red-500">Links</span> Instantly
          </h1>
          <p className="mb-8 font-one text-base sm:text-lg text-neutral-400">
            Turn long and messy URLs into short, clean links you can easily share.
          </p>

          <div className={`flex flex-col sm:flex-row gap-3 border rounded-xl p-2 sm:p-3 transition-all shadow-sm bg-[#1a1a1a] ${shortUrl ? 'border-blue-500' : 'border-neutral-800'}`}>
            <input
              type="text"
              placeholder="Paste your long URL here..."
              className="flex-1 w-full outline-none font-one px-3 sm:px-4 py-3 bg-transparent text-white text-base sm:text-lg cursor-text placeholder:text-neutral-600"
              value={url}
              onChange={(e) => { setUrl(e.target.value); if (shortUrl) setShortUrl(""); }}
              onKeyDown={handleKeyDown}
            />
            {shortUrl ? (
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={handleGenerateQr} className={`px-4 sm:px-5 py-3 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${showQr ? 'bg-blue-600 text-white' : 'bg-[#2a2a2a] text-white hover:bg-[#333333]'}`}>
                  <HugeiconsIcon icon={QrCodeIcon} />
                </button>
                <button onClick={copyToClipboard} className="flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-lg bg-blue-600 text-white font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-700 transition-colors">
                  <HugeiconsIcon icon={CopyIcon} />
                </button>
                <button onClick={handleReset} className="px-4 sm:px-5 py-3 rounded-lg bg-[#2a2a2a] text-white flex items-center justify-center cursor-pointer hover:bg-[#333333] transition-colors">
                  <HugeiconsIcon icon={Refresh04Icon} />
                </button>
              </div>
            ) : (
              <button onClick={() => handleShortUrl(url)} disabled={loading || !url} className="w-full sm:w-auto px-6 sm:px-10 py-3 bg-white text-black disabled:opacity-50 font-bold text-lg cursor-pointer hover:bg-gray-200 transition-colors rounded-lg">
                {loading ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : "Shorten"}
              </button>
            )}
          </div>

          {isLoggedIn && (
            <div className="mt-4 text-center animate-in fade-in slide-in-from-top-2">
              <span className="px-3 py-1.5 bg-[#1c1c1c] border border-neutral-800 text-sm font-medium text-neutral-400 inline-block">
                {userPlan === "FREE" ? (
                  <>You have <strong className="text-white">{linksLeft}</strong> links left for today</>
                ) : (
                  <>You have <strong className="text-white">{linksLeft}</strong> links left this month</>
                )}
              </span>
            </div>
          )}

          {showQr && typeof showQr === "string" && (
            <div className="mt-6 flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="bg-white p-4 rounded-none shadow-lg border border-neutral-200">
                <img src={showQr} alt="QR Code" className="w-40 h-40 object-contain" />
              </div>
              <div className="flex items-center gap-4 mt-4">
                <button 
                  onClick={downloadQrCode}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded hover:bg-gray-200 transition-all cursor-pointer"
                >
                  <HugeiconsIcon icon={Download01Icon} />
                  DOWNLOAD
                </button>
              </div>
            </div>
          )}

          {!authLoading && !isLoggedIn && (
            <div className="mt-4 font-one text-xl text-neutral-500">
              <p>You can only create 1 link/day</p>
              <button
                onClick={() => router.push("/auth/signin")}
                className="font-one mt-1 underline cursor-pointer text-white hover:text-blue-400 transition-colors">
                Login to create more
              </button>
            </div>
          )}
        </div>
      </section>

      <ShortlyFeatures isLoggedIn={isLoggedIn} userPlan={userPlan} />
      <div className="w-full h-px bg-neutral-800 my-6"></div>
      <div ref={pricingRef}>
        <PricingSection />
      </div>
      <div className="w-full h-px bg-neutral-800 my-6"></div>
      <FaqSection />

      {copied && (
        <div className="fixed font-two top-20 sm:top-24 left-1/2 -translate-x-1/2 px-6 py-2 shadow-lg text-sm z-[100] bg-green-600 text-white rounded-none animate-in fade-in slide-in-from-top-4 duration-300">
          URL Copied!
        </div>
      )}

      {upgradeMsg && (
        <div className="fixed font-two bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 shadow-2xl z-[100] bg-white text-black font-bold border border-transparent rounded-none animate-bounce">
          Upgrade to generate more!
        </div>
      )}

      {isLoggedIn && (
        <TotalData />
      )}

      <Footer />
    </div>
  );
}