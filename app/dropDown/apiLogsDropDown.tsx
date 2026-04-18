"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDown01Icon, Clock01Icon, CodeIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export type LogTimeFilter = "all" | "today" | "7days" | "28days" | "6months" | "12months";
export type MethodFilter = "all" | "POST";
export type SuccessFilter = "all" | "success" | "failed";

interface LogsFilterProps {
  methodFilter: MethodFilter;
  setMethodFilter: (m: MethodFilter) => void;
  successFilter: SuccessFilter;
  setSuccessFilter: (s: SuccessFilter) => void;
  timeFilter: LogTimeFilter;
  setTimeFilter: (t: LogTimeFilter) => void;
}

export function LogsFilter({
  methodFilter,
  setMethodFilter,
  successFilter,
  setSuccessFilter,
  timeFilter,
  setTimeFilter,
}: LogsFilterProps) {
  const getTimeLabel = () => {
    switch (timeFilter) {
      case "today":    return "Today";
      case "7days":    return "Last 7 Days";
      case "28days":   return "Last 28 Days";
      case "6months":  return "Last 6 Months";
      case "12months": return "Last 12 Months";
      default:         return "All Time";
    }
  };

  const getSuccessLabel = () => {
    if (successFilter === "success") return "Success";
    if (successFilter === "failed")  return "Failed";
    return "All Status";
  };


  return (
    <div className="flex items-center gap-2">

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-[#1a1a1a] border-neutral-800 text-white hover:bg-[#252525] hover:text-white rounded-lg flex items-center gap-2 h-9 outline-none focus:ring-1 focus:ring-neutral-700 cursor-pointer"
          >
            <HugeiconsIcon icon={CodeIcon} size={16} />
            <span className="text-sm">{methodFilter === "all" ? "All Methods" : methodFilter}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} size={13} className="text-neutral-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-44 bg-[#1a1a1a] border-neutral-800 text-white shadow-2xl rounded-lg"
        >
          <DropdownMenuLabel className="text-neutral-500 text-[10px] uppercase tracking-widest">
            Method
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-neutral-800" />
          <DropdownMenuCheckboxItem
            checked={methodFilter === "all"}
            onCheckedChange={() => setMethodFilter("all")}
            className="cursor-pointer focus:bg-[#252525] focus:text-white py-2"
          >
            All Methods
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={methodFilter === "POST"}
            onCheckedChange={() => setMethodFilter("POST")}
            className="cursor-pointer focus:bg-[#252525] focus:text-white py-2 font-mono text-xs text-green-400"
          >
            POST
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-[#1a1a1a] border-neutral-800 text-white hover:bg-[#252525] hover:text-white rounded-lg flex items-center gap-2 h-9 outline-none focus:ring-1 focus:ring-neutral-700 cursor-pointer"
          >
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
            <span className="text-sm">{getSuccessLabel()}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} size={13} className="text-neutral-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-44 bg-[#1a1a1a] border-neutral-800 text-white shadow-2xl rounded-lg"
        >
          <DropdownMenuLabel className="text-neutral-500 text-[10px] uppercase tracking-widest">
            Status
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-neutral-800" />
          <DropdownMenuCheckboxItem
            checked={successFilter === "all"}
            onCheckedChange={() => setSuccessFilter("all")}
            className="cursor-pointer focus:bg-[#252525] focus:text-white py-2"
          >
            All Status
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={successFilter === "success"}
            onCheckedChange={() => setSuccessFilter("success")}
            className="cursor-pointer focus:bg-[#252525] focus:text-white py-2 text-green-400"
          >
            Success
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={successFilter === "failed"}
            onCheckedChange={() => setSuccessFilter("failed")}
            className="cursor-pointer focus:bg-[#252525] focus:text-white py-2 text-red-400"
          >
            Failed
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-[#1a1a1a] border-neutral-800 text-white hover:bg-[#252525] hover:text-white rounded-lg flex items-center gap-2 h-9 outline-none focus:ring-1 focus:ring-neutral-700 cursor-pointer"
          >
            <HugeiconsIcon icon={Clock01Icon} size={16} />
            <span className="text-sm">{getTimeLabel()}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} size={13} className="text-neutral-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-[#1a1a1a] border-neutral-800 text-white shadow-2xl rounded-lg"
        >
          <DropdownMenuLabel className="text-neutral-500 text-[10px] uppercase tracking-widest">
            Time Range
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-neutral-800" />
          {([
            { val: "all",      label: "All Time" },
            { val: "today",    label: "Today" },
            { val: "7days",    label: "Last 7 Days" },
            { val: "28days",   label: "Last 28 Days" },
            { val: "6months",  label: "Last 6 Months" },
            { val: "12months", label: "Last 12 Months" },
          ] as { val: LogTimeFilter; label: string }[]).map(({ val, label }) => (
            <DropdownMenuCheckboxItem
              key={val}
              checked={timeFilter === val}
              onCheckedChange={() => setTimeFilter(val)}
              className="cursor-pointer focus:bg-[#252525] focus:text-white py-2"
            >
              {label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
}