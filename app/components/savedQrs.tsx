"use client";

import { IoDownloadOutline } from "react-icons/io5";

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
}

export default function SavedQrs({ qrs, onSelect }: SavedQrsProps) {

  const downloadQr = (e: React.MouseEvent, qrImage: string, name: string) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `qr-${name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="flex flex-col gap-3 sm:gap-4 pb-16">
      {qrs.map((qr) => (
        <div
          key={qr.id}
          onClick={() => onSelect(qr)}
          className="border border-border/60 p-3 sm:p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition cursor-pointer group bg-card hover:border-primary/30"
        >
          <div className="flex items-center gap-4 w-full overflow-hidden min-w-0">
            <div className="shrink-0 bg-white p-1.5 rounded-lg border border-border/50 shadow-sm">
              {qr.qrImage ? (
                <img
                  src={qr.qrImage}
                  alt="QR"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain" 
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted animate-pulse rounded-md" />
              )}
            </div>

            <div className="flex flex-col gap-0.5 w-full overflow-hidden">
              <div className="truncate text-base font-one sm:text-lg min-w-0">
                <span className="text-primary/70 text-[15px] uppercase tracking-tighter block font-bold">Target</span>
                <span className="font-normal text-foreground group-hover:text-primary transition-colors">
                  {qr.original}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => qr.qrImage && downloadQr(e, qr.qrImage, qr.shorturl)}
            className="whitespace-nowrap shrink-0 px-5 py-2.5 rounded-lg font-one text-sm transition flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground border border-border/40 active:scale-95 cursor-pointer"
          >
            <IoDownloadOutline size={18} />
            Download QR
          </button>
        </div>
      ))}
    </div>
  );
}