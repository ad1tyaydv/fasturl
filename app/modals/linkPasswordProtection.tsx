"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, PencilEdit02Icon, ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";

interface LinkPasswordProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUrl: any;
  onSuccess: () => void;
}

export default function LinkPasswordProtectionModal({ isOpen, onClose, selectedUrl, onSuccess }: LinkPasswordProps) {
  const [password, setPassword] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingExpiry, setIsEditingExpiry] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);


  useEffect(() => {
    if (isOpen && selectedUrl) {
      setPassword("");
      setExpiryDate(undefined);
      setIsEditingPassword(!selectedUrl.password);
      setIsEditingExpiry(!selectedUrl.expiresAt);
      setShowPassword(false);
    }
  }, [isOpen, selectedUrl]);

  if (!isOpen || !selectedUrl) return null;

  
  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      const finalPassword = isEditingPassword ? password : selectedUrl?.password;
      const finalExpiry = isEditingExpiry ? expiryDate?.toISOString() : selectedUrl?.expiresAt;

      await axios.post("/api/shortUrl/passwordProtection", {
        shortUrlId: selectedUrl?.id,
        password: finalPassword,
        expiryDate: finalExpiry,
      });

      toast.success(selectedUrl.password ? "Protection updated!" : "Protection added!", {
        style: {
          background: 'hsl(var(--popover))',
          color: 'hsl(var(--popover-foreground))',
          border: '1px solid hsl(var(--border))'
        },
      });

      onSuccess();
      onClose();

    } catch (error) {
      toast.error("Failed to update protection.");

    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveProtection = async () => {
    setIsRemoving(true);
    try {
      await axios.post("/api/shortUrl/passwordProtection/removePassword", {
        shortUrlId: selectedUrl?.id,
        password: "",
        expiryDate: "",
      });

      toast.success("Password removed!", {
        style: {
          background: 'hsl(var(--popover))',
          color: 'hsl(var(--popover-foreground))',
          border: '1px solid hsl(var(--border))'
        },
      });

      onSuccess();
      onClose();

    } catch (error) {
      console.log(error);
      toast.error("Failed to remove Password.");

    } finally {
      setIsRemoving(false);
    }
  };

  const hasExistingProtection = selectedUrl.password || selectedUrl.expiresAt;


  return (
  <div
    className="fixed inset-0 z-[110] flex items-center justify-center bg-background/50 backdrop-blur-sm p-4 transition-opacity"
    onClick={() => !(isUpdating || isRemoving) && onClose()}
  >
    <div
      className="bg-background shadow-2xl w-full max-w-lg p-6 sm:p-10 rounded-xl border border-border"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-xl sm:text-2xl font-three mb-8 text-center text-foreground">
        Link Protection
      </h3>

      <div className="space-y-6 mb-8">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xl font-one text-foreground">
              Password{" "}
              <span className="text-sm text-muted-foreground font-three font-normal">
                (Optional)
              </span>
            </label>

            {!isEditingPassword && selectedUrl.password && (
              <button
                onClick={() => {
                  setIsEditingPassword(true);
                  setPassword("");
                }}
                className="text-blue-500 hover:text-blue-400 cursor-pointer"
                disabled={isUpdating || isRemoving}
              >
                <HugeiconsIcon icon={PencilEdit02Icon} />
              </button>
            )}
          </div>

          {!isEditingPassword && selectedUrl.password ? (
            <div className="w-full p-3 border border-dashed border-border bg-secondary text-muted-foreground font-three italic rounded-lg">
              Password configured
            </div>
          ) : (
            <div className="relative flex items-center border border-border bg-background focus-within:ring-1 focus-within:ring-ring rounded-lg overflow-hidden transition-colors">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-transparent text-foreground font-three focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-4 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? (
                  <HugeiconsIcon icon={ViewOffSlashIcon} />
                ) : (
                  <HugeiconsIcon icon={ViewIcon} />
                )}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xl font-one text-foreground">
            Set Expiry Date
          </label>

          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              disabled={isUpdating || isRemoving}
              className="w-full p-3 border border-border bg-background text-foreground font-three rounded-lg flex justify-between items-center cursor-pointer hover:bg-accent transition-colors"
            >
              {expiryDate ? format(expiryDate, "PPP") : "Pick expiry date"}
              <HugeiconsIcon icon={Calendar03Icon} />
            </button>

            {showCalendar && (
              <div className="absolute z-50 mt-2 bg-popover border border-border rounded-lg p-3 shadow-lg">
                <DayPicker
                  className="text-popover-foreground"
                  mode="single"
                  selected={expiryDate}
                  onSelect={(date) => {
                    setExpiryDate(date);
                    setShowCalendar(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {hasExistingProtection && (
            <Button
              onClick={handleRemoveProtection}
              disabled={isUpdating || isRemoving}
              className="bg-primary h-10 text-primary-foreground hover:bg-destructive hover:text-destructive-foreground font-bold px-4 cursor-pointer"
            >
              {isRemoving ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                "Remove Password"
              )}
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating || isRemoving}
            className="font-three text-sm bg-transparent h-10 w-22 text-foreground border-border hover:bg-accent transition-colors cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            onClick={handleUpdate}
            disabled={isUpdating || isRemoving}
            className="bg-primary h-10 text-primary-foreground hover:bg-primary/90 font-bold min-w-[120px] cursor-pointer"
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