"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import PricingSection from "@/app/components/PricingSection";


export default function PremiumPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    try {
      await axios.post("/api/auth/logout");
      setIsLoggedIn(false);
      router.push("/auth/signin");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <section className="px-4 sm:px-8 py-0 max-w-6xl mx-auto flex flex-col items-center justify-start">
          <div className="w-full">
            <PricingSection />
          </div>
        </section>
      </main>
    </div>
  );
}