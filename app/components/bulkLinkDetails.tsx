"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Share05Icon, Delete02Icon, QrCodeIcon, Edit03Icon, MagicWand01Icon,
  CircleLock01Icon, CircleUnlock01Icon, CopyCheckIcon, Tick02Icon,
  CopyIcon, Link04Icon, Analytics01Icon, ArrowLeft01Icon, ArrowRight01Icon,
  Search02Icon
} from '@hugeicons/core-free-icons';

import { FilterDropDown, FilterType } from "@/app/dropDown/linksDropDown";

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

const getDomain = (url: string) => {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return ""; }
};

const getLogo = (url: string) => {
  const domainStr = getDomain(url);
  return `https://www.google.com/s2/favicons?domain=${domainStr}&sz=64`;
};


function BulkLinkItem({ 
  link, 
  domain, 
  router, 
  onRefresh, 
  onOpenQr, 
  onOpenPassword, 
  onOpenCustom 
}: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tempName, setTempName] = useState(link.linkName || "");
  const [copied, setCopied] = useState(false);
  
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const shortUrl = link.shortUrl || link.shorturl;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${domain}/${shortUrl}`);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
    setShowMobileMenu(false);
  };

  
  const saveName = async () => {
    if (!tempName.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSavingName(true);
    try {
      await axios.post("/api/shortUrl/linkName", { linkId: link.id, name: tempName.trim() });
      toast.success("Name updated!");
      if (onRefresh) await onRefresh();
    } catch {
      toast.error("Update failed");
    } finally {
      setIsSavingName(false);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
        setIsDeleting(false);
        setShowMobileMenu(false);
    }, 500);
  };

  return (
    <div className="relative flex items-center justify-between py-5 px-4 border-b border-neutral-800/60 hover:bg-[#1a1a1a] group transition-colors">
      
      <div className="flex items-start gap-4 w-[65%] md:w-[40%] min-w-0 pr-4">
        <div className="mt-1 w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
          {link.original ? (
            <img src={getLogo(link.original)} alt="logo" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
          ) : (
            <HugeiconsIcon icon={Link04Icon} />
          )}
        </div>
        <div className="flex flex-col min-w-0 w-full">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                className="bg-[#111111] border border-neutral-700 rounded px-2 py-1 text-white w-full outline-none"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isSavingName && saveName()}
                disabled={isSavingName}
              />
              <button onClick={saveName} disabled={isSavingName} className="text-green-500 shrink-0">
                {isSavingName ? <div className="w-[22px] h-[22px] border-2 border-t-transparent rounded-full animate-spin" /> : <HugeiconsIcon icon={Tick02Icon} />}
              </button>
            </div>
          ) : (
            <span className="text-white font-one text-xl truncate tracking-wide">{link.linkName || "Untitled Link"}</span>
          )}
          <span className="text-neutral-500 font-three text-base truncate">{domain}/{shortUrl}</span>
        </div>
      </div>

      <div className="hidden md:flex w-[10%] shrink-0">
        {link.password && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <HugeiconsIcon icon={CircleLock01Icon} size={15} />
            <span className="text-[10px] uppercase tracking-widest font-one">Protected</span>
          </div>
        )}
      </div>

      <div className="w-[20%] md:w-[10%] flex flex-col items-end md:items-start">
        <span className="text-white font-semibold text-sm md:text-base">{link.clicks || 0} clicks</span>
      </div>

      <div className="hidden md:flex items-center justify-end gap-3 text-neutral-400 w-[30%] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
        <button onClick={() => { if(onOpenPassword) onOpenPassword(link); }} className={`p-2 rounded-md cursor-pointer transition-colors ${link.password ? 'text-blue-500' : 'hover:text-white'}`}>
          {link.password ? <HugeiconsIcon icon={CircleLock01Icon} /> : <HugeiconsIcon icon={CircleUnlock01Icon} />}
        </button>
        <button onClick={() => { if(onOpenCustom) onOpenCustom(link); }} className="hover:text-white p-2 cursor-pointer"><HugeiconsIcon icon={MagicWand01Icon} /></button>
        <button onClick={() => window.open(`${domain}/${shortUrl}`, '_blank')} className="hover:text-white p-2 cursor-pointer"><HugeiconsIcon icon={Share05Icon} /></button>
        <button onClick={copyToClipboard} className={`p-2 cursor-pointer ${copied ? "text-green-500" : "hover:text-white"}`}>
          {copied ? <HugeiconsIcon icon={CopyCheckIcon} /> : <HugeiconsIcon icon={CopyIcon} />}
        </button>
        <button onClick={() => { if(onOpenQr) onOpenQr(link); }} className="hover:text-white p-2 cursor-pointer"><HugeiconsIcon icon={QrCodeIcon} /></button>
        <button onClick={() => router.push(`/analytics?link=${shortUrl}`)} className="hover:text-white p-2 cursor-pointer"><HugeiconsIcon icon={Analytics01Icon} /></button>
        <button onClick={() => { setIsEditing(true); setTempName(link.linkName || ""); }} className="hover:text-white p-2 cursor-pointer"><HugeiconsIcon icon={Edit03Icon} /></button>
        <button onClick={handleDelete} disabled={isDeleting} className="p-2 hover:text-red-500 cursor-pointer">
          {isDeleting ? <div className="w-[20px] h-[20px] border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <HugeiconsIcon icon={Delete02Icon} />}
        </button>
      </div>

      <div className="hidden md:block w-[10%] text-right text-neutral-500 text-sm font-medium">
        {getRelativeTime(link.createdAt)}
      </div>

      <div className="md:hidden flex justify-end w-[15%]" ref={menuRef}>
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)} 
          className="p-2 text-neutral-400 hover:text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>

        {showMobileMenu && (
          <div className="absolute right-4 top-16 mt-1 w-48 bg-[#111111] border border-neutral-800 rounded-lg shadow-xl z-50 flex flex-col py-2 overflow-hidden">
            <button onClick={() => { if(onOpenPassword) onOpenPassword(link); setShowMobileMenu(false); }} className={`flex items-center gap-3 px-4 py-2 text-sm text-left ${link.password ? 'text-blue-500' : 'text-neutral-300 hover:bg-neutral-800'}`}>
              {link.password ? <HugeiconsIcon icon={CircleLock01Icon} size={18} /> : <HugeiconsIcon icon={CircleUnlock01Icon} size={18} />}
              {link.password ? 'Protected' : 'Add Password'}
            </button>
            <button onClick={() => { if(onOpenCustom) onOpenCustom(link); setShowMobileMenu(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 text-left">
              <HugeiconsIcon icon={MagicWand01Icon} size={18} /> Custom Link
            </button>
            <button onClick={() => { window.open(`${domain}/${shortUrl}`, '_blank'); setShowMobileMenu(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 text-left">
              <HugeiconsIcon icon={Share05Icon} size={18} /> Open Link
            </button>
            <button onClick={copyToClipboard} className={`flex items-center gap-3 px-4 py-2 text-sm text-left ${copied ? 'text-green-500' : 'text-neutral-300 hover:bg-neutral-800'}`}>
              {copied ? <HugeiconsIcon icon={CopyCheckIcon} size={18} /> : <HugeiconsIcon icon={CopyIcon} size={18} />} Copy Link
            </button>
            <button onClick={() => { if(onOpenQr) onOpenQr(link); setShowMobileMenu(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 text-left">
              <HugeiconsIcon icon={QrCodeIcon} size={18} /> QR Code
            </button>
            <button onClick={() => { router.push(`/analytics?link=${shortUrl}`); setShowMobileMenu(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 text-left">
              <HugeiconsIcon icon={Analytics01Icon} size={18} /> Analytics
            </button>
            <button onClick={() => { setIsEditing(true); setTempName(link.linkName || ""); setShowMobileMenu(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 text-left">
              <HugeiconsIcon icon={Edit03Icon} size={18} /> Edit Name
            </button>
            
            <div className="h-px bg-neutral-800 my-1 mx-2" />
            
            <button onClick={handleDelete} disabled={isDeleting} className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 text-left">
              {isDeleting ? <div className="w-[18px] h-[18px] border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <HugeiconsIcon icon={Delete02Icon} size={18} />} Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


export default function BulkLinkDetails({ 
  batch, 
  onBack, 
  domain, 
  onRefresh, 
  onOpenQr, 
  onOpenPassword, 
  onOpenCustom 
}: any) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterType>("all");

  const filteredLinks = useMemo(() => {
    let result = batch.links || [];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((l: any) => 
        l.linkName?.toLowerCase().includes(q) || 
        l.shortUrl?.toLowerCase().includes(q) ||
        l.shorturl?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [batch.links, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / itemsPerPage));
  const paginatedLinks = filteredLinks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-6 border-b border-neutral-800 pb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-[#1c1c1c] rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={22} />
        </button>
        <div>
          <h2 className="text-xl md:text-2xl font-one text-white tracking-wide">{batch.name || "Bulk link"}</h2>
          <p className="text-neutral-500 font-three text-xs md:text-sm">{filteredLinks.length} total items</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 fade-in">
        <div className="relative w-full sm:max-w-[450px] flex-1">
          <HugeiconsIcon icon={Search02Icon} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search within folder..."
            className="w-full pl-11 pr-4 py-3 bg-[#111111] border border-neutral-800 rounded-xl text-white text-sm outline-none focus:border-neutral-600 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-auto flex justify-end">
          <FilterDropDown value={statusFilter} onChange={(val: FilterType) => setStatusFilter(val)} />
        </div>
      </div>

      <div className="flex flex-col w-full">
        {paginatedLinks.length > 0 ? (
          paginatedLinks.map((link: any, index: number) => (
            <BulkLinkItem 
              key={index}
              link={link}
              domain={domain}
              router={router}
              onRefresh={onRefresh}
              onOpenQr={onOpenQr}
              onOpenPassword={onOpenPassword}
              onOpenCustom={onOpenCustom}
            />
          ))
        ) : (
          <div className="text-center py-16 text-neutral-600 font-three italic">No links match your search.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-8 mt-12 pb-10">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-neutral-700 rounded-full disabled:opacity-20 hover:bg-neutral-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} className="text-white" />
          </button>
          
          <div className="text-neutral-400 font-one text-base md:text-lg">
            Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
          </div>

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-neutral-700 rounded-full disabled:opacity-20 hover:bg-neutral-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}