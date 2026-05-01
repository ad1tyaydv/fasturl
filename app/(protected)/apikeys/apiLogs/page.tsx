"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon } from "@hugeicons/core-free-icons";
import { ApiLogsDropDown, ApiLogTimeFilter, ApiMethodFilter, ApiSuccessFilter } from "@/app/dropDown/apiLogsDropDown";

interface ApiLog {
  id: string;
  endpoint: string;
  method: string;
  status: number;
  success: boolean;
  error?: string | null;
  device?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  apiKey?: {
    name: string;
    apiLinks?: { shorturl: string }[];
  } | null;
}

const PAGE_SIZE = 25;

export default function LogsTab() {
  const [allLogs, setAllLogs] = useState<ApiLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [methodFilter, setMethodFilter]   = useState<ApiMethodFilter>("all");
  const [successFilter, setSuccessFilter] = useState<ApiSuccessFilter>("all");
  const [timeFilter, setTimeFilter]       = useState<ApiLogTimeFilter>("all");


  useEffect(() => {
    fetchLogs();
  }, []);


  useEffect(() => {
    setPage(1);
  }, [methodFilter, successFilter, timeFilter]);


  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/api_key/v1apiLogs");
      const nested: { apiLogs: ApiLog[] }[] = res.data.apiLogs ?? [];
      const flat: ApiLog[] = nested.flatMap((entry) => entry.apiLogs ?? []);

      flat.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAllLogs(flat);

    } catch (err) {
      toast.error("Failed to fetch logs");

    } finally {
      setIsLoading(false);
    }
  };


  const filteredLogs = useMemo(() => {
    let logs = [...allLogs];
    if (methodFilter !== "all") logs = logs.filter((l) => l.method.toUpperCase() === methodFilter);
    if (successFilter === "success") logs = logs.filter((l) => l.success);
    else if (successFilter === "failed") logs = logs.filter((l) => !l.success);

    if (timeFilter !== "all") {
      const now = new Date();
      const cutoff = new Date();
      if (timeFilter === "today") cutoff.setHours(0, 0, 0, 0);
      else if (timeFilter === "7days") cutoff.setDate(now.getDate() - 7);
      else if (timeFilter === "28days") cutoff.setDate(now.getDate() - 28);
      else if (timeFilter === "6months") cutoff.setMonth(now.getMonth() - 6);
      else if (timeFilter === "12months") cutoff.setFullYear(now.getFullYear() - 1);
      logs = logs.filter((l) => new Date(l.createdAt) >= cutoff);
    }
    return logs;

  }, [allLogs, methodFilter, successFilter, timeFilter]);


  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const pagedLogs = filteredLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);


  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":    return "text-blue-600 dark:text-blue-400";
      case "POST":   return "text-emerald-600 dark:text-emerald-400";
      case "PUT":    return "text-amber-600 dark:text-amber-400";
      case "DELETE": return "text-red-600 dark:text-red-400";
      default:       return "text-muted-foreground";
    }
  };

  
  const getStatusDot = (status: number) => {
    if (status >= 200 && status < 300) return "bg-emerald-500";
    if (status >= 400) return "bg-red-500";
    return "bg-amber-500";
  };


  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) {
        pages.push("...");
      }
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="animate-in fade-in duration-300 font-one">
      <div className="flex items-start justify-between mb-6">
        <div className="hidden sm:block">
          <h2 className="text-xl font-bold text-foreground">API Logs</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Full request history across all your API keys.
          </p>
        </div>

        <div className="w-full sm:w-auto flex justify-end">
          <ApiLogsDropDown
            methodFilter={methodFilter}
            setMethodFilter={setMethodFilter}
            successFilter={successFilter}
            setSuccessFilter={setSuccessFilter}
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
      ) : filteredLogs.length === 0 ? (
        <div className="border border-border flex flex-col items-center justify-center py-16 text-center rounded-xl bg-secondary/30">
          <Clock className="w-8 h-8 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-medium">No logs found</p>
          <p className="text-muted-foreground/60 text-xs mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border overflow-hidden overflow-x-auto bg-background shadow-sm">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  {["Endpoint", "Method", "Status", "Success", "Error", "Device", "IP Address", "Created"].map((col) => (
                    <th key={col} className="text-left text-xs font-medium text-muted-foreground px-5 py-3 uppercase tracking-wider text-[10px] whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pagedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-foreground font-mono text-xs font-medium">{log.endpoint}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold font-mono ${getMethodColor(log.method)}`}>
                        {log.method.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getStatusDot(log.status)}`} />
                        <span className="text-foreground text-xs font-mono">{log.status}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {log.success ? (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-500 text-xs font-bold">Yes</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <HugeiconsIcon icon={CancelCircleIcon} className="w-4 h-4 text-destructive" />
                          <span className="text-destructive text-xs font-bold">No</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-[160px]">
                      {log.error ? (
                        <span className="text-destructive text-xs truncate block" title={log.error}>{log.error}</span>
                      ) : (
                        <span className="text-muted-foreground/30 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-[140px]">
                      <span className="text-muted-foreground text-xs truncate block" title={log.device ?? ""}>{log.device ?? "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-muted-foreground text-xs font-mono">{log.ipAddress ?? "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-IN", {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
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
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredLogs.length)} of {filteredLogs.length}
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
                      <span key={`dot-${i}`} className="px-1.5 text-muted-foreground text-xs">…</span>
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