"use client";

import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";

interface SavedLinksProps {
  links: any[];
  onSelect: (link: any) => void;
  onDelete: (id: string) => void;
  domain: string;
}

export default function SavedLinks({ links, onSelect, onDelete, domain }: SavedLinksProps) {

  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<"original" | "short" | null>(null);

  
  const copyToClipboard = (e: React.MouseEvent, url: string, id: string, type: "original" | "short") => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrlId(id); setCopiedType(type);
    setTimeout(() => { setCopiedUrlId(null); setCopiedType(null); }, 2000);
  };


  return (
    <div className="flex flex-col gap-4 sm:gap-5 pb-16">
      {links.map((url) => (
        <div
          key={url.id}
          onClick={() => onSelect(url)}
          className="border border-border p-4 sm:p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 hover:shadow-md transition cursor-pointer group bg-card hover:border-primary/50"
        >
          <div className="flex flex-col gap-2 sm:gap-3 w-full overflow-hidden min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
              <div className="truncate text-base font-three sm:text-lg min-w-0 flex-1">
                <strong>Short Url - </strong>
                <span className="font-normal text-muted-foreground">{domain}/{url.shorturl}</span>
              </div>
              <button onClick={(e) => copyToClipboard(e, `${domain}/${url.shorturl}`, url.id, "short")} className="shrink-0 cursor-pointer p-1">
                <IoCopyOutline size={20} className="transition text-muted-foreground hover:text-foreground" />
              </button>
              {copiedUrlId === url.id && copiedType === "short" && (
                <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold shrink-0 bg-green-500/20 text-green-600 dark:text-green-400 uppercase">COPIED!</span>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
              <div className="truncate font-three text-sm sm:text-lg min-w-0 flex-1">
                <strong>Original Url - </strong> 
                <span className="font-normal text-muted-foreground">{url.original}</span>
              </div>
              <button onClick={(e) => copyToClipboard(e, url.original, url.id, "original")} className="shrink-0 cursor-pointer p-1">
                <IoCopyOutline size={20} className="transition text-muted-foreground hover:text-foreground" />
              </button>
              {copiedUrlId === url.id && copiedType === "original" && (
                <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold shrink-0 bg-green-500/20 text-green-600 dark:text-green-400 uppercase">COPIED!</span>
              )}
            </div>
          </div>

          <button onClick={(e) => { e.stopPropagation(); onDelete(url.id); }} className="w-full md:w-auto mt-2 md:mt-0 px-6 py-2.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap shrink-0 opacity-100 md:opacity-80 group-hover:opacity-100 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border border-destructive/20">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}