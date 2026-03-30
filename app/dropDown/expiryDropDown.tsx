"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IoTimerOutline, IoChevronDown, IoCalendarOutline, IoStatsChartOutline } from "react-icons/io5";

type ExpiryType = "date" | "clicks";

interface ExpiryDropDownProps {
  expiryType: ExpiryType;
  setExpiryType: (type: ExpiryType) => void;
}

export function ExpiryDropDown({ expiryType, setExpiryType }: ExpiryDropDownProps) {

    
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-[#111111] border-neutral-700 text-white hover:bg-[#1a1a1a] font-three rounded-lg flex items-center gap-2 h-12 w-full justify-between px-4"
        >
          <div className="flex items-center gap-2">
            <IoTimerOutline size={18} className="text-blue-500" />
            <span className="text-sm">
                {expiryType === "date" ? "Expiry by Date" : "Expiry by Clicks"}
            </span>
          </div>
          <IoChevronDown size={14} className="text-neutral-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] bg-[#1c1c1c] border-neutral-800 text-white font-three shadow-2xl">
        <DropdownMenuLabel className="text-neutral-500 text-xs uppercase tracking-widest p-3">Expiration Method</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neutral-800" />
        
        <DropdownMenuCheckboxItem
          checked={expiryType === "date"}
          onSelect={() => setExpiryType("date")}
          className="cursor-pointer focus:bg-blue-600 focus:text-white p-3"
        >
          <IoCalendarOutline className="mr-3" size={18} /> By Specific Date
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={expiryType === "clicks"}
          onSelect={() => setExpiryType("clicks")}
          className="cursor-pointer focus:bg-blue-600 focus:text-white p-3"
        >
          <IoStatsChartOutline className="mr-3" size={18} /> By Max Clicks
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}