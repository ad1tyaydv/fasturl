"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Clock, ShieldCheck, ShieldOff, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { ApiRequestsFilter, ApiTimeFilter } from "@/app/dropDown/apiRequestDropDown";

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

export default function RequestsTab() {
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

      flat.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAllRows(flat);
      setApiKeyNames(apiKeys.map((k) => k.name));
    } catch (err) {
      toast.error("Failed to fetch requests.");
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
      const now = new Date();
      const cutoff = new Date();
      if (timeFilter === "today") {
        cutoff.setHours(0, 0, 0, 0);
      } else if (timeFilter === "7days") {
        cutoff.setDate(now.getDate() - 7);
      } else if (timeFilter === "28days") {
        cutoff.setDate(now.getDate() - 28);
      }
      rows = rows.filter((r) => new Date(r.createdAt) >= cutoff);
    }

    return rows;
  }, [allRows, selectedKey, timeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pagedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [selectedKey, timeFilter]);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="animate-in fade-in duration-300 font-one">
      <div className="flex items-start justify-between mb-6">
        <div className="hidden sm:block">
          <h2 className="text-xl font-bold text-foreground">Request Links</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Short links associated with your API keys.
          </p>
        </div>

        <div className="w-full sm:w-auto flex justify-end">
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
        <div className="flex items-center gap-2 text-muted-foreground py-10">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm">Loading...</span>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="border border-border flex flex-col items-center justify-center py-16 text-center rounded-xl bg-secondary/30">
          <Clock className="w-8 h-8 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-medium">No links found</p>
          <p className="text-muted-foreground/60 text-xs mt-1">
            Try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border overflow-hidden overflow-x-auto bg-background shadow-sm">
            <table className="w-full text-sm min-w-[600px] sm:min-w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 uppercase tracking-wider text-[10px]">
                    Short URL
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 uppercase tracking-wider text-[10px]">
                    API Key
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 uppercase tracking-wider text-[10px]">
                    Protected
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 uppercase tracking-wider text-[10px]">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pagedRows.map((row, i) => (
                  <tr key={i} className="hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-primary font-mono text-xs font-medium">
                        {row.shorturl}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-foreground text-xs font-medium">{row.keyName}</span>
                    </td>
                    <td className="px-5 py-4">
                      {row.isProtected ? (
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-500 text-xs font-bold">Yes</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <ShieldOff className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground text-xs">No</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-muted-foreground text-xs">
                        {new Date(row.createdAt).toLocaleString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
              <p className="text-muted-foreground text-xs">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredRows.length)} of {filteredRows.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer border border-border"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((p, i) =>
                    p === "..." ? (
                      <span key={`dot-${i}`} className="px-1.5 text-muted-foreground text-xs">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          page === p
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer border border-border"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}