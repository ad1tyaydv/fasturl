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

export type SortOrder = "most" | "least" | "newest" | "oldest";

interface FilterProps {
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

export function AnalyticsFilter({ sortOrder, setSortOrder }: FilterProps) {
  const getLabel = () => {
    switch (sortOrder) {
      case "most": return "Most Clicks";
      case "least": return "Least Clicks";
      case "oldest": return "Oldest First";
      default: return "Newest First";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          // Added font-three here to match the trigger text
          className="bg-[#1a1a1a] border-neutral-800 text-white hover:bg-[#252525] hover:text-white font-three rounded-lg flex items-center gap-2 h-10 outline-none focus:ring-1 focus:ring-neutral-700"
        >
          <IoFilterOutline size={18} className="text-blue-500" />
          <span className="text-sm">Sort: {getLabel()}</span>
          <IoChevronDown size={14} className="text-neutral-500" />
        </Button>
      </DropdownMenuTrigger>

      {/* Added font-three to the Content to ensure all items inherit the font */}
      <DropdownMenuContent 
        align="end"
        className="w-56 bg-[#1a1a1a] border-neutral-800 text-white font-three shadow-2xl rounded-lg"
      >
        <DropdownMenuLabel className="text-neutral-500 text-[10px] uppercase tracking-widest font-three">
          Date Created
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neutral-800" />
        
        <DropdownMenuCheckboxItem
          checked={sortOrder === "newest"}
          onCheckedChange={() => setSortOrder("newest")}
          className="cursor-pointer focus:bg-[#252525] focus:text-white py-2 font-three"
        >
          Newest First (Recent)
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={sortOrder === "oldest"}
          onCheckedChange={() => setSortOrder("oldest")}
          className="cursor-pointer focus:bg-[#252525] focus:text-white py-2 font-three"
        >
          Oldest First (First Created)
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator className="bg-neutral-800" />
        <DropdownMenuLabel className="text-neutral-500 text-[10px] uppercase tracking-widest font-three">
          Performance
        </DropdownMenuLabel>
        
        <DropdownMenuCheckboxItem
          checked={sortOrder === "most"}
          onCheckedChange={() => setSortOrder("most")}
          className="cursor-pointer focus:bg-[#252525] focus:text-white py-2 font-three"
        >
          Most Clicks
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={sortOrder === "least"}
          onCheckedChange={() => setSortOrder("least")}
          className="cursor-pointer focus:bg-[#252525] focus:text-white py-2 font-three"
        >
          Least Clicks
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}