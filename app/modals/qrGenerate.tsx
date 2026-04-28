"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Loader2 } from "lucide-react"; // Added Loader2
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface QrDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrData: {
    qrImage: string;
    shortUrl: string;
    longUrl: string;
    qrName?: string;
  } | null;
}

export default function QrDownloadModal({ isOpen, onClose, qrData }: QrDownloadModalProps) {
  const [showShortUrl, setShowShortUrl] = useState(true);
  const [showLongUrl, setShowLongUrl] = useState(true);
  const [qrOnly, setQrOnly] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsImageLoading(true);
    }
  }, [isOpen, qrData?.qrImage]);

  if (!isOpen || !qrData) return null;


  const handleDownload = async () => {
    if (!previewRef.current || isImageLoading) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        backgroundColor: "#ffffff",
        scale: 3,
        logging: false,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${qrData.qrName || "qrcode"}.png`;
      link.click();
      toast.success("QR Code downloaded successfully");

    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download QR code");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1c1c1c] w-full max-w-2xl p-6 sm:p-10 border border-neutral-800 rounded-2xl relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>

        <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-white">
          Download QR Code
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <div className="flex flex-col items-center w-full">
            <p className="text-neutral-400 text-sm mb-3 self-start">Preview</p>
            <div
              ref={previewRef}
              style={{
                backgroundColor: "#ffffff",
                padding: qrOnly ? "24px" : "32px",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                maxWidth: "320px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                color: "#000000",
              }}
            >
              {!qrOnly && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                  <img src="/favicon.ico" alt="Logo" style={{ width: "24px", height: "24px" }} />
                  <span style={{ color: "#000000", fontWeight: "800", fontSize: "18px", fontFamily: "sans-serif" }}>
                    FASTURL
                  </span>
                </div>
              )}

              <div style={{ 
                width: "100%", 
                aspectRatio: "1/1", 
                position: "relative",
                marginBottom: qrOnly ? "0" : "24px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                border: qrOnly ? "none" : "1px solid #f3f4f6",
                backgroundColor: "#ffffff"
              }}>
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                )}
                
                <img
                  src={qrData.qrImage}
                  alt="QR Code"
                  onLoad={() => setIsImageLoading(false)}
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "contain",
                    display: isImageLoading ? "none" : "block" 
                  }}
                />
              </div>

              {!qrOnly && (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {showShortUrl && (
                    <div style={{ width: "100%" }}>
                      <span style={{ fontWeight: "bold", color: "#888888", fontSize: "10px", textTransform: "uppercase" }}>Short URL</span>
                      <div style={{ color: "#2563eb", fontSize: "12px", wordBreak: "break-all", fontWeight: "500" }}>
                        {qrData.shortUrl}
                      </div>
                    </div>
                  )}
                  {showLongUrl && (
                    <div style={{ width: "100%" }}>
                      <span style={{ fontWeight: "bold", color: "#888888", fontSize: "10px", textTransform: "uppercase" }}>Original URL</span>
                      <div style={{ color: "#444444", fontSize: "11px", wordBreak: "break-all" }}>
                        {qrData.longUrl}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 justify-center">
            <div className="space-y-3">
              {[
                { label: "QR Only", sub: "Only the code", state: qrOnly, setter: setQrOnly },
                { label: "Short URL", sub: "Show link", state: showShortUrl, setter: setShowShortUrl },
                { label: "Original URL", sub: "Show destination", state: showLongUrl, setter: setShowLongUrl }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-neutral-900/50 border border-neutral-800 rounded-xl">
                  <div>
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    <p className="text-neutral-500 text-[10px]">{item.sub}</p>
                  </div>
                  <button
                    onClick={() => item.setter(!item.state)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${item.state ? "bg-blue-500" : "bg-neutral-700"}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.state ? "right-1" : "left-1"}`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <Button
                onClick={handleDownload}
                disabled={isImageLoading}
                className="w-full bg-white text-black hover:bg-neutral-200 font-bold h-12 rounded-xl transition-all"
              >
                {isImageLoading ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2 h-5 w-5" />}
                Download PNG
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full bg-transparent text-neutral-400 border-neutral-800 hover:bg-neutral-900 h-12 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}