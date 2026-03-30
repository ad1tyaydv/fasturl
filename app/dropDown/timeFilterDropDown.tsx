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
      <SelectTrigger className="w-[180px] bg-[#1a1a1a] border-neutral-800 text-white font-three focus:ring-1 focus:ring-blue-500 rounded-lg outline-none">
        <SelectValue placeholder="Select timeframe" />
      </SelectTrigger>
      
      <SelectContent 
        position="popper" 
        sideOffset={5} 
        className="bg-[#1a1a1a] border-neutral-800 text-white font-three rounded-lg w-[180px]"
      >
        <SelectItem value="today" className="cursor-pointer">
          Created Today
        </SelectItem>
        <SelectItem value="7days" className="cursor-pointer">
          Last 7 Days
        </SelectItem>
        <SelectItem value="30days" className="cursor-pointer">
          Last 30 Days
        </SelectItem>
        <SelectItem value="lifetime" className="cursor-pointer">
          Lifetime
        </SelectItem>
      </SelectContent>
    </Select>
  );
}