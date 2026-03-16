"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  IoCopyOutline, 
  IoRefreshOutline, 
  IoArrowForwardOutline,
  IoLinkOutline,
  IoQrCodeOutline
} from "react-icons/io5";
import { ModeToggle } from "./components/toggleTheme";


const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function Dashboard() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState<string | boolean>(false);


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

    } catch (error) {
      console.log("Can't short url", error);

    } finally {
      setLoading(false);
    }
  };


  const handleGenerateQr = async () => {
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

    } catch (error) {
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
    <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">
      
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
            Shorten Your Links Instantly
          </h1>
          <p className="mb-8 font-two text-base sm:text-lg px-2 text-muted-foreground">
            Turn long and messy URLs into short, clean links you can easily share.
          </p>

          <div className={`flex flex-col sm:flex-row gap-3 border-2 rounded-xl p-2 sm:p-3 transition-colors shadow-sm bg-card ${
            shortUrl ? 'border-primary' : 'border-border'
          }`}>
            <input
              type="text"
              placeholder="Paste your long URL here..."
              className={`flex-1 w-full outline-none font-one px-3 sm:px-4 py-3 bg-transparent text-base sm:text-lg text-center sm:text-left text-foreground placeholder:text-muted-foreground ${
                shortUrl ? 'font-semibold' : ''
              }`}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (shortUrl) setShortUrl("");
              }}
              onKeyDown={handleKeyDown}
            />

            {shortUrl ? (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  className={`px-4 sm:px-5 py-3 rounded-lg cursor-pointer flex items-center justify-center transition shrink-0 ${
                    showQr ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                  onClick={() => handleGenerateQr()}
                  title="Generate QR Code"
                >
                  <IoQrCodeOutline size={22} />
                </button>

                <button
                  className="flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={copyToClipboard}
                >
                  <IoCopyOutline size={20} />
                  Copy
                </button>
                
                <button
                  className="px-4 sm:px-5 py-3 rounded-lg cursor-pointer flex items-center justify-center transition shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  onClick={handleReset}
                  title="Shorten a new link"
                >
                  <IoRefreshOutline size={22} />
                </button>
              </div>
            ) : (
              <button
                className="w-full sm:w-auto px-6 sm:px-10 py-3 rounded-lg cursor-pointer flex items-center justify-center transition disabled:opacity-50 font-medium text-base sm:text-lg bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handleShortUrl(url)}
                disabled={loading || !url}
              >
                {loading ? (
                  <div className="w-6 h-6 font-two border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Shorten"
                )}
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
              <p>You can only create 3 links/day</p>
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
          <p className="mb-6 font-three text-sm sm:text-base px-2 text-muted-foreground">
            See all your previously shortened URLs, copy them, or delete the ones you no longer need.
          </p>
          <button
            onClick={() => router.push('/urls')} 
            className="w-full font-one sm:w-auto group flex justify-center items-center gap-2 border-2 border-input bg-background px-6 sm:px-8 py-3 rounded-lg transition cursor-pointer font-semibold text-base sm:text-lg hover:bg-accent hover:text-accent-foreground"
          >
            See all your short URLs
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

      {copied && (
        <div className="fixed font-two top-20 sm:top-24 left-1/2 -translate-x-1/2 mt-1 px-6 py-2 rounded-md shadow-lg text-xs sm:text-sm z-50 animate-bounce bg-primary text-primary-foreground">
          URL Copied!
        </div>
      )}
    </div>
  );
}