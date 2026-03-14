"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCopyOutline, IoRefreshOutline, IoArrowForwardOutline } from "react-icons/io5";

const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function Dashboard() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = () => {
    const fullUrl = `${NEXT_DOMAIN}/${shortUrl}`;
    navigator.clipboard.writeText(fullUrl);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setShortUrl("");
    setUrl("");
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

        if (!res.data.authenticated) {
          setIsLoggedIn(false);

        } else {
          setIsLoggedIn(true);
        }
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
    <div className="bg-white min-h-screen">
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b">
        <h1 className="text-lg sm:text-xl font-semibold text-black">SHORTLY</h1>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="border border-black text-black px-4 py-1.5 rounded-md hover:bg-black hover:text-white transition cursor-pointer font-medium text-sm sm:text-base"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/auth/signin")}
            className="border border-black text-black px-4 py-1.5 rounded-md hover:bg-black hover:text-white transition font-medium cursor-pointer text-sm sm:text-base"
          >
            Login
          </button>
        )}
      </nav>

      <section className="flex flex-col items-center justify-center px-4 sm:px-6 pt-16 md:pt-24 pb-12">
        <div className="text-center max-w-3xl w-full mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
            Shorten Your Links Instantly
          </h1>

          <p className="text-gray-600 mb-8 text-base sm:text-lg px-2">
            Turn long and messy URLs into short, clean links you can easily share.
          </p>

          <div className={`flex flex-col sm:flex-row gap-3 border-2 rounded-xl p-2 sm:p-3 transition-colors shadow-sm ${shortUrl ? 'border-black bg-gray-50' : 'border-gray-300 bg-white'}`}>
            <input
              type="text"
              placeholder="Paste your long URL here..."
              className={`flex-1 w-full outline-none px-3 sm:px-4 py-3 bg-transparent text-base sm:text-lg text-center sm:text-left ${shortUrl ? 'text-black font-semibold' : 'text-black'}`}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (shortUrl) {
                  setShortUrl("");
                }
              }}
              onKeyDown={handleKeyDown}
            />

            {shortUrl ? (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  className="flex-1 sm:flex-none bg-black text-white px-4 sm:px-8 py-3 rounded-lg hover:bg-gray-800 cursor-pointer flex items-center justify-center gap-2 transition font-medium"
                  onClick={copyToClipboard}
                >
                  <IoCopyOutline size={20} />
                  Copy
                </button>
                
                <button
                  className="bg-gray-200 text-gray-700 px-4 sm:px-5 py-3 rounded-lg hover:bg-gray-300 hover:text-black cursor-pointer flex items-center justify-center transition shrink-0"
                  onClick={handleReset}
                  title="Shorten a new link"
                >
                  <IoRefreshOutline size={22} />
                </button>
              </div>
            ) : (
              <button
                className="w-full sm:w-auto bg-black text-white px-6 sm:px-10 py-3 rounded-lg hover:bg-gray-900 cursor-pointer flex items-center justify-center transition disabled:opacity-70 font-medium text-base sm:text-lg"
                onClick={() => handleShortUrl(url)}
                disabled={loading || !url}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Shorten"
                )}
              </button>
            )}
          </div>

          {!isLoggedIn && (
            <div className="mt-4 flex flex-col items-center justify-center text-sm sm:text-base md:text-xl">
              <p className="text-gray-800">You can only create 3 links/day</p>
              <button 
                onClick={() => router.push("/auth/signin")}
                className="text-black font-semibold mt-1 hover:underline cursor-pointer"
              >
                Login to create more
              </button>
            </div>
          )}

        </div>
      </section>

      <section className="flex flex-col items-center justify-center px-4 sm:px-6 pb-8">
        <div className="mt-2 border-t border-gray-200 pt-8 md:pt-12 w-full max-w-3xl flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3">Manage Your Links</h2>
          <p className="text-gray-900 mb-6 text-sm sm:text-base px-2">See all your previously shortened URLs, copy them, or delete the ones you no longer need.</p>
          
          <button
            onClick={() => router.push('/urls')} 
            className="w-full sm:w-auto group flex justify-center items-center gap-2 border-2 border-black text-black px-6 sm:px-8 py-3 rounded-lg hover:bg-black hover:text-white transition cursor-pointer font-semibold text-base sm:text-lg"
          >
            See all your short URLs
            <IoArrowForwardOutline size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {copied && (
        <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 mt-1 bg-black text-white px-6 py-2 rounded-md shadow-lg text-xs sm:text-sm z-50 animate-bounce">
          URL Copied!
        </div>
      )}

    </div>
  );
}