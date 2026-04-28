"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, Check, Plus, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


interface DomainDropdownProps {
  selectedDomain: string;
  onSelect: (domain: string) => void;
  defaultDomain: string;
}


export function DomainDropdown({ selectedDomain, onSelect, defaultDomain }: DomainDropdownProps) {
  const router = useRouter();
  const [domains, setDomains] = useState<any[]>([]);


  useEffect(() => {
    const getDomains = async () => {
      try {
        const res = await axios.get("/api/domain/fetchDomain");
        const verifiedDomains = res.data.userDomains?.filter((d: any) => d.isActive) || [];
        setDomains(verifiedDomains);
        console.log("Fetched domains:", verifiedDomains);

      } catch (err) {
        console.error("Failed to fetch domains", err);
      }
    };
    getDomains();

  }, []);


  const displayDomain = (selectedDomain ?? "").replace(/^https?:\/\//, "");
  const itemClasses = "flex items-center justify-between text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer transition-colors duration-200 rounded-md mx-1";


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border text-foreground text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all outline-none focus:ring-1 focus:ring-ring">
          <Globe size={16} className="text-blue-500" />
          <span className="truncate max-w-[180px]">{displayDomain}</span>
          <ChevronDown size={14} className="text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 bg-popover border-border text-popover-foreground shadow-2xl rounded-lg p-1">
        <DropdownMenuLabel className="text-muted-foreground text-[10px] uppercase tracking-widest px-2 py-1.5">
          Select Domain
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => onSelect(defaultDomain)}
          className={itemClasses}
        >
          <span className="truncate">
            {defaultDomain.replace(/^https?:\/\//, "")} (Default)
          </span>
          {selectedDomain === defaultDomain && <Check size={14} className="text-blue-500 ml-2 shrink-0" />}
        </DropdownMenuItem>

        {domains.map((d) => {
          const fullDomain = d.subDomain
            ? `${d.subDomain}.${d.domain}`
            : d.domain;

          return (
            <DropdownMenuItem
              key={d.id}
              onClick={() => {
                onSelect(fullDomain);
              }}
              className={itemClasses}
            >
              <span className="truncate">
                {fullDomain}
              </span>

              {selectedDomain === fullDomain && (
                <Check size={14} className="text-blue-500 ml-2 shrink-0" />
              )}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          onClick={() => router.push("/domain")}
          className="flex items-center gap-2 text-muted-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer transition-colors mx-1 rounded-md"
        >
          <Plus size={14} />
          <span>Manage Domains</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}