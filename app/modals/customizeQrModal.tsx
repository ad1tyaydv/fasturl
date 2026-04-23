"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, Copy, Download, Share2, LayoutTemplate, 
  Palette, ImageIcon, Square, Frame 
} from "lucide-react";
import toast from "react-hot-toast";
import QRCodeStyling from "qr-code-styling";

interface QrCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrData: any;
}

export default function QrCustomizeModal({ isOpen, onClose, qrData }: QrCustomizeModalProps) {
  const [activeTab, setActiveTab] = useState("colors");
  const [logoEnabled, setLogoEnabled] = useState(true);
  const [logoSize, setLogoSize] = useState(20); // 20%
  
  const [qrColor, setQrColor] = useState("#F07D51");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [activeCorner, setActiveCorner] = useState(0);
  const [activeEye, setActiveEye] = useState(0);

  // Reference for the div where the QR code will be injected
  const qrRef = useRef<HTMLDivElement>(null);
  // Reference to hold the QRCodeStyling instance
  const qrCodeInstance = useRef<any>(null);

  const fullUrl = qrData ? `${process.env.NEXT_PUBLIC_DOMAIN || 'https://fasturl.in'}/${qrData.shortUrl}` : "https://fasturl.in";

  // Maps your UI index to actual qr-code-styling types
  const cornerTypes = ["square", "extra-rounded", "rounded", "dot", "classy"];
  const eyeTypes = ["square", "dot"];

  // Initialize QR Code Instance (Runs once when modal opens)
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      qrCodeInstance.current = new QRCodeStyling({
        width: 300,
        height: 300,
        data: fullUrl,
        margin: 10,
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 5,
        },
      });

      if (qrRef.current) {
        qrRef.current.innerHTML = ""; // Clear existing
        qrCodeInstance.current.append(qrRef.current);
      }
    }
  }, [isOpen, fullUrl]);

  // Update QR Code whenever settings change
  useEffect(() => {
    if (!qrCodeInstance.current) return;

    qrCodeInstance.current.update({
      data: fullUrl,
      dotsOptions: {
        color: qrColor,
        type: "rounded" // Default dot style
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        type: cornerTypes[activeCorner] || "square",
        color: qrColor,
      },
      cornersDotOptions: {
        type: eyeTypes[activeEye] || "square",
        color: qrColor,
      },
      image: logoEnabled ? "/favicon.ico" : "", // Toggles your logo
      imageOptions: {
        imageSize: logoSize / 100, // Converts 20% to 0.2
        margin: 5,
      }
    });
  }, [qrColor, bgColor, activeCorner, activeEye, logoEnabled, logoSize, fullUrl]);

  if (!isOpen || !qrData) return null;


  const handleSave = async () => {
  try {
    await fetch("/api/qrCode", {
      method: "POST",
      body: JSON.stringify({
        shortUrl: qrData.shortUrl,
        longUrl: qrData.longUrl,

        qrColor,
        bgColor,
        cornerStyle: cornerTypes[activeCorner],
        eyeStyle: eyeTypes[activeEye],

        logoUrl: logoEnabled ? "/favicon.ico" : null,
        logoSize: logoSize / 100,
      }),
    });

    toast.success("QR saved!");
  } catch {
    toast.error("Failed to save QR");
  }
};

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleDownload = (ext: "png" | "svg") => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.download({
        name: `qr-${qrData.shortUrl}`,
        extension: ext
      });
    }
  };

  const tabs = [
    { id: "templates", label: "Templates", icon: LayoutTemplate },
    { id: "colors", label: "Colors", icon: Palette },
    { id: "logo", label: "Logo", icon: ImageIcon },
    { id: "background", label: "Background", icon: Square },
    { id: "frame", label: "Frame", icon: Frame },
  ];

  const presetQrColors = ["#1A1A1A", "#2563EB", "#F07D51", "#3B82F6", "#22C55E", "#06B6D4"];
  const presetBgColors = ["#FFFFFF", "#F8FAFC", "#EFF6FF", "#F0FDF4", "#FEF3C7", "#FCE7F3"];

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#1c1c1c] w-full max-w-5xl rounded-2xl border border-neutral-800 shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white tracking-tight">Customize QR Code</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          {/* Left Column: Settings */}
          <div className="w-full lg:w-[55%] flex flex-col border-r border-neutral-800">
            <div className="flex justify-between px-6 pt-6 border-b border-neutral-800 overflow-x-auto custom-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-2 pb-4 px-2 border-b-2 transition-all min-w-[70px] ${
                    activeTab === tab.id ? "border-[#F07D51] text-[#F07D51]" : "border-transparent text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  <tab.icon size={22} />
                  <span className="text-[11px] font-bold tracking-wider uppercase">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              {activeTab === "colors" && (
                <>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-white">QR Code Color</label>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center border border-neutral-700 rounded-lg overflow-hidden bg-[#111111] p-1 w-[120px]">
                        <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                        <input type="text" value={qrColor.toUpperCase()} onChange={(e) => setQrColor(e.target.value)} className="w-full bg-transparent text-white px-2 text-sm outline-none" />
                      </div>
                      {presetQrColors.map((color) => (
                        <button key={color} onClick={() => setQrColor(color)} className="w-8 h-8 rounded-full border-2 border-neutral-800 transition-transform hover:scale-110 flex items-center justify-center" style={{ backgroundColor: color }}>
                          {qrColor.toUpperCase() === color && <span className="w-2 h-2 bg-white rounded-full opacity-80" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-white">Background Color</label>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center border border-neutral-700 rounded-lg overflow-hidden bg-[#111111] p-1 w-[120px]">
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                        <input type="text" value={bgColor.toUpperCase()} onChange={(e) => setBgColor(e.target.value)} className="w-full bg-transparent text-white px-2 text-sm outline-none" />
                      </div>
                      {presetBgColors.map((color) => (
                        <button key={color} onClick={() => setBgColor(color)} className="w-8 h-8 rounded-full border-2 border-neutral-800 transition-transform hover:scale-110 flex items-center justify-center" style={{ backgroundColor: color }}>
                           {bgColor.toUpperCase() === color && <span className="w-2 h-2 bg-black rounded-full opacity-50" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-white">Corner Style</label>
                        <div className="flex gap-2">
                          {[0, 1, 2, 3, 4].map((idx) => (
                            <button key={idx} onClick={() => setActiveCorner(idx)} className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-colors ${activeCorner === idx ? 'border-[#F07D51] bg-[#F07D51]/10 text-[#F07D51]' : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}>
                              <Square size={20} className={idx === 1 ? "rounded-sm" : idx === 2 ? "rounded-md" : idx === 3 ? "rounded-lg" : idx === 4 ? "rounded-full" : ""} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-white">Eye Style</label>
                        <div className="flex gap-2">
                          {[0, 1].map((idx) => (
                            <button key={idx} onClick={() => setActiveEye(idx)} className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-colors ${activeEye === idx ? 'border-[#F07D51] bg-[#F07D51]/10 text-[#F07D51]' : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}>
                              <div className={`border-2 border-current w-5 h-5 flex items-center justify-center ${idx === 1 ? 'rounded-full' : 'rounded-sm'}`}>
                                 <div className={`bg-current w-2 h-2 ${idx === 1 ? 'rounded-full' : 'rounded-sm'}`} />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border border-neutral-700 rounded-xl p-5 bg-[#111111] flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-bold text-white">Add Logo</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={logoEnabled} onChange={() => setLogoEnabled(!logoEnabled)} />
                          <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F07D51]"></div>
                        </label>
                      </div>

                      <div className={`flex flex-col items-center gap-4 transition-opacity ${!logoEnabled ? 'opacity-30 pointer-events-none' : ''}`}>
                        <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2 shadow-inner">
                           <img src="/favicon.ico" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        
                        <div className="w-full mt-2">
                          <div className="flex justify-between text-xs text-neutral-400 mb-2">
                            <span>Logo Size</span>
                            <span>{logoSize}%</span>
                          </div>
                          <input 
                            type="range" min="5" max="40" 
                            value={logoSize} onChange={(e) => setLogoSize(Number(e.target.value))}
                            className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#F07D51]" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Preview & Actions */}
          <div className="w-full lg:w-[45%] p-8 bg-[#161616] flex flex-col items-center">
            <div className="w-full max-w-sm flex flex-col gap-6">
              <div className="bg-neutral-800 text-xs font-bold text-neutral-300 uppercase tracking-widest px-3 py-1 rounded-full self-start">
                Preview
              </div>

              {/* LIVE QR CODE INJECTION CONTAINER */}
              <div className="w-full aspect-square rounded-2xl shadow-xl flex items-center justify-center p-6 relative overflow-hidden bg-white">
                <div ref={qrRef} className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>canvas]:w-full [&>canvas]:h-full" />
              </div>

              <div className="flex items-center justify-between border border-neutral-700 bg-[#111111] rounded-xl p-1.5 pr-2">
                <span className="text-neutral-400 text-sm truncate pl-3 font-medium">
                  {fullUrl}
                </span>
                <button onClick={handleCopyLink} className="flex items-center gap-1.5 text-[#F07D51] bg-[#F07D51]/10 hover:bg-[#F07D51]/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer">
                  <Copy size={14} /> Copy Link
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleDownload("png")} className="bg-[#F07D51] hover:bg-[#e06d41] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors shadow-lg shadow-[#F07D51]/20 cursor-pointer">
                  <Download size={18} /> Download PNG
                </button>
                <button onClick={() => handleDownload("svg")} className="border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors cursor-pointer">
                  <Download size={18} /> Download SVG
                </button>
              </div>

              <button className="w-full border border-[#F07D51]/30 text-[#F07D51] hover:bg-[#F07D51]/10 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors cursor-pointer">
                <Share2 size={18} /> Share QR Code
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}