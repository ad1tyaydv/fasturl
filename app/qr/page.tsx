"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  IoCopyOutline, 
  IoRefreshOutline, 
  IoArrowForwardOutline,
  IoQrCodeOutline,
  IoCloseOutline,
  IoCheckmarkCircle,
  IoDownloadOutline,
  IoLinkOutline
} from "react-icons/io5";
import { ModeToggle } from "../components/toggleTheme";

export default function QRGenerator() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showQr, setShowQr] = useState<string | null>(null);

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

    } catch (error: any) {
      if (error.response?.status === 429) {
        setModalConfig({
          show: true,
          title: "Upgrade Your Plan",
          description: "You've reached your daily QR code limit. Upgrade to unlock unlimited generations.",
          buttonText: "Close",
          action: () => setModalConfig(prev => ({ ...prev, show: false })),
          showPlans: true,
        });
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`bg-card border-2 border-border p-6 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 ${modalConfig.showPlans ? 'max-w-4xl w-full' : 'max-w-sm w-full'}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold font-one">{modalConfig.title}</h3>
              <button 
                onClick={() => setModalConfig({ ...modalConfig, show: false })}
                className="p-1 hover:bg-accent rounded-full transition-colors"
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
                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition">Upgrade Essentials</button>
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
                  <button className="w-full py-2 bg-secondary text-secondary-foreground rounded-lg font-bold hover:bg-secondary/80 transition">Go Premium</button>
                </div>
              </div>
            ) : (
              <button 
                onClick={modalConfig.action}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold transition hover:opacity-90 active:scale-95"
              >
                {modalConfig.buttonText}
              </button>
            )}
          </div>
        </div>
      )}

      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-border">
        <h1 className="text-lg font-three sm:text-xl">SHORTLY</h1>
        <div className="flex items-center gap-4 cursor-pointer">
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
            Generate QR Codes
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

          {showQr && (
            <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-border">
                <img src={showQr} alt="Generated QR Code" className="w-48 h-48 object-contain" />
              </div>
              <p className="mt-4 text-sm font-three font-semibold text-primary">✓ Your QR code is ready for download!</p>
            </div>
          )}

          {!isLoggedIn && (
            <div className="mt-6 flex font-two flex-col items-center justify-center text-sm sm:text-base text-muted-foreground">
              <p>Sign in to download and save your QR codes</p>
              <button 
                onClick={() => router.push("/auth/signin")}
                className="font-semibold font-two mt-1 hover:underline cursor-pointer text-foreground"
              >
                Login now
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col items-center justify-center px-4 sm:px-6 py-12 border-t border-border mt-12">
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
        </div>
      </section>

      <section className="px-4 sm:px-8 py-16 md:py-24 max-w-7xl mx-auto flex flex-col xl:flex-row gap-12 xl:gap-10 items-center xl:items-start">
        <div className="xl:w-1/3 text-center xl:text-left pt-2">
          <h2 className="text-3xl font-one sm:text-4xl font-extrabold mb-5 leading-tight">
            Unlock the Full Potential of Your Links.
          </h2>
          <p className="text-muted-foreground font-two mb-5 text-base sm:text-lg">
            Stop guessing and start tracking. Whether you are a solo creator or a growing enterprise, our advanced tools deliver the insights you need to succeed.
          </p>
          <p className="text-muted-foreground font-two text-base sm:text-lg">
            Build brand trust with custom short domains and monitor global engagement in real-time.
          </p>
        </div>

        <div className="xl:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
          <div className="border border-border rounded-2xl p-6 bg-card flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-2xl font-bold text-center mb-4">Free</h3>
            <div className="text-center text-4xl font-extrabold mb-6">$0</div>
            <button className="w-full font-two bg-foreground text-background py-2.5 rounded-lg font-semibold text-sm sm:text-base mb-6 transition hover:bg-foreground/90 cursor-pointer">
              Start for free
            </button>
            <ul className="space-y-4 text-sm font-medium flex-1">
              <li className="flex items-center">
                <span className="bg-[#facc15] font-two text-black px-2.5 py-1 rounded flex items-center gap-2 font-bold shadow-sm">
                  <IoLinkOutline size={16} /> 3 Links/Day
                </span>
              </li>
              <li className="flex font-two items-center gap-2.5 px-1 text-muted-foreground">
                <IoQrCodeOutline size={18} className="text-foreground"/> 1 QR Code/Day
              </li>
            </ul>
          </div>

          <div className="relative md:scale-105 z-10 flex flex-col">
            <div className="animate-gentle-shake border-2 border-primary/50 bg-card rounded-2xl p-6 flex flex-col shadow-xl dark:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] hover:-translate-y-1 transition-transform duration-300 h-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-foreground mt-2">Essentials</h3>
              <div className="text-center mb-6 flex justify-center items-end gap-2.5">
                <span className="line-through decoration-red-500 decoration-2 text-muted-foreground text-2xl font-bold mb-0.5">$15</span>
                <span className="text-5xl font-extrabold text-foreground">$6<span className="text-lg font-bold text-muted-foreground">/mo</span></span>
              </div>
              <button className="w-full font-two bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 rounded-lg font-semibold text-sm sm:text-base mb-6 transition shadow-sm cursor-pointer">
                Upgrade Now
              </button>
              <ul className="space-y-4 text-sm font-medium flex-1">
                <li className="flex items-center">
                  <span className="bg-[#facc15] font-two text-black px-2.5 py-1 rounded flex items-center gap-2 font-bold shadow-sm">
                    <IoLinkOutline size={16} /> 200 Links/Mo
                  </span>
                </li>
                <li className="flex items-center gap-2.5 px-1 text-muted-foreground">
                  <IoQrCodeOutline size={18} className="font-two text-foreground"/> 20 QR Codes/Mo
                </li>
              </ul>
            </div>
          </div>

          <div className="border border-border rounded-2xl p-6 bg-card flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-2xl font-bold text-center mb-4">Premium</h3>
            <div className="text-center mb-6 flex justify-center items-end gap-2.5">
              <span className="line-through decoration-red-500 decoration-2 text-muted-foreground text-xl font-bold mb-1">$499</span>
              <span className="text-4xl font-extrabold">$299<span className="text-lg font-bold text-muted-foreground">/mo</span></span>
            </div>
            <button className="w-full font-two bg-secondary text-secondary-foreground py-2.5 rounded-lg font-semibold text-sm sm:text-base mb-6 transition hover:bg-secondary/80 cursor-pointer">
              Go Premium
            </button>
            <ul className="space-y-4 text-sm font-medium flex-1">
              <li className="flex items-center">
                <span className="bg-[#facc15] font-two text-black px-2.5 py-1 rounded flex items-center gap-2 font-bold shadow-sm">
                  <IoLinkOutline size={16} /> Unlimited Links
                </span>
              </li>
              <li className="flex items-center gap-2.5 px-1 text-muted-foreground">
                <IoQrCodeOutline size={18} className="font-two text-foreground"/> 500 QR Codes/Mo
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}