"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  IoCopyOutline, 
  IoHomeOutline, 
  IoListOutline, 
  IoSettingsOutline, 
  IoPersonOutline,
  IoQrCodeOutline,
  IoAnalyticsOutline
} from "react-icons/io5";

interface UrlItem {
  id: string;
  original: string;
  shorturl: string;
  clicks?: number;
  createdAt?: string;
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
  
  // Modal State
  const [selectedUrl, setSelectedUrl] = useState<UrlItem | null>(null);

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
    <div className="bg-white h-screen flex flex-col overflow-hidden relative">
      
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b z-20 bg-white shrink-0">
        <h1 
          className="text-lg sm:text-xl font-semibold text-black cursor-pointer" 
          onClick={() => router.push('/')}
        >
          SHORTLY
        </h1>

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

      <div className="flex flex-1 overflow-hidden pb-16 md:pb-0">
        
        <aside className="w-64 border-r bg-gray-50 flex-col py-6 px-4 shrink-0 hidden md:flex">
          <div>
            <p className="text-xs font-bold text-gray-400 mb-4 px-2 uppercase tracking-wider">Menu</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push('/')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                  pathname === '/'
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
                Links
              </button>

              <button
                onClick={() => router.push('/qrcodes')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                  pathname === '/qrcodes' 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-black'
                }`}
              >
                <IoQrCodeOutline size={20} />
                QR Codes
              </button>

              <button
                onClick={() => router.push('/analytics')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                  pathname === '/analytics' 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-black'
                }`}
              >
                <IoAnalyticsOutline size={20} />
                Analytics
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

        <main className="flex-1 overflow-y-auto bg-white p-4 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-black">Your Saved URLs</h1>
              <span className="px-3 bg-gray-200 rounded-xl py-1 text-base sm:text-xl font-medium w-fit">
                Total Links - {urls.length}
              </span>
            </div>

            {loading && urls.length === 0 ? (
              <div className="flex justify-center mt-24">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
              </div>
            ) : urls.length === 0 ? (
              <div className="text-center mt-10 sm:mt-16 p-8 sm:p-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                <p className="text-gray-500 text-base sm:text-lg mb-6">You haven't saved any URLs yet.</p>
                <button 
                  onClick={() => router.push('/')}
                  className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-medium cursor-pointer"
                >
                  Shorten your first link
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:gap-5 pb-16">
                {urls.map((url) => (
                  <div
                    key={url.id}
                    onClick={() => setSelectedUrl(url)}
                    className="border border-gray-200 p-4 sm:p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 hover:shadow-md hover:border-gray-300 transition bg-white cursor-pointer group"
                  >
                    <div className="flex flex-col gap-2 sm:gap-3 w-full overflow-hidden min-w-0">
                      
                      <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                        <div className="truncate text-black text-base sm:text-lg min-w-0 flex-1">
                            <strong>Short Url - </strong> 
                            <span className="font-normal">{NEXT_DOMAIN}/{url.shorturl}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(`${NEXT_DOMAIN}/${url.shorturl}`, url.id, "short");
                          }} 
                          className="shrink-0 cursor-pointer p-1"
                        >
                            <IoCopyOutline size={20} className="text-gray-400 hover:text-black transition" />
                        </button>
                        {copiedUrlId === url.id && copiedType === "short" && (
                            <span className="text-gray-700 bg-green-50 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold shrink-0">COPIED!</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                        <div className="truncate text-black text-sm sm:text-lg min-w-0 flex-1">
                            <strong>Original Url - </strong> 
                            <span className="font-normal">{url.original}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(url.original, url.id, "original");
                          }} 
                          className="shrink-0 cursor-pointer p-1"
                        >
                            <IoCopyOutline size={20} className="text-gray-400 hover:text-black transition" />
                        </button>
                        {copiedUrlId === url.id && copiedType === "original" && (
                            <span className="text-gray-700 bg-green-50 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold shrink-0">COPIED!</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(url.id);
                      }}
                      className="w-full md:w-auto mt-2 md:mt-0 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-100 px-6 py-2.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap shrink-0 opacity-100 md:opacity-80 group-hover:opacity-100"
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

      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center pb-safe z-30">
        <button
          onClick={() => router.push('/')}
          className={`flex flex-col items-center gap-1 py-3 px-2 ${pathname === '/' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
        >
          <IoHomeOutline size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        
        <button
          onClick={() => router.push('/urls')}
          className={`flex flex-col items-center gap-1 py-3 px-2 ${pathname === '/urls' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
        >
          <IoListOutline size={24} />
          <span className="text-[10px] font-medium">Links</span>
        </button>

        <button
          onClick={() => router.push('/qrcodes')}
          className={`flex flex-col items-center gap-1 py-3 px-2 ${pathname === '/qrcodes' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
        >
          <IoQrCodeOutline size={24} />
          <span className="text-[10px] font-medium">QR</span>
        </button>

        <button
          onClick={() => router.push('/analytics')}
          className={`flex flex-col items-center gap-1 py-3 px-2 ${pathname === '/analytics' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
        >
          <IoAnalyticsOutline size={24} />
          <span className="text-[10px] font-medium">Analytics</span>
        </button>

        <button
          onClick={() => console.log('Profile clicked')}
          className="flex flex-col items-center gap-1 py-3 px-2 text-gray-400 hover:text-black"
        >
          <IoPersonOutline size={24} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>

      {selectedUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4 cursor-pointer"
          onClick={() => setSelectedUrl(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform transition-all cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-5 sm:mb-6 border-b pb-4">Link Details</h3>
            
            <div className="space-y-5 sm:space-y-6 mb-6 sm:mb-8">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-widest mb-1">Total Clicks</p>
                <p className="text-3xl sm:text-4xl font-extrabold text-black">
                  {selectedUrl.clicks ?? 0}
                </p>
              </div>
              
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-widest mb-1">Created At</p>
                <p className="text-base sm:text-lg font-medium text-gray-800">
                  {selectedUrl.createdAt 
                    ? new Date(selectedUrl.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) 
                    : "Not Available"}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
                <button 
                  onClick={() => setSelectedUrl(null)}
                  className="w-full sm:w-auto bg-black text-white px-6 py-2.5 sm:py-2 rounded-lg hover:bg-gray-800 transition font-medium cursor-pointer text-sm"
                >
                  Close
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}