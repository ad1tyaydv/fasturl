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

import { ModeToggle } from "../components/toggleTheme";

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
    <div className="h-screen flex flex-col overflow-hidden relative transition-colors duration-300 bg-background text-foreground">
      
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-border z-20 shrink-0 bg-background">
        <h1 
          className="text-lg sm:text-xl font-semibold cursor-pointer" 
          onClick={() => router.push('/')}
        >
          SHORTLY
        </h1>

        <div className="flex items-center gap-4 cursor-pointer">
          <ModeToggle />

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-1.5 rounded-md transition cursor-pointer font-medium text-sm sm:text-base"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth/signin")}
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-1.5 rounded-md transition cursor-pointer font-medium text-sm sm:text-base"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden pb-16 md:pb-0">
        
        <aside className="w-64 border-r border-border flex-col py-6 px-4 shrink-0 hidden md:flex bg-muted/20">
          <div>
            <p className="text-xs font-bold mb-4 px-2 uppercase tracking-wider text-muted-foreground">Menu</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push('/')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                  pathname === '/'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <IoHomeOutline size={20} />
                Dashboard
              </button>
              
              <button
                onClick={() => router.push('/urls')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                  pathname === '/urls' 
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <IoListOutline size={20} />
                Links
              </button>

              <button
                onClick={() => router.push('/qrcodes')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                  pathname === '/qrcodes' 
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <IoQrCodeOutline size={20} />
                QR Codes
              </button>

              <button
                onClick={() => router.push('/analytics')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                  pathname === '/analytics' 
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <IoAnalyticsOutline size={20} />
                Analytics
              </button>
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-xs font-bold mb-4 px-2 uppercase tracking-wider text-muted-foreground">Account</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => console.log('Profile clicked')} 
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <IoPersonOutline size={20} />
                Profile
              </button>

              <button
                onClick={() => console.log('Settings clicked')} 
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <IoSettingsOutline size={20} />
                Settings
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold">Your Saved URLs</h1>
              <span className="px-3 rounded-xl py-1 text-base sm:text-xl font-medium w-fit bg-secondary text-secondary-foreground">
                Total Links - {urls.length}
              </span>
            </div>

            {loading && urls.length === 0 ? (
              <div className="flex justify-center mt-24">
                <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : urls.length === 0 ? (
              <div className="text-center mt-10 sm:mt-16 p-8 sm:p-12 border-2 border-dashed border-border rounded-2xl bg-muted/30">
                <p className="text-base sm:text-lg mb-6 text-muted-foreground">You haven't saved any URLs yet.</p>
                <button 
                  onClick={() => router.push('/')}
                  className="w-full sm:w-auto px-8 py-3 rounded-lg transition font-medium cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
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
                    className="border border-border p-4 sm:p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 hover:shadow-md transition cursor-pointer group bg-card hover:border-primary/50"
                  >
                    <div className="flex flex-col gap-2 sm:gap-3 w-full overflow-hidden min-w-0">
                      
                      <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                        <div className="truncate text-base sm:text-lg min-w-0 flex-1">
                            <strong>Short Url - </strong> 
                            <span className="font-normal text-muted-foreground">{NEXT_DOMAIN}/{url.shorturl}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(`${NEXT_DOMAIN}/${url.shorturl}`, url.id, "short");
                          }} 
                          className="shrink-0 cursor-pointer p-1"
                        >
                            <IoCopyOutline size={20} className="transition text-muted-foreground hover:text-foreground" />
                        </button>
                        {copiedUrlId === url.id && copiedType === "short" && (
                            <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold shrink-0 bg-green-500/20 text-green-600 dark:text-green-400">COPIED!</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                        <div className="truncate text-sm sm:text-lg min-w-0 flex-1">
                            <strong>Original Url - </strong> 
                            <span className="font-normal text-muted-foreground">{url.original}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(url.original, url.id, "original");
                          }} 
                          className="shrink-0 cursor-pointer p-1"
                        >
                            <IoCopyOutline size={20} className="transition text-muted-foreground hover:text-foreground" />
                        </button>
                        {copiedUrlId === url.id && copiedType === "original" && (
                            <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold shrink-0 bg-green-500/20 text-green-600 dark:text-green-400">COPIED!</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(url.id);
                      }}
                      className="w-full md:w-auto mt-2 md:mt-0 px-6 py-2.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap shrink-0 opacity-100 md:opacity-80 group-hover:opacity-100 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/20"
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

      <nav className="md:hidden fixed bottom-0 w-full border-t border-border flex justify-around items-center pb-safe z-30 bg-background">
        <button
          onClick={() => router.push('/')}
          className={`flex flex-col items-center gap-1 py-3 px-2 ${pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <IoHomeOutline size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        
        <button
          onClick={() => router.push('/urls')}
          className={`flex flex-col items-center gap-1 py-3 px-2 ${pathname === '/urls' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <IoListOutline size={24} />
          <span className="text-[10px] font-medium">Links</span>
        </button>

        <button
          onClick={() => router.push('/qrcodes')}
          className={`flex flex-col items-center gap-1 py-3 px-2 ${pathname === '/qrcodes' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <IoQrCodeOutline size={24} />
          <span className="text-[10px] font-medium">QR</span>
        </button>

        <button
          onClick={() => router.push('/analytics')}
          className={`flex flex-col items-center gap-1 py-3 px-2 ${pathname === '/analytics' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <IoAnalyticsOutline size={24} />
          <span className="text-[10px] font-medium">Analytics</span>
        </button>

        <button
          onClick={() => console.log('Profile clicked')}
          className="flex flex-col items-center gap-1 py-3 px-2 text-muted-foreground hover:text-foreground"
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
            className="rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform transition-all cursor-default bg-background border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 border-b border-border pb-4 text-foreground">Link Details</h3>
            
            <div className="space-y-5 sm:space-y-6 mb-6 sm:mb-8">
              <div>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 text-muted-foreground">Total Clicks</p>
                <p className="text-3xl sm:text-4xl font-extrabold text-foreground">
                  {selectedUrl.clicks ?? 0}
                </p>
              </div>
              
              <div>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 text-muted-foreground">Created At</p>
                <p className="text-base sm:text-lg font-medium text-muted-foreground">
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
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-2 rounded-lg transition font-medium cursor-pointer text-sm bg-primary text-primary-foreground hover:bg-primary/90"
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