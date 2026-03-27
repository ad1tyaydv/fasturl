"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { 
  IoPencilOutline, IoEyeOutline, 
  IoEyeOffOutline, IoCalendarOutline 
} from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUrl: any;
  onSuccess: () => void;
}


export default function PasswordProtectionModal({ isOpen, onClose, selectedUrl, onSuccess }: PasswordModalProps) {
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


  const handleAddPassword = async () => {
    setIsLoading(true);
    try {
      const finalPassword = isEditingPassword ? password : selectedUrl?.password;
      const finalExpiry = isEditingExpiry ? expiryDate : selectedUrl?.expiresAt;
      
      await axios.post("/api/shortUrl/passwordProtection", {
        shortUrlId: selectedUrl?.id,
        password: finalPassword,
        expiryDate: finalExpiry,
      });
      
      if (selectedUrl.password) {
        toast.success("Password updated successfully!");
      } else {
        toast.success("Password added successfully!");
      }
      
      onSuccess();
      onClose();

    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update link protection.");

    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 transition-opacity duration-150"
      onClick={() => !isLoading && onClose()}
    >
      <div 
        className="bg-[#1c1c1c] shadow-2xl w-full max-w-lg p-6 sm:p-10 cursor-default border border-neutral-800 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl sm:text-2xl font-three mb-8 text-center text-white">
          Add Link Protection
        </h3>

        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xl font-one text-white">
                Password <span className="text-sm text-neutral-500 font-three font-normal">(Optional)</span>
              </label>
              {!isEditingPassword && selectedUrl.password && (
                <button 
                  onClick={() => { setIsEditingPassword(true); setPassword(""); }} 
                  className="text-blue-500 hover:text-blue-400 cursor-pointer transition-colors" 
                  title="Edit Password"
                  disabled={isLoading}
                >
                  <IoPencilOutline size={18} />
                </button>
              )}
            </div>
            
            {!isEditingPassword && selectedUrl.password ? (
              <div className="w-full p-3 border border-dashed border-neutral-700 bg-[#1a1a1a] text-neutral-400 font-three italic rounded-lg">
                Password is already configured
              </div>
            ) : (
              <div className="relative flex items-center border border-neutral-700 bg-[#111111] focus-within:border-blue-500 transition-colors rounded-lg overflow-hidden">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  disabled={isLoading}
                  className="w-full p-3 bg-transparent text-white font-three focus:outline-none disabled:opacity-50" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  disabled={isLoading}
                  className="px-4 text-neutral-500 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xl font-one text-white">Set Expiry Date</label>
              {!isEditingExpiry && selectedUrl.expiresAt && (
                <button 
                  onClick={() => { setIsEditingExpiry(true); setExpiryDate(""); }} 
                  className="text-blue-500 hover:text-blue-400 cursor-pointer transition-colors" 
                  title="Edit Expiry"
                  disabled={isLoading}
                >
                  <IoPencilOutline size={18} />
                </button>
              )}
            </div>

            {!isEditingExpiry && selectedUrl.expiresAt ? (
              <div className="w-full p-3 border border-dashed border-neutral-700 bg-[#1a1a1a] text-neutral-400 font-three rounded-lg">
                Expires on {new Date(selectedUrl.expiresAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="relative group">
                <input 
                  type="date" 
                  value={expiryDate} 
                  onChange={(e) => setExpiryDate(e.target.value)} 
                  disabled={isLoading}
                  className="w-full p-3 border border-neutral-700 bg-[#111111] text-white font-three focus:outline-none focus:border-blue-500 transition-colors rounded-lg cursor-pointer [color-scheme:dark] pr-12 appearance-none disabled:opacity-50" 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                  <IoCalendarOutline size={20} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
            className="font-three text-sm bg-transparent h-10 w-22 text-white border-neutral-700 hover:bg-[#2a2a2a] hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddPassword}
            disabled={isLoading}
            className="font-three text-sm bg-white h-9 text-black hover:bg-gray-200 transition-colors font-bold min-w-[100px] cursor-pointer"
          >
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
}