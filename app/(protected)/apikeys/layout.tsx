"use client";

import { useState, Suspense, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/navbar";
import { Loader2, Menu, X, ChevronRight } from "lucide-react";
import AllKeysTab from "./api/page";
import RequestsTab from "./requests/page";
import DocsTab from "./docs/page";
import LogsTab from "./apiLogs/page";

const tabs = [
  { id: "allkeys", label: "All Keys" },
  { id: "requests", label: "Requests" },
  { id: "logs", label: "API Logs" },
  { id: "docs", label: "Docs" },
];

function ApiKeysSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("type") ?? "allkeys";

  return (
    <aside className="hidden md:flex fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 flex-col bg-background border-r border-border px-4 py-6 z-10">
      <nav className="flex flex-col gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => router.push(`/apikeys?type=${tab.id}`)}
            className={`text-left px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("type") ?? "allkeys";

  return (
    <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
      isOpen ? "max-h-[400px] opacity-100 mb-8" : "max-h-0 opacity-0 pointer-events-none"
    }`}>
      <nav className="flex flex-col gap-2 p-2 bg-background rounded-xl border border-border">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                router.push(`/apikeys?type=${tab.id}`);
                onClose();
              }}
              className={`flex items-center justify-between px-4 py-4 rounded-lg font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && <ChevronRight size={18} />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function ApiKeysContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("type") ?? "allkeys";

  return (
    <div className="flex-1 min-w-0">
      {activeTab === "allkeys" && <AllKeysTab />}
      {activeTab === "requests" && <RequestsTab />}
      {activeTab === "logs" && <LogsTab />}
      {activeTab === "docs" && <DocsTab />}
    </div>
  );
}

function ApiKeysPageInner() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");

        if (!res.data?.authenticated) {
          router.replace("/auth/signin");
          return;
        }

        if (res.data.plan === "FREE") {
          router.replace("/premium");
          return;
        }

      } catch {
        router.replace("/auth/signin");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <Suspense fallback={null}>
        <ApiKeysSidebar />
      </Suspense>

      <div className="md:pl-64">
        <main className="pt-6 pb-12 px-4 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              API Keys
            </h1>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 bg-secondary/50 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-all active:scale-95 cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <Suspense fallback={null}>
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </Suspense>

          <Suspense
            fallback={
              <div className="flex items-center gap-3 text-muted-foreground py-10">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm font-medium">Loading content...</span>
              </div>
            }
          >
            <ApiKeysContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function ApiKeysPage() {
  return <ApiKeysPageInner />;
}