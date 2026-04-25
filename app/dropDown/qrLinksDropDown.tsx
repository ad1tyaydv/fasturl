"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type QrFilterType = "today" | "7days" | "30days" | "all";

interface QrFilterDropDownProps {
  value: QrFilterType;
  onChange: (value: QrFilterType) => void;
}

export function QrFilterDropDown({ value, onChange }: QrFilterDropDownProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as QrFilterType)}>
      <SelectTrigger className="w-[200px] bg-[#111111] border-neutral-800 text-white rounded-lg outline-none cursor-pointer">
        <SelectValue placeholder="Filter QR Codes" />
      </SelectTrigger>
      
      <SelectContent 
        position="popper"
        sideOffset={5} 
        className="bg-[#1a1a1a] border-neutral-800 text-white rounded-lg w-[200px]"
      >
        <SelectItem value="all" className="cursor-pointer hover:bg-neutral-800">
          All QR Codes
        </SelectItem>
        
        <div className="h-[1px] bg-neutral-800 my-1 mx-2" />
        
        <SelectItem value="today" className="cursor-pointer hover:bg-neutral-800">
          Created Today
        </SelectItem>
        <SelectItem value="7days" className="cursor-pointer hover:bg-neutral-800">
          Last 7 Days
        </SelectItem>
        <SelectItem value="30days" className="cursor-pointer hover:bg-neutral-800">
          Last 30 Days
        </SelectItem>
      </SelectContent>
    </Select>
  );
}