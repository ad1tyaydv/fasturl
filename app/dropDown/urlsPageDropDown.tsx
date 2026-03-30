"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterType = "today" | "7days" | "30days" | "lifetime" | "most-clicked" | "protected" | "all";

interface FilterDropDownProps {
  value: string;
  onChange: (value: FilterType) => void;
}

export function FilterDropDown({ value, onChange }: FilterDropDownProps) {

    
  return (
    <Select value={value} onValueChange={(val) => onChange(val as FilterType)}>
      <SelectTrigger className="w-[200px] bg-[#1a1a1a] border-neutral-800 text-white focus:ring-1 focus:ring-neutral-700 rounded-lg outline-none">
        <SelectValue placeholder="Filter & Sort" />
      </SelectTrigger>
      
      <SelectContent 
        position="popper" 
        sideOffset={5} 
        className="bg-[#1a1a1a] border-neutral-800 text-white rounded-lg w-[200px]"
      >
        <SelectItem value="all" className="cursor-pointer">All Links</SelectItem>
        <div className="h-[1px] bg-neutral-800 my-1 mx-2" />
        
        <SelectItem value="today" className="cursor-pointer">Created Today</SelectItem>
        <SelectItem value="7days" className="cursor-pointer">Last 7 Days</SelectItem>
        <SelectItem value="30days" className="cursor-pointer">Last 30 Days</SelectItem>
        <SelectItem value="lifetime" className="cursor-pointer">Lifetime (Newest)</SelectItem>
        
        <div className="h-[1px] bg-neutral-800 my-1 mx-2" />
        
        <SelectItem value="most-clicked" className="cursor-pointer">
          Most Clicked
        </SelectItem>
        <SelectItem value="protected" className="cursor-pointer">
          Password Protected
        </SelectItem>
      </SelectContent>
    </Select>
  );
}