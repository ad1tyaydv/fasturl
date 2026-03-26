"use client";

import { IoLinkOutline, IoArrowForwardOutline } from "react-icons/io5";

interface LinkTabProps {
  urls: any[];
  onSelect: (url: any) => void;
}


const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function LinkAnalyticsTab({ urls, onSelect }: LinkTabProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {urls.length > 0 ? (
        urls.map((url) => (
          <div 
            key={url.id}
            onClick={() => onSelect(url)} 
            className="p-6 rounded-2xl border border-neutral-800 bg-[#1c1c1c] hover:border-blue-500/50 hover:shadow-lg hover:shadow-black/50 transition-all cursor-pointer relative group overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                <IoLinkOutline size={22} />
              </div>
              <div className="bg-[#2a2a2a] px-2.5 py-1 rounded-full text-[10px] font-three uppercase tracking-wider text-white">
                Clicks: {url.clicks || 0}
              </div>
            </div>
            <h3 className="font-three text-lg truncate mb-1 text-white">{NEXT_DOMAIN}/{url.shorturl}</h3>
            <p className="text-xs font-three text-neutral-400 truncate mb-6">{url.original}</p>
            <div className="flex items-center gap-2 text-xs font-three text-blue-500 uppercase">
              Detailed Report <IoArrowForwardOutline className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full py-20 text-center border-2 border-dashed border-neutral-800 rounded-3xl">
          <p className="text-neutral-400">No links found. Create one to see analytics!</p>
        </div>
      )}
    </div>
  );
}