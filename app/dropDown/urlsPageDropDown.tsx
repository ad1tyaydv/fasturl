"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterType = "today" | "7days" | "30days" | "most-clicked" | "protected" | "all";

interface FilterDropDownProps {
  value: FilterType;
  onChange: (value: FilterType) => void;
}

export function FilterDropDown({ value, onChange }: FilterDropDownProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as FilterType)}>
      <SelectTrigger className="w-[200px] bg-[#111111] border-neutral-800 text-white rounded-lg outline-none cursor-pointer">
        <SelectValue placeholder="Filter & Sort" />
      </SelectTrigger>
      
      <SelectContent 
        position="popper" 
        sideOffset={5} 
        className="bg-[#1a1a1a] border-neutral-800 text-white rounded-lg w-[200px]"
      >
        <SelectItem value="all" className="cursor-pointer hover:bg-neutral-800">All Links</SelectItem>
        <div className="h-[1px] bg-neutral-800 my-1 mx-2" />
        
        <SelectItem value="today" className="cursor-pointer hover:bg-neutral-800">Created Today</SelectItem>
        <SelectItem value="7days" className="cursor-pointer hover:bg-neutral-800">Last 7 Days</SelectItem>
        <SelectItem value="30days" className="cursor-pointer hover:bg-neutral-800">Last 30 Days</SelectItem>
        
        <div className="h-[px] bg-neutral-800 my-1 mx-2" />
        
        <SelectItem value="most-clicked" className="cursor-pointer hover:bg-neutral-800">Most Clicked</SelectItem>
        <SelectItem value="protected" className="cursor-pointer hover:bg-neutral-800">Password Protected</SelectItem>
      </SelectContent>
    </Select>
  );
}