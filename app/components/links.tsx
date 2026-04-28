"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Share05Icon, Delete02Icon, QrCodeIcon, Edit03Icon, MagicWand01Icon,
  CircleLock01Icon, CircleUnlock01Icon, CopyCheckIcon, Tick02Icon,
  CopyIcon, Link04Icon, Analytics01Icon, SentIcon
} from '@hugeicons/core-free-icons';
import RedirectToModal from "../modals/redirectToModal";
import QrDownloadModal from "../modals/qrGenerate";

interface UrlItemProps {
  url: any;
  nextDomain: string | undefined;
  onRefresh: () => Promise<void>;
  onOpenQr?: (url: any) => void; // Made optional as we handle it internally now
  onOpenPassword: (url: any) => void;
  onOpenCustom: (url: any) => void;
  getRelativeTime: (date?: string) => string;
  router: any;
  userPlan?: string;
}

export default function Links({
  url,
  nextDomain,
  onRefresh,
  onOpenPassword,
  onOpenCustom,
  getRelativeTime,
  router,
  userPlan = "FREE"
}: UrlItemProps) {

  const [isEditing, setIsEditing] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tempName, setTempName] = useState(url.linkName || "");
  const [copied, setCopied] = useState(false);

  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQrData, setSelectedQrData] = useState<any>(null);

  const isFree = userPlan === "FREE";

  const getShortLink = () => {
    if (url.domain && url.subdomain) {
      return `${url.subdomain}.${url.domain}/${url.shorturl}`;
    }
    return `${nextDomain}/${url.shorturl}`;
  };

  const getDomain = (urlStr: string) => {
    try { return new URL(urlStr).hostname.replace("www.", ""); } catch { return ""; }
  };

  const getLogo = (urlStr: string) => {
    const domain = getDomain(urlStr);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  };

  const handleOpenQr = () => {
    const shortLink = getShortLink();
    setSelectedQrData({
      qrImage: `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent('https://' + shortLink)}`,
      shortUrl: shortLink,
      longUrl: url.original,
      qrName: url.linkName || "qr-code"
    });
    setIsQrModalOpen(true);
  };

  const copyToClipboard = () => {
    const link = getShortLink();
    navigator.clipboard.writeText(`https://${link}`);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const saveName = async () => {
    if (!tempName.trim()) {
      setIsEditing(false);
      return;
    }
    setIsSavingName(true);
    try {
      await axios.post("/api/shortUrl/linkName", { linkId: url.id, name: tempName.trim() });
      toast.success("Name updated!");
      await onRefresh();

    } catch {
      toast.error("Update failed");

    } finally {
      setIsSavingName(false);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    setIsDeleting(true);
    try {
      await axios.post(`/api/shortUrl/delete/${url.id}`);
      await onRefresh();
      toast.success("Link deleted successfully");

    } catch {
      toast.error("Failed to delete link");
      
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestrictedAction = (cb: () => void) => {
    if (isFree) {
      router.push("/premium");
      return;
    }
    cb();
  };

  return (
    <>
      <div className="relative flex items-center justify-between py-5 px-4 border-b border-neutral-800/60 hover:bg-[#1a1a1a] group transition-colors">

        <div className="flex items-start gap-4 w-[65%] md:w-[35%] min-w-0 pr-4">
          <div className="mt-1 w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
            {url.original ? (
              <img
                src={getLogo(url.original)}
                alt="logo"
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
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
                  {isSavingName ? (
                    <div className="w-[22px] h-[22px] border-2 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <HugeiconsIcon icon={Tick02Icon} />
                  )}
                </button>
              </div>
            ) : (
              <span className="text-white font-one text-xl truncate tracking-wide">
                {url.linkName || "Untitled Link"}
              </span>
            )}
            <span className="text-neutral-500 font-three text-base truncate">
              {getShortLink()}
            </span>
          </div>
        </div>

        <div className="hidden md:flex w-[15%] shrink-0 pr-4">
          {url.password && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <HugeiconsIcon icon={CircleLock01Icon} size={15} />
              <span className="text-[10px] uppercase tracking-widest font-one">Protected</span>
            </div>
          )}
        </div>

        <div className="w-[20%] md:w-[20%] flex flex-col items-end md:items-start">
          <span className="text-white font-semibold text-sm md:text-base">{url.clicks || 0} clicks</span>
        </div>

        <div className="hidden md:flex items-center justify-end gap-3 text-neutral-400 w-[30%] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">

          <button
            onClick={() => handleRestrictedAction(() => onOpenPassword(url))}
            className={`p-2 rounded-md cursor-pointer transition-colors ${url.password ? 'text-blue-500' : 'hover:text-white'}`}
            title="Password Protect"
          >
            {url.password ? <HugeiconsIcon icon={CircleLock01Icon} /> : <HugeiconsIcon icon={CircleUnlock01Icon} />}
          </button>

          <button
            onClick={() => handleRestrictedAction(() => onOpenCustom(url))}
            className="hover:text-white p-2 cursor-pointer"
            title="Custom Styling"
          >
            <HugeiconsIcon icon={MagicWand01Icon} />
          </button>

          <button
            onClick={() => window.open(`https://${getShortLink()}`, '_blank')}
            className="hover:text-white p-2 cursor-pointer"
            title="Open Link"
          >
            <HugeiconsIcon icon={Share05Icon} />
          </button>

          <button
            onClick={copyToClipboard}
            className={`p-2 cursor-pointer ${copied ? "text-green-500" : "hover:text-white"}`}
            title="Copy Link"
          >
            {copied ? <HugeiconsIcon icon={CopyCheckIcon} /> : <HugeiconsIcon icon={CopyIcon} />}
          </button>

          <button
            onClick={handleOpenQr}
            className="hover:text-white p-2 cursor-pointer"
            title="Generate QR Code"
          >
            <HugeiconsIcon icon={QrCodeIcon} />
          </button>

          <button
            onClick={() => setIsRedirectModalOpen(true)}
            className={`p-2 cursor-pointer transition-colors ${url.redirectTo ? 'text-blue-500' : 'hover:text-white'}`}
            title="Target URL Settings"
          >
            <HugeiconsIcon icon={SentIcon} />
          </button>

          <button
            onClick={() => router.push(`/analytics?link=${url.shorturl}`)}
            className="hover:text-white p-2 cursor-pointer"
            title="View Analytics"
          >
            <HugeiconsIcon icon={Analytics01Icon} />
          </button>

          <button
            onClick={() => { setIsEditing(true); setTempName(url.linkName || ""); }}
            className="hover:text-white p-2 cursor-pointer"
            title="Edit Name"
          >
            <HugeiconsIcon icon={Edit03Icon} />
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 hover:text-red-500 cursor-pointer"
            title="Delete Link"
          >
            {isDeleting ? (
              <div className="w-[20px] h-[20px] border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <HugeiconsIcon icon={Delete02Icon} />
            )}
          </button>
        </div>

        <div className="hidden md:block w-[10%] text-right text-neutral-500 text-sm font-medium">
          {getRelativeTime(url.createdAt)}
        </div>
      </div>

      <RedirectToModal
        isOpen={isRedirectModalOpen}
        onClose={() => setIsRedirectModalOpen(false)}
        selectedUrl={url}
        onSuccess={onRefresh}
      />

      <QrDownloadModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        qrData={selectedQrData}
      />
    </>
  );
}