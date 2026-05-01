"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TimeFilter = "today" | "7days" | "30days" | "lifetime";

interface TimeFilterProps {
  value: TimeFilter;
  onChange: (value: TimeFilter) => void;
}

export function TimeFilterDropDown({ value, onChange }: TimeFilterProps) {

    
  return (
    <Select value={value} onValueChange={(val) => onChange(val as TimeFilter)}>
      <SelectTrigger className="w-[180px] bg-background border-border text-foreground font-three focus:ring-1 focus:ring-ring rounded-lg outline-none cursor-pointer">
        <SelectValue placeholder="Select timeframe" />
      </SelectTrigger>
      
      <SelectContent 
        position="popper" 
        sideOffset={5} 
        className="bg-popover border-border text-popover-foreground font-three rounded-lg w-[180px]"
      >
        <SelectItem value="today" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
          Created Today
        </SelectItem>
        <SelectItem value="7days" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
          Last 7 Days
        </SelectItem>
        <SelectItem value="30days" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
          Last 30 Days
        </SelectItem>
        <SelectItem value="lifetime" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
          Lifetime
        </SelectItem>
      </SelectContent>
    </Select>
  );
}