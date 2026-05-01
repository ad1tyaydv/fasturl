"use client";

import Navbar from "@/app/components/navbar";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

const links = [
  { name: "Support", path: "/contact/support" },
  { name: "Feedback", path: "/contact/feedback" },
  { name: "Business", path: "/contact/business" },
];

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      
      <div className="shrink-0 z-50">
        <Navbar />
      </div>

      <div className="flex flex-1 relative overflow-hidden">
        
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-8 right-8 z-[55] p-4 bg-primary text-primary-foreground rounded-full shadow-2xl active:scale-95 transition-all"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <aside
          className={`
            fixed top-[88px] bottom-0 left-0 z-50 w-64 bg-background border-r border-border
            flex flex-col transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static
          `}
        >
          <div className="p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
              Contact
            </h2>

            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    router.push(link.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                    pathname === link.path
                      ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.name}
                  <ChevronRight
                    size={14}
                    className={`transition-transform duration-200 ${
                      pathname === link.path
                        ? "translate-x-0"
                        : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto h-[calc(100vh-88px)] p-6 sm:p-10 md:p-12 lg:pl-10 max-w-4xl w-full">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
