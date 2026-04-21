"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../components/navbar";
import { Menu, X, ChevronRight } from "lucide-react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userTier, setUserTier] = useState<string | null>(null); // Track the user's tier
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        
        if (!res.data.authenticated) {
          router.push("/auth/signin");
          return;
        }

        // Assuming your API returns user tier (e.g., "FREE" or "PREMIUM")
        const tier = res.data.user?.tier || "FREE";
        setUserTier(tier);

        // Safety: If they are already on the API page but are FREE tier, kick them out
        if (pathname === "/settings/api" && tier === "FREE") {
          router.push("/premium");
        }
        
      } catch (error) {
        router.push("/auth/signin");
      }
    };
    checkAuth();
  }, [router, pathname]);

  const tabs = [
    { id: "/settings/profile", label: "profile" },
    { id: "/settings/authentication", label: "authentication" },
    { id: "/settings/2fa", label: "2fa" },
    { id: "/settings/subscription", label: "Subscription & Usage" },
    { id: "/settings/api", label: "API" },
  ];

  // Centralized navigation logic
  const handleNavigation = (id: string) => {
    if (id === "/settings/api" && userTier === "FREE") {
      router.push("/premium");
    } else {
      router.push(id);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-6 pb-12 px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Settings</h1>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-neutral-800/50 rounded-lg border border-neutral-700 text-neutral-300 hover:text-white transition-all active:scale-95"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-[400px] opacity-100 mb-8" : "max-h-0 opacity-0"
        }`}>
          <nav className="flex flex-col gap-2 p-2 bg-[#1a1a1a] rounded-xl border border-neutral-800">
            {tabs.map((tab) => {
              const isActive = pathname === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavigation(tab.id)}
                  className={`flex items-center justify-between px-4 py-4 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-[#1D9BF0] text-white"
                      : "text-neutral-400 hover:bg-neutral-800/50"
                  }`}
                >
                  <span className="capitalize">{tab.label}</span>
                  {isActive && <ChevronRight size={18} />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleNavigation(tab.id)}
                  className={`text-left px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer capitalize ${
                    pathname === tab.id
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}