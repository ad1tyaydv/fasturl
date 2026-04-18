"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CustomUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUrl: any;
  onSuccess: () => void;
}

const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function CustomUrlModal({ isOpen, onClose, selectedUrl, onSuccess }: CustomUrlModalProps) {
  const [customUrl, setCustomUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };

  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setCustomUrl("");
      setErrorMessage("");
    }
  }, [isOpen]);

  if (!isOpen || !selectedUrl) return null;


  const handleUpdate = async () => {
    if (!customUrl) return setErrorMessage("Please enter an alias");
    setErrorMessage("");
    setIsLoading(true);

    try {
      await axios.post("/api/shortUrl/customUrl", {
        shortUrl: selectedUrl?.id,
        customUrl: customUrl,
      });
      toast.success("Short URL updated successfully!");
      onSuccess();
      onClose();

    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrorMessage("This alias is already taken");

      } else {
        toast.error("Something went wrong");
      }

    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 transition-opacity duration-150"
      onClick={() => !isLoading && onClose()}
    >
      <div
        className="bg-[#1c1c1c] shadow-2xl w-full max-w-lg p-6 sm:p-10 cursor-default rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl sm:text-2xl font-three mb-8 text-center text-white">
          Custom Short URL
        </h3>

        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <label className="text-xl font-one text-white">Current URL</label>
            <div className="w-full p-3 border border-neutral-700 bg-[#1a1a1a] text-neutral-400 font-three rounded-lg text-sm truncate">
              {NEXT_DOMAIN}/{selectedUrl.shorturl}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xl font-one text-white">New Custom Alias</label>
            <div
              className={`flex items-center border ${
                errorMessage ? "border-red-500" : "border-neutral-700"
              } bg-[#111111] transition-colors rounded-lg overflow-hidden`}
            >
              <span className="pl-3 py-3 text-neutral-500 font-three bg-[#1a1a1a] border-r border-neutral-700 px-3 text-sm">
                {NEXT_DOMAIN}/
              </span>
              <input
                type="text"
                maxLength={25}
                placeholder="custom-alias"
                value={customUrl}
                onChange={(e) => {
                  setCustomUrl(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""));
                  if (errorMessage) setErrorMessage("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleUpdate();
                  }
                }}
                disabled={isLoading}
                className="flex-1 p-3 bg-transparent text-white font-three focus:outline-none disabled:opacity-50"
              />
            </div>
            {errorMessage ? (
              <p className="text-sm text-red-500 font-two mt-1">{errorMessage}</p>
            ) : (
              <p className="text-[10px] font-three text-neutral-500 uppercase tracking-widest mt-1">
                Max 25 characters
              </p>
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
            onClick={handleUpdate}
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