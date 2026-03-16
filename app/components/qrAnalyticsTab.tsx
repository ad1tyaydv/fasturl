"use client";

import { IoQrCodeOutline, IoArrowForwardOutline } from "react-icons/io5";

interface QRTabProps {
  urls: any[];
  onSelect: (url: any) => void;
}


const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function QRAnalyticsTab({ urls, onSelect }: QRTabProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {urls.length > 0 ? (
        urls.map((url) => (
          <div 
            key={url.id} 
            onClick={() => onSelect(url)} 
            className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer relative group overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <IoQrCodeOutline size={22} />
              </div>
              <div className="bg-secondary px-2.5 py-1 rounded-full text-[10px] font-three uppercase tracking-wider text-secondary-foreground">
                Scans: {url.clicks || 0}
              </div>
            </div>
            <h3 className="font-three text-lg truncate mb-1">{NEXT_DOMAIN}/{url.shorturl}</h3>
            <p className="text-xs font-three text-muted-foreground truncate mb-6">{url.original}</p>
            <div className="flex items-center gap-2 text-xs font-three text-primary uppercase">
              QR Report <IoArrowForwardOutline className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl">
          <p className="text-muted-foreground">No QRs found. Create one to see analytics!</p>
        </div>
      )}
    </div>
  );
}