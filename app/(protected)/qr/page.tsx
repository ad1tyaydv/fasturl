"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { 
  IoRefreshOutline,
  IoCloseOutline,
  IoCheckmarkCircle,
  IoDownloadOutline,
} from "react-icons/io5";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Refresh04Icon, Download01Icon, 
  ArrowRight01Icon}
  from '@hugeicons/core-free-icons';

import Navbar from "@/app/components/navbar";
import PricingSection from "@/app/components/PricingSection";
import FaqSection from "@/app/components/faqSection";
import TotalData from "@/app/components/totalData";
import Features from "@/app/components/features";
import Footer from "@/app/components/footer";
import { Button } from "@/components/ui/button";
import QrDownloadModal from "@/app/modals/qrDownloadModal";


import { useUser } from "@/app/components/userContext";

export default function QRGenerator() {
  const router = useRouter();
  const pricingRef = useRef<HTMLDivElement>(null);
  const { user, loading: authLoading } = useUser();

  const [url, setUrl] = useState("");
  const isLoggedIn = !!user;
  const userPlan = user?.plan || "FREE";
  const [qrsLeft, setQrsLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQr, setShowQr] = useState<string | null>(null);
  const [upgradeMsg, setUpgradeMsg] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

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
    action: () => {},
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


  const handleGenerateQr = async () => {
    if (!url) return;

    if (!isLoggedIn) {
      setModalConfig({
        show: true,
        title: "Login Required",
        description: "Login to generate high-quality QR codes for your links.",
        buttonText: "Login Now",
        action: () => router.push("/auth/signin"),
        showPlans: false,
      });

      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("/api/qrCode", {
        shortUrl: url, 
        longUrl: url
      });

      setShowQr(res.data.qrImage);

      const count = await axios.get("/api/qrCode/qrLeft");
      setQrsLeft(count.data.qrLeft);

    } catch (error: any) {
      if (error.response?.status === 429) {
        slowScrollToPricing();
      }
      console.log("Error while generating qr code", error);

    } finally {
      setLoading(false);
    }
  };


  const downloadQr = () => {
    if (!showQr) return;
    const link = document.createElement("a");
    link.href = showQr;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleReset = () => {
    setUrl("");
    setShowQr(null);
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && url && !loading) {
      handleGenerateQr();
    }
  };


  useEffect(() => {
    const fetchQrLeft = async () => {
      if (user) {
        try {
          const count = await axios.get("/api/qrCode/qrLeft");
          setQrsLeft(count.data.qrLeft);
        } catch (error) {
          console.error("Error fetching qrLeft", error);
        }
      } else {
        setQrsLeft(null);
      }
    };

    fetchQrLeft();
  }, [user]);


  return (
    <div className="min-h-screen transition-colors duration-300 bg-background text-foreground relative">
      <Navbar />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gentleShake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-0.5deg); }
          75% { transform: rotate(0.5deg); }
        }
        .animate-gentle-shake {
          animation: gentleShake 3s infinite ease-in-out;
        }
      `}} />

      {modalConfig.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`bg-popover border border-border p-6 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 ${modalConfig.showPlans ? 'max-w-4xl w-full' : 'max-w-sm w-full'}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold font-one text-foreground">{modalConfig.title}</h3>
              <button 
                onClick={() => setModalConfig({ ...modalConfig, show: false })}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors cursor-pointer"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>
            <p className="text-muted-foreground font-two mb-6">
              {modalConfig.description}
            </p>

            {modalConfig.showPlans ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border border-blue-600/50 rounded-xl p-5 bg-background relative overflow-hidden text-left shadow-lg shadow-blue-900/10">
                  <div className="absolute top-2 right-2 bg-blue-600 text-[10px] text-white px-2 py-0.5 rounded-full font-bold text-center">POPULAR</div>
                  <h4 className="font-bold text-lg mb-1 text-foreground">Essentials</h4>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold text-foreground">$6</span>
                    <span className="text-muted-foreground text-sm">/mo</span>
                  </div>
                  <ul className="text-sm space-y-2 mb-6 text-foreground/80">
                    <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-blue-500"/> 200 Links / Mo</li>
                    <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-blue-500"/> 20 QR Codes / Mo</li>
                  </ul>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition cursor-pointer">Upgrade Essentials</button>
                </div>

                <div className="border border-border rounded-xl p-5 bg-background text-left">
                  <h4 className="font-bold text-lg mb-1 text-foreground">Premium</h4>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold text-foreground">$299</span>
                    <span className="text-muted-foreground text-sm">/mo</span>
                  </div>
                  <ul className="text-sm space-y-2 mb-6 text-foreground/80">
                    <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-muted-foreground"/> Unlimited Links</li>
                    <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-muted-foreground"/> 500 QR Codes / Mo</li>
                  </ul>
                  <button className="w-full py-2 bg-secondary text-foreground rounded-lg font-bold hover:bg-accent transition cursor-pointer">Go Premium</button>
                </div>
              </div>
            ) : (
              <button 
                onClick={modalConfig.action}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold transition hover:opacity-90 active:scale-95 cursor-pointer"
              >
                {modalConfig.buttonText}
              </button>
            )}
          </div>
        </div>
      )}

      <section className="flex flex-col items-center justify-center px-4 sm:px-6 pt-16 md:pt-24 pb-12">
        <div className="text-center max-w-3xl w-full mx-auto">
          <h1 className="text-3xl font-one sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Generate <span className="text-red-500">QR Codes</span> Instantly
          </h1>
          <p className="mb-8 font-one sm:text-lg px-2 text-muted-foreground">
            Transform any URL into a high-quality, shareable QR code instantly.
          </p>

          <div className={`flex flex-col sm:flex-row gap-3 border rounded-xl p-2 sm:p-3 transition-colors shadow-sm bg-secondary/50 ${
            showQr ? 'border-blue-500' : 'border-border'
          }`}>
            <input
              type="text"
              placeholder="Enter URL to generate QR..."
              className="flex-1 w-full outline-none font-one px-3 sm:px-4 py-3 bg-transparent text-base sm:text-lg text-center sm:text-left text-foreground placeholder:text-muted-foreground/50"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (showQr) setShowQr(null);
              }}
              onKeyDown={handleKeyDown}
            />

            <div className="flex gap-2 w-full sm:w-auto">
              {showQr ? (
                <>
                  <button
                    className="px-4 sm:px-5 py-3 rounded-lg cursor-pointer flex items-center justify-center transition shrink-0 bg-secondary text-foreground hover:bg-accent border border-border"
                    onClick={handleReset}
                    title="Generate another"
                  >
                    <HugeiconsIcon icon={Refresh04Icon} />
                  </button>
                </>
              ) : (
                <button
                  className="w-full sm:w-auto px-6 sm:px-10 py-3 rounded-lg cursor-pointer flex items-center justify-center transition disabled:opacity-50 font-medium text-base sm:text-lg bg-primary text-primary-foreground hover:opacity-90 shadow-md"
                  onClick={handleGenerateQr}
                  disabled={loading || !url}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Generate"
                  )}
                </button>
              )}
            </div>
          </div>

          {(isLoggedIn || authLoading) && (
            <div className="mt-4 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-2">
              <span className="px-3 py-1.5 bg-secondary border border-border text-sm font-medium text-muted-foreground rounded-lg inline-flex items-center gap-1.5 shadow-sm">
                You have 
                <span className="inline-flex items-center justify-center min-w-[20px]">
                  {qrsLeft === null ? (
                    <div className="w-3 h-3 border-2 border-muted-foreground border-t-foreground rounded-full animate-spin"></div>
                  ) : (
                    <strong className="text-foreground">{qrsLeft}</strong>
                  )}
                </span>
                QR codes left this month
              </span>

              {isLoggedIn && (
                <button
                  onClick={() => router.push('/links?types=qr')}
                  className="flex items-center justify-between gap-3 px-6 py-2.5 bg-secondary hover:bg-accent border border-border rounded-xl transition-all group cursor-pointer"
                >
                  <span className="font-semibold text-sm text-muted-foreground group-hover:text-foreground">Manage your QR codes</span>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all"
                    size={18}
                  />
                </button>
              )}
            </div>
          )}

          {showQr && (
            <div className="mt-10 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-white p-4 rounded-xl shadow-2xl border border-border mb-6">
                <img src={showQr} alt="Generated QR Code" className="w-52 h-52 object-contain" />
              </div>
              
              <Button
                onClick={() => setIsDownloadModalOpen(true)}
                className="bg-primary text-primary-foreground hover:opacity-90 font-one px-5 py-5 rounded-xl text-lg shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <HugeiconsIcon icon={Download01Icon}/>
                Download
              </Button>

              <QrDownloadModal
                isOpen={isDownloadModalOpen}
                onClose={() => setIsDownloadModalOpen(false)}
                qrData={{
                  qrImage: showQr,
                  shortUrl: url,
                  longUrl: url,
                  qrName: "qr-code"
                }}
              />
            </div>
          )}

          {!authLoading && !isLoggedIn && (
            <div className="mt-6 flex font-one flex-col items-center justify-center text-sm sm:text-base text-muted-foreground">
              <p>Sign in to download and save your QR codes</p>
              <button 
                onClick={() => router.push("/auth/signin")}
                className="font-semibold font-one mt-1 hover:underline cursor-pointer text-foreground"
              >
                Login now
              </button>
            </div>
          )}
        </div>
      </section>

      <Features isLoggedIn={isLoggedIn} userPlan={userPlan} />

      {(!isLoggedIn || userPlan === "FREE") && (
        <div ref={pricingRef}>
          <PricingSection />
        </div>
      )}

      {upgradeMsg && (
        <div className="fixed font-two bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full shadow-2xl text-sm sm:text-base z-50 animate-in slide-in-from-bottom-4 fade-in duration-300 bg-primary text-primary-foreground font-bold border border-transparent">
          Upgrade to generate more!
        </div>
      )}

      <div className="w-full h-px bg-border my-6"></div>

      <FaqSection />
      
      <TotalData />

      <Footer />      
    </div>
  );
}