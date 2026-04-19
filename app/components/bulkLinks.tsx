"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  File02Icon, Download01Icon, Delete02Icon,
  Edit03Icon, CircleLock01Icon, CircleUnlock01Icon, Tick02Icon, ArrowRight01Icon, ArrowLeft01Icon
} from '@hugeicons/core-free-icons';

import BulkPasswordModal from "../modals/bulkPasswordProtection";
import BulkDownloadModal from "../modals/bulkModalDownload";
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
  bulkLinks, onRefresh, searchQuery, setSearchQuery, statusFilter, setStatusFilter, domain, itemCount
}: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [selectedBatchDetails, setSelectedBatchDetails] = useState<any>(null);
  const [displaySearch, setDisplaySearch] = useState(searchQuery);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(itemCount / itemsPerPage);


  useEffect(() => {
    const handler = setTimeout(() => setSearchQuery(displaySearch), 300);
    return () => clearTimeout(handler);

  }, [displaySearch, setSearchQuery]);


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

  
  const handleDeleteBatch = async (urlId: string) => {

    const loadingToast = toast.loading("Deleting batch...");

    try {
      await axios.post(`/api/shortUrl/bulkLinks/delete/${urlId}`);

      toast.success("Batch deleted successfully!", { id: loadingToast });
      onRefresh();

    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete the batch. Please try again.", { id: loadingToast });
    }
  };


  if (selectedBatchDetails) {
    return <BulkLinkDetails batch={selectedBatchDetails} onBack={() => setSelectedBatchDetails(null)} domain={domain} />;
  }


  return (
    <div className="flex flex-col gap-2 w-full">

      <div className="flex flex-col w-full">
        {bulkLinks.length > 0 ? (
          bulkLinks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((url: any) => (
            <div
              key={url.id} onClick={() => setSelectedBatchDetails(url)}
              className="flex items-center justify-between py-5 px-4 border-b border-neutral-800/60 hover:bg-[#1a1a1a] group transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4 w-[40%] min-w-0 pr-4">
                <div className="mt-1 w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <HugeiconsIcon icon={File02Icon} />
                </div>
                <div className="flex flex-col min-w-0 w-full">
                  {editingId === url.id ? (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        autoFocus
                        disabled={savingId === url.id}
                        className="bg-[#111111] border border-neutral-700 rounded px-2 py-1 text-white w-full outline-none disabled:opacity-50"
                        value={tempName} onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveName(e as any, url.id)}
                      />
                      <button
                        onClick={(e) => saveName(e, url.id)}
                        disabled={savingId === url.id}
                        className="text-green-500 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {savingId === url.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        ) : (
                          <HugeiconsIcon icon={Tick02Icon} />
                        )}
                      </button>
                    </div>
                  ) : (
                    <span className="text-white font-one text-xl truncate tracking-wide">{url.name || "Bulk link"}</span>
                  )}
                  <span className="text-neutral-500 font-three text-sm">{url.links?.length || 0} items in this batch</span>
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

              <div className="flex items-center justify-end gap-2 text-neutral-400 w-[30%] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedBatch(url); setIsPasswordModalOpen(true); }}
                  className={`p-2 rounded-lg transition-colors cursor-pointer hover:bg-neutral-800 ${url.password ? 'text-blue-500' : 'hover:text-white'}`}
                >
                  <HugeiconsIcon icon={url.password ? CircleLock01Icon : CircleUnlock01Icon} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingId(url.id); setTempName(url.name || ""); }}
                  className="p-2 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                >
                  <HugeiconsIcon icon={Edit03Icon} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedBatch(url); setShowDownloadModal(true); }}
                  className="p-2 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                >
                  <HugeiconsIcon icon={Download01Icon} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBatch(url.id);
                  }}
                  className="p-2 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete Batch"
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                </button>
              </div>

              <div className="w-[15%] text-right text-neutral-500 font-medium text-sm whitespace-nowrap">
                {getRelativeTime(url.createdAt)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-neutral-600 font-three italic">No link batches discovered yet.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 pb-10 flex-wrap">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="btn btn-outline bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800 disabled:opacity-40"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} /> Prev
          </button>

          {(() => {
            const pages = [];

            for (let i = 1; i <= totalPages; i++) {
              if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 2 && i <= currentPage + 2)
              ) {
                pages.push(i);
              } else if (
                i === currentPage - 3 ||
                i === currentPage + 3
              ) {
                pages.push("...");
              }
            }

            return pages.map((page, index) =>
              page === "..." ? (
                <span key={index} className="px-2 text-neutral-500">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(Number(page))}
                  className={`btn btn-square ${currentPage === page
                      ? "bg-white text-black"
                      : "bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800"
                    }`}
                >
                  {page}
                </button>
              )
            );
          })()}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="btn btn-outline bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800 disabled:opacity-40"
          >
            Next <HugeiconsIcon icon={ArrowRight01Icon} />
          </button>

        </div>
      )}

      <BulkPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        selectedBatch={selectedBatch}
        onSuccess={onRefresh}
      />

      <BulkDownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        batchName={selectedBatch?.name}
        links={selectedBatch?.links || []}
      />
    </div>
  );
}