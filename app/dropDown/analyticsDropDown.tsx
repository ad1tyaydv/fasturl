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

import { HugeiconsIcon } from '@hugeicons/react';
import {
  FilterIcon, ArrowDown01Icon }
  from '@hugeicons/core-free-icons';

interface AnalyticsFilterProps {
  days: number;
  setDays: (days: number) => void;
}

export function AnalyticsDropDown({ days, setDays }: AnalyticsFilterProps) {


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg flex items-center gap-2 h-9 outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        >
          <HugeiconsIcon icon={FilterIcon} />
          <span className="text-xs font-medium cusor-pointer">Last {days} Days</span>
          <HugeiconsIcon icon={ArrowDown01Icon} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end"
        className="w-48 bg-popover border-border text-popover-foreground shadow-2xl rounded-lg"
      >
        <DropdownMenuLabel className="text-muted-foreground text-[10px] uppercase tracking-widest px-2 py-1.5">
          Time Range
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        
        {[7, 14, 28].map((range) => (
          <DropdownMenuCheckboxItem
            key={range}
            checked={days === range}
            onCheckedChange={() => setDays(range)}
            className="cursor-pointer focus:bg-accent focus:text-accent-foreground py-2"
          >
            Last {range} Days
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}