"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  IoArrowBackOutline, IoLinkOutline, IoCopyOutline, IoQrCodeOutline, 
  IoPencilOutline, IoTrashOutline, IoLockOpenOutline, IoLockClosedOutline,
  IoChevronBackOutline, IoChevronForwardOutline, IoStatsChartOutline,
  IoOpenOutline, IoSparklesOutline
} from "react-icons/io5";


export default function BulkLinkDetails({ batch, onBack, domain, onRefresh }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const links = batch.links || [];
  const totalPages = Math.ceil(links.length / itemsPerPage);
  const paginatedLinks = links.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const copyToClipboard = (shortUrl: string) => {
    navigator.clipboard.writeText(`${domain}/${shortUrl}`);
    toast.success("Copied to clipboard");
  };


  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-8 border-b border-neutral-800 pb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-[#1c1c1c] rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <IoArrowBackOutline size={22} />
        </button>
        <div>
          <h2 className="text-2xl font-one text-white tracking-wide">{batch.name || "Bulk link"}</h2>
          <p className="text-neutral-500 font-three text-sm">{links.length} total items</p>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {paginatedLinks.map((link: any, index: number) => (
          <div key={index} className="flex items-center justify-between py-5 px-2 border-b border-neutral-800/60 hover:bg-[#1a1a1a]/50 transition-colors group">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="mt-1 w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0 border border-neutral-700">
                <IoLinkOutline size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-white font-one text-lg truncate">
                  {link.linkName || "Untitled Link"}
                </span>
                <span className="text-neutral-500 font-three text-sm truncate max-w-md">
                   {domain}/{link.shortUrl || link.shorturl}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-neutral-500 text-sm font-three mr-4">
                <IoStatsChartOutline size={14} />
                <span>{link.clicks || 0} clicks</span>
              </div>
              
              <div className="flex items-center gap-1">
                <button className="p-2 text-neutral-500 hover:text-white transition-colors cursor-pointer"><IoLockOpenOutline size={18}/></button>
                <button className="p-2 text-neutral-400 hover:text-blue-400 transition-colors cursor-pointer"><IoSparklesOutline size={18}/></button>
                <button className="p-2 text-neutral-500 hover:text-white transition-colors cursor-pointer"><IoOpenOutline size={18}/></button>
                <button onClick={() => copyToClipboard(link.shortUrl || link.shorturl)} className="p-2 text-neutral-500 hover:text-white transition-colors cursor-pointer"><IoCopyOutline size={18}/></button>
                <button className="p-2 text-neutral-500 hover:text-white transition-colors cursor-pointer"><IoQrCodeOutline size={18}/></button>
                <button className="p-2 text-neutral-500 hover:text-white transition-colors cursor-pointer"><IoPencilOutline size={18}/></button>
                <button className="p-2 text-neutral-500 hover:text-red-500 transition-colors cursor-pointer"><IoTrashOutline size={18}/></button>
              </div>

              <div className="ml-4 text-neutral-500 text-sm font-three min-w-[80px] text-right">
                {link.createdAt ? new Date(link.createdAt).toLocaleDateString() : '3/21/2026'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-8 mt-12 pb-10">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-12 h-12 flex items-center justify-center border border-neutral-700 rounded-full disabled:opacity-20 hover:bg-neutral-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <IoChevronBackOutline size={20} className="text-white" />
          </button>
          
          <div className="text-neutral-400 font-one text-lg">
            Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
          </div>

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-12 h-12 flex items-center justify-center border border-neutral-700 rounded-full disabled:opacity-20 hover:bg-neutral-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <IoChevronForwardOutline size={20} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}