"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Clock, ShieldCheck, ShieldOff, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ApiRequestsFilter, ApiTimeFilter } from "@/app/dropDown/apiRequestDropDown";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings02Icon } from "@hugeicons/core-free-icons";

interface ApiLink {
  shorturl: string;
  isProtected: boolean;
  createdAt: string;
}

interface ApiKey {
  name: string;
  apiLinks: ApiLink[];
}

interface FlatRow {
  keyName: string;
  shorturl: string;
  isProtected: boolean;
  createdAt: string;
}

const PAGE_SIZE = 25;

export default function ApiLinks() {
  const router = useRouter();
  const [allRows, setAllRows] = useState<FlatRow[]>([]);
  const [apiKeyNames, setApiKeyNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<ApiTimeFilter>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/api_key/v1Request");
      const apiKeys: ApiKey[] = res.data.apiKeys ?? [];

      const flat: FlatRow[] = apiKeys.flatMap((key) =>
        key.apiLinks.map((link) => ({
          keyName: key.name,
          shorturl: link.shorturl,
          isProtected: link.isProtected,
          createdAt: link.createdAt,
        }))
      );

      flat.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setAllRows(flat);
      setApiKeyNames(apiKeys.map((k) => k.name));

    } catch (err) {
      toast.error("Failed to fetch API requests.");

    } finally {
      setIsLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    let rows = [...allRows];

    if (selectedKey !== "all") {
        rows = rows.filter((r) => r.keyName === selectedKey);
    }

    if (timeFilter !== "all") {
      const cutoff = new Date();
      if (timeFilter === "today") cutoff.setHours(0, 0, 0, 0);
      else if (timeFilter === "7days") cutoff.setDate(cutoff.getDate() - 7);
      else if (timeFilter === "28days") cutoff.setDate(cutoff.getDate() - 28);
      rows = rows.filter((r) => new Date(r.createdAt) >= cutoff);
    }
    return rows;

  }, [allRows, selectedKey, timeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pagedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [selectedKey, timeFilter]);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3 self-start">
          <button 
            onClick={() => router.push('/apikeys?type=allkeys')}
            className="flex items-center gap-2 px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-sm transition-all text-white cursor-pointer"
          >
            <HugeiconsIcon icon={Settings02Icon} size={16} />
            Manage API Keys
          </button>
          <span className="px-4 py-1.5 font-bold bg-[#1c1c1c] border border-neutral-800 rounded-lg text-xs uppercase tracking-widest text-neutral-400">
            Total - {filteredRows.length}
          </span>
        </div>

        <div className="flex items-center justify-end w-full md:w-auto">
          <ApiRequestsFilter
            apiKeyNames={apiKeyNames}
            selectedKey={selectedKey}
            setSelectedKey={setSelectedKey}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-neutral-500 py-20 justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-sm">Fetching API links...</span>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="border border-neutral-800 flex flex-col items-center justify-center py-16 text-center rounded-xl bg-neutral-900/20">
          <Clock className="w-8 h-8 text-neutral-700 mb-3" />
          <p className="text-neutral-400 text-sm font-medium">No API links found</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-neutral-800/60 overflow-x-auto bg-[#111111]">
            <table className="w-full min-w-[600px] text-sm text-neutral-300">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900/50">
                  <th className="text-left text-xs font-medium text-neutral-500 px-6 py-4 uppercase whitespace-nowrap">Short URL</th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-6 py-4 uppercase whitespace-nowrap">API Key</th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-6 py-4 uppercase whitespace-nowrap">Protected</th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-6 py-4 uppercase whitespace-nowrap">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/40">
                {pagedRows.map((row, i) => (
                  <tr key={i} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-blue-400 whitespace-nowrap">{row.shorturl}</td>
                    <td className="px-6 py-4 text-neutral-400 whitespace-nowrap">{row.keyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.isProtected ? (
                        <div className="flex items-center gap-1.5 text-green-500"><ShieldCheck size={14}/> <span>Yes</span></div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-neutral-600"><ShieldOff size={14}/> <span>No</span></div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-neutral-500 text-xs whitespace-nowrap">
                      {new Date(row.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-neutral-600 text-xs">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1}
                  className="p-2 border border-neutral-800 rounded-lg hover:bg-neutral-800 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages}
                  className="p-2 border border-neutral-800 rounded-lg hover:bg-neutral-800 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}