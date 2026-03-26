"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface NavbarProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
}


export default function Navbar({ isLoggedIn, handleLogout }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [tier, setTier] = useState("FREE");

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Links', path: '/urls' },
    { name: 'Bulk Links', path: '/bulklinks' },
    { name: 'QR Codes', path: '/qr' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Premium', path: '/premium' },
    { name: 'Settings', path: '/settings' },
  ];


  useEffect(() => {
    const stored = localStorage.getItem("plan");
    if (stored) setTier(stored);

    if (!isLoggedIn) return;

    const checkTier = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (res.data && res.data.plan) {
          setTier(res.data.plan);
          localStorage.setItem("plan", res.data.plan);
        }

      } catch (error) {
        console.error("Error while fetching tier:", error);
      }
    };
    checkTier();

  }, [isLoggedIn]);


  const isPaid = tier !== "FREE" && tier !== "";


  return (
    <nav className="flex items-center justify-between px-6 sm:px-10 py-6 border-b border-neutral-800 z-30 shrink-0 bg-[#141414] text-white sticky top-0 shadow-sm">
      
      <div className="flex items-center gap-10">
        <h1 
          className="text-xl sm:text-2xl font-three font-bold cursor-pointer tracking-tighter" 
          onClick={() => router.push('/')}
        >
          SHORTLY
        </h1>

        <div className="hidden lg:flex items-center gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#1D9BF0] text-white shadow-sm' 
                    : 'text-neutral-400 hover:bg-[#222222] hover:text-white'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {isLoggedIn && tier && (
          <div className="relative flex flex-col items-center">
            <button
              onClick={() => router.push('/premium')}
              className={`border font-three px-5 py-2 rounded-lg font-bold text-xs uppercase transition-all duration-500 cursor-pointer shadow-sm
                ${isPaid 
                  ? "bg-linear-to-r from-amber-400 via-yellow-200 to-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.3)]" 
                  : "bg-[#222222] text-white border-neutral-700 hover:bg-[#333333]"
                }`}
            >
              {tier}
            </button>

            {tier.toUpperCase() === "FREE" && (
              <div 
                className="absolute font-one top-14 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-800 text-[10px] font-black px-4 py-1.5 rounded-full border border-yellow-300 animate-bounce whitespace-nowrap shadow-md z-50"
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-yellow-100"></div>
                UPGRADE
              </div>
            )}
          </div>
        )}

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="border border-neutral-700 bg-transparent text-white hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 px-6 py-2.5 rounded-lg transition-all cursor-pointer font-three text-sm font-semibold"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/auth/signin")}
            className="bg-white text-black hover:bg-gray-200 px-8 py-2.5 rounded-lg transition-all cursor-pointer font-three text-sm font-semibold shadow-sm"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}