"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoLinkOutline, IoQrCodeOutline } from "react-icons/io5";
import DashboardLayout from "../../components/dashBoardComponent"; // Adjust path if needed

export default function PremiumPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on load
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

  // Handle logout
  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    router.push("/auth/signin");
  };

  return (
    <DashboardLayout isLoggedIn={isLoggedIn} handleLogout={handleLogout}>
      <div className="max-w-7xl mx-auto">
        <section className="px-4 sm:px-8 py-8 md:py-12 flex flex-col xl:flex-row gap-12 xl:gap-10 items-center xl:items-start">
          
          <div className="xl:w-1/3 text-center xl:text-left pt-2">
            <h2 className="text-3xl font-one sm:text-4xl font-extrabold mb-5 leading-tight text-foreground">
              Unlock the Full Potential of Your Links.
            </h2>
            <p className="text-muted-foreground font-two mb-5 text-base sm:text-lg">
              Stop guessing and start tracking. Whether you are a solo creator or a growing enterprise, our advanced tools deliver the insights you need to succeed.
            </p>
            <p className="text-muted-foreground font-two text-base sm:text-lg">
              Build brand trust with custom short domains and monitor global engagement in real-time.
            </p>
          </div>

          <div className="xl:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch pb-24 md:pb-8">
            
            {/* Free Tier */}
            <div className="border border-border rounded-2xl p-6 bg-card flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-bold text-center mb-4 text-foreground">Free</h3>
              <div className="text-center text-4xl font-extrabold mb-6 text-foreground">$0</div>
              <button className="w-full font-two bg-foreground text-background py-2.5 rounded-lg font-semibold text-sm sm:text-base mb-6 transition hover:bg-foreground/90 cursor-pointer">
                Start for free
              </button>
              <ul className="space-y-4 text-sm font-medium flex-1">
                <li className="flex items-center">
                  <span className="bg-[#facc15] font-two text-black px-2.5 py-1 rounded flex items-center gap-2 font-bold shadow-sm">
                    <IoLinkOutline size={16} /> 3 Links/Day
                  </span>
                </li>
                <li className="flex font-two items-center gap-2.5 px-1 text-muted-foreground">
                  <IoQrCodeOutline size={18} className="text-foreground"/> 1 QR Code/Day
                </li>
              </ul>
            </div>

            {/* Essentials Tier */}
            <div className="relative md:scale-105 z-10 flex flex-col">
              <div className="animate-gentle-shake border-2 border-primary/50 bg-card rounded-2xl p-6 flex flex-col shadow-xl dark:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] hover:-translate-y-1 transition-transform duration-300 h-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-center mb-4 text-foreground mt-2">Essentials</h3>
                <div className="text-center mb-6 flex justify-center items-end gap-2.5">
                  <span className="line-through decoration-red-500 decoration-2 text-muted-foreground text-2xl font-bold mb-0.5">$15</span>
                  <span className="text-5xl font-extrabold text-foreground">$6<span className="text-lg font-bold text-muted-foreground">/mo</span></span>
                </div>
                <button className="w-full font-two bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 rounded-lg font-semibold text-sm sm:text-base mb-6 transition shadow-sm cursor-pointer">
                  Upgrade Now
                </button>
                <ul className="space-y-4 text-sm font-medium flex-1">
                  <li className="flex items-center">
                    <span className="bg-[#facc15] font-two text-black px-2.5 py-1 rounded flex items-center gap-2 font-bold shadow-sm">
                      <IoLinkOutline size={16} /> 200 Links/Mo
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5 px-1 text-muted-foreground">
                    <IoQrCodeOutline size={18} className="font-two text-foreground"/> 20 QR Codes/Mo
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium Tier */}
            <div className="border border-border rounded-2xl p-6 bg-card flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-bold text-center mb-4 text-foreground">Premium</h3>
              <div className="text-center mb-6 flex justify-center items-end gap-2.5">
                <span className="line-through decoration-red-500 decoration-2 text-muted-foreground text-xl font-bold mb-1">$499</span>
                <span className="text-4xl font-extrabold text-foreground">$299<span className="text-lg font-bold text-muted-foreground">/mo</span></span>
              </div>
              <button className="w-full font-two bg-secondary text-secondary-foreground py-2.5 rounded-lg font-semibold text-sm sm:text-base mb-6 transition hover:bg-secondary/80 cursor-pointer">
                Go Premium
              </button>
              <ul className="space-y-4 text-sm font-medium flex-1">
                <li className="flex items-center">
                  <span className="bg-[#facc15] font-two text-black px-2.5 py-1 rounded flex items-center gap-2 font-bold shadow-sm">
                    <IoLinkOutline size={16} /> Unlimited Links
                  </span>
                </li>
                <li className="flex items-center gap-2.5 px-1 text-muted-foreground">
                  <IoQrCodeOutline size={18} className="font-two text-foreground"/> 500 QR Codes/Mo
                </li>
              </ul>
            </div>

          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}