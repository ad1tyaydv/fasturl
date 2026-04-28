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
    if (!customUrl) {
      return setErrorMessage("Please enter an alias");
    }

    if (customUrl.length < 5) {
      return setErrorMessage("Alias must be at least 5 characters");
    }

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
      className="fixed inset-0 z-[110] flex items-center justify-center bg-background/50 backdrop-blur-sm p-4 transition-opacity duration-150"
      onClick={() => !isLoading && onClose()}
    >
      <div
        className="bg-background shadow-2xl border border-border w-full max-w-lg p-6 sm:p-10 cursor-default rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl sm:text-2xl font-three mb-8 text-center text-foreground">
          Custom Short URL
        </h3>

        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <label className="text-xl font-one text-foreground">Current URL</label>
            <div className="w-full p-3 border border-border bg-secondary text-muted-foreground font-three rounded-lg text-sm truncate">
              {NEXT_DOMAIN}/{selectedUrl.shorturl}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xl font-one text-foreground">New Custom Alias</label>
            <div
              className={`flex items-center border ${
                errorMessage ? "border-destructive" : "border-border"
              } bg-background transition-colors rounded-lg overflow-hidden`}
            >
              <span className="pl-3 py-3 text-muted-foreground font-three bg-secondary border-r border-border px-3 text-sm">
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
                className="flex-1 p-3 bg-transparent text-foreground font-three focus:outline-none disabled:opacity-50"
              />
            </div>
            {errorMessage ? (
              <p className="text-sm text-destructive font-two mt-1">{errorMessage}</p>
            ) : (
              <p className="text-[10px] font-three text-muted-foreground uppercase tracking-widest mt-1">
                Min 5, Max 25 characters
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="font-three text-sm bg-transparent h-10 w-22 text-foreground border-border hover:bg-accent transition-colors cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isLoading}
            className="font-three text-sm bg-primary h-10 text-primary-foreground hover:bg-primary/90 transition-colors font-bold min-w-[100px] cursor-pointer"
          >
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
}