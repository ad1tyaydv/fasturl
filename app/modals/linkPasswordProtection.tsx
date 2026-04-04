"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { 
  IoPencilOutline, IoEyeOutline, 
  IoEyeOffOutline, IoCalendarOutline 
} from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface LinkPasswordProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUrl: any;
  onSuccess: () => void;
}

export default function LinkPasswordModal({ isOpen, onClose, selectedUrl, onSuccess }: LinkPasswordProps) {
  const [password, setPassword] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingExpiry, setIsEditingExpiry] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedUrl) {
      setPassword("");
      setExpiryDate("");
      setIsEditingPassword(!selectedUrl.password);
      setIsEditingExpiry(!selectedUrl.expiresAt);
      setShowPassword(false);
    }
  }, [isOpen, selectedUrl]);

  if (!isOpen || !selectedUrl) return null;

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const finalPassword = isEditingPassword ? password : selectedUrl?.password;
      const finalExpiry = isEditingExpiry ? expiryDate : selectedUrl?.expiresAt;
      
      await axios.post("/api/shortUrl/passwordProtection", {
        shortUrlId: selectedUrl?.id,
        password: finalPassword,
        expiryDate: finalExpiry,
      });
      
      toast.success(selectedUrl.password ? "Protection updated!" : "Protection added!", {
        style: { background: '#1c1c1c', color: '#fff', border: '1px solid #333' },
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to update protection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProtection = async () => {
    setIsLoading(true);
    try {
      // Sending empty values to clear the existing protection
      await axios.post("/api/shortUrl/passwordProtection", {
        shortUrlId: selectedUrl?.id,
        password: "",
        expiryDate: "",
      });
      
      toast.success("Password removed!", {
        style: { background: '#1c1c1c', color: '#fff', border: '1px solid #333' },
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to remove Password.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasExistingProtection = selectedUrl.password || selectedUrl.expiresAt;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 transition-opacity" onClick={() => !isLoading && onClose()}>
      <div className="bg-[#1c1c1c] shadow-2xl w-full max-w-lg p-6 sm:p-10 border border-neutral-800 rounded-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl sm:text-2xl font-three mb-8 text-center text-white">Link Protection</h3>
        
        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xl font-one text-white">Password <span className="text-sm text-neutral-500 font-three font-normal">(Optional)</span></label>
              {!isEditingPassword && selectedUrl.password && (
                <button onClick={() => { setIsEditingPassword(true); setPassword(""); }} className="text-blue-500 hover:text-blue-400 cursor-pointer" disabled={isLoading}>
                  <IoPencilOutline size={18} />
                </button>
              )}
            </div>
            {!isEditingPassword && selectedUrl.password ? (
              <div className="w-full p-3 border border-dashed border-neutral-700 bg-[#1a1a1a] text-neutral-400 font-three italic rounded-lg">Password configured</div>
            ) : (
              <div className="relative flex items-center border border-neutral-700 bg-[#111111] focus-within:border-blue-500 rounded-lg overflow-hidden">
                <input type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-transparent text-white font-three focus:outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-4 text-neutral-500 hover:text-white cursor-pointer">
                  {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xl font-one text-white">Set Expiry Date</label>
            </div>
            <div className="relative group">
              <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full p-3 border border-neutral-700 bg-[#111111] text-white font-three focus:outline-none focus:border-blue-500 rounded-lg cursor-pointer [color-scheme:dark]" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                <IoCalendarOutline size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {hasExistingProtection && (
              <Button 
                onClick={handleRemoveProtection} 
                disabled={isLoading} 
                className="bg-white h-10 text-red-600 hover:text-red-700 hover:bg-gray-200 font-bold px-4 cursor-pointer"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Remove Password"}
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="bg-transparent h-10 px-6 text-white border-neutral-700 hover:bg-[#2a2a2a] cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading} className="bg-white h-10 text-black hover:bg-gray-200 font-bold min-w-[120px] cursor-pointer">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Update"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}