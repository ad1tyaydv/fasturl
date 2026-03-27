"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  IoSearchOutline, IoChevronBack, IoChevronForward,
  IoTrashOutline, IoLockOpenOutline, IoPencilOutline,
  IoCheckmarkOutline, IoFileTrayFullOutline, IoDownloadOutline,
  IoCloseOutline, IoDocumentTextOutline, IoLockClosedOutline
} from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PasswordProtectionModal from "../modals/passwordProtection";

interface BulkLinksProps {
  bulkLinks: any[];
  onRefresh: () => void;
  domain: string;
  userPlan: string;
}


const getRelativeTime = (dateString?: string) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 30) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
};


export default function BulkLinks({ bulkLinks, onRefresh, domain, userPlan }: BulkLinksProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<any | null>(null);


  const saveName = async (id: string) => {
    if (tempName.trim()) {
      try {
        await axios.post("/api/shortUrl/bulkLinks/updateName", { linkId: id, name: tempName });
        onRefresh();

      } catch (err) {
        console.error("Failed to update name:", err);
      }
    }
    setEditingId(null);
  };


  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bulk batch?")) return;
    try {
      await axios.delete(`/api/shortUrl/bulkLinks/delete/${id}`);
      onRefresh();

    } catch (error) {
      console.error("Failed to delete bulk job", error);
    }
  };


  const exportPDF = () => {
    if (!selectedUrl?.links) return;
    const doc = new jsPDF();
    doc.text(`Shortly - Bulk Batch: ${selectedUrl.name || "Links"}`, 14, 15);
    autoTable(doc, {
      head: [['#', 'Original URL', 'Short URL']],
      body: selectedUrl.links.map((l: any, i: number) => [i + 1, l.original, `${domain}/${l.shorturl || l.short}`]),
      startY: 20,
    });
    doc.save(`bulk-links-${selectedUrl.id}.pdf`);
  };


  const exportCSV = () => {
    if (!selectedUrl?.links) return;
    const headers = "Original URL,Short URL\n";
    const rows = selectedUrl.links.map((l: any) => `${l.original},${domain}/${l.shorturl || l.short}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-links-${selectedUrl.id}.csv`;
    a.click();
  };


  const filteredLinks = bulkLinks.filter((link) => {
    const query = searchQuery.toLowerCase();
    return link.name?.toLowerCase().includes(query) || "bulk batch".includes(query);
  });


  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const currentLinks = filteredLinks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  return (
    <div className="flex flex-col gap-2 pb-16 w-full">
      <div className="flex justify-end w-full mb-4 mt-2">
        <div className="relative w-full sm:w-[280px]">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input 
            type="text"
            placeholder="Search bulk batches..."
            className="w-full pl-9 pr-4 py-2 bg-[#111111] border border-neutral-800 rounded-lg text-white font-three text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      <div className="flex flex-col w-full">
        {currentLinks.map((url) => (
          <div key={url.id} className="flex items-center justify-between py-5 px-4 border-b border-neutral-800/60 hover:bg-[#1a1a1a] transition-colors group w-full">
            <div className="flex items-start gap-4 w-[40%] min-w-0 pr-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <IoFileTrayFullOutline size={18} />
              </div>
              <div className="flex flex-col min-w-0 w-full gap-1">
                <div className="flex items-center min-w-0 w-full h-8">
                  {editingId === url.id ? (
                    <div className="flex items-center gap-2 w-full max-w-[250px]">
                      <input autoFocus className="bg-[#111111] border border-neutral-700 rounded px-2 py-1 text-lg font-semibold text-white font-three focus:outline-none w-full" value={tempName} onChange={(e) => setTempName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveName(url.id)} />
                      <button onClick={() => saveName(url.id)} className="text-green-500 p-1"><IoCheckmarkOutline size={22} /></button>
                    </div>
                  ) : (
                    <span className="text-white font-bold font-three text-xl truncate">{url.name || "Bulk Batch"}</span>
                  )}
                </div>
                <span className="text-neutral-400 font-three text-base truncate mt-0.5">Generated Batch</span>
              </div>
            </div>

            <div className="w-[10%] text-neutral-300 font-three text-base shrink-0">
              {url.links?.length || 0} link{(url.links?.length || 0) !== 1 ? 's' : ''}
            </div>

            <div className="flex items-center justify-end gap-3 text-neutral-300 w-[35%] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => {
                  if (userPlan !== "PRO" && userPlan !== "ULTRA") router.push("/premium");
                  else { setSelectedUrl(url); setIsPasswordModalOpen(true); }
                }} 
                className={`p-2 rounded-md hover:bg-neutral-800 ${url.password ? 'text-blue-500' : 'hover:text-white'}`}
                title="Password Protection"
              >
                {url.password ? <IoLockClosedOutline size={18} /> : <IoLockOpenOutline size={18} />}
              </button>

              <button onClick={() => { setEditingId(url.id); setTempName(url.name || ""); }} className="hover:text-white hover:bg-neutral-800 p-2 rounded-md transition-colors"><IoPencilOutline size={18} /></button>
              <button onClick={() => { setSelectedUrl(url); setShowDownloadModal(true); }} className="hover:text-white hover:bg-neutral-800 p-2 rounded-md transition-colors"><IoDownloadOutline size={18} /></button>
              <button onClick={() => handleDelete(url.id)} className="hover:text-red-500 hover:bg-red-500/10 p-2 rounded-md transition-colors"><IoTrashOutline size={18} /></button>
            </div>

            <div className="w-[15%] text-right text-neutral-400 font-three text-sm">
              {getRelativeTime(url.createdAt)}
            </div>
          </div>
        ))}
      </div>

      <PasswordProtectionModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        selectedUrl={selectedUrl}
        onSuccess={onRefresh}
      />

      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-three">
          <div className="absolute inset-0 bg-black/80 cursor-pointer" onClick={() => setShowDownloadModal(false)} />
          <div className="relative bg-[#1c1c1c] border border-neutral-800 w-full max-w-[320px] rounded-xl p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-white">Download As</h3>
              <button onClick={() => setShowDownloadModal(false)} className="text-neutral-400 hover:text-white"><IoCloseOutline size={22} /></button>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { exportPDF(); setShowDownloadModal(false); }} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 hover:bg-[#2a2a2a] group">
                <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500"><IoDocumentTextOutline size={18} /></div>
                <span className="text-sm font-bold text-white">PDF Document</span>
              </button>
              <button onClick={() => { exportCSV(); setShowDownloadModal(false); }} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 hover:bg-[#2a2a2a] group">
                <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-green-500"><IoFileTrayFullOutline size={18} /></div>
                <span className="text-sm font-bold text-white">CSV Spreadsheet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}