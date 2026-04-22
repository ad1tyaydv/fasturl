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
  Edit02Icon,
  Tick02Icon,
  Edit03Icon
} from '@hugeicons/core-free-icons';


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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(itemCount / itemsPerPage);


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


  const handleDownload = (base64Data: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = base64Data;
    link.download = `${fileName || "qrcode"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              className="relative flex items-center py-8 px-5 border-b border-neutral-800/60 hover:bg-[#1a1a1a] group transition-all"
            >
              <div className="shrink-0 mr-6">
                <div className="w-16 h-16 bg-white flex items-center justify-center overflow-hidden shadow-lg border border-white/10">
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
                      className="bg-[#111111] border border-neutral-700 rounded-lg px-3 py-1.5 text-white w-full outline-none focus:border-blue-500 transition-colors text-lg font-one disabled:opacity-50"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveName(qr.id)}
                    />
                    <button
                      onClick={() => saveName(qr.id)}
                      disabled={savingId === qr.id}
                      className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors disabled:opacity-50 shrink-0"
                    >
                      {savingId === qr.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      ) : (
                        <HugeiconsIcon icon={Tick02Icon} size={24} />
                      )}
                    </button>
                  </div>
                ) : (
                  <h3 className="text-white font-one text-xl md:text-2xl truncate tracking-wide mb-1">
                    {qr.qrName || "Untitled QR"}
                  </h3>
                )}
                <p className="text-neutral-500 font-three text-sm truncate opacity-80 mt-1">
                  {qr.longUrl}
                </p>
              </div>

              <div className="flex items-center gap-1 md:gap-2 mr-8">
                <button
                  onClick={() => {
                    setEditingId(qr.id);
                    setTempName(qr.name || "");
                  }}
                  className={`p-3 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer text-neutral-400 ${editingId === qr.id ? 'hidden' : 'flex'}`}
                  title="Edit Name"
                >
                  <HugeiconsIcon icon={Edit03Icon} />
                </button>

                <button
                  onClick={() => handleDownload(qr.qrImage, qr.name || `qr-${qr.id}`)}
                  className="p-3 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer text-neutral-400"
                  title="Download"
                >
                  <HugeiconsIcon icon={Download01Icon} />
                </button>
                <button
                  onClick={() => handleDeleteQr(qr.id)}
                  className="p-3 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer text-neutral-400"
                  title="Delete"
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                </button>
              </div>

              <div className="shrink-0 text-right text-neutral-500 font-medium text-sm whitespace-nowrap min-w-[90px]">
                {getRelativeTime(qr.createdAt)}
              </div>
            </div>
          ))
        ) : (
          /* EMPTY STATE */
          <div className="w-full py-20 px-4 flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 rounded-3xl bg-[#1c1c1c]/30 mt-4">
            <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 mb-6">
                <HugeiconsIcon icon={QrCodeIcon} className="w-10 h-10 text-neutral-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-one mb-2 text-white">No QR Codes discovered</h2>
            <p className="text-neutral-500 font-three text-sm mb-8 text-center max-w-md">
                Generate custom QR codes for your links to use them in the physical world.
            </p>
            <button 
              onClick={() => router.push('/')} 
              className="bg-white text-black hover:bg-neutral-200 font-three px-8 py-3 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
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
            className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl disabled:opacity-30 cursor-pointer hover:bg-neutral-800 transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </button>
          <span className="text-sm text-neutral-400 font-one mx-4">
             Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl disabled:opacity-30 cursor-pointer hover:bg-neutral-800 transition-colors"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
          </button>
        </div>
      )}
    </div>
  );
}