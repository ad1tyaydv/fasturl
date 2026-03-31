"use client";

import { useEffect } from "react";
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Pdf02Icon, 
  Csv02Icon, 
  CancelCircleIcon, 
  Download01Icon 
} from '@hugeicons/core-free-icons';
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface BulkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchName: string;
  links: any[]; // We need the actual data to download it
}

export default function BulkDownloadModal({ isOpen, onClose, batchName, links }: BulkDownloadModalProps) {    
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);


  const downloadCSV = () => {
    const data = links.map(link => ({
      Name: link.name || "Unnamed",
      Original_URL: link.url,
      Short_URL: `${window.location.origin}/${link.shorturl}`,
      Clicks: link.clicks || 0,
      Created: new Date(link.createdAt).toLocaleDateString()
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${batchName || "batch"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(batchName || "Link Batch Report", 14, 15);
    
    const tableColumn = ["Name", "Original URL", "Short URL", "Clicks"];
    const tableRows = links.map(link => [
      link.name || "N/A",
      link.url,
      link.shorturl,
      link.clicks || 0
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`${batchName || "batch"}.pdf`);
  };


  if (!isOpen) return null;

  
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      
      <div className="relative bg-[#111111] border border-neutral-800 w-full max-w-[400px] rounded-lg p-6 shadow-xl font-three">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-lg font-medium">Download Batch</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-white cursor-pointer">
            <HugeiconsIcon icon={CancelCircleIcon} size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={downloadPDF}
            className="flex items-center justify-between p-3 rounded-md bg-[#1a1a1a] border border-neutral-800 hover:border-neutral-600 text-white transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Pdf02Icon} size={20} className="text-red-500" />
              <span className="text-sm font-one">Download as PDF</span>
            </div>
            <HugeiconsIcon icon={Download01Icon} size={16} className="text-neutral-500" />
          </button>

          <button 
            onClick={downloadCSV}
            className="flex items-center justify-between p-3 rounded-md bg-[#1a1a1a] border border-neutral-800 hover:border-neutral-600 text-white transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Csv02Icon} size={20} className="text-green-500" />
              <span className="text-sm font-one">Download as CSV</span>
            </div>
            <HugeiconsIcon icon={Download01Icon} size={16} className="text-neutral-500" />
          </button>
        </div>
      </div>
    </div>
  );
}