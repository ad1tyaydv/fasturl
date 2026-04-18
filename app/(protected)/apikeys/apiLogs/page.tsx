"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon } from "@hugeicons/core-free-icons";
import { LogsFilter, LogTimeFilter, MethodFilter, SuccessFilter } from "@/app/dropDown/apiLogsDropDown";


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

  const [methodFilter, setMethodFilter]   = useState<MethodFilter>("all");
  const [successFilter, setSuccessFilter] = useState<SuccessFilter>("all");
  const [timeFilter, setTimeFilter]       = useState<LogTimeFilter>("all");


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

      flat.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAllLogs(flat);

    } catch (err) {
      toast.error("Failed to fetch logs.");

    } finally {
      setIsLoading(false);
    }
  };


  const filteredLogs = useMemo(() => {
    let logs = [...allLogs];

    if (methodFilter !== "all") {
      logs = logs.filter((l) => l.method.toUpperCase() === methodFilter);
    }

    if (successFilter === "success") {
      logs = logs.filter((l) => l.success);
    } else if (successFilter === "failed") {
      logs = logs.filter((l) => !l.success);
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
      } else if (timeFilter === "6months") {
        cutoff.setMonth(now.getMonth() - 6);
      } else if (timeFilter === "12months") {
        cutoff.setFullYear(now.getFullYear() - 1);
      }
      logs = logs.filter((l) => new Date(l.createdAt) >= cutoff);
    }

    return logs;
  }, [allLogs, methodFilter, successFilter, timeFilter]);


  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const pagedLogs = filteredLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);


  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":    return "text-blue-400";
      case "POST":   return "text-green-400";
      case "PUT":    return "text-yellow-400";
      case "DELETE": return "text-red-400";
      default:       return "text-neutral-400";
    }
  };


  const getStatusDot = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500";
    if (status >= 400) return "bg-red-500";
    return "bg-yellow-500";
  };


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
    <div className="animate-in fade-in duration-300">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">API Logs</h2>
          <p className="text-neutral-500 text-sm mt-0.5">
            Full request history across all your API keys.
          </p>
        </div>

        <LogsFilter
          methodFilter={methodFilter}
          setMethodFilter={setMethodFilter}
          successFilter={successFilter}
          setSuccessFilter={setSuccessFilter}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-neutral-500 py-10">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="border border-neutral-800 flex flex-col items-center justify-center py-16 text-center rounded-md">
          <Clock className="w-8 h-8 text-neutral-700 mb-3" />
          <p className="text-neutral-400 text-sm font-medium">No logs found</p>
          <p className="text-neutral-600 text-xs mt-1">
            Try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-md border border-neutral-800 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900/80">
                  {["Endpoint", "Method", "Status", "Success", "Error", "Device", "IP Address", "Created"].map((col) => (
                    <th
                      key={col}
                      className="text-left text-xs font-medium text-neutral-500 px-4 py-2.5 uppercase tracking-wide whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {pagedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-neutral-300 font-mono text-xs">{log.endpoint}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold font-mono ${getMethodColor(log.method)}`}>
                        {log.method.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getStatusDot(log.status)}`} />
                        <span className="text-neutral-300 text-xs font-mono">{log.status}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {log.success ? (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-green-500 text-xs">Yes</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <HugeiconsIcon icon={CancelCircleIcon} className="w-3.5 h-3.5 text-red-500" />
                          <span className="text-red-500 text-xs">No</span>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 max-w-[160px]">
                      {log.error ? (
                        <span className="text-red-400 text-xs truncate block" title={log.error}>
                          {log.error}
                        </span>
                      ) : (
                        <span className="text-neutral-700 text-xs">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 max-w-[140px]">
                      <span className="text-neutral-400 text-xs truncate block" title={log.device ?? ""}>
                        {log.device ?? "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-neutral-400 text-xs font-mono">
                        {log.ipAddress ?? "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-neutral-500 text-xs whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-IN", {
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
            <div className="flex items-center justify-between mt-4">
              <p className="text-neutral-600 text-xs">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredLogs.length)} of {filteredLogs.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`dot-${i}`} className="px-1.5 text-neutral-600 text-xs">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                        page === p
                          ? "bg-white text-black"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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