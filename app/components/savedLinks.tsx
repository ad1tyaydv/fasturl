"use client";

import { useState } from "react";
import { 
  IoCopyOutline, IoPencilOutline, IoCheckmarkOutline, IoSearchOutline, 
  IoChevronBack, IoChevronForward, IoGlobeOutline, IoTrashOutline, 
  IoLockOpenOutline, IoOpenOutline, IoQrCodeOutline, IoShareSocialOutline, 
  IoColorWandOutline 
} from "react-icons/io5";
import QRCodeModal from "../modals/qrGenerate";

interface SavedLinksProps {
  links: any[];
  onSelect?: (link: any) => void; 
  onDelete: (id: string) => void;
  onUpdateName: (id: string, newName: string) => void;
  domain: string;
  updatingLinkId: string | null;
  onOpenPasswordModal?: (link: any) => void;
  onOpenCustomUrlModal?: (link: any) => void;
}

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
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};


const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function SavedLinks({ 
  links, onDelete, onUpdateName, domain, updatingLinkId, 
  onOpenPasswordModal, onOpenCustomUrlModal 
}: SavedLinksProps) {
  

  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedLinkForQr, setSelectedLinkForQr] = useState<any>(null);


  const copyToClipboard = (e: React.MouseEvent, url: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrlId(id);
    setTimeout(() => { setCopiedUrlId(null); }, 2000);
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


  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const currentLinks = filteredLinks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  
  return (
    <div className="flex flex-col gap-2 pb-16 w-full">
      <div className="flex justify-end w-full mb-4 mt-2">
        <div className="relative w-full sm:w-[280px]">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input 
            type="text"
            placeholder="Search by name or link..."
            className="w-full pl-9 pr-4 py-2 bg-[#111111] border border-neutral-800 rounded-lg text-white text-sm focus:ring-1 focus:ring-neutral-500 outline-none transition"
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
                  <div className="mt-1 w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                    <IoGlobeOutline size={18} />
                  </div>
                  <div className="flex flex-col min-w-0 w-full gap-1">
                    <div className="flex items-center min-w-0 w-full h-8">
                      {updatingLinkId === url.id ? (
                        <span className="text-neutral-400 animate-pulse text-lg font-semibold">Updating...</span>
                      ) : editingId === url.id ? (
                        <div className="flex items-center gap-2 w-full max-w-[250px]">
                          <input
                            autoFocus
                            className="bg-[#111111] border border-neutral-700 rounded px-2 py-1 text-lg font-semibold text-white focus:outline-none w-full"
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
                        <span className="text-white font-one text-xl truncate tracking-wide">
                          {url.name || "Untitled Link"}
                        </span>
                      )}
                    </div>
                    <span className="text-neutral-500 font-three text-base truncate">
                      {domain}/{url.shorturl}
                    </span>
                  </div>
                </div>

                <div className="w-[10%] pl-2 text-neutral-400 font-three text-base shrink-0">
                  {url.clicks || 0} click{(url.clicks || 0) !== 1 ? 's' : ''}
                </div>

                <div className="flex items-center justify-end gap-3 text-neutral-400 w-[35%] shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onOpenPasswordModal?.(url)} className="hover:text-white p-2 rounded-md transition-colors cursor-pointer" title="Password Protection"><IoLockOpenOutline size={18} /></button>
                  <button onClick={() => onOpenCustomUrlModal?.(url)} className="hover:text-white p-2 rounded-md transition-colors cursor-pointer" title="Add Custom URL"><IoColorWandOutline size={18} /></button>
                  <button onClick={() => window.open(`${domain}/${url.shorturl}`, '_blank')} className="hover:text-white p-2 rounded-md transition-colors cursor-pointer" title="Open Link"><IoOpenOutline size={18} /></button>
                  <button onClick={(e) => copyToClipboard(e, `${NEXT_DOMAIN}/${url.shorturl}`, url.id)} className={`transition-colors p-2 rounded-md ${copiedUrlId === url.id ? "text-green-500" : "hover:text-white"} cursor-pointer`} title="Copy Short URL">
                    {copiedUrlId === url.id ? <IoCheckmarkOutline size={18} /> : <IoCopyOutline size={18} />}
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedLinkForQr(url);
                      setIsQrModalOpen(true);
                    }} 
                    className="hover:text-white p-2 rounded-md transition-colors cursor-pointer"
                    title="QR Code"
                  >
                    <IoQrCodeOutline size={18} />
                  </button>

                  <button onClick={() => {}} className="hover:text-white p-2 rounded-md transition-colors cursor-pointer" title="Share"><IoShareSocialOutline size={18} /></button>
                  <button onClick={() => { setEditingId(url.id); setTempName(url.name || ""); }} className="hover:text-white p-2 rounded-md transition-colors cursor-pointer" title="Edit Name"><IoPencilOutline size={18} /></button>
                  <button onClick={() => onDelete(url.id)} className="hover:text-red-500 p-2 rounded-md transition-colors cursor-pointer" title="Delete"><IoTrashOutline size={18} /></button>
                </div>

                <div className="w-[15%] text-right text-neutral-500 font-medium text-sm shrink-0">
                  {getRelativeTime(url.createdAt)}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-20 text-neutral-600 font-three uppercase tracking-widest text-sm">
            No links found
          </div>
        )}
      </div>

      <QRCodeModal 
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        selectedUrl={selectedLinkForQr}
      />
    </div>
  );
}