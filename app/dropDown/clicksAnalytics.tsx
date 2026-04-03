"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoFilterOutline, IoChevronDown } from "react-icons/io5"

interface AnalyticsFilterProps {
  days: number;
  setDays: (days: number) => void;
}

export function ClicksFilter({ days, setDays }: AnalyticsFilterProps) {


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-[#1a1a1a] border-neutral-800 text-white hover:bg-[#252525] hover:text-white rounded-lg flex items-center gap-2 h-9 outline-none focus:ring-1 focus:ring-neutral-700"
        >
          <IoFilterOutline size={16} className="text-blue-500" />
          <span className="text-xs font-medium">Last {days} Days</span>
          <IoChevronDown size={14} className="text-neutral-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end"
        className="w-48 bg-[#1a1a1a] border-neutral-800 text-white shadow-2xl rounded-lg"
      >
        <DropdownMenuLabel className="text-neutral-500 text-[10px] uppercase tracking-widest px-2 py-1.5">
          Time Range
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neutral-800" />
        
        {[7, 14, 28].map((range) => (
          <DropdownMenuCheckboxItem
            key={range}
            checked={days === range}
            onCheckedChange={() => setDays(range)}
            className="cursor-pointer focus:bg-[#252525] focus:text-white py-2"
          >
            Last {range} Days
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}