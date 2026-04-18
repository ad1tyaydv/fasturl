"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/navbar";
import { Loader2 } from "lucide-react";
import AllKeysTab from "./api/page";
import RequestsTab from "./requests/page";
import DocsTab from "./docs/page";

const tabs = [
  { id: "allkeys", label: "All Keys" },
  { id: "requests", label: "Requests" },
  { id: "docs", label: "Docs" },
];

function ApiKeysSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("type") ?? "allkeys";

  return (
    <aside className="hidden md:flex fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 flex-col bg-[#141414] border-r border-neutral-800 px-4 py-6 z-10">
      <nav className="flex flex-col gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => router.push(`/apikeys?type=${tab.id}`)}
            className={`text-left px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function MobileSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("type") ?? "allkeys";


  return (
    <div className="flex md:hidden gap-2 mb-6 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => router.push(`/apikeys?type=${tab.id}`)}
          className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === tab.id
              ? "bg-neutral-800 text-white"
              : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
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
      {activeTab === "docs" && <DocsTab />}
    </div>
  );
}


export default function ApiKeysPage() {
  
  return (
    <div className="min-h-screen bg-[#141414] text-white transition-colors duration-300">
      <Navbar />

      <Suspense fallback={null}>
        <ApiKeysSidebar />
      </Suspense>

      <div className="md:pl-64">
        <main className="max-w-5xl mx-auto pt-6 pb-12 px-4 sm:px-8">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">API Keys</h1>
          </div>

          <Suspense fallback={null}>
            <MobileSidebar />
          </Suspense>

          <Suspense
            fallback={
              <div className="flex items-center gap-3 text-neutral-400 py-10">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="text-sm font-medium">Loading...</span>
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