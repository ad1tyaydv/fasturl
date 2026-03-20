"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { 
  IoRefreshOutline, 
  IoArrowForwardOutline,
  IoCloseOutline,
  IoCheckmarkCircle,
  IoDownloadOutline,
} from "react-icons/io5";
import { ModeToggle } from "../../components/toggleTheme";
import PricingSection from "@/app/components/PricingSection";
import FaqSection from "@/app/components/faqSection";
import TotalData from "@/app/components/totalData";
import Footer from "@/app/components/footer";


export default function QRGenerator() {
  const router = useRouter();
  const pricingRef = useRef<HTMLDivElement>(null);

  const [url, setUrl] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPlan, setUserPlan] = useState("FREE");
  const [qrsLeft, setQrsLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showQr, setShowQr] = useState<string | null>(null);
  const [upgradeMsg, setUpgradeMsg] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

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

      const count = await axios.get("/api/shortUrl/linksLeft");
      setQrsLeft(count.data.linksLeft);

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
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        const count = await axios.get("/api/qrCode/qrLeft");
        
        const authenticated = !!res.data.authenticated;
        setIsLoggedIn(authenticated);
        setQrsLeft(count.data.qrLeft);
        console.log(count.data);

        if (authenticated) {
          setUserPlan(res.data.plan || "FREE");
        }

      } catch {
        setIsLoggedIn(false);
      }
      finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
    
  }, [router]);

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    setIsLoggedIn(false);
    setUserPlan("FREE");
    setQrsLeft(0);
  };


  return (
    <div className="min-h-screen transition-colors duration-300 bg-background text-foreground relative">
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
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`bg-card border-2 border-border p-6 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 ${modalConfig.showPlans ? 'max-w-4xl w-full' : 'max-w-sm w-full'}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold font-one">{modalConfig.title}</h3>
              <button 
                onClick={() => setModalConfig({ ...modalConfig, show: false })}
                className="p-1 hover:bg-accent rounded-full transition-colors cursor-pointer"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>
            <p className="text-muted-foreground font-two mb-6">
              {modalConfig.description}
            </p>

            {modalConfig.showPlans ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border-2 border-primary/30 rounded-xl p-5 bg-background relative overflow-hidden text-left">
                  <div className="absolute top-2 right-2 bg-primary text-[10px] text-primary-foreground px-2 py-0.5 rounded-full font-bold text-center">POPULAR</div>
                  <h4 className="font-bold text-lg mb-1">Essentials</h4>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold">$6</span>
                    <span className="text-muted-foreground text-sm">/mo</span>
                  </div>
                  <ul className="text-sm space-y-2 mb-6">
                    <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-primary"/> 200 Links / Mo</li>
                    <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-primary"/> 20 QR Codes / Mo</li>
                  </ul>
                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition cursor-pointer">Upgrade Essentials</button>
                </div>

                <div className="border border-border rounded-xl p-5 bg-background text-left">
                  <h4 className="font-bold text-lg mb-1">Premium</h4>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold">$299</span>
                    <span className="text-muted-foreground text-sm">/mo</span>
                  </div>
                  <ul className="text-sm space-y-2 mb-6">
                    <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-primary"/> Unlimited Links</li>
                    <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-primary"/> 500 QR Codes / Mo</li>
                  </ul>
                  <button className="w-full py-2 bg-secondary text-secondary-foreground rounded-lg font-bold hover:bg-secondary/80 transition cursor-pointer">Go Premium</button>
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

      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-border">
        <h1 className="text-lg font-three sm:text-xl">SHORTLY</h1>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="border font-one border-input px-4 py-1.5 rounded-md transition cursor-pointer text-sm sm:text-base hover:bg-accent hover:text-accent-foreground"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth/signin")}
              className="border font-one border-input px-4 py-1.5 rounded-md transition cursor-pointer font-medium text-sm sm:text-base hover:bg-accent hover:text-accent-foreground"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center px-4 sm:px-6 pt-16 md:pt-24 pb-12">
        <div className="text-center max-w-3xl w-full mx-auto">
          <h1 className="text-3xl font-one sm:text-4xl md:text-5xl font-bold mb-4">
            Generate <span className="text-red-500">QR Codes</span> Instantly
          </h1>
          <p className="mb-8 font-two text-base sm:text-lg px-2 text-muted-foreground">
            Transform any URL into a high-quality, shareable QR code instantly.
          </p>

          <div className={`flex flex-col sm:flex-row gap-3 border-2 rounded-xl p-2 sm:p-3 transition-colors shadow-sm bg-card ${
            showQr ? 'border-primary' : 'border-border'
          }`}>
            <input
              type="text"
              placeholder="Enter URL to generate QR..."
              className="flex-1 w-full outline-none font-one px-3 sm:px-4 py-3 bg-transparent text-base sm:text-lg text-center sm:text-left text-foreground placeholder:text-muted-foreground"
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
                    className="flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={downloadQr}
                  >
                    <IoDownloadOutline size={20} />
                    Download
                  </button>
                  <button
                    className="px-4 sm:px-5 py-3 rounded-lg cursor-pointer flex items-center justify-center transition shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    onClick={handleReset}
                    title="Generate another"
                  >
                    <IoRefreshOutline size={22} />
                  </button>
                </>
              ) : (
                <button
                  className="w-full sm:w-auto px-6 sm:px-10 py-3 rounded-lg cursor-pointer flex items-center justify-center transition disabled:opacity-50 font-medium text-base sm:text-lg bg-primary text-primary-foreground hover:bg-primary/90"
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

          {isLoggedIn && (
            <div className="mt-4 text-center animate-in fade-in slide-in-from-top-2">
              <span className="px-3 py-1.5 bg-secondary/50 border border-border text-sm font-medium text-muted-foreground rounded-lg">
                {userPlan === "FREE" ? (
                  <>You have <strong className="text-foreground">{qrsLeft}</strong> QR codes left for today</>
                ) : (
                  <>You have <strong className="text-foreground">{qrsLeft}</strong> QR codes left this month</>
                )}
              </span>
            </div>
          )}

          {showQr && (
            <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-border">
                <img src={showQr} alt="Generated QR Code" className="w-48 h-48 object-contain" />
              </div>
              <p className="mt-4 text-sm font-three font-semibold text-primary">✓ Your QR code is ready for download!</p>
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

      <section className="flex flex-col items-center justify-center px-4 sm:px-6 py-12 mt-12">
        <div className="w-full max-w-3xl flex flex-col items-center text-center">
          <h2 className="text-2xl font-three sm:text-3xl font-bold mb-3">Manage Your QR</h2>
          <p className="mb-6 font-three text-sm sm:text-base px-2 text-muted-foreground">
            Access your library of generated QR codes and short links in one place.
          </p>
          <button
            onClick={() => router.push('/urls')} 
            className="w-full font-one sm:w-auto group flex justify-center items-center gap-2 border-2 border-input bg-background px-6 sm:px-8 py-3 rounded-lg transition cursor-pointer font-semibold text-base sm:text-lg hover:bg-accent hover:text-accent-foreground"
          >
            See all your QRs
            <IoArrowForwardOutline size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="w-full border-t border-border mt-8"></div>
        </div>
      </section>

      <div ref={pricingRef}>
        <PricingSection />
      </div>

      {upgradeMsg && (
        <div className="fixed font-two bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full shadow-2xl text-sm sm:text-base z-50 animate-in slide-in-from-bottom-4 fade-in duration-300 bg-black text-white dark:bg-white dark:text-black font-bold border border-border">
          Upgrade to generate more!
        </div>
      )}

      <div className="w-full h-px bg-gray-300 my-6"></div>

      <FaqSection />
      <div className="w-full h-px bg-gray-300 my-6"></div>
      
      <TotalData />

      <Footer />      
    </div>
  );
}