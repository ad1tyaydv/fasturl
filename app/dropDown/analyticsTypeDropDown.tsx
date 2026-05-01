"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Link04Icon, File02Icon, ArrowDown01Icon,
} from '@hugeicons/core-free-icons';

export type AnalyticsType = "links" | "bulk";

interface AnalyticsTypeToggleProps {
  value: AnalyticsType;
  onChange: (value: AnalyticsType) => void;
}

export function AnalyticsTypeToggle({ value, onChange }: AnalyticsTypeToggleProps) {
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg flex items-center gap-2 h-10 outline-none focus:ring-1 focus:ring-ring cursor-pointer px-4"
        >
          <HugeiconsIcon
            icon={value === "links" ? Link04Icon : File02Icon}
            size={18}
            className={value === "links" ? "text-blue-500" : "text-amber-500"}
          />
          <span className="text-sm font-semibold capitalize">
            {value === "links" ? "Link Analytics" : "Bulk Analytics"}
          </span>
          <HugeiconsIcon icon={ArrowDown01Icon} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-56 bg-popover border-border text-popover-foreground shadow-2xl rounded-xl p-1.5"
      >
        <DropdownMenuSeparator className="bg-border mx-1" />

        <DropdownMenuCheckboxItem
          checked={value === "links"}
          onCheckedChange={() => onChange("links")}
          className="cursor-pointer focus:bg-accent focus:text-accent-foreground py-3 rounded-lg flex items-center gap-2"
        >
          <HugeiconsIcon icon={Link04Icon} className="text-blue-500" />
          <span className="font-medium">Link Analytics</span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={value === "bulk"}
          onCheckedChange={() => onChange("bulk")}
          className="cursor-pointer focus:bg-accent focus:text-accent-foreground py-3 rounded-lg flex items-center gap-2"
        >
          <HugeiconsIcon icon={File02Icon} className="text-amber-500" />
          <span className="font-medium">Bulk Analytics</span>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}