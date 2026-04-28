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
          className="bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground font-three rounded-lg flex items-center gap-2 h-12 w-full justify-between px-4 outline-none focus:ring-1 focus:ring-ring"
        >
          <div className="flex items-center gap-2">
            <IoTimerOutline size={18} className="text-blue-500" />
            <span className="text-sm">
                {expiryType === "date" ? "Expiry by Date" : "Expiry by Clicks"}
            </span>
          </div>
          <IoChevronDown size={14} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] bg-popover border-border text-popover-foreground font-three shadow-2xl rounded-lg">
        <DropdownMenuLabel className="text-muted-foreground text-xs uppercase tracking-widest p-3">Expiration Method</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuCheckboxItem
          checked={expiryType === "date"}
          onSelect={() => setExpiryType("date")}
          className="cursor-pointer focus:bg-accent focus:text-accent-foreground p-3"
        >
          <IoCalendarOutline className="mr-3" size={18} /> By Specific Date
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={expiryType === "clicks"}
          onSelect={() => setExpiryType("clicks")}
          className="cursor-pointer focus:bg-accent focus:text-accent-foreground p-3"
        >
          <IoStatsChartOutline className="mr-3" size={18} /> By Max Clicks
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}