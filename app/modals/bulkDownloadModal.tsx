"use client";

import { useEffect } from "react";
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Pdf02Icon, 
  Csv02Icon, 
  Download01Icon,
  Cancel01Icon 
} from '@hugeicons/core-free-icons';
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface BulkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchName: string;
  links: any[]; // Ensure this is passed as an array
}

const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function BulkDownloadModal({ isOpen, onClose, batchName, links }: BulkDownloadModalProps) {    
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // FIX: Safety check to ensure links is always an array
  const safeLinks = Array.isArray(links) ? links : [];

  const downloadCSV = () => {
    if (safeLinks.length === 0) return;

    const data = safeLinks.map(link => {
      const fullShortUrl = `${NEXT_DOMAIN}/${link.shorturl || link.short}`;
      return {
        Name: link.linkName || link.name || "Unnamed",
        Original_URL: link.original || link.url,
        Short_URL: fullShortUrl,
        Clicks: link.clicks || 0,
        Created: link.createdAt ? new Date(link.createdAt).toLocaleDateString() : "N/A"
      };
    });

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", `${batchName || "batch"}.csv`);
    a.click();
  };

  const downloadPDF = () => {
    if (safeLinks.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(batchName || "Link Batch Report", 14, 15);
    
    const tableColumn = ["#", "Name", "Original URL", "Short URL"];
    const tableRows = safeLinks.map((link, i) => [
      i + 1,
      link.linkName || link.name || "N/A",
      link.original || link.url,
      `${NEXT_DOMAIN}/${link.shorturl || link.short}`
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 30, 30] }
    });

    doc.save(`${batchName || "batch"}.pdf`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container - Increased Width and Padding */}
      <div className="relative bg-[#0F0F0F] border border-zinc-800 w-full max-w-[500px] min-h-[320px] rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Close Button - Top Right */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={24} />
        </button>

        <div className="mb-8">
          <h3 className="text-white text-2xl font-bold mb-2">Export Data</h3>
          <p className="text-zinc-500 text-sm">Choose your preferred format to download the batch <span className="text-zinc-300 font-bold">"{batchName}"</span>.</p>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={downloadPDF}
            className="group flex items-center justify-between p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900 text-white transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-lg text-red-500 group-hover:scale-110 transition-transform">
                <HugeiconsIcon icon={Pdf02Icon} size={24} />
              </div>
              <div className="text-left">
                <span className="block text-base font-bold">Document Report</span>
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">PDF Format</span>
              </div>
            </div>
            <HugeiconsIcon icon={Download01Icon} size={20} className="text-zinc-600 group-hover:text-white" />
          </button>

          <button 
            onClick={downloadCSV}
            className="group flex items-center justify-between p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900 text-white transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg text-green-500 group-hover:scale-110 transition-transform">
                <HugeiconsIcon icon={Csv02Icon} size={24} />
              </div>
              <div className="text-left">
                <span className="block text-base font-bold">Spreadsheet Data</span>
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">CSV Format</span>
              </div>
            </div>
            <HugeiconsIcon icon={Download01Icon} size={20} className="text-zinc-600 group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}