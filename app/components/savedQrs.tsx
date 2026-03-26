"use client";

import { useState } from "react";
import { 
  IoCopyOutline, 
  IoCheckmarkOutline,
  IoSearchOutline, 
  IoChevronBack, 
  IoChevronForward,
  IoQrCodeOutline,
  IoTrashOutline
} from "react-icons/io5";

interface QrItem {
  id: string;
  original: string;
  shorturl: string;
  qrImage?: string;
  scans?: number;
  createdAt?: string;
}

interface SavedQrsProps {
  qrs: QrItem[];
  onSelect: (qr: QrItem) => void;
  onDelete: (id: string) => void;
  domain: string;
}


const getRelativeTime = (dateString?: string) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};


export default function SavedQrs({ qrs, onSelect, onDelete, domain }: SavedQrsProps) {
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const copyToClipboard = (e: React.MouseEvent, url: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrlId(id);

    setTimeout(() => {
      setCopiedUrlId(null);
    }, 2000);

  };


  const filteredQrs = qrs.filter((qr) => {
    const query = searchQuery.toLowerCase();
    return (
      qr.shorturl?.toLowerCase().includes(query) ||
      qr.original?.toLowerCase().includes(query)
    );
  });


  const totalPages = Math.ceil(filteredQrs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQrs = filteredQrs.slice(startIndex, endIndex);

  
  return (
    <div className="flex flex-col gap-2 pb-16 w-full">
      <div className="flex justify-end w-full mb-4 mt-2">
        <div className="relative w-full sm:w-[280px]">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input 
            type="text"
            placeholder="Search by link..."
            className="w-full pl-9 pr-4 py-2 bg-[#111111] border border-neutral-800 rounded-lg text-white text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col w-full">
        {currentQrs.length > 0 ? (
          <>
            {currentQrs.map((qr) => (
              <div
                key={qr.id}
                onClick={() => onSelect(qr)}
                className="flex items-center justify-between py-4 px-4 border-b border-neutral-800/60 hover:bg-[#1a1a1a] transition-colors cursor-pointer group w-full"
              >
                <div className="flex items-center gap-4 w-[45%] min-w-0 pr-4">
                  <div className="w-8 h-8 rounded shrink-0 bg-white p-0.5 overflow-hidden flex items-center justify-center">
                    {qr.qrImage ? (
                      <img src={qr.qrImage} alt="QR" className="w-full h-full object-contain" />
                    ) : (
                      <IoQrCodeOutline size={18} className="text-black" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 w-full">
                    <span className="text-white font-medium text-base truncate">
                      {domain}/{qr.shorturl}
                    </span>
                    <span className="text-neutral-500 text-sm truncate">
                      QR Code Link
                    </span>
                  </div>
                </div>

                <div className="w-[15%] text-white text-sm shrink-0">
                  {qr.scans || 0} scan{(qr.scans || 0) !== 1 ? 's' : ''}
                </div>

                <div className="flex items-center justify-end gap-5 text-neutral-400 w-[20%] shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => copyToClipboard(e, `${domain}/${qr.shorturl}`, qr.id)} 
                    className={`transition-colors p-1 ${copiedUrlId === qr.id ? "text-green-500" : "hover:text-white"}`}
                    title="Copy Short URL"
                  >
                    {copiedUrlId === qr.id ? <IoCheckmarkOutline size={18} /> : <IoCopyOutline size={18} />}
                  </button>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onDelete(qr.id); 
                    }} 
                    className="hover:text-red-500 transition p-1"
                    title="Delete QR"
                  >
                    <IoTrashOutline size={18} />
                  </button>
                </div>

                <div className="w-[20%] text-right text-white text-sm shrink-0">
                  {getRelativeTime(qr.createdAt)}
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-8 mt-8 text-white">
                <button
                  disabled={currentPage === 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPage((prev) => prev - 1);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-800 hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <IoChevronBack size={20} />
                </button>

                <span className="font-bold text-sm tracking-widest">
                  {startIndex + 1} - {Math.min(endIndex, filteredQrs.length)}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPage((prev) => prev + 1);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-800 hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <IoChevronForward size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-neutral-500">
            No QR codes found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}