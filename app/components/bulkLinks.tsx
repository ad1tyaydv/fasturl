"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  IoSearchOutline, IoChevronBack, IoChevronForward,
  IoTrashOutline, IoLockOpenOutline, IoPencilOutline,
  IoCheckmarkOutline, IoFileTrayFullOutline, IoDownloadOutline,
  IoCloseOutline, IoDocumentTextOutline, IoEyeOutline,
  IoEyeOffOutline, IoCalendarOutline, IoLockClosedOutline
} from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


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
  const [selectedUrl, setSelectedUrl] = useState<any | null>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingExpiry, setIsEditingExpiry] = useState(false);


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


  const closeAllModals = () => {
    setSelectedUrl(null);
    setIsPasswordModalOpen(false);
    setShowDownloadModal(false);
    setPassword("");
    setExpiryDate("");
    setShowPassword(false);
    setIsEditingPassword(false);
    setIsEditingExpiry(false);
  };


  const handleAddPassword = async () => {
    try {
      const finalPassword = isEditingPassword ? password : selectedUrl?.password;
      const finalExpiry = isEditingExpiry ? expiryDate : selectedUrl?.expiresAt;
      await axios.post("/api/shortUrl/passwordProtection", {
        shortUrlId: selectedUrl?.id,
        password: finalPassword,
        expiryDate: finalExpiry,
      });
      alert("Protection Updated successfully");
      onRefresh();
      closeAllModals();

    } catch (error) {
      console.log("Update failed", error);
    }
  };


  const exportPDF = () => {
    if (!selectedUrl || !selectedUrl.links) return;
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
    if (!selectedUrl || !selectedUrl.links) return;
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
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLinks = filteredLinks.slice(startIndex, endIndex);


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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col w-full">
        {currentLinks.length > 0 ? (
          <>
            {currentLinks.map((url) => (
              <div
                key={url.id}
                className="flex items-center justify-between py-5 px-4 border-b border-neutral-800/60 hover:bg-[#1a1a1a] transition-colors cursor-default group w-full"
              >
                <div className="flex items-start gap-4 w-[40%] min-w-0 pr-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <IoFileTrayFullOutline size={18} />
                  </div>
                  
                  <div className="flex flex-col min-w-0 w-full gap-1">
                    <div className="flex items-center min-w-0 w-full h-8">
                      {editingId === url.id ? (
                        <div className="flex items-center gap-2 w-full max-w-[250px]">
                          <input
                            autoFocus
                            className="bg-[#111111] border border-neutral-700 rounded px-2 py-1 text-lg font-semibold text-white font-three focus:outline-none w-full"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveName(url.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                          />
                          <button onClick={() => saveName(url.id)} className="text-green-500 hover:text-green-400 shrink-0 p-1 cursor-pointer">
                            <IoCheckmarkOutline size={22} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-white font-bold font-three text-xl truncate tracking-wide">
                          {url.name || "Bulk Batch"}
                        </span>
                      )}
                    </div>
                    <span className="text-neutral-400 font-three font-medium text-base truncate mt-0.5">
                      Generated Batch
                    </span>
                  </div>
                </div>

                <div className="w-[10%] pl-2 text-neutral-300 font-three font-medium text-base shrink-0">
                  {url.links?.length || 0} link{(url.links?.length || 0) !== 1 ? 's' : ''}
                </div>

                <div className="flex items-center justify-end gap-3 text-neutral-300 w-[35%] shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      if (userPlan !== "PRO" && userPlan !== "ULTRA") {
                        router.push("/premium");
                      } else {
                        setSelectedUrl(url);
                        setIsPasswordModalOpen(true);
                        setIsEditingPassword(!url.password);
                        setIsEditingExpiry(!url.expiresAt);
                      }
                    }} 
                    className={`hover:bg-neutral-800 p-2 rounded-md transition-colors cursor-pointer ${url.password ? 'text-blue-500' : 'hover:text-white'}`}
                    title="Password Protection"
                  >
                    {url.password ? <IoLockClosedOutline size={18} /> : <IoLockOpenOutline size={18} />}
                  </button>

                  <button 
                    onClick={() => {
                      setEditingId(url.id);
                      setTempName(url.name || "");
                    }} 
                    className="hover:text-white hover:bg-neutral-800 p-2 rounded-md transition-colors cursor-pointer"
                    title="Edit Name"
                  >
                    <IoPencilOutline size={18} />
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedUrl(url);
                      setShowDownloadModal(true);
                    }} 
                    className="hover:text-white hover:bg-neutral-800 p-2 rounded-md transition-colors cursor-pointer"
                    title="Download Batch"
                  >
                    <IoDownloadOutline size={18} />
                  </button>

                  <button 
                    onClick={() => handleDelete(url.id)} 
                    className="hover:text-red-500 hover:bg-red-500/10 p-2 rounded-md transition-colors cursor-pointer"
                    title="Delete Batch"
                  >
                    <IoTrashOutline size={18} />
                  </button>
                </div>

                <div className="w-[15%] text-right text-neutral-400 font-three font-medium text-sm shrink-0">
                  {getRelativeTime(url.createdAt)}
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-8 mt-8 text-white font-three">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-800 hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <IoChevronBack size={20} />
                </button>
                
                <span className="font-bold text-sm tracking-widest">
                  {startIndex + 1} - {Math.min(endIndex, filteredLinks.length)}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-800 hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <IoChevronForward size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-neutral-500 font-three">
            No bulk batches found matching your search.
          </div>
        )}
      </div>

      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-three">
          <div className="absolute inset-0 bg-black/80 cursor-pointer" onClick={closeAllModals} />
          <div className="relative bg-[#1c1c1c] border border-neutral-800 w-full max-w-[320px] rounded-xl p-5 shadow-2xl transition-none">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-white font-one">Download As</h3>
              <button onClick={closeAllModals} className="text-neutral-400 hover:text-white cursor-pointer transition-colors">
                <IoCloseOutline size={22} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { exportPDF(); closeAllModals(); }} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 hover:bg-[#2a2a2a] transition-colors text-left cursor-pointer group">
                <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform"><IoDocumentTextOutline size={18} /></div>
                <span className="text-sm font-bold text-white">PDF Document</span>
              </button>
              <button onClick={() => { exportCSV(); closeAllModals(); }} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 hover:bg-[#2a2a2a] transition-colors text-left cursor-pointer group">
                <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform"><IoFileTrayFullOutline size={18} /></div>
                <span className="text-sm font-bold text-white">CSV Spreadsheet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isPasswordModalOpen && selectedUrl && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 transition-opacity duration-150" onClick={closeAllModals}>
          <div className="bg-[#1c1c1c] shadow-2xl w-full max-w-lg p-6 sm:p-10 cursor-default border border-neutral-800 rounded-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl sm:text-2xl font-three mb-8 text-center text-white">Add Link Protection</h3>
            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xl font-one text-white">Password <span className="text-sm text-neutral-500 font-three font-normal">(Optional)</span></label>
                  {!isEditingPassword && selectedUrl.password && (
                    <button onClick={() => { setIsEditingPassword(true); setPassword(""); }} className="text-blue-500 hover:text-blue-400 cursor-pointer transition-colors" title="Edit Password">
                      <IoPencilOutline size={18} />
                    </button>
                  )}
                </div>
                {!isEditingPassword && selectedUrl.password ? (
                  <div className="w-full p-3 border border-dashed border-neutral-700 bg-[#1a1a1a] text-neutral-400 font-three italic rounded-lg">Password is already configured</div>
                ) : (
                  <div className="relative flex items-center border border-neutral-700 bg-[#111111] focus-within:border-blue-500 transition-colors rounded-lg overflow-hidden">
                    <input type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-transparent text-white font-three focus:outline-none" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-4 text-neutral-500 hover:text-white transition-colors cursor-pointer">
                      {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xl font-one text-white">Set Expiry Date</label>
                  {!isEditingExpiry && selectedUrl.expiresAt && (
                    <button onClick={() => { setIsEditingExpiry(true); setExpiryDate(""); }} className="text-blue-500 hover:text-blue-400 cursor-pointer transition-colors" title="Edit Expiry">
                      <IoPencilOutline size={18} />
                    </button>
                  )}
                </div>
                {!isEditingExpiry && selectedUrl.expiresAt ? (
                  <div className="w-full p-3 border border-dashed border-neutral-700 bg-[#1a1a1a] text-neutral-400 font-three rounded-lg">Expires on {new Date(selectedUrl.expiresAt).toLocaleDateString()}</div>
                ) : (
                  <div className="relative group">
                    <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full p-3 border border-neutral-700 bg-[#111111] text-white font-three focus:outline-none focus:border-blue-500 transition-colors rounded-lg cursor-pointer [color-scheme:dark] pr-12 appearance-none" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"><IoCalendarOutline size={20} /></div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={closeAllModals} className="cursor-pointer px-6 py-2.5 font-three text-sm bg-transparent text-white border border-neutral-700 hover:bg-[#2a2a2a] transition-colors rounded-lg">Cancel</button>
              <button onClick={handleAddPassword} className="bg-white text-black px-6 py-2.5 font-three text-sm hover:bg-gray-200 transition-colors rounded-lg cursor-pointer active:scale-95 font-bold">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}