"use client";

import { useEffect, useState } from "react";
import { 
  Globe, 
  X, 
  Loader2, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


interface ConnectDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (domain: string) => Promise<void>;
  isAdding: boolean;
}


export default function ConnectDomainModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  isAdding 
}: ConnectDomainModalProps) {
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
        className="absolute inset-0 bg-black/70 transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative bg-[#111111] border border-neutral-800 w-full max-w-[450px] rounded-lg p-6 shadow-2xl font-three">
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-900 rounded-md border border-neutral-800">
              <Globe size={18} className="text-white" />
            </div>
            <h3 className="text-white text-lg font-medium">Connect Domain</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-2 block">
              Domain Name
            </label>
            <Input
              placeholder="e.g. links.mybrand.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="bg-[#1a1a1a] border-neutral-800 focus:border-neutral-600 text-white h-11 transition-all"
            />
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-md p-3">
            <h4 className="text-[11px] font-bold text-neutral-400 uppercase mb-2 flex items-center gap-2">
              <AlertCircle size={12} /> Instructions
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Enter the domain or subdomain you want to use. After adding, you'll need to point your DNS <b>CNAME</b> record to our servers.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <Button 
            onClick={handleSubmit}
            disabled={isAdding || !domain}
            className="w-full bg-white text-black hover:bg-neutral-200 h-11 font-bold rounded-md transition-all flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Add Domain"
            )}
          </Button>
          
          <button 
            onClick={onClose}
            className="w-full text-neutral-500 hover:text-neutral-300 text-sm font-medium py-2 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}