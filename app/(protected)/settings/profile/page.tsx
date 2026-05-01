
"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { useUser } from "@/app/components/userContext";

const AVATAR_LIST = [
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Felix",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Mia",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Zoe",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Leo",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Luna",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Max",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Mia",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Luna",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Aria",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Nova",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Ruby",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Ace",
];


function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-secondary rounded-lg ${className}`} />
  );
}

export default function Profile() {
  const { user, loading: userLoading, refreshUser } = useUser();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [updateUserName, setUpdateUserName] = useState("");
  const [updateUserNameLoader, setUpdateUserNameLoader] = useState(false);
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateEmailLoader, setUpdateEmailLoader] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_LIST[0]);
  const [tempAvatar, setTempAvatar] = useState(AVATAR_LIST[0]);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [updateImageLoader, setUpdateImageLoader] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyOtpLoader, setVerifyOtpLoader] = useState(false);


  useEffect(() => {
    if (user) {
      setUserName(user.userName || "");
      setEmail(user.email || "");
      setUpdateUserName(user.userName || "");
      setUpdateEmail(user.email || "");
      setSelectedAvatar(user.image || AVATAR_LIST[0]);
    }
  }, [user]);


  const handleUpdateUserName = async () => {
    if (!updateUserName.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    setUpdateUserNameLoader(true);

    try {
      await axios.post("/api/auth/update/userName", { userName: updateUserName });
      setUserName(updateUserName);
      await refreshUser();
      toast.success("Username updated successfully");

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating username");

    } finally {
      setUpdateUserNameLoader(false);
    }
  };


  const handleUpdateImage = async (imageUrl: string) => {
    setUpdateImageLoader(true);

    try {
      await axios.post("/api/auth/update/image", {
        image: imageUrl
      });
      setSelectedAvatar(imageUrl);
      await refreshUser();
      toast.success("Avatar updated");

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating image");

    } finally {
      setUpdateImageLoader(false);
    }
  };


  const handleUpdateEmail = async () => {
    if (!updateEmail.trim()) {
      toast.error("Email cannot be empty");
      return;
    }

    if (updateEmail === email) {
      toast.error("Email is already set to this address");
      return;
    }

    setUpdateEmailLoader(true);

    try {
      await axios.post("/api/auth/update/email", { email: updateEmail });
      setShowOtpModal(true);
      toast.success("OTP sent to your new email address");

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating email");

    } finally {
      setUpdateEmailLoader(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setVerifyOtpLoader(true);

    try {
      await axios.post("/api/auth/update/email/verifyOtp", {
        email: updateEmail,
        otp: otp
      });
      setEmail(updateEmail);
      await refreshUser();
      setShowOtpModal(false);
      setOtp("");
      toast.success("Email updated successfully");

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error verifying OTP");

    } finally {
      setVerifyOtpLoader(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === "Enter") callback();
  };


  const handleAvatarUpdate = async () => {
    await handleUpdateImage(tempAvatar);
    setShowAvatarModal(false);
  };


  const openAvatarModal = () => {
    setTempAvatar(selectedAvatar);
    setShowAvatarModal(true);
  };


  if (userLoading) {
    return (
      <div className="pl-6">
        <Skeleton className="h-8 w-48 mb-8" />

        <div className="flex items-center gap-5 mb-10">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-7 w-24 mt-1" />
          </div>
        </div>

        <div className="space-y-6 pr-0 sm:pr-96">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <div className="flex gap-3">
              <Skeleton className="flex-1 h-9" />
              <Skeleton className="w-20 h-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <div className="flex gap-3">
              <Skeleton className="flex-1 h-9" />
              <Skeleton className="w-20 h-9" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pl-6 font-one">
      <h1 className="text-2xl font-bold mb-8 text-foreground">Profile Settings</h1>

      <div className="flex items-center gap-5 mb-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-border bg-secondary">
            <img src={selectedAvatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>

        <div>
          <p className="font-semibold text-foreground text-base">{userName}</p>
          <p className="text-sm text-muted-foreground mb-3">{email}</p>
          <button
            onClick={openAvatarModal}
            className="px-4 py-1.5 text-xs font-medium rounded-lg border border-border bg-secondary hover:bg-accent text-foreground transition-colors cursor-pointer"
          >
            Update Emoji
          </button>
        </div>
      </div>

      <div className="space-y-6 pr-0 sm:pr-96">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-muted-foreground">Name</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={updateUserName}
              onChange={(e) => setUpdateUserName(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleUpdateUserName)}
              placeholder="Enter your username"
              className="flex-1 bg-background text-foreground px-3 py-2 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              onClick={handleUpdateUserName}
              disabled={updateUserNameLoader}
              className="px-5 py-2 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 font-medium rounded transition-all flex items-center justify-center gap-2 whitespace-nowrap text-sm cursor-pointer"
            >
              {updateUserNameLoader ? <Loader2 className="w-3 h-3 animate-spin" /> : "Update"}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-muted-foreground">Email Address</label>
          <div className="flex gap-3">
            <input
              type="email"
              value={updateEmail}
              onChange={(e) => setUpdateEmail(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleUpdateEmail)}
              placeholder="Enter your email"
              className="flex-1 bg-background text-foreground px-3 py-2 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              onClick={handleUpdateEmail}
              disabled={updateEmailLoader}
              className="px-5 py-2 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 font-medium rounded transition-all flex items-center justify-center gap-2 whitespace-nowrap text-sm cursor-pointer"
            >
              {updateEmailLoader ? <Loader2 className="w-3 h-3 animate-spin" /> : "Update"}
            </button>
          </div>
        </div>
      </div>

      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-popover border border-border rounded-2xl p-6 w-full max-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground">Choose Emoji</h2>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {AVATAR_LIST.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setTempAvatar(url)}
                  className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    tempAvatar === url
                      ? "border-primary scale-105"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <img src={url} alt={`avatar-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <button
              onClick={handleAvatarUpdate}
              disabled={updateImageLoader}
              className="w-full py-2.5 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {updateImageLoader ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update"}
            </button>
          </div>
        </div>
      )}

      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-[2px] p-4">
          <div className="bg-popover border border-border rounded-md p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-foreground">Verify Email</h2>
              <button
                onClick={() => setShowOtpModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              An OTP has been sent to <span className="text-foreground font-medium">{updateEmail}</span>. Please enter it to verify your new email.
            </p>

            <div className="space-y-6 flex flex-col items-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerifyOtp();
                }}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg rounded-md border" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg rounded-md border" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg rounded-md border" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg rounded-md border" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg rounded-md border" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg rounded-md border" />
                </InputOTPGroup>
              </InputOTP>

              <button
                onClick={handleVerifyOtp}
                disabled={verifyOtpLoader}
                className="w-full py-2.5 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 font-semibold rounded-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {verifyOtpLoader ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify OTP"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
