"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from '@hugeicons/react';
import { Link04Icon, File02Icon } from '@hugeicons/core-free-icons';

export type AnalyticsType = "links" | "bulk";

interface AnalyticsTypeToggleProps {
  value: AnalyticsType;
  onChange: (value: AnalyticsType) => void;
}

export function AnalyticsTypeToggle({ value, onChange }: AnalyticsTypeToggleProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as AnalyticsType)}>
      <SelectTrigger className="w-[220px] bg-[#111111] border-neutral-800 text-white rounded-lg outline-none cursor-pointer h-12 font-bold text-lg focus:ring-0">
        <SelectValue placeholder="Select Type" />
      </SelectTrigger>
      
      <SelectContent 
        position="popper"
        sideOffset={5} 
        className="bg-[#1a1a1a] border-neutral-800 text-white rounded-lg w-[220px] z-[130]"
      >
        <SelectItem value="links" className="cursor-pointer hover:bg-neutral-800 py-3">
            <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Link04Icon} size={16} className="text-blue-500" />
                <span>Link Analytics</span>
            </div>
        </SelectItem>
        <div className="h-[1px] bg-neutral-800 my-1 mx-2" />
        <SelectItem value="bulk" className="cursor-pointer hover:bg-neutral-800 py-3">
            <div className="flex items-center gap-2">
                <HugeiconsIcon icon={File02Icon} size={16} className="text-amber-500" />
                <span>Bulk Analytics</span>
            </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}