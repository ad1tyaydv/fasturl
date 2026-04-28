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
      <SelectTrigger className="w-[200px] bg-background border-border text-foreground rounded-lg outline-none cursor-pointer">
        <SelectValue placeholder="Filter & Sort" />
      </SelectTrigger>
      
      <SelectContent 
        position="popper"
        sideOffset={5} 
        className="bg-popover border-border text-popover-foreground rounded-lg w-[200px]"
      >
        <SelectItem value="all" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">All Links</SelectItem>
        <div className="h-[1px] bg-border my-1 mx-2" />
        
        <SelectItem value="today" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">Created Today</SelectItem>
        <SelectItem value="7days" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">Last 7 Days</SelectItem>
        <SelectItem value="30days" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">Last 30 Days</SelectItem>
        
        <div className="h-[1px] bg-border my-1 mx-2" />
        
        <SelectItem value="most-clicked" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">Most Clicked</SelectItem>
        <SelectItem value="protected" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">Password Protected</SelectItem>
      </SelectContent>
    </Select>
  );
}