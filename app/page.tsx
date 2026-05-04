"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoCloseOutline } from "react-icons/io5";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  QrCodeIcon, CopyIcon, Refresh04Icon, Download01Icon, CopyCheckIcon
} from '@hugeicons/core-free-icons';

import Navbar from "./components/navbar";
import PricingSection from "./components/PricingSection";
import TotalData from "./components/totalData";
import Features from "./components/features";
import FaqSection from "./components/faqSection";
import Footer from "./components/footer";
import { DomainDropdown } from "./dropDown/domainDropDown";
import { toast } from "sonner";
import { UpgradeAlert } from "./modals/upgradeAlert";
import QrDownloadModal from "./modals/qrDownloadModal";


const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN!;

export default function Dashboard() {
  const router = useRouter();
  const pricingRef = useRef<HTMLDivElement>(null);


  const [url, setUrl] = useState("");
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPlan, setUserPlan] = useState("FREE");
  const [links, setLinks] = useState<[]>([]);
  const [linksLeft, setLinksLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState<string | boolean>(false);
  const [upgradeMsg, setUpgradeMsg] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const [authLoading, setAuthLoading] = useState(true);
  const [isLoadingQr, setIsLoadingQr] = useState(false);

  const [selectedDomain, setSelectedDomain] = useState(NEXT_DOMAIN);

  const [modalConfig, setModalConfig] = useState<{
    show: boolean; title: string; description: string; buttonText: string; action: () => void;
  }>({ show: false, title: "", description: "", buttonText: "", action: () => { } });



  useEffect(() => {
    router.prefetch("/auth/signin");
    router.prefetch("/links?types=links");
    router.prefetch("/qr");
    router.prefetch("/domain");
    router.prefetch("/premium");
    router.prefetch("/docs/what-is-url-shortener");
  }, []);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        const authenticated = !!res.data.authenticated;
        setIsLoggedIn(authenticated);

        if (authenticated) {
          const linksLeftRes = await axios.get("/api/shortUrl/linksLeft");
          const linksRes = await axios.get("/api/fetchUrls");
          setLinksLeft(linksLeftRes.data.linksLeft);
          setLinks(linksRes.data.urls);
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


  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;

    } catch {
      return false;
    }
  };

  const handleShortUrl = async (originalUrl: string) => {
    if (!originalUrl || !isValidUrl(originalUrl)) {
      toast.error("Please enter a valid URL!");
      return;
    }
    try {
      setLoading(true);
      setLongUrl(originalUrl);
      const res = await axios.post("/api/shortUrl", {
        url: originalUrl,
        customDomain: selectedDomain !== NEXT_DOMAIN ? selectedDomain : null
      });

      const generatedShortUrl = res.data.shortUrl;
      setShortUrl(generatedShortUrl);
      setUrl(`${selectedDomain}/${generatedShortUrl}`);

      if (linksLeft !== null) {
        setLinksLeft((prev) => Math.max(0, (prev || 0) - 1));
      }


    } catch (error: any) {
      if (error.response?.status === 403) {
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
      } else if (error.response?.status === 430) {
        toast.error("Too many requests under 1 minute, Please try again later");
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
      return;
    }

    setIsLoadingQr(true);
    try {
      const res = await axios.post("/api/qrCode", {
        shortUrl: shortUrl,
        longUrl: url
      });
      if (res.data.qrImage && typeof res.data.qrImage === "string") {
        setShowQr(res.data.qrImage);
      }

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
    <div className="min-h-screen bg-background text-foreground relative transition-colors duration-300 overflow-x-hidden selection:bg-blue-500/30">
      <Navbar />

      {modalConfig.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-150 cursor-pointer" onClick={() => setModalConfig({ ...modalConfig, show: false })}>
          <div className="bg-card border border-border rounded-2xl shadow-2xl relative p-8 max-w-sm w-full cursor-default" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalConfig({ ...modalConfig, show: false })} className="absolute top-5 right-5 p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent">
              <IoCloseOutline size={24} />
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-one font-bold mb-2 text-foreground">{modalConfig.title}</h2>
              <p className="text-muted-foreground mb-6 font-one text-sm">{modalConfig.description}</p>
              <button onClick={modalConfig.action} className="w-full py-3 bg-primary text-primary-foreground font-bold cursor-pointer hover:opacity-90 transition-colors rounded-xl">
                {modalConfig.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20">

          <div className="flex-1 text-center lg:text-left lg:pt-6">
            <h1 className="text-3xl sm:text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight font-three tracking-tight">
              <span className="text-red-500">Url Shortner,</span><br />
              QR Generator,<br />
              Custom Domain,<br />
              Detailed Analytics.
            </h1>

            <p className="font-one text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-4 px-2 sm:px-0">
              Fasturl is your all-in-one link management platform for digital marketing links, and real time click tracking.
            </p>

          </div>

          <div className="flex-1 w-full max-w-xl">
            <div className="flex justify-start mb-4">
              <DomainDropdown
                selectedDomain={selectedDomain}
                onSelect={setSelectedDomain}
                defaultDomain={NEXT_DOMAIN}
              />
            </div>

            <div className={`flex flex-col sm:flex-row gap-3 rounded-2xl p-1 sm:p-1 transition-all bg-secondary`}>
              <input
                type="text"
                placeholder="Paste your long URL here..."
                className="flex-1 w-full outline-none font-one px-3 sm:px-4 py-3 bg-transparent text-foreground text-base sm:text-lg placeholder:text-muted-foreground/60"
                value={url}
                onChange={(e) => { setUrl(e.target.value); if (shortUrl) setShortUrl(""); }}
                onKeyDown={(e) => e.key === "Enter" && !shortUrl && handleShortUrl(url)}
              />
              {shortUrl ? (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={handleGenerateQr} className={`px-4 sm:px-5 py-3 bg-accent rounded-xl flex items-center justify-center cursor-pointer transition-colors ${showQr ? 'text-foreground shadow-lg' : 'bg-accent text-foreground hover:bg-accent/80'}`}>
                    <HugeiconsIcon icon={QrCodeIcon} />
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${copied ? "bg-green-600 text-white" : "bg-accent text-foreground hover:bg-accent/80"
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
                  <button onClick={handleReset} className="px-4 sm:px-5 py-3 rounded-xl bg-accent text-foreground flex items-center justify-center cursor-pointer hover:bg-accent/80">
                    <HugeiconsIcon icon={Refresh04Icon} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleShortUrl(url)}
                  disabled={loading || !url}
                  className="w-full sm:w-auto px-6 sm:px-10 py-3 bg-primary text-primary-foreground disabled:opacity-50 font-bold text-lg cursor-pointer hover:opacity-90 transition-all rounded-xl shadow-lg shadow-primary/5"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mx-auto"></div> : "Shorten"}
                </button>
              )}
            </div>

            <div className="flex flex-col items-center mt-6 min-h-[280px] w-full">
              {(isLoggedIn || authLoading) && (
                <div className="mb-4">
                  <span className="px-3 py-1.5 bg-card border border-border text-sm font-one text-muted-foreground inline-flex items-center gap-1.5 rounded-lg shadow-sm">
                    You have
                    <span className="inline-flex items-center justify-center min-w-[20px]">
                      {linksLeft === null ? (
                        <div className="w-3 h-3 border-2 border-muted-foreground border-t-foreground rounded-full animate-spin"></div>
                      ) : (
                        <strong className="text-foreground">{linksLeft}</strong>
                      )}
                    </span>
                    links left this month
                  </span>
                </div>
              )}

              <div className="w-full flex flex-col items-center">
                {isLoadingQr ? (
                  <div className="flex flex-col items-center justify-center h-[200px]">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse font-one">
                      Generating QR, Please wait...
                    </p>
                  </div>
                ) : typeof showQr === "string" ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">

                    <div className="bg-white p-1 rounded-md">
                      <img
                        src={showQr}
                        alt="QR Code"
                        className="w-44 h-44 object-contain"
                      />
                    </div>

                    <button
                      onClick={() => setIsDownloadModalOpen(true)}
                      className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md text-xs font-bold hover:opacity-90 transition-all font-one cursor-pointer"
                    >
                      <HugeiconsIcon icon={Download01Icon} size={16} />
                      DOWNLOAD
                    </button>

                  </div>
                ) : (
                  <div className="h-[200px] w-full hidden lg:block"></div>
                )}
              </div>

              {!authLoading && !isLoggedIn && (
                <div className="mt-4 font-one text-lg text-muted-foreground text-center">
                  <p>Guest limit: 1 link/day</p>
                  <button
                    onClick={() => router.push("/auth/signin")}
                    className="mt-1 underline cursor-pointer text-foreground hover:text-blue-400 transition-colors">
                    Login for custom domains & much more
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-secondary border border-border backdrop-blur-md shadow-2xl">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://api.dicebear.com/9.x/micah/svg?seed=${i + 42}`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-background bg-blue-600 flex items-center justify-center text-[10px] font-one text-white shadow-lg shadow-blue-500/20">
                1˝0+
              </div>
            </div>
            <div className="h-6 w-px bg-border mx-1"></div>
            <p className="text-muted-foreground font-one text-sm sm:text-base flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Trusted by 10+ <span className="text-foreground font-semibold underline decoration-blue-500/50 underline-offset-4">global users</span>
            </p>
          </div>
        </div>
      </section>


      <Features isLoggedIn={isLoggedIn} userPlan={userPlan} />
      <div className="w-full h-px bg-border my-12 shadow-sm"></div>

      {userPlan !== "ESSENTIAL" && userPlan !== "PRO" && <PricingSection />}
      <FaqSection />

      {copied && (
        <div className="toast toast-top toast-center z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="alert alert-success border-none shadow-lg text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Link copied successfully!</span>
          </div>
        </div>
      )}

      <UpgradeAlert
        isOpen={upgradeMsg}
        onClose={setUpgradeMsg}
        onConfirm={() => {
          setUpgradeMsg(false);
          pricingRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <QrDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        qrData={showQr ? {
          qrImage: showQr as string,
          shortUrl: `${selectedDomain}/${shortUrl}`,
          longUrl: url,
          qrName: `qr-${shortUrl}`
        } : null}
      />

      <TotalData />
      <Footer />
    </div>
  );
}