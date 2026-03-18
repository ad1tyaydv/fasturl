"use client";

import { useRouter } from "next/navigation";
import { ModeToggle } from "./toggleTheme";
import { useEffect, useState } from "react";
import axios from "axios";

interface NavbarProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
}

export default function Navbar({ isLoggedIn, handleLogout }: NavbarProps) {
  const router = useRouter();
  const [tier, setTier] = useState<string>("");

  useEffect(() => {
    const checkTier = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (res.data && res.data.plan) {
          setTier(res.data.plan);
        }

      } catch (error) {
        console.error("Error fetching tier:", error);
      }
    };

    if (isLoggedIn) {
      checkTier();
    }

    const interval = setInterval(checkTier, 5000);
    return () => {
      clearInterval(interval);
    }

  }, [isLoggedIn]);

  const isPaid = tier.toUpperCase() !== "FREE" && tier !== "";

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-border z-20 shrink-0 bg-background">
      <h1 
        className="text-lg sm:text-xl font-three cursor-pointer" 
        onClick={() => router.push('/')}
      >
        SHORTLY
      </h1>

      <div className="flex items-center gap-4">
        {isLoggedIn && tier && (
          <div className="relative flex flex-col items-center">
            <button
              onClick={() => router.push('/premium')}
              className={`border font-three px-4 py-1.5 rounded-md font-bold text-sm uppercase transition-all duration-500 cursor-pointer shadow-sm
                ${isPaid 
                  ? "bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 text-black border-amber-500 animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.5)] hover:shadow-[0_0_25px_rgba(251,191,36,0.8)]" 
                  : "bg-secondary text-secondary-foreground border-input hover:bg-secondary/80"
                }`}
            >
              {tier}
            </button>

            {tier.toUpperCase() === "FREE" && (
              <div 
                className="absolute font-one top-12 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-800 text-xs font-bold px-5 py-2 rounded-full border border-yellow-300 animate-bounce whitespace-nowrap shadow-md z-50"
                style={{ animationDuration: '1s' }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-yellow-100"></div>
                Upgrade
              </div>
            )}
          </div>
        )}

        <ModeToggle />

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-1.5 rounded-md transition cursor-pointer font-three text-sm sm:text-base"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/auth/signin")}
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-1.5 rounded-md transition cursor-pointer font-three text-sm sm:text-base"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}