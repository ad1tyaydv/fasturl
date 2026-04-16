"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

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
    <div className={`animate-pulse bg-white/8 rounded-lg ${className}`} />
  );
}

export default function Profile() {
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
  const [pageLoading, setPageLoading] = useState(true);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setUserName(res.data.userName || "");
        setEmail(res.data.email || "");
        setUpdateUserName(res.data.userName || "");
        setUpdateEmail(res.data.email || "");
        setSelectedAvatar(res.data.image || AVATAR_LIST[0]);
        
      } catch (error) {
        toast.error("Failed to load user data");

      } finally {
        setPageLoading(false);
      }
    };
    fetchUserData();

  }, []);


  const handleUpdateUserName = async () => {
    if (!updateUserName.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    setUpdateUserNameLoader(true);

    try {
      await axios.post("/api/auth/update/userName", { userName: updateUserName });
      setUserName(updateUserName);
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
    setUpdateEmailLoader(true);

    try {
      await axios.post("/api/auth/update/email", { email: updateEmail });
      setEmail(updateEmail);
      toast.success("Email updated successfully");

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating email");

    } finally {
      setUpdateEmailLoader(false);
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


  if (pageLoading) {
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

        <div className="space-y-6 pr-96">
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

  return (
    <div className="pl-6">
      <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>

      <div className="flex items-center gap-5 mb-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10 bg-[#1e1e1e]">
            <img src={selectedAvatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>

        <div>
          <p className="font-semibold text-white text-base">{userName}</p>
          <p className="text-sm text-white/40 mb-3">{email}</p>
          <button
            onClick={openAvatarModal}
            className="px-4 py-1.5 text-xs font-medium rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            Update Emoji
          </button>
        </div>
      </div>

      <div className="space-y-6 pr-96">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-neutral-300">Name</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={updateUserName}
              onChange={(e) => setUpdateUserName(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleUpdateUserName)}
              placeholder="Enter your username"
              className="flex-1 bg-white text-black px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleUpdateUserName}
              disabled={updateUserNameLoader}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm"
            >
              {updateUserNameLoader ? <Loader2 className="w-3 h-3 animate-spin" /> : "Update"}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-neutral-300">Email Address</label>
          <div className="flex gap-3">
            <input
              type="email"
              value={updateEmail}
              onChange={(e) => setUpdateEmail(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleUpdateEmail)}
              placeholder="Enter your email"
              className="flex-1 bg-white text-black px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleUpdateEmail}
              disabled={updateEmailLoader}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm"
            >
              {updateEmailLoader ? <Loader2 className="w-3 h-3 animate-spin" /> : "Update"}
            </button>
          </div>
        </div>
      </div>

      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">Choose Emoji</h2>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {AVATAR_LIST.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setTempAvatar(url)}
                  className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    tempAvatar === url
                      ? "border-blue-500 scale-105"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <img src={url} alt={`avatar-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <button
              onClick={handleAvatarUpdate}
              disabled={updateImageLoader}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {updateImageLoader ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
