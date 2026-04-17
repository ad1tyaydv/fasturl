"use client";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

export type DomainFilterType = "all" | "verified" | "unverified";

interface FilterDomainDropDownProps {
  value: DomainFilterType;
  onChange: (value: DomainFilterType) => void;
}

export function FilterDomainDropDown({ value, onChange }: FilterDomainDropDownProps) {
    
  return (
    <Select value={value} onValueChange={(val) => onChange(val as DomainFilterType)}>
      <SelectTrigger className="w-[200px] bg-[#111111] border-neutral-800 text-white rounded-lg outline-none cursor-pointer">
        <SelectValue placeholder="Filter Domains" />
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={5}
        className="bg-[#1a1a1a] border-neutral-800 text-white rounded-lg w-[200px]"
      >
        <SelectItem value="all" className="cursor-pointer hover:bg-neutral-800">All Domains</SelectItem>
        <div className="h-[1px] bg-neutral-800 my-1 mx-2" />
        <SelectItem value="verified" className="cursor-pointer hover:bg-neutral-800">Verified</SelectItem>
        <SelectItem value="unverified" className="cursor-pointer hover:bg-neutral-800">Non-Verified</SelectItem>
      </SelectContent>
    </Select>
  );
}
