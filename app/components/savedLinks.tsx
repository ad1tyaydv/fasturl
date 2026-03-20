"use client";

import { useState } from "react";
import { IoCopyOutline, IoPencilOutline, IoCheckmarkOutline, IoSearchOutline, IoChevronBack, IoChevronForward } from "react-icons/io5";

interface SavedLinksProps {
  links: any[];
  onSelect: (link: any) => void;
  onDelete: (id: string) => void;
  onUpdateName: (id: string, newName: string) => void;
  domain: string;
  updatingLinkId: string | null;
}

export default function SavedLinks({ 
  links, 
  onSelect, 
  onDelete, 
  onUpdateName, 
  domain,
  updatingLinkId 
}: SavedLinksProps) {
  
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<"original" | "short" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const copyToClipboard = (e: React.MouseEvent, url: string, id: string, type: "original" | "short") => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrlId(id); setCopiedType(type);
    setTimeout(() => { setCopiedUrlId(null); setCopiedType(null); }, 2000);
  };

  const saveName = (id: string) => {
    if (tempName.trim()) {
      onUpdateName(id, tempName);
    }
    setEditingId(null);
  };

  const filteredLinks = links.filter((link) => {
    const query = searchQuery.toLowerCase();
    return (
      link.name?.toLowerCase().includes(query) ||
      link.shorturl?.toLowerCase().includes(query) ||
      link.original?.toLowerCase().includes(query)
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLinks = filteredLinks.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-6 pb-16">
      <div className="relative w-full mb-2">
        <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input 
          type="text"
          placeholder="Search by name or link..."
          className="w-full pl-12 pr-4 py-3 bg-card border border-neutral-400 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search
          }}
        />
      </div>

      <div className="flex flex-col gap-6 sm:gap-8">
        {currentLinks.length > 0 ? (
          <>
            {currentLinks.map((url) => (
              <div
                key={url.id}
                onClick={() => onSelect(url)}
                className="border border-border p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row md:items-end justify-between gap-6 hover:shadow-lg transition cursor-pointer group bg-card hover:border-primary/50"
              >
                <div className="flex flex-col gap-4 w-full overflow-hidden min-w-0">
                  <div className="flex items-center gap-3 group/name">
                    {updatingLinkId === url.id ? (
                      <h3 className="text-xl sm:text-2xl font-bold text-primary animate-pulse">Updating...</h3>
                    ) : editingId === url.id ? (
                      <div className="flex items-center gap-2 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <input
                          autoFocus
                          className="bg-background border border-primary rounded px-2 py-1 text-lg font-bold w-full focus:outline-none"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveName(url.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                        <button onClick={() => saveName(url.id)} className="text-green-500 cursor-pointer">
                          <IoCheckmarkOutline size={24} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl sm:text-2xl font-bold truncate">{url.name || "Untitled Link"}</h3>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(url.id);
                            setTempName(url.name || "");
                          }}
                          className="opacity-0 group-hover/name:opacity-100 transition-opacity p-1 hover:bg-muted rounded cursor-pointer"
                        >
                          <IoPencilOutline size={18} className="text-muted-foreground" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                      <div className="truncate text-base font-three sm:text-lg min-w-0 flex-1">
                        <strong>Short Url - </strong>
                        <span className="font-normal text-muted-foreground">{domain}/{url.shorturl}</span>
                      </div>
                      <button onClick={(e) => copyToClipboard(e, `${domain}/${url.shorturl}`, url.id, "short")} className="shrink-0 p-1 cursor-pointer">
                        <IoCopyOutline size={20} className="text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                      <div className="truncate font-three text-sm sm:text-lg min-w-0 flex-1">
                        <strong>Original Url - </strong> 
                        <span className="font-normal text-muted-foreground">{url.original}</span>
                      </div>
                      <button onClick={(e) => copyToClipboard(e, url.original, url.id, "original")} className="shrink-0 p-1 cursor-pointer">
                        <IoCopyOutline size={20} className="text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(url.id); }} 
                  className="w-full md:w-auto px-8 py-3 rounded-xl font-medium bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border border-destructive/20 transition whitespace-nowrap cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-8 mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <IoChevronBack size={20} />
                </button>
                
                <span className="font-bold text-xl tracking-widest">
                  {startIndex + 1} - {Math.min(endIndex, filteredLinks.length)}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <IoChevronForward size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No links found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}