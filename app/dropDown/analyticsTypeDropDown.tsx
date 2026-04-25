"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Link04Icon,
  File02Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons';

export type AnalyticsType = "links" | "bulk";

interface AnalyticsTypeToggleProps {
  value: AnalyticsType;
  onChange: (value: AnalyticsType) => void;
}

export function AnalyticsTypeToggle({ value, onChange }: AnalyticsTypeToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-[#1a1a1a] border-neutral-800 text-white hover:bg-[#252525] hover:text-white rounded-lg flex items-center gap-2 h-10 outline-none focus:ring-1 focus:ring-neutral-700 cursor-pointer px-4"
        >
          <HugeiconsIcon 
            icon={value === "links" ? Link04Icon : File02Icon} 
            size={18} 
            className={value === "links" ? "text-blue-500" : "text-amber-500"}
          />
          <span className="text-sm font-bold capitalize">
            {value === "links" ? "Link Analytics" : "Bulk Analytics"}
          </span>
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="text-neutral-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="start"
        className="w-56 bg-[#1a1a1a] border-neutral-800 text-white shadow-2xl rounded-xl p-1.5"
      >
        <DropdownMenuSeparator className="bg-neutral-800 mx-1" />
        
        <DropdownMenuCheckboxItem
          checked={value === "links"}
          onCheckedChange={() => onChange("links")}
          className="cursor-pointer focus:bg-white focus:text-white py-3 rounded-lg flex items-center gap-2"
        >
          <HugeiconsIcon icon={Link04Icon} className="text-blue-500" />
          <span className="font-medium">Link Analytics</span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={value === "bulk"}
          onCheckedChange={() => onChange("bulk")}
          className="cursor-pointer focus:bg-white focus:text-white py-3 rounded-lg flex items-center gap-2"
        >
          <HugeiconsIcon icon={File02Icon} className="text-amber-500" />
          <span className="font-medium">Bulk Analytics</span>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}