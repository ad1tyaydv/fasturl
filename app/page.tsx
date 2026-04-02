"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoCloseOutline } from "react-icons/io5";

import { HugeiconsIcon } from '@hugeicons/react';
import { 
  QrCodeIcon, CopyIcon, Refresh04Icon, Download01Icon, CopyCheckIcon, ArrowRightDoubleIcon
} from '@hugeicons/core-free-icons';

import Navbar from "./components/navbar";
import PricingSection from "./components/PricingSection";
import TotalData from "./components/totalData";
import FasturlFeatures from "./components/features";
import FaqSection from "./components/faqSection";
import Footer from "./components/footer";
import { DomainDropdown } from "./dropDown/domainDropDown";
import { Button } from "@/components/ui/button";

const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "fasturl.in";

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
  const [isLoadingQr, setIsLoadingQr] = useState(false); // Add this state
  
  const [selectedDomain, setSelectedDomain] = useState(NEXT_DOMAIN);

  const [modalConfig, setModalConfig] = useState<{
    show: boolean; title: string; description: string; buttonText: string; action: () => void;
  }>({ show: false, title: "", description: "", buttonText: "", action: () => { } });


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        const links = await axios.get("/api/shortUrl/linksLeft");
        const authenticated = !!res.data.authenticated;
        setIsLoggedIn(authenticated);
        setLinksLeft(links.data.linksLeft);

        if (authenticated) {
          setUserPlan(res.data.plan || "FREE");
        }

      } catch (err) {
        setIsLoggedIn(false);

      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();

  }, []);


  const handleShortUrl = async (originalUrl: string) => {
    if (!originalUrl) return;
    try {
      setLoading(true);
      const res = await axios.post("/api/shortUrl", { 
        url: originalUrl,
        customDomain: selectedDomain !== NEXT_DOMAIN ? selectedDomain : null
      });
      
      const generatedShortUrl = res.data.shortUrl;
      setShortUrl(generatedShortUrl);
      setUrl(`${selectedDomain}/${generatedShortUrl}`);
      
    } catch (error: any) {
      if (error.response?.status === 429) {
        if (!isLoggedIn) {
          setModalConfig({
            show: true,
            title: "Limit Reached",
            description: "Login to generate more links and access custom domains.",
            buttonText: "Login Now",
            action: () => router.push("/auth/signin"),
          });
        } else {
          setUpgradeMsg(true);
          pricingRef.current?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => setUpgradeMsg(false), 3000);
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
        description: "Login to generate high-quality QR codes for your links.",
        buttonText: "Login Now",
        action: () => router.push("/auth/signin"),
      });
      return;
    }

    if (typeof showQr === "string") {
      setShowQr(false);
      return;
    }

    setIsLoadingQr(true);
    try {
      const res = await axios.post("/api/qrCode", { shortUrl: shortUrl, longUrl: url });
      setShowQr(res.data.qrImage);

    } catch (error: any) {
      if (error.response?.status === 429) setUpgradeMsg(true);

    } finally {
      setIsLoadingQr(false);
    }
  };


  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    
    setTimeout(() => setCopied(false), 1000);
  };


  const handleReset = () => {
    setShortUrl("");
    setUrl("");
    setShowQr(false);
  };

  
  return (
    <div className="min-h-screen bg-[#141414] text-white relative transition-colors duration-300 overflow-x-hidden selection:bg-blue-500/30">
      <Navbar />

      {modalConfig.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-150 cursor-pointer" onClick={() => setModalConfig({ ...modalConfig, show: false })}>
          <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl shadow-2xl relative p-8 max-w-sm w-full cursor-default" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalConfig({ ...modalConfig, show: false })} className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer bg-transparent">
              <IoCloseOutline size={24} />
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-one font-bold mb-2 text-white">{modalConfig.title}</h2>
              <p className="text-neutral-400 mb-6 font-one text-sm">{modalConfig.description}</p>
              <button onClick={modalConfig.action} className="w-full py-3 bg-white text-black font-bold cursor-pointer hover:bg-gray-200 transition-colors rounded-xl">
                {modalConfig.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}

        <section className="max-w-7xl mx-auto px-6 pt-16 pb-20"> {/* Reduced pt-24 to pt-16 */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20">
            
            <div className="flex-1 text-center lg:text-left lg:pt-6"> {/* Reduced lg:pt-12 to lg:pt-6 */}
              <h1 className="text-3xl sm:text-3xl md:text-5xl font-bold mb-6 text-white leading-tight font-one tracking-tight">
                Shorten Your <span className="text-red-500">Links</span> Instantly
              </h1>
              
              <p className="font-one text-lg text-neutral-400 max-w-lg mx-auto lg:mx-0 mb-4">
                Transform long URLs into brandable short links with analytics, custom domains, and QR codes. 
              </p>
              
              <p className="font-one text-lg text-neutral-400 max-w-lg mx-auto lg:mx-0 mb-8">
                Share links, Generate QR Codes, view analytics and more than just a URL shortener.
              </p>

              <div className="flex justify-center lg:justify-start">
                <Button
                  onClick={() => router.push("/premium")}
                  className="px-5 py-5 font-bold bg-white text-black transition-all duration-300 flex items-center gap-2 group cursor-pointer"
                >
                  View Plans
                  <span className="group-hover:translate-x-1 transition-transform"><HugeiconsIcon icon={ArrowRightDoubleIcon} /></span>
                </Button>
              </div>
            </div>

          <div className="flex-1 w-full max-w-xl">
            <div className="flex justify-start mb-4">
              <DomainDropdown 
                selectedDomain={selectedDomain} 
                onSelect={setSelectedDomain} 
                defaultDomain={NEXT_DOMAIN}
              />
            </div>

            <div className={`flex flex-col sm:flex-row gap-3 rounded-2xl p-1 sm:p-1 transition-all bg-[#1a1a1a]`}>
              <input
                type="text"
                placeholder="Paste your long URL here..."
                className="flex-1 w-full outline-none font-one px-3 sm:px-4 py-3 bg-transparent text-white text-base sm:text-lg placeholder:text-neutral-600"
                value={url}
                onChange={(e) => { setUrl(e.target.value); if (shortUrl) setShortUrl(""); }}
                onKeyDown={(e) => e.key === "Enter" && !shortUrl && handleShortUrl(url)}
              />
              {shortUrl ? (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={handleGenerateQr} className={`px-4 sm:px-5 py-3 bg-[#2a2a2a] rounded-xl flex items-center justify-center cursor-pointer transition-colors ${showQr ? 'text-white shadow-lg' : 'bg-[#2a2a2a] text-white hover:bg-[#333333]'}`}>
                    <HugeiconsIcon icon={QrCodeIcon} />
                  </button>
                  <button 
                    onClick={copyToClipboard} 
                    className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                      copied ? "bg-green-600 text-white" : "bg-[#2a2a2a] text-white hover:bg-[#333333]"
                    }`}
                  >
                    {copied ? (
                      <>
                        <HugeiconsIcon icon={CopyCheckIcon} />
                      </>
                    ) : (
                      <>
                        <HugeiconsIcon icon={CopyIcon} size={20} />
                      </>
                    )}
                  </button>
                  <button onClick={handleReset} className="px-4 sm:px-5 py-3 rounded-xl bg-[#2a2a2a] text-white flex items-center justify-center cursor-pointer">
                    <HugeiconsIcon icon={Refresh04Icon} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleShortUrl(url)} 
                  disabled={loading || !url} 
                  className="w-full sm:w-auto px-6 sm:px-10 py-3 bg-white text-black disabled:opacity-50 font-bold text-lg cursor-pointer hover:bg-gray-200 transition-all rounded-xl shadow-lg shadow-white/5"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div> : "Shorten"}
                </button>
              )}
            </div>

            <div className="flex flex-col items-center mt-6 min-h-[280px] w-full">
              {isLoggedIn && (
                <div className="mb-4">
                  <span className="px-3 py-1.5 bg-[#1c1c1c] border border-neutral-800 text-sm font-medium text-neutral-400 inline-block rounded-lg shadow-sm">
                    {userPlan === "FREE" ? (
                      <>You have <strong className="text-white">{linksLeft}</strong> links left for today</>
                    ) : (
                      <>You have <strong className="text-white">{linksLeft}</strong> links left this month</>
                    )}
                  </span>
                </div>
              )}

              <div className="w-full flex flex-col items-center">
                {isLoadingQr ? (
                  <div className="flex flex-col items-center justify-center h-[200px]">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-sm font-medium text-neutral-400 animate-pulse font-one">Generating your QR...</p>
                  </div>
                ) : showQr && typeof showQr === "string" ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="bg-white p-4 rounded-2xl shadow-2xl border border-neutral-200">
                      <img src={showQr} alt="QR Code" className="w-44 h-44 object-contain" />
                    </div>
                    <button 
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = showQr;
                        link.download = `qrcode-${shortUrl}.png`;
                        link.click();
                      }}
                      className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-white rounded text-black text-xs font-bold hover:bg-gray-200 transition-all font-one"
                    >
                      <HugeiconsIcon icon={Download01Icon} size={16} />
                      DOWNLOAD QR
                    </button>
                  </div>
                ) : (
                  <div className="h-[200px] w-full hidden lg:block"></div>
                )}
              </div>

              {!authLoading && !isLoggedIn && (
                <div className="mt-4 font-one text-lg text-neutral-500 text-center">
                  <p>Guest limit: 1 link/day</p>
                  <button onClick={() => router.push("/auth/signin")} className="mt-1 underline cursor-pointer text-white hover:text-blue-400 transition-colors">
                    Login for custom domains & much more
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <FasturlFeatures isLoggedIn={isLoggedIn} userPlan={userPlan} />
      <div className="w-full h-px bg-neutral-800/50 my-12 shadow-sm"></div>
      <div ref={pricingRef}><PricingSection /></div>
      <div className="w-full h-px bg-neutral-800/50 my-12 shadow-sm"></div>
      <FaqSection />

      {copied && (
        <div className="fixed font-one top-24 left-1/2 -translate-x-1/2 px-6 py-3 shadow-2xl z-[100] bg-green-600 text-white font-bold rounded-full animate-in fade-in slide-in-from-top-6 duration-300">
          ✓ URL Copied to Clipboard
        </div>
      )}

      {upgradeMsg && (
        <div className="fixed font-one bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 shadow-2xl z-[100] bg-white text-black font-bold rounded-full animate-bounce border border-neutral-200">
          Upgrade your plan for more links!
        </div>
      )}

      {isLoggedIn && <TotalData />}
      <Footer />
    </div>
  );
}