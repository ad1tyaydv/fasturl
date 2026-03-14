'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";


const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function HomePage() {
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

      setShortUrl(res.data.shortUrl);
      setUrl("");

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");

        if (!res.data.authenticated) {
          router.push("/auth/signin");
        } else {
          setIsLoggedIn(true);
        }

      } catch {
        router.push("/auth/signin");
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    setIsLoggedIn(false);
  };

  return (
    <div className="bg-white min-h-screen">

      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <h1 className="text-xl font-semibold text-black">
          SHORTLY
        </h1>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="border border-black text-black px-4 py-1.5 rounded-md hover:bg-black hover:text-white transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/auth/signin")}
            className="border border-black text-black px-4 py-1.5 rounded-md hover:bg-black hover:text-white transition"
          >
            Login
          </button>
        )}
      </nav>

      <section className="flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-2xl w-full">

          <h1 className="text-5xl font-bold text-black mb-4">
            Shorten Your Links Instantly
          </h1>

          <p className="text-gray-600 mb-8">
            Turn long and messy URLs into short, clean links you can easily share.
          </p>

          <div className="flex gap-2 border border-gray-300 rounded-lg p-2">
            <input
              type="text"
              placeholder="Paste your long URL here..."
              className="flex-1 outline-none px-3 py-2 text-black"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900 cursor-pointer flex items-center justify-center"
              onClick={() => handleShortUrl(url)}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Shorten"
              )}
            </button>
          </div>

          <div className="mt-6 border border-gray-300 rounded-lg p-8 flex items-center justify-between">

            {shortUrl ? (
              <>
                <span className="text-black font-medium">
                  short.ly/{shortUrl}
                </span>

                <button
                  onClick={copyToClipboard}
                  className="text-gray-600 hover:text-black cursor-pointer"
                >
                  <FiCopy size={20} />
                </button>
              </>
            ) : (
              <span className="text-gray-500">
                Your short url will be generated here
              </span>
            )}

          </div>

          <p className="text-sm text-gray-500 mt-4">
            Free. Fast. No signup required.
          </p>

        </div>
      </section>

      {copied && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-1 bg-black text-white px-4 py-2 rounded-md shadow-lg text-sm">
          URL Copied!
        </div>
      )}

    </div>
  );
}