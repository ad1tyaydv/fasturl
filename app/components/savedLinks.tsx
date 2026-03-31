"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IoCheckmarkOutline } from "react-icons/io5";

import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Globe02Icon, Share05Icon, Delete02Icon, QrCodeIcon, Edit03Icon, MagicWand01Icon,
  CircleLock01Icon, Search02Icon, CircleUnlock01Icon, CopyCheckIcon,
  CopyIcon }
  from '@hugeicons/core-free-icons';

import QRCodeModal from "../modals/qrGenerate";
import PasswordProtectionModal from "@/app/modals/linkPasswordProtection";
import CustomUrlModal from "@/app/modals/customUrl";
import { FilterDropDown, FilterType } from "../dropDown/urlsPageDropDown";

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
  return date.toLocaleDateString();
};

export default function SavedLinks({ 
  links, 
  onRefresh, 
  domain, 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter 
}: any) {
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [selectedLink, setSelectedLink] = useState<any>(null);
  
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrlId(id);
    toast.success("Link copied!"); 
    setTimeout(() => setCopiedUrlId(null), 2000);
  };


  const saveName = async (id: string) => {
    if (!tempName.trim()) { setEditingId(null); return; }

    try {
      await axios.post("/api/shortUrl/linkName", { linkId: id, name: tempName.trim() });
      toast.success("Name updated!");
      onRefresh();

    } catch { toast.error("Update failed"); }
    setEditingId(null);
  };


  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 mt-2">
        <div className="relative w-full sm:w-[400px]">
          <HugeiconsIcon icon={Search02Icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search links..."
            className="w-full pl-10 pr-3 py-3 bg-[#111111] font-three border border-neutral-800 rounded-lg text-white text-sm outline-none focus:border-neutral-600 transition-all" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>

        <FilterDropDown 
          value={statusFilter} 
          onChange={(val: FilterType) => setStatusFilter(val)} 
        />
      </div>

      <div className="flex flex-col w-full">
        {links.map((url: any) => (
          <div key={url.id} className="flex items-center justify-between py-5 px-4 border-b border-neutral-800/60 hover:bg-[#1a1a1a] group transition-colors">
            <div className="flex items-start gap-4 w-[40%] min-w-0 pr-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                <HugeiconsIcon icon={Globe02Icon} />
              </div>
              <div className="flex flex-col min-w-0 w-full">
                {editingId === url.id ? (
                  <div className="flex items-center gap-2">
                    <input 
                      autoFocus 
                      className="bg-[#111111] border border-neutral-700 rounded px-2 py-1 text-white w-full outline-none" 
                      value={tempName} 
                      onChange={(e) => setTempName(e.target.value)} 
                      onKeyDown={(e) => e.key === "Enter" && saveName(url.id)} 
                    />
                    <button onClick={() => saveName(url.id)} className="text-green-500 cursor-pointer">
                      <IoCheckmarkOutline size={22} />
                    </button>
                  </div>
                ) : (
                  <span className="text-white font-one text-xl truncate tracking-wide">{url.linkName || "Untitled Link"}</span>
                )}
                <span className="text-neutral-500 font-three text-base truncate">{domain}/{url.shorturl}</span>
              </div>
            </div>

            <div className="hidden md:flex w-[10%] shrink-0">
              {url.password && (
                <div className="flex items-center gap-1.5 px-1.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <HugeiconsIcon icon={CircleLock01Icon} size={15} />
                  <span className="text-[10px] uppercase tracking-widest font-one">Protected</span>
                </div>
              )}
            </div>

            <div className="w-[10%] text-neutral-400 font-medium">{url.clicks || 0} clicks</div>

            <div className="flex items-center justify-end gap-3 text-neutral-400 w-[30%] opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setSelectedLink(url); setIsPasswordModalOpen(true); }} 
                  className={`p-2 rounded-md cursor-pointer transition-colors ${url.password ? 'text-blue-500' : 'hover:text-white'}`}
                >
                    {url.password ? <HugeiconsIcon icon={CircleLock01Icon} /> : <HugeiconsIcon icon={CircleUnlock01Icon} />}
                </button>
                <button onClick={() => { setSelectedLink(url); setIsCustomModalOpen(true); }} className="hover:text-white p-2 cursor-pointer">
                  <HugeiconsIcon icon={MagicWand01Icon} />
                </button>
                <button onClick={() => window.open(`${domain}/${url.shorturl}`, '_blank')} className="hover:text-white p-2 cursor-pointer">
                  <HugeiconsIcon icon={Share05Icon} />
                </button>
                <button onClick={() => copyToClipboard(`${domain}/${url.shorturl}`, url.id)} className={`p-2 cursor-pointer ${copiedUrlId === url.id ? "text-green-500" : "hover:text-white"}`}>
                  {copiedUrlId === url.id ? <HugeiconsIcon icon={CopyCheckIcon} /> : <HugeiconsIcon icon={CopyIcon} />}
                </button>
                <button onClick={() => { setSelectedLink(url); setIsQrModalOpen(true); }} className="hover:text-white p-2 cursor-pointer">
                  <HugeiconsIcon icon={QrCodeIcon} />
                </button>
                <button onClick={() => { setEditingId(url.id); setTempName(url.linkName || ""); }} className="hover:text-white p-2 cursor-pointer">
                  <HugeiconsIcon icon={Edit03Icon} />
                </button>
                <button 
                  onClick={async () => { if(confirm("Delete link?")) { await axios.post(`/api/shortUrl/delete/${url.id}`); onRefresh(); } }} 
                  className="hover:text-red-500 p-2 cursor-pointer"
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                </button>
            </div>

            <div className="w-[10%] text-right text-neutral-500 text-sm font-medium">{getRelativeTime(url.createdAt)}</div>
          </div>
        ))}
      </div>

      <QRCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} selectedUrl={selectedLink} />
      <PasswordProtectionModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} selectedUrl={selectedLink} onSuccess={onRefresh} />
      <CustomUrlModal isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)} selectedUrl={selectedLink} onSuccess={onRefresh} domain={domain} />
    </div>
  );
}