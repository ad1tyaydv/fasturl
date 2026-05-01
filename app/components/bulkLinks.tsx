"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  File02Icon, Download01Icon, Delete02Icon,
  Edit03Icon, CircleLock01Icon, CircleUnlock01Icon, Tick02Icon, 
  PlusSignIcon, ArrowRight01Icon, ArrowLeft01Icon
} from '@hugeicons/core-free-icons';

import BulkPasswordProtectionModal from "../modals/bulkPasswordProtection";
import BulkDownloadModal from "../modals/bulkDownloadModal";
import BulkLinkDetails from "./bulkLinkDetails";

const getRelativeTime = (dateString?: string) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return date.toLocaleDateString();
};

export default function BulkLinks({
  bulkLinks, onRefresh, searchQuery, setSearchQuery, statusFilter, setStatusFilter, domain, itemCount, setIsDetailViewOpen, userTier = "FREE",
  onOpenQr, onOpenPassword, onOpenCustom
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [selectedBatchDetails, setSelectedBatchDetails] = useState<any>(null);
  const [displaySearch, setDisplaySearch] = useState(searchQuery);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const totalPages = Math.ceil(itemCount / itemsPerPage);

  useEffect(() => {
    const batchId = searchParams.get("batchId");
    if (batchId && bulkLinks.length > 0) {
      const batch = bulkLinks.find((b: any) => b.id === batchId);

      if (batch) setSelectedBatchDetails(batch);
    }

  }, [searchParams, bulkLinks]);


  const updateBatchSelection = (batch: any | null) => {
    setSelectedBatchDetails(batch);
    const params = new URLSearchParams(searchParams.toString());
    if (batch) {
      params.set("batchId", batch.id);

    } else {
      params.delete("batchId");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const handler = setTimeout(() => setSearchQuery(displaySearch), 300);
    return () => clearTimeout(handler);

  }, [displaySearch, setSearchQuery]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);


  useEffect(() => {
    if (setIsDetailViewOpen) {
      setIsDetailViewOpen(!!selectedBatchDetails);
    }
    
  }, [selectedBatchDetails, setIsDetailViewOpen]);


  const handleProtectedAction = (action: () => void) => {
    if (userTier === "FREE") {
      toast.error("Upgrade to Premium to create bulk links!");
      router.push("/premium");

    } else {
      action();
    }
  };

  const saveName = async (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
    e.stopPropagation();
    if (!tempName.trim()) { setEditingId(null); return; }

    setSavingId(id);
    try {
      await axios.post("/api/shortUrl/bulkLinks/updateName", {
        linkId: id,
        name: tempName.trim()
      });

      toast.success("Updated");
      onRefresh();
      setEditingId(null);

    } catch {
      toast.error("Failed to update");
      
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteBatch = async (id: string) => {
    const loadingToast = toast.loading("Deleting batch...");
    try {
      await axios.post(`/api/shortUrl/bulkLinks/delete/${id}`);
      toast.success("Batch deleted successfully!", { id: loadingToast });

      onRefresh();
    } catch (error) {
      toast.error("Failed to delete the batch. Please try again.", { id: loadingToast });
      
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {selectedBatchDetails ? (
        <BulkLinkDetails 
          batch={selectedBatchDetails} 
          onBack={() => updateBatchSelection(null)} 
          domain={domain} 
          onOpenPassword={onOpenPassword}
          onOpenCustom={onOpenCustom}
          onOpenQr={onOpenQr}
          onRefresh={onRefresh}
        />
      ) : (
        <div className="flex flex-col w-full" ref={menuRef}>
          {bulkLinks.length > 0 ? (
            bulkLinks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((url: any) => (
              <div
                key={url.id} onClick={() => updateBatchSelection(url)}
                className="relative flex items-center justify-between py-5 px-4 border-b border-border/60 hover:bg-accent group transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3 md:gap-4 w-[85%] md:w-[40%] min-w-0 pr-2 md:pr-4">
                  <div className="mt-1 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <HugeiconsIcon icon={File02Icon} />
                  </div>
                  <div className="flex flex-col min-w-0 w-full">
                    {editingId === url.id ? (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          autoFocus
                          disabled={savingId === url.id}
                          className="bg-background border border-border rounded px-2 py-1 text-foreground w-full outline-none disabled:opacity-50"
                          value={tempName} onChange={(e) => setTempName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveName(e as any, url.id)}
                        />
                        <button
                          onClick={(e) => saveName(e, url.id)}
                          disabled={savingId === url.id}
                          className="text-green-500 cursor-pointer disabled:cursor-not-allowed shrink-0"
                        >
                          {savingId === url.id ? (
                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                          ) : (
                            <HugeiconsIcon icon={Tick02Icon} />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-foreground font-one text-lg md:text-xl truncate tracking-wide">{url.name || "Bulk link"}</span>
                    )}
                    <span className="text-muted-foreground font-three text-xs md:text-sm truncate">{url.links?.length || 0} items in this batch</span>
                  </div>
                </div>

                <div className="hidden md:flex w-[15%] shrink-0">
                  {url.password && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <HugeiconsIcon icon={CircleLock01Icon} size={15} />
                      <span className="text-[10px] uppercase tracking-widest font-one">Protected</span>
                    </div>
                  )}
                </div>

                <div className="hidden md:flex items-center justify-end gap-2 text-muted-foreground w-[30%] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleProtectedAction(() => { setSelectedBatch(url); setIsPasswordModalOpen(true); }); }}
                    className={`p-2 rounded-lg transition-colors cursor-pointer hover:bg-accent ${url.password ? 'text-blue-500' : 'hover:text-foreground'}`}
                  >
                    <HugeiconsIcon icon={url.password ? CircleLock01Icon : CircleUnlock01Icon} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleProtectedAction(() => { setEditingId(url.id); setTempName(url.name || ""); }); }}
                    className="p-2 hover:text-foreground hover:bg-accent rounded-lg transition-colors cursor-pointer"
                  >
                    <HugeiconsIcon icon={Edit03Icon} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleProtectedAction(() => { setSelectedBatch(url); setShowDownloadModal(true); }); }}
                    className="p-2 hover:text-foreground hover:bg-accent rounded-lg transition-colors cursor-pointer"
                  >
                    <HugeiconsIcon icon={Download01Icon} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteBatch(url.id); }}
                    className="p-2 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <HugeiconsIcon icon={Delete02Icon} />
                  </button>
                </div>

                <div className="hidden md:block w-[15%] text-right text-muted-foreground font-medium text-sm whitespace-nowrap">
                  {getRelativeTime(url.createdAt)}
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden flex justify-end w-[15%] shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === url.id ? null : url.id); }} className="p-2 text-muted-foreground">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                  </button>
                  {activeMenuId === url.id && (
                    <div onClick={(e) => e.stopPropagation()} className="absolute right-4 top-14 mt-1 w-48 bg-popover border border-border rounded-lg shadow-xl z-50 flex flex-col py-2">
                      <button onClick={() => handleProtectedAction(() => { setSelectedBatch(url); setIsPasswordModalOpen(true); setActiveMenuId(null); })} className={`flex items-center gap-3 px-4 py-2 text-sm ${url.password ? 'text-blue-500' : 'text-popover-foreground'}`}>
                        <HugeiconsIcon icon={url.password ? CircleLock01Icon : CircleUnlock01Icon} size={18} /> {url.password ? 'Protected' : 'Add Password'}
                      </button>
                      <button onClick={() => handleProtectedAction(() => { setEditingId(url.id); setTempName(url.name || ""); setActiveMenuId(null); })} className="flex items-center gap-3 px-4 py-2 text-sm text-popover-foreground">
                        <HugeiconsIcon icon={Edit03Icon} size={18} /> Edit Name
                      </button>
                      <button onClick={() => handleProtectedAction(() => { setSelectedBatch(url); setShowDownloadModal(true); setActiveMenuId(null); })} className="flex items-center gap-3 px-4 py-2 text-sm text-popover-foreground">
                        <HugeiconsIcon icon={Download01Icon} size={18} /> Download
                      </button>
                      <div className="h-px bg-border my-1 mx-2" />
                      <button onClick={() => { handleDeleteBatch(url.id); setActiveMenuId(null); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-500">
                        <HugeiconsIcon icon={Delete02Icon} size={18} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            /* EMPTY STATE */
            <div className="w-full py-20 px-4 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-secondary/30 mt-4">
              <div className="p-4 bg-secondary rounded-2xl border border-border mb-6">
                  <HugeiconsIcon icon={File02Icon} className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl sm:text-2xl font-one mb-2 text-foreground">No bulk batches discovered</h2>
              <p className="text-muted-foreground font-three text-sm mb-8 text-center max-w-md">
                  Create your first batch of links to manage them efficiently. Premium users can password protect and bulk download these batches.
              </p>
              <button 
                onClick={() => handleProtectedAction(() => router.push('/bulklinks'))} 
                className="bg-foreground text-background hover:opacity-90 font-three px-8 py-3 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={PlusSignIcon} className="w-5 h-5" /> Create Bulk links
              </button>
            </div>
          )}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {!selectedBatchDetails && totalPages > 1 && bulkLinks.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-8 pb-10 flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="btn btn-outline bg-background border-border text-foreground hover:bg-accent disabled:opacity-40 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} /> Prev
          </button>

          {(() => {
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
              if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                pages.push(i);
              } else if (i === currentPage - 3 || i === currentPage + 3) {
                pages.push("...");
              }
            }
            return pages.map((page, index) =>
              page === "..." ? (
                <span key={index} className="px-2 text-muted-foreground">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(Number(page))}
                  className={`w-10 h-10 rounded-lg border font-one transition-colors cursor-pointer ${currentPage === page ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-foreground hover:bg-accent"}`}
                >
                  {page}
                </button>
              )
            );
          })()}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="btn btn-outline bg-background border-border text-foreground hover:bg-accent disabled:opacity-40 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            Next <HugeiconsIcon icon={ArrowRight01Icon} />
          </button>
        </div>
      )}

      <BulkPasswordProtectionModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} selectedBatch={selectedBatch} onSuccess={onRefresh} />
      <BulkDownloadModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} batchName={selectedBatch?.name} links={selectedBatch?.links || []} />
    </div>
  );
}
