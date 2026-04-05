"use client";

import { usePathname, useRouter } from "next/navigation";
import Navbar from "../../components/navbar";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();


  const tabs = [
    { id: "/settings/profile", label: "profile" },
    { id: "/settings/authentication", label: "authentication" },
    { id: "/settings/2fa", label: "2fa" },
    { id: "/settings/subscription", label: "Subscription & Usage" },
  ];


  return (
    <div className="min-h-screen bg-[#141414] text-white transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-6 pb-12 px-4 sm:px-8">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Settings</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => router.push(tab.id)}
                  className={`text-left px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
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