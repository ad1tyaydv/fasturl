"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Globe02Icon, Alert02Icon } from '@hugeicons/core-free-icons';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


interface AddDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (domain: string) => Promise<void>;
  isAdding: boolean;
}


export default function AddDomainModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  isAdding 
}: AddDomainModalProps) {
  const [domain, setDomain] = useState("");


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };

  }, [isOpen]);


  const handleSubmit = async () => {
    if (!domain) return;
    await onAdd(domain);
    setDomain("");
    onClose();
  };


  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative bg-background border border-border w-full max-w-[450px] rounded-lg p-6 shadow-2xl font-three">
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-md border border-border text-foreground">
              <HugeiconsIcon icon={Globe02Icon} />
            </div>
            <h3 className="text-foreground text-lg font-medium">Connect Domain</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
              SubDomain Name
            </label>
            <Input
              placeholder="e.g. links.mybrand.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="bg-background border-border focus:ring-1 focus:ring-ring text-foreground h-11 transition-all"
            />
          </div>

          <div className="bg-secondary/50 border border-border/50 rounded-md p-3">
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase mb-2 flex items-center gap-2">
              <HugeiconsIcon icon={Alert02Icon} /> Instructions
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enter the subdomain you want to use. After adding, you'll need to point your DNS <b>TXT</b> and <b>CNAME</b> record to our servers.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <Button 
            onClick={handleSubmit}
            disabled={isAdding || !domain}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-bold rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAdding ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Add Domain"
            )}
          </Button>
          
          <button 
            onClick={onClose}
            className="w-full text-muted-foreground hover:text-foreground text-sm font-medium py-2 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}