"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  IoPencilOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import toast from "react-hot-toast";

interface BulkPasswordProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBatch: any;
  onSuccess: () => void;
}

export default function BulkPasswordProtectionModal({
  isOpen,
  onClose,
  selectedBatch,
  onSuccess,
}: BulkPasswordProps) {
  const [password, setPassword] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingExpiry, setIsEditingExpiry] = useState(false);

  const [showCalendar, setShowCalendar] = useState(false);


  useEffect(() => {
    if (isOpen && selectedBatch) {
      setPassword("");
      setExpiryDate(undefined);
      setShowPassword(false);

      setIsEditingPassword(!selectedBatch.password);
      setIsEditingExpiry(!selectedBatch.expiresAt);
    }
  }, [isOpen, selectedBatch]);


  if (!isOpen || !selectedBatch) return null;


  const handleBulkUpdate = async () => {
    setIsLoading(true);
    try {
      const finalPassword = isEditingPassword
        ? password
        : selectedBatch?.password;

      const finalExpiry = isEditingExpiry
        ? expiryDate?.toISOString()
        : selectedBatch?.expiresAt;

      await axios.post("/api/shortUrl/bulkLinks/passwordProtection", {
        bulkLinkId: selectedBatch?.id,
        password: finalPassword,
        expiryDate: finalExpiry,
      });

      toast.success("Batch protection updated!", {
        style: {
          background: "#1c1c1c",
          color: "#fff",
          border: "1px solid #333",
        },
      });

      onSuccess();
      onClose();

    } catch (error) {
      toast.error("Failed to update batch protection.");

    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4"
      onClick={() => !isLoading && onClose()}
    >
      <div
        className="bg-[#1c1c1c] shadow-2xl w-full max-w-lg p-6 sm:p-10 border border-neutral-800 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl sm:text-2xl font-three mb-8 text-center text-white">
          Protect Bulk Batch
        </h3>

        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xl font-one text-white">
                Batch Password
              </label>

              {!isEditingPassword && selectedBatch.password && (
                <button
                  onClick={() => {
                    setIsEditingPassword(true);
                    setPassword("");
                  }}
                  className="text-blue-500 hover:text-blue-400 cursor-pointer transition-colors"
                >
                  <IoPencilOutline size={18} />
                </button>
              )}
            </div>

            {!isEditingPassword && selectedBatch.password ? (
              <div className="w-full p-3 border border-dashed border-neutral-700 bg-[#1a1a1a] text-neutral-400 font-three italic rounded-lg">
                Password is already configured
              </div>
            ) : (
              <div className="relative flex items-center border border-neutral-700 bg-[#111111] focus-within:border-blue-500 rounded-lg overflow-hidden transition-colors">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-transparent text-white font-three focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-4 text-neutral-500 hover:text-white cursor-pointer"
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-center">
              <label className="text-xl font-one text-white">
                Batch Expiry
              </label>

              {!isEditingExpiry && selectedBatch.expiresAt && (
                <button
                  onClick={() => {
                    setIsEditingExpiry(true);
                    setExpiryDate(undefined);
                  }}
                  className="text-blue-500 hover:text-blue-400 cursor-pointer transition-colors"
                >
                  <IoPencilOutline size={18} />
                </button>
              )}
            </div>

            {!isEditingExpiry && selectedBatch.expiresAt ? (
              <div className="w-full p-3 border border-dashed border-neutral-700 bg-[#1a1a1a] text-neutral-400 font-three rounded-lg">
                Expires on{" "}
                {new Date(selectedBatch.expiresAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full p-3 border border-neutral-700 bg-[#111111] 
                  text-white font-three rounded-lg flex justify-between items-center
                  hover:border-blue-500 transition-colors"
                >
                  {expiryDate
                    ? expiryDate.toLocaleDateString()
                    : "Pick expiry date"}

                  <IoCalendarOutline
                    size={20}
                    className="text-neutral-500"
                  />
                </button>

                {showCalendar && (
                  <div className="absolute z-50 mt-2 bg-[#1c1c1c] border border-neutral-800 rounded-xl p-3 shadow-xl">
                    <DayPicker
                      mode="single"
                      selected={expiryDate}
                      onSelect={(date) => {
                        setExpiryDate(date);
                        setShowCalendar(false);
                      }}
                      className="text-white"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="bg-transparent h-10 px-6 text-white border-neutral-700 hover:bg-[#2a2a2a] cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            onClick={handleBulkUpdate}
            disabled={isLoading}
            className="bg-white h-10 text-black hover:bg-gray-200 font-bold min-w-[120px] cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              "Apply to Batch"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}