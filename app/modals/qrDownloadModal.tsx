"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
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
  const previewRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !qrData) return null;

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        onclone: (clonedDoc) => {
          const styleSheets = Array.from(clonedDoc.querySelectorAll('style, link[rel="stylesheet"]'));
          styleSheets.forEach(sheet => sheet.remove());
          clonedDoc.body.style.backgroundColor = "transparent";
        }
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

        <h3 className="text-xl sm:text-2xl font-one mb-6 text-center text-foreground">
          Download QR Code
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <div className="flex flex-col items-center w-full">
            <p className="text-muted-foreground text-sm mb-3 self-start">Preview</p>
            <div
              ref={previewRef}
              style={{
                backgroundColor: "#ffffff",
                padding: "32px",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                maxWidth: "320px",
                height: "auto",
                minHeight: "400px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                color: "#000000",
                boxSizing: "border-box"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                <img src="/favicon.ico" alt="Logo" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
                <span style={{ color: "#000000", fontWeight: "bold", fontSize: "20px", letterSpacing: "-0.05em", fontFamily: "sans-serif" }}>
                  FASTURL
                </span>
              </div>

              <div style={{ width: "100%", aspectRatio: "1/1", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #f3f4f6", padding: "10px", backgroundColor: "#ffffff", boxSizing: "border-box" }}>
                <img
                  src={qrData.qrImage}
                  alt="QR Code"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>

              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
                {showShortUrl && (
                  <div style={{ width: "100%" }}>
                    <span style={{ fontWeight: "bold", color: "#666666", fontSize: "11px", display: "block", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Short URL:</span>
                    <div style={{ color: "#2563eb", fontSize: "12px", wordBreak: "break-all", lineHeight: "1.4", fontWeight: "500" }}>
                      {qrData.shortUrl}
                    </div>
                  </div>
                )}
                {showLongUrl && (
                  <div style={{ width: "100%" }}>
                    <span style={{ fontWeight: "bold", color: "#666666", fontSize: "11px", display: "block", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Original URL:</span>
                    <div style={{ color: "#2563eb", fontSize: "12px", wordBreak: "break-all", lineHeight: "1.4", fontWeight: "500" }}>
                      {qrData.longUrl}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 justify-center h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/50 border border-border rounded-xl">
                <div>
                  <p className="text-foreground font-medium">Show Short URL</p>
                  <p className="text-muted-foreground text-xs">Include short URL in download</p>
                </div>
                <button
                  onClick={() => setShowShortUrl(!showShortUrl)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    showShortUrl ? "bg-blue-500" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      showShortUrl ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/50 border border-border rounded-xl">
                <div>
                  <p className="text-foreground font-medium">Show Original URL</p>
                  <p className="text-muted-foreground text-xs">Include original URL in download</p>
                </div>
                <button
                  onClick={() => {setShowLongUrl(!showLongUrl); console.log("Toggled showLongUrl:", !showLongUrl)}}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    showLongUrl ? "bg-blue-500" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      showLongUrl ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Button
                onClick={handleDownload}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 text-lg rounded-xl transition-all active:scale-95"
              >
                <Download className="mr-2 h-5 w-5" /> Download PNG
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full bg-transparent text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground h-12 rounded-xl"
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
