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
        const verifiedOnes = res.data.userDomains?.filter((d: any) => d.verified) || [];
        setDomains(verifiedOnes);

      } catch (err) {
        console.error("Failed to fetch domains", err);
      }
    };
    getDomains();
    
  }, []);


  const handleVerifyDomain = async (domainName: string) => {
    try {
      const res = await axios.post("/api/domain/verifyDomain", {
        domain: domainName
      });
      
      if (res.status === 200) {
        toast.success("Domain verified successfully!");
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message || "DNS records not found yet. Try again later.");
    } 
  };


  const displayDomain = (selectedDomain ?? "").replace(/^https?:\/\//, "");
  const itemClasses = "flex items-center justify-between text-white focus:text-white cursor-pointer transition-colors duration-200";

  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-300 text-sm font-medium rounded-lg hover:border-neutral-600 transition-all outline-none focus:ring-0">
          <Globe size={16} className="text-blue-500" />
          <span className="truncate max-w-[180px]">{displayDomain}</span>
          <ChevronDown size={14} className="text-neutral-500" />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 bg-[#1c1c1c] border-neutral-800 text-white shadow-2xl">
        <DropdownMenuLabel className="text-neutral-500 text-[10px] uppercase tracking-widest px-2 py-1.5">
          Select Domain
        </DropdownMenuLabel>
        
        <DropdownMenuItem
          onClick={() => onSelect(defaultDomain)}
          className={itemClasses}
        >
          <span className="truncate">
            {defaultDomain.replace(/^https?:\/\//, "")} (Default)
          </span>
          {selectedDomain === defaultDomain && <Check size={14} className="text-blue-400 ml-2 shrink-0" />}
        </DropdownMenuItem>

        {domains.map((d) => (
          <DropdownMenuItem
            key={d.domain}
            onClick={() => {
              onSelect(d.domain);
              handleVerifyDomain(d.domain);
            }}
            className={itemClasses}
          >
            <span className="truncate">{d.domain}</span>
            {selectedDomain === d.domain && <Check size={14} className="text-white ml-2 shrink-0" />}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="bg-neutral-800" />
        
        <DropdownMenuItem
          onClick={() => router.push("/domain")}
          className="flex items-center gap-2 text-neutral-400 focus:text-white cursor-pointer transition-colors"
        >
          <Plus size={14} />
          <span>Manage Domains</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}