"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link04Icon } from "@hugeicons/core-free-icons";

interface RedirectToModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUrl: any;
  onSuccess: () => void;
}

export default function RedirectToModal({ isOpen, onClose, selectedUrl, onSuccess }: RedirectToModalProps) {
  const [destinationUrl, setDestinationUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (isOpen && selectedUrl) {
      // Pre-fill with existing redirect URL if it exists
      setDestinationUrl(selectedUrl.redirectTo || "");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, selectedUrl]);

  if (!isOpen || !selectedUrl) return null;

  // Check if a redirect already exists for this link
  const hasExistingRedirect = !!selectedUrl.redirectTo;

  const handleUpdate = async () => {
    if (!destinationUrl.trim()) {
      return toast.error("Please enter a destination URL");
    }

    setIsUpdating(true);
    try {
      await axios.post("/api/shortUrl/redirectTo", {
        linkId: selectedUrl?.id,
        redirectTo: destinationUrl.trim(),
      });

      toast.success("Redirect updated successfully!", {
        style: { background: '#1c1c1c', color: '#fff', border: '1px solid #333' },
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to update redirect.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveRedirect = async () => {
    setIsRemoving(true);
    try {
      await axios.post(`/api/shortUrl/redirectTo/removeRedirectTo/${selectedUrl?.id}`);

      toast.success("Redirect removed!", {
        style: { background: '#1c1c1c', color: '#fff', border: '1px solid #333' },
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to remove redirect.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 transition-opacity"
      onClick={() => !(isUpdating || isRemoving) && onClose()}
    >
      <div
        className="bg-[#1c1c1c] shadow-2xl w-full max-w-lg p-6 sm:p-10 rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-4">
            <HugeiconsIcon icon={Link04Icon} size={32} />
          </div>
          <h3 className="text-xl sm:text-2xl font-three text-white">
            Redirect Destination
          </h3>
          <p className="text-neutral-500 font-three text-sm mt-2">
            Let the user know where this link will redirect To
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <label className="text-xl font-one text-white">Destination URL</label>
            <div className="relative flex items-center border border-neutral-700 bg-[#111111] rounded-lg overflow-hidden">
              <input
                type="url"
                placeholder="Add a destination URL"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                className="w-full p-3 bg-transparent text-white font-three focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {hasExistingRedirect && (
              <Button
                onClick={handleRemoveRedirect}
                disabled={isUpdating || isRemoving}
                className="bg-white h-10 text-black hover:text-red-700 hover:bg-gray-200 font-bold px-4 cursor-pointer"
              >
                {isRemoving ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  "Remove Redirect"
                )}
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUpdating || isRemoving}
              className="font-three text-sm bg-transparent h-10 w-22 text-white border-neutral-700 hover:bg-[#2a2a2a] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              onClick={handleUpdate}
              disabled={isUpdating || isRemoving}
              className="bg-white h-10 text-black hover:bg-gray-200 font-bold min-w-[120px] cursor-pointer"
            >
              {isUpdating ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}