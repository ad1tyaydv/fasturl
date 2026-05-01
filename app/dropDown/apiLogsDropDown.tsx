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

export type ApiLogTimeFilter = "all" | "today" | "7days" | "28days" | "6months" | "12months";
export type ApiMethodFilter = "all" | "POST";
export type ApiSuccessFilter = "all" | "success" | "failed";

interface ApiLogsFilterProps {
  methodFilter: ApiMethodFilter;
  setMethodFilter: (m: ApiMethodFilter) => void;
  successFilter: ApiSuccessFilter;
  setSuccessFilter: (s: ApiSuccessFilter) => void;
  timeFilter: ApiLogTimeFilter;
  setTimeFilter: (t: ApiLogTimeFilter) => void;
}

export function ApiLogsDropDown({
  methodFilter,
  setMethodFilter,
  successFilter,
  setSuccessFilter,
  timeFilter,
  setTimeFilter,
}: ApiLogsFilterProps) {
  
  const getTimeLabel = (isMobile: boolean) => {
    switch (timeFilter) {
      case "today":    return "Today";
      case "7days":    return isMobile ? "7 Days" : "Last 7 Days";
      case "28days":   return isMobile ? "28 Days" : "Last 28 Days";
      case "6months":  return isMobile ? "6 Mo" : "Last 6 Months";
      case "12months": return isMobile ? "12 Mo" : "Last 12 Months";
      default:         return isMobile ? "All Time" : "All Time";
    }
  };

  const getSuccessLabel = (isMobile: boolean) => {
    if (successFilter === "success") return "Success";
    if (successFilter === "failed")  return "Failed";
    return isMobile ? "Status" : "All Status";
  };

  return (
    <div className="flex items-center w-full sm:w-auto gap-2 sm:gap-2">
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 sm:flex-none bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 h-10 sm:h-9 px-1 sm:px-4 outline-none focus:ring-1 focus:ring-ring cursor-pointer transition-all"
          >
            <HugeiconsIcon icon={CodeIcon} size={14} className="sm:size-[16px] shrink-0" />
            <span className="text-[12px] sm:text-sm truncate">
              {methodFilter === "all" ? "Method" : methodFilter}
            </span>
            <HugeiconsIcon icon={ArrowDown01Icon} size={12} className="text-muted-foreground shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40 sm:w-44 bg-popover border-border text-popover-foreground shadow-2xl rounded-xl"
        >
          <DropdownMenuLabel className="text-muted-foreground text-[10px] uppercase tracking-widest">
            Method
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuCheckboxItem
            checked={methodFilter === "all"}
            onCheckedChange={() => setMethodFilter("all")}
            className="cursor-pointer focus:bg-accent focus:text-accent-foreground py-2"
          >
            All Methods
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={methodFilter === "POST"}
            onCheckedChange={() => setMethodFilter("POST")}
            className="cursor-pointer focus:bg-accent focus:text-accent-foreground py-2 font-mono text-xs text-green-600 dark:text-green-400"
          >
            POST
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 sm:flex-none bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 h-10 sm:h-9 px-1 sm:px-4 outline-none focus:ring-1 focus:ring-ring cursor-pointer transition-all"
          >
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} className="sm:size-[16px] shrink-0" />
            <span className="text-[12px] sm:text-sm truncate">{getSuccessLabel(true)}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} size={12} className="text-muted-foreground shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40 sm:w-44 bg-popover border-border text-popover-foreground shadow-2xl rounded-xl"
        >
          <DropdownMenuLabel className="text-muted-foreground text-[10px] uppercase tracking-widest">
            Status
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuCheckboxItem
            checked={successFilter === "all"}
            onCheckedChange={() => setSuccessFilter("all")}
            className="cursor-pointer focus:bg-accent focus:text-accent-foreground py-2"
          >
            All Status
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={successFilter === "success"}
            onCheckedChange={() => setSuccessFilter("success")}
            className="cursor-pointer focus:bg-accent focus:text-accent-foreground py-2 text-green-600 dark:text-green-400"
          >
            Success
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={successFilter === "failed"}
            onCheckedChange={() => setSuccessFilter("failed")}
            className="cursor-pointer focus:bg-accent focus:text-accent-foreground py-2 text-red-600 dark:text-red-400"
          >
            Failed
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 sm:flex-none bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 h-10 sm:h-9 px-1 sm:px-4 outline-none focus:ring-1 focus:ring-ring cursor-pointer transition-all"
          >
            <HugeiconsIcon icon={Clock01Icon} size={14} className="sm:size-[16px] shrink-0" />
            <span className="text-[12px] sm:text-sm truncate">{getTimeLabel(true)}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} size={12} className="text-muted-foreground shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-44 sm:w-48 bg-popover border-border text-popover-foreground shadow-2xl rounded-xl"
        >
          <DropdownMenuLabel className="text-muted-foreground text-[10px] uppercase tracking-widest">
            Time Range
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />
          {([
            { val: "all",      label: "All Time" },
            { val: "today",    label: "Today" },
            { val: "7days",    label: "Last 7 Days" },
            { val: "28days",   label: "Last 28 Days" },
            { val: "6months",  label: "Last 6 Months" },
            { val: "12months", label: "Last 12 Months" },
          ] as { val: ApiLogTimeFilter; label: string }[]).map(({ val, label }) => (
            <DropdownMenuCheckboxItem
              key={val}
              checked={timeFilter === val}
              onCheckedChange={() => setTimeFilter(val)}
              className="cursor-pointer focus:bg-accent focus:text-accent-foreground py-2"
            >
              {label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
}