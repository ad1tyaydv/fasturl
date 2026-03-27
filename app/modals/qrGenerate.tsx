"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2, X, Download } from "lucide-react";
import { toast } from "sonner";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUrl: any;
}

export default function QRCodeModal({ isOpen, onClose, selectedUrl }: QRCodeModalProps) {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (isOpen && selectedUrl) {
      handleGenerateQr();
    }

    if (!isOpen) {
      setQrImage(null);
    }

  }, [isOpen, selectedUrl]);


  const handleGenerateQr = async () => {
    if (!selectedUrl?.original) {
        console.error("No original URL found for QR generation");
        return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post("/api/qrCode", {
        shortUrl: selectedUrl.shorturl,
        longUrl: selectedUrl.original,
      });

      console.log(res.data.qrImage)

      if (res.data.qrImage) {
        setQrImage(res.data.qrImage);
      }

    } catch (error: any) {
      console.error("QR Error:", error);
      toast.error("Failed to generate QR code");

    } finally {
      setIsLoading(false);
    }
  };


  if (!isOpen) return null;

  
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1c1c1c] w-full max-w-lg p-6 sm:p-10 border border-neutral-800 rounded-xl relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-neutral-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <h3 className="text-xl sm:text-2xl font-three mb-8 text-center text-white">Link QR Code</h3>

        <div className="flex flex-col items-center justify-center space-y-6 mb-8">
          <div className="relative w-64 h-64 bg-white rounded-lg flex items-center justify-center overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-black" />
                <p className="text-black text-[10px] font-bold font-three uppercase tracking-widest">Generating...</p>
              </div>
            ) : qrImage ? (
              <img src={qrImage} alt="QR Code" className="w-full h-full p-4 object-contain" />
            ) : (
              <p className="text-neutral-400 text-xs">Preparing QR...</p>
            )}
          </div>

          <div className="text-center space-y-1 w-full px-4">
            <p className="text-white font-one text-lg truncate uppercase tracking-tight">
              {selectedUrl?.name || "Untitled Link"}
            </p>
            <p className="text-neutral-500 font-three text-xs truncate">
              {selectedUrl?.original}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="bg-transparent text-white border-neutral-700 hover:bg-[#2a2a2a]">
            Close
          </Button>
          <Button
            onClick={() => {
                const link = document.createElement("a");
                link.href = qrImage!;
                link.download = `qr-${selectedUrl?.name || 'code'}.png`;
                link.click();
            }}
            disabled={isLoading || !qrImage}
            className="bg-white text-black hover:bg-gray-200 font-bold"
          >
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        </div>
      </div>
    </div>
  );
}