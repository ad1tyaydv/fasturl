"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  IoSearchOutline, IoTrashOutline, IoLockOpenOutline, IoPencilOutline,
  IoCheckmarkOutline, IoFileTrayFullOutline, IoDownloadOutline,
  IoCloseOutline, IoDocumentTextOutline, IoLockClosedOutline, IoFilterOutline
} from "react-icons/io5";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import BulkPasswordModal from "../modals/bulkPasswordProtection";
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
  bulkLinks, 
  onRefresh, 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  domain
}: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [selectedBatchDetails, setSelectedBatchDetails] = useState<any>(null); // New state for navigation

  const [displaySearch, setDisplaySearch] = useState(searchQuery);


  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(displaySearch);
    }, 300);
    return () => clearTimeout(handler);

  }, [displaySearch, setSearchQuery]);


  const saveName = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!tempName.trim()) { setEditingId(null); return; }
    try {
      await axios.post("/api/shortUrl/bulkLinks/updateName", { linkId: id, name: tempName.trim() });
      toast.success("Updated");
      onRefresh();

    } catch { 
      toast.error("Failed to update name"); 
    }
    setEditingId(null);
  };



  if (selectedBatchDetails) {
    return (
      <BulkLinkDetails 
        batch={selectedBatchDetails} 
        onBack={() => setSelectedBatchDetails(null)} 
        domain={domain}
      />
    );
  }


  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 mt-2">
        <div className="relative w-full sm:w-[320px]">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input 
            type="text" 
            placeholder="Search batches..." 
            className="w-full pl-10 pr-4 py-2 bg-[#111111] border border-neutral-800 rounded-lg text-white text-sm outline-none focus:border-neutral-600 transition-all" 
            value={displaySearch} 
            onChange={(e) => setDisplaySearch(e.target.value)} 
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-neutral-800 rounded-lg text-sm text-neutral-400 outline-none hover:text-white transition-colors cursor-pointer">
            <IoFilterOutline size={18} /> {statusFilter === "all" ? "All Batches" : "Protected Only"}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1c1c1c] border-neutral-800 text-white min-w-[180px]">
            <DropdownMenuItem onClick={() => setStatusFilter("all")} className="cursor-pointer">All Batches</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("protected")} className="cursor-pointer">Protected Only</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col w-full">
        {bulkLinks.length > 0 ? (
          bulkLinks.map((url: any) => (
            <div 
              key={url.id} 
              onClick={() => setSelectedBatchDetails(url)} // Handle opening details
              className="flex items-center justify-between py-5 px-4 border-b border-neutral-800/60 hover:bg-[#1a1a1a] group transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4 w-[40%] min-w-0 pr-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <IoFileTrayFullOutline size={18} />
                </div>
                <div className="flex flex-col min-w-0 w-full">
                  {editingId === url.id ? (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input 
                        autoFocus 
                        className="bg-[#111111] border border-neutral-700 rounded px-2 py-1 text-white w-full outline-none" 
                        value={tempName} 
                        onChange={(e) => setTempName(e.target.value)} 
                        onKeyDown={(e) => e.key === "Enter" && saveName(e as any, url.id)} 
                      />
                      <button onClick={(e) => saveName(e, url.id)} className="text-green-500 cursor-pointer"><IoCheckmarkOutline size={22} /></button>
                    </div>
                  ) : (
                    <span className="text-white font-one text-xl truncate tracking-wide">
                      {url.name || "Bulk link"}
                    </span>
                  )}
                  <span className="text-neutral-500 font-three text-base">{url.links?.length || 0} items</span>
                </div>
              </div>

              <div className="hidden md:flex w-[15%] shrink-0">
                {url.password && (
                  <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Protected
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 text-neutral-400 w-[30%] opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedBatch(url); setIsPasswordModalOpen(true); }} 
                  className={`p-2 rounded-md transition-colors cursor-pointer ${url.password ? 'text-blue-500' : 'hover:text-white'}`}
                >
                    {url.password ? <IoLockClosedOutline size={18} /> : <IoLockOpenOutline size={18} />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); setEditingId(url.id); setTempName(url.name || ""); }} className="p-2 hover:text-white rounded-md transition-colors cursor-pointer">
                  <IoPencilOutline size={18} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setSelectedBatch(url); setShowDownloadModal(true); }} className="p-2 hover:text-white rounded-md transition-colors cursor-pointer">
                  <IoDownloadOutline size={18} />
                </button>
                <button onClick={async (e) => { 
                  e.stopPropagation();
                  if(confirm("Are you sure?")) {
                    await axios.post(`/api/shortUrl/bulkLinks/delete/${url.id}`); 
                    onRefresh();
                  }
                }} className="p-2 hover:text-red-500 rounded-md transition-colors cursor-pointer">
                  <IoTrashOutline size={18} />
                </button>
              </div>

              <div className="w-[15%] text-right text-neutral-500 font-medium text-sm whitespace-nowrap">
                {getRelativeTime(url.createdAt)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-neutral-500">No batches found.</div>
        )}
      </div>

      <BulkPasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        selectedBatch={selectedBatch}
        onSuccess={onRefresh}
      />

      {showDownloadModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" onClick={() => setShowDownloadModal(false)} />
          <div className="relative bg-[#1c1c1c] border border-neutral-800 w-full max-w-[320px] rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 text-white font-one text-lg">
              Download Batch 
              <button onClick={() => setShowDownloadModal(false)} className="text-neutral-500 hover:text-white transition-colors cursor-pointer">
                <IoCloseOutline size={22}/>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 hover:bg-[#2a2a2a] text-white text-sm transition-colors cursor-pointer">
                <IoDocumentTextOutline className="text-red-500" size={18}/>PDF Document
              </button>
              <button className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 hover:bg-[#2a2a2a] text-white text-sm transition-colors cursor-pointer">
                <IoFileTrayFullOutline className="text-green-500" size={18}/>CSV Spreadsheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}