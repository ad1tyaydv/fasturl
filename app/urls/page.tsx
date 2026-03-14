"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { IoCopyOutline, IoHomeOutline, IoListOutline, IoSettingsOutline, IoPersonOutline } from "react-icons/io5";

interface UrlItem {
  id: string;
  original: string;
  shorturl: string;
}


const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function AllUrlsPage() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<"original" | "short" | null>(null);

  
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
  }, [router]);


  const fetchUrls = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/fetchUrls", {
        params: { t: new Date().getTime() },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });

      setUrls(res.data.urls.reverse());

    } catch (err) {

      console.log("Error fetching URLs:", err);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUrls();
  }, []);


  const copyToClipboard = (url: string, id: string, type: "original" | "short") => {
    navigator.clipboard.writeText(url);
    setCopiedUrlId(id);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedUrlId(null);
      setCopiedType(null);
    }, 2000);

  };


  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/shortUrl/delete${id}`);
      setUrls(urls.filter((u) => u.id !== id));

    } catch (err) {
      console.log("Error deleting URL:", err);
    }
  };

  
  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    setIsLoggedIn(false);
    router.push("/auth/signin");
  };

  
  return (
    <div className="bg-white h-screen flex flex-col overflow-hidden">
      
      <nav className="flex items-center justify-between px-8 py-4 border-b z-20 bg-white shrink-0">
        <h1 className="text-xl font-semibold text-black">SHORTLY</h1>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="border border-black text-black px-4 py-1.5 rounded-md hover:bg-black hover:text-white transition cursor-pointer font-medium"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/auth/signin")}
            className="border border-black text-black px-4 py-1.5 rounded-md hover:bg-black hover:text-white transition font-medium"
          >
            Login
          </button>
        )}
      </nav>

      <div className="flex flex-1 overflow-hidden">
        
        <aside className="w-64 border-r bg-gray-50 flex flex-col py-6 px-4 shrink-0 hidden md:flex">
          
          <div>
            <p className="text-xs font-bold text-gray-400 mb-4 px-2 uppercase tracking-wider">Menu</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push('/dashboard')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                  pathname === '/dashboard' 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-black'
                }`}
              >
                <IoHomeOutline size={20} />
                Dashboard
              </button>
              
              <button
                onClick={() => router.push('/urls')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                  pathname === '/urls' 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-black'
                }`}
              >
                <IoListOutline size={20} />
                My URLs
              </button>
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-xs font-bold text-gray-400 mb-4 px-2 uppercase tracking-wider">Account</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => console.log('Profile clicked')} 
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition text-gray-600 hover:bg-gray-200 hover:text-black cursor-pointer"
              >
                <IoPersonOutline size={20} />
                Profile
              </button>

              <button
                onClick={() => console.log('Settings clicked')} 
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition text-gray-600 hover:bg-gray-200 hover:text-black cursor-pointer"
              >
                <IoSettingsOutline size={20} />
                Settings
              </button>
            </div>
          </div>
          
        </aside>

        <main className="flex-1 overflow-y-auto bg-white p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-black">Your Saved URLs</h1>
              <span className="px-3 bg-gray-200 rounded-xl py-1 text-xl font-medium">
                Total Links - {urls.length}
              </span>
            </div>

            {loading && urls.length === 0 ? (
              <div className="flex justify-center mt-24">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
              </div>
            ) : urls.length === 0 ? (
              <div className="text-center mt-16 p-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                <p className="text-gray-500 text-lg mb-6">You haven't saved any URLs yet.</p>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  Shorten your first link
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5 pb-16">
                {urls.map((url) => (
                  <div
                    key={url.id}
                    className="border border-gray-200 p-6 rounded-xl flex items-center justify-between gap-6 hover:shadow-md hover:border-gray-300 transition bg-white"
                  >
                    <div className="flex flex-col gap-3 w-full overflow-hidden">
                      
                    <div className="flex items-center gap-3">
                        <div className="truncate text-black text-lg">
                            <strong>Short Url - </strong> 
                            <span className="font-normal">{NEXT_DOMAIN}/{url.shorturl}</span>
                        </div>
                        <button onClick={() => copyToClipboard(`${NEXT_DOMAIN}/${url.shorturl}`, url.id, "short")} className="shrink-0">
                            <IoCopyOutline size={22} className="text-gray-400 hover:text-black transition cursor-pointer" />
                        </button>
                        {copiedUrlId === url.id && copiedType === "short" && (
                            <span className="text-gray-700 bg-green-50 px-2 py-0.5 rounded text-xs font-bold shrink-0">COPIED!</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="truncate text-black text-xl">
                            <strong>Original Url - </strong> 
                            <span className="font-normal">{url.original}</span>
                        </div>
                        <button onClick={() => copyToClipboard(url.original, url.id, "original")} className="shrink-0">
                            <IoCopyOutline size={22} className="text-gray-400 hover:text-black transition cursor-pointer" />
                        </button>
                            {copiedUrlId === url.id && copiedType === "original" && (
                                <span className="text-gray-700 bg-green-50 px-2 py-0.5 rounded text-xs font-bold shrink-0">COPIED!</span>
                            )}
                        </div>
  
                    </div>

                    <button
                      onClick={() => handleDelete(url.id)}
                      className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-100 px-6 py-2.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}