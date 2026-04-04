"use client";

import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: "/profile", label: "Profile" },
    { id: "/authentication", label: "Authentication" },
    { id: "/2fa", label: "2FA" },
    { id: "/subscription", label: "Subscription & Usage" },
  ];


  return (
    <div className="min-h-screen bg-[#141414] text-white transition-colors duration-300">

      <main className="max-w-7xl mx-auto pt-6 pb-12 px-4 sm:px-8">
        
      </main>
    </div>
  );
}