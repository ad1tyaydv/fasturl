"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoCloseOutline } from "react-icons/io5";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  QrCodeIcon, CopyIcon, Refresh04Icon, Download01Icon, CopyCheckIcon,
  Link01Icon, GlobeIcon, ArrowRight01Icon
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
import LiveOn from "./components/liveOn";


const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN!;

export default function Dashboard() {
  const router = useRouter();
  const pricingRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"shorten" | "qr">("shorten");
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPlan, setUserPlan] = useState("FREE");
  const [linksLeft, setLinksLeft] = useState<number | null>(null);
  const [qrLeft, setQrLeft] = useState<number | null>(null);
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
  }, [router]);


  useEffect(() => {

    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        const authenticated = !!res.data.authenticated;
        setIsLoggedIn(authenticated);

        if (authenticated) {
          const [linksLeftRes, qrLeftRes] = await Promise.all([
            axios.get("/api/shortUrl/linksLeft"),
            axios.get("/api/qrCode/qrLeft")
          ]);
          setLinksLeft(linksLeftRes.data.linksLeft);
          setQrLeft(qrLeftRes.data.qrLeft);
          setUserPlan(res.data.plan || "FREE");
        }

      } catch (err) {
        console.error("Auth check failed:", err);
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
      return null;
    }
    try {
      setLoading(true);
      const res = await axios.post("/api/shortUrl", {
        url: originalUrl,
        customDomain: selectedDomain !== NEXT_DOMAIN ? selectedDomain : null,
        customAlias: customAlias || undefined
      });

      const generatedShortUrl = res.data.shortUrl;
      setShortUrl(generatedShortUrl);
      setUrl(`${selectedDomain}/${generatedShortUrl}`);

      if (linksLeft !== null) {
        setLinksLeft((prev) => Math.max(0, (prev || 0) - 1));
      }

      return generatedShortUrl;

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
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
      }
      return null;

    } finally {
      setLoading(false);
    }
  };


  const handleGenerateQr = async (overrideShortUrl?: string, overrideLongUrl?: string) => {
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

    const short = typeof overrideShortUrl === 'string' ? overrideShortUrl : shortUrl;
    const long = typeof overrideLongUrl === 'string' ? overrideLongUrl : url;

    if (typeof showQr === "string" && short === shortUrl) {
      return;
    }

    setIsLoadingQr(true);
    try {
      const res = await axios.post("/api/qrCode", {
        shortUrl: short,
        longUrl: long
      });
      if (res.data.qrImage && typeof res.data.qrImage === "string") {
        setShowQr(res.data.qrImage);
        if (qrLeft !== null) {
          setQrLeft((prev) => Math.max(0, (prev || 0) - 1));
        }
      }

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) setUpgradeMsg(true);
      }
    } finally {
      setIsLoadingQr(false);
    }
  };

  const handleAction = async () => {
    if (!url) return;
    const generated = await handleShortUrl(url);
    if (generated && activeTab === "qr") {
      await handleGenerateQr(generated, url);
    }
  };


  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied successfully!");
    setCopied(true);

    setTimeout(() => setCopied(false), 1000);
  };


  const handleReset = () => {
    setShortUrl("");
    setUrl("");
    setCustomAlias("");
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
            <div className="w-full p-6 sm:p-8 bg-card border border-border rounded-[32px] shadow-sm font-one">

              <div className="flex p-1.5 bg-secondary/60 rounded-full mb-8">
                <button
                  onClick={() => {
                    setActiveTab("shorten");
                    handleReset();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-base font-medium transition-all cursor-pointer ${activeTab === "shorten"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <HugeiconsIcon icon={Link01Icon} size={20} />
                  Shorten a Link
                </button>
                <button
                  onClick={() => {
                    setActiveTab("qr");
                    handleReset();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-base font-medium transition-all cursor-pointer ${activeTab === "qr"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <HugeiconsIcon icon={QrCodeIcon} size={20} />
                  Generate QR Code
                </button>
              </div>

              {!shortUrl ? (
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-base font-medium mb-2 text-foreground">
                      Long URL <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border border-border rounded-xl px-4 py-3.5 bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                      <HugeiconsIcon icon={GlobeIcon} size={22} className="text-muted-foreground/70" />
                      <input
                        type="text"
                        placeholder="Paste your long URL here..."
                        className="w-full bg-transparent border-none outline-none ml-3 text-base placeholder:text-muted-foreground/50 text-foreground"
                        value={url}
                        onChange={(e) => { setUrl(e.target.value); if (shortUrl) setShortUrl(""); }}
                        onKeyDown={(e) => e.key === "Enter" && !shortUrl && handleAction()}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-medium mb-2 text-foreground">
                      Custom Alias/Slug <span className="text-muted-foreground/60 font-normal">(optional)</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-[180px] bg-background border border-border rounded-xl flex items-center focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden">
                        <DomainDropdown
                          selectedDomain={selectedDomain}
                          onSelect={setSelectedDomain}
                          defaultDomain={NEXT_DOMAIN}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="my-custom-link"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        className="flex-1 border border-border rounded-xl px-4 py-3.5 bg-background text-base outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAction}
                    disabled={loading || !url}
                    className="w-full mt-2 bg-black dark:bg-white hover:opacity-90 disabled:opacity-60 text-white dark:text-black rounded-xl py-4 text-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        {activeTab === "shorten" ? "Shorten Link" : "Generate QR Code"}
                        <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 py-6 animate-in fade-in zoom-in duration-300">
                  <div className="w-full flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      readOnly
                      className="flex-1 w-full border border-border rounded-xl px-4 py-4 bg-secondary/30 text-foreground text-lg outline-none"
                      value={url}
                    />
                    <div className="flex gap-2">
                      {activeTab === "shorten" && (
                        <button
                          onClick={() => handleGenerateQr()}
                          className={`px-5 py-4 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${showQr ? "bg-background shadow-md border border-border text-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"
                            }`}
                        >
                          <HugeiconsIcon icon={QrCodeIcon} size={24} />
                        </button>
                      )}
                      <button
                        onClick={copyToClipboard}
                        className={`flex-1 sm:flex-none px-5 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${copied ? "bg-black dark:bg-white text-white dark:text-black shadow-md" : "bg-secondary text-foreground hover:bg-secondary/80 shadow-sm"
                          }`}
                      >
                        {copied ? <HugeiconsIcon icon={CopyCheckIcon} size={24} /> : <HugeiconsIcon icon={CopyIcon} size={24} />}
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-5 py-4 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <HugeiconsIcon icon={Refresh04Icon} size={24} />
                      </button>
                    </div>
                  </div>

                  {(showQr || isLoadingQr || activeTab === "qr") && (
                    <div className="flex flex-col items-center mt-4 w-full">
                      {isLoadingQr ? (
                        <div className="flex flex-col items-center justify-center h-[200px]">
                          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : typeof showQr === "string" ? (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                          <div className="bg-white p-2 rounded-xl border border-border shadow-sm">
                            <img src={showQr} alt="QR Code" className="w-48 h-48 object-contain" />
                          </div>
                          <button
                            onClick={() => setIsDownloadModalOpen(true)}
                            className="mt-6 flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-all cursor-pointer shadow-sm"
                          >
                            <HugeiconsIcon icon={Download01Icon} size={18} />
                            DOWNLOAD
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-border/50 flex flex-col items-center gap-4">
                {(isLoggedIn || authLoading) ? (
                  <span className="px-3 py-1.5 bg-secondary border border-border text-xs sm:text-sm font-one text-muted-foreground inline-flex items-center gap-1.5 rounded-lg shadow-sm">
                    You have
                    <span className="inline-flex items-center justify-center min-w-[20px]">
                      {activeTab === "shorten" ? (
                        linksLeft === null ? (
                          <div className="w-3 h-3 border-2 border-muted-foreground border-t-foreground rounded-full animate-spin"></div>
                        ) : (
                          <strong className="text-foreground">{linksLeft}</strong>
                        )
                      ) : (
                        qrLeft === null ? (
                          <div className="w-3 h-3 border-2 border-muted-foreground border-t-foreground rounded-full animate-spin"></div>
                        ) : (
                          <strong className="text-foreground">{qrLeft}</strong>
                        )
                      )}
                    </span>
                    {activeTab === "shorten" ? "links left this month" : "QR codes left this month"}
                  </span>
                ) : (
                  <div className="mt-2 font-one text-sm sm:text-base text-muted-foreground text-center">
                    <div className="flex flex-col sm:flex-row items-center gap-1.5 justify-center">
                      <span>Tip: <button onClick={() => router.push("/auth/signin")} className="text-foreground underline underline-offset-2 cursor-pointer hover:text-blue-500 transition-colors font-medium">Sign in</button> to unlock advanced features</span>
                    </div>
                    <p className="text-xs mt-2 opacity-70">Guest limit: 1 link/day</p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>

      <Features isLoggedIn={isLoggedIn} userPlan={userPlan} />
      <div className="w-full h-px bg-border my-12 shadow-sm"></div>

      {userPlan !== "ESSENTIAL" && userPlan !== "PRO" && <PricingSection />}
      <FaqSection />

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
      <LiveOn />
      <Footer />
    </div>
  );
}