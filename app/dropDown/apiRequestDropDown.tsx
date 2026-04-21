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

import { ArrowDown01Icon, Clock01Icon, Key01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";


export type ApiTimeFilter = "all" | "today" | "7days" | "28days";

interface ApiRequestsFilterProps {
  apiKeyNames: string[];
  selectedKey: string;
  setSelectedKey: (key: string) => void;
  timeFilter: ApiTimeFilter;
  setTimeFilter: (time: ApiTimeFilter) => void;
}

export function ApiRequestsFilter({
  apiKeyNames,
  selectedKey,
  setSelectedKey,
  timeFilter,
  setTimeFilter,
}: ApiRequestsFilterProps) {
  const getTimeLabel = () => {
    switch (timeFilter) {
      case "today":  return "Today";
      case "7days":  return "Last 7 Days";
      case "28days": return "Last 28 Days";
      default:       return "All Time";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-[#1a1a1a] border-neutral-800 text-white hover:bg-[#252525] hover:text-white rounded-lg flex items-center gap-2 h-9 outline-none focus:ring-1 focus:ring-neutral-700 cursor-pointer"
          >
            <HugeiconsIcon icon={Key01Icon} />
            <span className="text-sm">
              {selectedKey === "all" ? "All Keys" : selectedKey}
            </span>
            <HugeiconsIcon icon={ArrowDown01Icon} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-[#1a1a1a] border-neutral-800 text-white shadow-2xl rounded-lg"
        >
          <DropdownMenuLabel className="text-neutral-500 text-[10px] uppercase tracking-widest">
            API Key
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-neutral-800" />
          <DropdownMenuCheckboxItem
            checked={selectedKey === "all"}
            onCheckedChange={() => setSelectedKey("all")}
            className="cursor-pointer focus:bg-[#252525] focus:text-white py-2"
          >
            All Keys
          </DropdownMenuCheckboxItem>
          {apiKeyNames.map((name) => (
            <DropdownMenuCheckboxItem
              key={name}
              checked={selectedKey === name}
              onCheckedChange={() => setSelectedKey(name)}
              className="cursor-pointer focus:bg-[#252525] focus:text-white py-2 font-mono text-xs"
            >
              {name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-[#1a1a1a] border-neutral-800 text-white hover:bg-[#252525] hover:text-white rounded-lg flex items-center cursor-pointer gap-2 h-9 outline-none focus:ring-1 focus:ring-neutral-700"
          >
            <HugeiconsIcon icon={Clock01Icon} />
            <span className="text-sm">{getTimeLabel()}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} />
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
          {(["all", "today", "7days", "28days"] as ApiTimeFilter[]).map((val) => (
            <DropdownMenuCheckboxItem
              key={val}
              checked={timeFilter === val}
              onCheckedChange={() => setTimeFilter(val)}
              className="cursor-pointer focus:bg-[#252525] focus:text-white py-2"
            >
              {val === "all"
                ? "All Time"
                : val === "today"
                ? "Today"
                : val === "7days"
                ? "Last 7 Days"
                : "Last 28 Days"}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}