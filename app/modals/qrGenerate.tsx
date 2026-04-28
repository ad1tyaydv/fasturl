"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface QrDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrData?: {
    qrImage: string;
    shortUrl: string;
    longUrl: string;
    qrName?: string;
  } | null;
  selectedUrl?: any;
}

export default function QrDownloadModal({ isOpen, onClose, qrData, selectedUrl }: QrDownloadModalProps) {
  const [showShortUrl, setShowShortUrl] = useState(true);
  const [showLongUrl, setShowLongUrl] = useState(true);
  const [qrOnly, setQrOnly] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const [effectiveQrData, setEffectiveQrData] = useState<any>(null);

  useEffect(() => {
    if (qrData) {
      setEffectiveQrData(qrData);
    } else if (selectedUrl) {
      const nextDomain = process.env.NEXT_PUBLIC_DOMAIN;
      const getShortLink = () => {
        if (selectedUrl.domain && selectedUrl.subdomain) {
          return `${selectedUrl.subdomain}.${selectedUrl.domain}/${selectedUrl.shorturl}`;
        }
        return `${nextDomain}/${selectedUrl.shorturl}`;
      };
      const shortLink = getShortLink();
      
      setEffectiveQrData({
        qrImage: `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent('https://' + shortLink)}`,
        shortUrl: shortLink,
        longUrl: selectedUrl.original,
        qrName: selectedUrl.linkName || "qr-code"
      });
    } else {
      setEffectiveQrData(null);
    }
  }, [qrData, selectedUrl, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsImageLoading(true);
    }
  }, [isOpen, effectiveQrData?.qrImage]);

  if (!isOpen || !effectiveQrData) return null;


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
      link.download = `${effectiveQrData.qrName || "qrcode"}.png`;
      link.click();
      toast.success("QR Code downloaded successfully");

    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download QR code");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-background w-full max-w-2xl p-6 sm:p-10 border border-border rounded-2xl relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>

        <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-foreground">
          Download QR Code
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <div className="flex flex-col items-center w-full">
            <p className="text-muted-foreground text-sm mb-3 self-start">Preview</p>
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
                  src={effectiveQrData.qrImage}
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
                        {effectiveQrData.shortUrl}
                      </div>
                    </div>
                  )}
                  {showLongUrl && (
                    <div style={{ width: "100%" }}>
                      <span style={{ fontWeight: "bold", color: "#888888", fontSize: "10px", textTransform: "uppercase" }}>Original URL</span>
                      <div style={{ color: "#444444", fontSize: "11px", wordBreak: "break-all" }}>
                        {effectiveQrData.longUrl}
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
                <div key={item.label} className="flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-xl">
                  <div>
                    <p className="text-foreground text-sm font-medium">{item.label}</p>
                    <p className="text-muted-foreground text-[10px]">{item.sub}</p>
                  </div>
                  <button
                    onClick={() => item.setter(!item.state)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${item.state ? "bg-blue-500" : "bg-muted"}`}
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
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 rounded-xl transition-all"
              >
                {isImageLoading ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2 h-5 w-5" />}
                Download PNG
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full bg-transparent text-muted-foreground border-border hover:bg-accent h-12 rounded-xl"
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
