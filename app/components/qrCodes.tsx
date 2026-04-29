"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Download01Icon, 
  Delete02Icon, 
  QrCodeIcon, 
  PlusSignIcon, 
  ArrowRight01Icon, 
  ArrowLeft01Icon,
  Tick02Icon,
  Edit03Icon
} from '@hugeicons/core-free-icons';
import QrDownloadModal from "../modals/qrDownloadModal";

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

export default function QrCodes({
  qrCodes, onRefresh, itemCount, router
}: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const totalPages = Math.ceil(itemCount / itemsPerPage);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedQrForDownload, setSelectedQrForDownload] = useState<any>(null);

  const handleDeleteQr = async (id: string) => {
    const loadingToast = toast.loading("Deleting QR Code...");

    try {
      await axios.delete(`/api/qrCode/delete/${id}`);
      toast.success("QR Code deleted", { id: loadingToast });
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete", { id: loadingToast });
    }
  };

  const handleDownloadClick = (qr: any) => {
    setSelectedQrForDownload({
      qrImage: qr.qrImage,
      shortUrl: qr.shortUrl.startsWith('http') ? qr.shortUrl : `${window.location.origin}/r/${qr.shortUrl}`,
      longUrl: qr.longUrl,
      qrName: qr.qrName || qr.name
    });
    setIsDownloadModalOpen(true);
  };

  const saveName = async (id: string) => {
    if (!tempName.trim()) {
      setEditingId(null);
      return;
    }

    setSavingId(id);
    try {
      await axios.post("/api/qrCode/qrName", {
        id: id,
        qrName: tempName.trim()
      });
      
      toast.success("QR Code name updated");
      onRefresh();
      setEditingId(null);
    } catch (error) {
      toast.error("Failed to update name");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col w-full">
        {qrCodes.length > 0 ? (
          qrCodes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((qr: any) => (
            <div
              key={qr.id}
              className="relative flex items-center py-8 px-5 border-b border-border hover:bg-accent group transition-all"
            >
              <div className="shrink-0 mr-6">
                <div className="w-16 h-16 bg-white flex items-center justify-center overflow-hidden shadow-lg border border-border/10">
                  <img 
                    src={qr.qrImage} 
                    alt="QR Preview" 
                    className="w-full h-full object-cover p-0" 
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0 mr-4">
                {editingId === qr.id ? (
                  <div className="flex items-center gap-2 max-w-md">
                    <input
                      autoFocus
                      disabled={savingId === qr.id}
                      className="bg-background border border-border rounded-lg px-3 py-1.5 text-foreground w-full outline-none focus:ring-1 focus:ring-ring transition-colors text-lg font-one disabled:opacity-50"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveName(qr.id)}
                    />
                    <button
                      onClick={() => saveName(qr.id)}
                      disabled={savingId === qr.id}
                      className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
                    >
                      {savingId === qr.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      ) : (
                        <HugeiconsIcon icon={Tick02Icon} size={24} />
                      )}
                    </button>
                  </div>
                ) : (
                  <h3 className="text-foreground font-one text-xl md:text-2xl truncate tracking-wide mb-1">
                    {qr.qrName || "Untitled QR"}
                  </h3>
                )}
                <p className="text-muted-foreground font-three text-sm truncate opacity-80 mt-1">
                  {qr.longUrl}
                </p>
              </div>

              <div className="flex items-center gap-1 md:gap-2 mr-8">
                <button
                  onClick={() => {
                    setEditingId(qr.id);
                    setTempName(qr.name || "");
                  }}
                  className={`p-3 hover:text-foreground hover:bg-accent rounded-xl transition-colors cursor-pointer text-muted-foreground ${editingId === qr.id ? 'hidden' : 'flex'}`}
                  title="Edit Name"
                >
                  <HugeiconsIcon icon={Edit03Icon} />
                </button>

                <button
                  onClick={() => handleDownloadClick(qr)}
                  className="p-3 hover:text-foreground hover:bg-accent rounded-xl transition-colors cursor-pointer text-muted-foreground"
                  title="Download"
                >
                  <HugeiconsIcon icon={Download01Icon} />
                </button>
                <button
                  onClick={() => handleDeleteQr(qr.id)}
                  className="p-3 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer text-muted-foreground"
                  title="Delete"
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                </button>
              </div>

              <div className="shrink-0 text-right text-muted-foreground font-medium text-sm whitespace-nowrap min-w-[90px]">
                {getRelativeTime(qr.createdAt)}
              </div>
            </div>
          ))
        ) : (
          <div className="w-full py-20 px-4 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-secondary/30 mt-4">
            <div className="p-4 bg-secondary rounded-2xl border border-border mb-6">
                <HugeiconsIcon icon={QrCodeIcon} className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl sm:text-2xl font-one mb-2 text-foreground">No QR Codes discovered</h2>
            <p className="text-muted-foreground font-three text-sm mb-8 text-center max-w-md">
                Generate custom QR codes for your links to use them in the physical world.
            </p>
            <button 
              onClick={() => router.push('/')} 
              className="bg-foreground text-background hover:opacity-90 font-three px-8 py-3 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={PlusSignIcon} className="w-5 h-5" /> Create QR Code
            </button>
          </div>
        )}
      </div>

      {totalPages > 1 && qrCodes.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-10 pb-10">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-3 bg-secondary border border-border rounded-xl disabled:opacity-30 cursor-pointer hover:bg-accent transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </button>
          <span className="text-sm text-muted-foreground font-one mx-4">
             Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-3 bg-secondary border border-border rounded-xl disabled:opacity-30 cursor-pointer hover:bg-accent transition-colors"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
          </button>
        </div>
      )}

      <QrDownloadModal 
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        qrData={selectedQrForDownload}
      />
    </div>
  );
}
