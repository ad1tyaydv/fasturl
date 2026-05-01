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
import { IoFilterOutline } from "react-icons/io5"
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowDown01Icon
}
  from '@hugeicons/core-free-icons';
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
          className="bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground font-three rounded-lg flex items-center gap-2 h-10 outline-none focus:ring-1 focus:ring-ring"
        >
          <IoFilterOutline size={18} className="text-blue-500" />
          <span className="text-sm">Sort: {getLabel()}</span>
          <HugeiconsIcon icon={ArrowDown01Icon} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end"
        className="w-56 bg-popover border-border text-popover-foreground font-three shadow-2xl rounded-lg"
      >
        <DropdownMenuLabel className="text-muted-foreground text-[10px] uppercase tracking-widest font-three">
          Date Created
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuCheckboxItem
          checked={sortOrder === "newest"}
          onCheckedChange={() => setSortOrder("newest")}
          className="cursor-pointer focus:bg-accent focus:text-accent-foreground py-2 font-three"
        >
          Newest First (Recent)
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={sortOrder === "oldest"}
          onCheckedChange={() => setSortOrder("oldest")}
          className="cursor-pointer focus:bg-accent focus:text-accent-foreground py-2 font-three"
        >
          Oldest First (First Created)
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuLabel className="text-muted-foreground text-[10px] uppercase tracking-widest font-three">
          Performance
        </DropdownMenuLabel>
        
        <DropdownMenuCheckboxItem
          checked={sortOrder === "most"}
          onCheckedChange={() => setSortOrder("most")}
          className="cursor-pointer focus:bg-accent focus:text-accent-foreground py-2 font-three"
        >
          Most Clicks
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={sortOrder === "least"}
          onCheckedChange={() => setSortOrder("least")}
          className="cursor-pointer focus:bg-accent focus:text-accent-foreground py-2 font-three"
        >
          Least Clicks
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}