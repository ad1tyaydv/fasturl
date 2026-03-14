"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { IoCopyOutline, IoHomeOutline, IoListOutline, IoSettingsOutline, IoPersonOutline, IoQrCodeOutline, IoAnalyticsOutline, IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

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
  
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  
  
  return (
    <div className={`h-screen flex flex-col overflow-hidden relative transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      
      <nav className={`flex items-center justify-between px-4 sm:px-8 py-4 border-b z-20 shrink-0 ${theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
        <h1 
          className="text-lg sm:text-xl font-semibold cursor-pointer" 
          onClick={() => router.push('/')}
        >
          SHORTLY
        </h1>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full transition cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            {theme === 'dark' ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
          </button>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className={`border px-4 py-1.5 rounded-md transition cursor-pointer font-medium text-sm sm:text-base ${
                theme === 'dark' 
                  ? 'border-white text-white hover:bg-white hover:text-black' 
                  : 'border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth/signin")}
              className={`border px-4 py-1.5 rounded-md transition cursor-pointer font-medium text-sm sm:text-base ${
                theme === 'dark' 
                  ? 'border-white text-white hover:bg-white hover:text-black' 
                  : 'border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden pb-16 md:pb-0">
        
        <aside className={`w-64 border-r flex-col py-6 px-4 shrink-0 hidden md:flex ${theme === 'dark' ? 'bg-[#0a0a0a] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
          <div>
            <p className={`text-xs font-bold mb-4 px-2 uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Menu</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push('/')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                  pathname === '/'
                    ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white')
                    : (theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-black')
                }`}
              >
                <IoHomeOutline size={20} />
                Dashboard
              </button>
              
              <button
                onClick={() => router.push('/urls')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                  pathname === '/urls' 
                    ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white')
                    : (theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-black')
                }`}
              >
                <IoListOutline size={20} />
                Links
              </button>

              <button
                onClick={() => router.push('/qrcodes')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                  pathname === '/qrcodes' 
                    ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white')
                    : (theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-black')
                }`}
              >
                <IoQrCodeOutline size={20} />
                QR Codes
              </button>

              <button
                onClick={() => router.push('/analytics')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                  pathname === '/analytics' 
                    ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white')
                    : (theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-black')
                }`}
              >
                <IoAnalyticsOutline size={20} />
                Analytics
              </button>
            </div>
          </div>

          <div className="mt-auto">
            <p className={`text-xs font-bold mb-4 px-2 uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Account</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => console.log('Profile clicked')} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-black'}`}
              >
                <IoPersonOutline size={20} />
                Profile
              </button>

              <button
                onClick={() => console.log('Settings clicked')} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-black'}`}
              >
                <IoSettingsOutline size={20} />
                Settings
              </button>
            </div>
          </div>
        </aside>

        <main className={`flex-1 overflow-y-auto p-4 sm:p-8 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold">Your Saved URLs</h1>
              <span className={`px-3 rounded-xl py-1 text-base sm:text-xl font-medium w-fit ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-black'}`}>
                Total Links - {urls.length}
              </span>
            </div>

            {loading && urls.length === 0 ? (
              <div className="flex justify-center mt-24">
                <div className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin ${theme === 'dark' ? 'border-gray-800 border-t-white' : 'border-gray-200 border-t-black'}`}></div>
              </div>
            ) : urls.length === 0 ? (
              <div className={`text-center mt-10 sm:mt-16 p-8 sm:p-12 border-2 border-dashed rounded-2xl ${theme === 'dark' ? 'border-gray-800 bg-[#0a0a0a]' : 'border-gray-300 bg-gray-50'}`}>
                <p className={`text-base sm:text-lg mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>You haven't saved any URLs yet.</p>
                <button 
                  onClick={() => router.push('/')}
                  className={`w-full sm:w-auto px-8 py-3 rounded-lg transition font-medium cursor-pointer ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
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
                    className={`border p-4 sm:p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 hover:shadow-md transition cursor-pointer group ${
                      theme === 'dark' ? 'border-gray-800 bg-[#0a0a0a] hover:border-gray-700' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col gap-2 sm:gap-3 w-full overflow-hidden min-w-0">
                      
                      <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                        <div className="truncate text-base sm:text-lg min-w-0 flex-1">
                            <strong>Short Url - </strong> 
                            <span className={`font-normal ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{NEXT_DOMAIN}/{url.shorturl}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(`${NEXT_DOMAIN}/${url.shorturl}`, url.id, "short");
                          }} 
                          className="shrink-0 cursor-pointer p-1"
                        >
                            <IoCopyOutline size={20} className={`transition ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'}`} />
                        </button>
                        {copiedUrlId === url.id && copiedType === "short" && (
                            <span className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold shrink-0 ${theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-50 text-gray-700'}`}>COPIED!</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                        <div className="truncate text-sm sm:text-lg min-w-0 flex-1">
                            <strong>Original Url - </strong> 
                            <span className={`font-normal ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{url.original}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(url.original, url.id, "original");
                          }} 
                          className="shrink-0 cursor-pointer p-1"
                        >
                            <IoCopyOutline size={20} className={`transition ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'}`} />
                        </button>
                        {copiedUrlId === url.id && copiedType === "original" && (
                            <span className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold shrink-0 ${theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-50 text-gray-700'}`}>COPIED!</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(url.id);
                      }}
                      className={`w-full md:w-auto mt-2 md:mt-0 px-6 py-2.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap shrink-0 opacity-100 md:opacity-80 group-hover:opacity-100 ${
                        theme === 'dark' ? 'bg-red-900/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-100'
                      }`}
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

      <nav className={`md:hidden fixed bottom-0 w-full border-t flex justify-around items-center pb-safe z-30 ${theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
        <button
          onClick={() => router.push('/')}
          className={`flex flex-col items-center gap-1 py-3 px-2 ${pathname === '/' ? (theme === 'dark' ? 'text-white' : 'text-black') : (theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black')}`}
        >
          <IoHomeOutline size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        
        <button
          onClick={() => router.push('/urls')}
          className={`flex flex-col items-center gap-1 py-3 px-2 ${pathname === '/urls' ? (theme === 'dark' ? 'text-white' : 'text-black') : (theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black')}`}
        >
          <IoListOutline size={24} />
          <span className="text-[10px] font-medium">Links</span>
        </button>

        <button
          onClick={() => router.push('/qrcodes')}
          className={`flex flex-col items-center gap-1 py-3 px-2 ${pathname === '/qrcodes' ? (theme === 'dark' ? 'text-white' : 'text-black') : (theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black')}`}
        >
          <IoQrCodeOutline size={24} />
          <span className="text-[10px] font-medium">QR</span>
        </button>

        <button
          onClick={() => router.push('/analytics')}
          className={`flex flex-col items-center gap-1 py-3 px-2 ${pathname === '/analytics' ? (theme === 'dark' ? 'text-white' : 'text-black') : (theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black')}`}
        >
          <IoAnalyticsOutline size={24} />
          <span className="text-[10px] font-medium">Analytics</span>
        </button>

        <button
          onClick={() => console.log('Profile clicked')}
          className={`flex flex-col items-center gap-1 py-3 px-2 ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'}`}
        >
          <IoPersonOutline size={24} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>

      {selectedUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity p-4 cursor-pointer"
          onClick={() => setSelectedUrl(null)}
        >
          <div 
            className={`rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform transition-all cursor-default ${theme === 'dark' ? 'bg-[#111] border border-gray-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`text-xl sm:text-2xl font-bold mb-5 sm:mb-6 border-b pb-4 ${theme === 'dark' ? 'text-white border-gray-800' : 'text-black border-gray-200'}`}>Link Details</h3>
            
            <div className="space-y-5 sm:space-y-6 mb-6 sm:mb-8">
              <div>
                <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Total Clicks</p>
                <p className={`text-3xl sm:text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {selectedUrl.clicks ?? 0}
                </p>
              </div>
              
              <div>
                <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Created At</p>
                <p className={`text-base sm:text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
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
                  className={`w-full sm:w-auto px-6 py-2.5 sm:py-2 rounded-lg transition font-medium cursor-pointer text-sm ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
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