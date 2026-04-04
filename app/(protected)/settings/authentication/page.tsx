"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Loader2 } from "lucide-react"; 
import { Button } from "@/components/ui/button"; 

export default function AuthenticationPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleUpdatePassword = async () => {
    setLoadingPassword(true);
    setTimeout(() => setLoadingPassword(false), 1500); 
  };

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    router.push("/auth/signin");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation === "delete my account") {
      setLoadingDelete(true);
      try {
        await axios.post("/api/auth/deleteAccount");
        await handleLogout();
      } catch (error) {
        console.error("Error deleting account", error);
      } finally {
        setLoadingDelete(false);
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-200 mb-6">Update Password</h2>

        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 items-center mb-4 max-w-2xl">
            <label className="sm:text-right text-neutral-400 font-medium pr-4">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-md px-4 py-2 pr-10 focus:outline-none focus:border-blue-500 text-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer transition-colors"
              >
                {showCurrent ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 items-center mb-4 max-w-2xl">
            <label className="sm:text-right text-neutral-400 font-medium pr-4">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-md px-4 py-2 pr-10 focus:outline-none focus:border-blue-500 text-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer transition-colors"
              >
                {showNew ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 items-center mb-6 max-w-2xl">
            <label className="sm:text-right text-neutral-400 font-medium pr-4">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-md px-4 py-2 pr-10 focus:outline-none focus:border-blue-500 text-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer transition-colors"
              >
                {showConfirm ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 max-w-2xl">
            <div className="hidden sm:block"></div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 w-full sm:w-fit cursor-pointer"
              onClick={handleUpdatePassword}
              disabled={loadingPassword}
            >
              {loadingPassword ? <Loader2 className="animate-spin" /> : "Update Password"}
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-neutral-800 my-10 max-w-2xl"></div>

      <div className="pt-2">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Danger Zone</h2>
        <p className="text-neutral-400 mb-6 max-w-2xl">
          Once you delete your account, there is no going back. All of your links, QR codes, and analytics will be permanently removed.
        </p>

        {!isDeleting ? (
          <Button
            variant="outline"
            onClick={() => setIsDeleting(true)}
            className="text-red-500 border-red-500/50 hover:bg-red-500/10 hover:text-red-500 bg-transparent font-bold cursor-pointer"
          >
            Delete Account
          </Button>
        ) : (
          <div className="bg-[#1c1c1c] p-6 rounded-lg border border-red-900/50 max-w-2xl animate-in fade-in slide-in-from-top-2">
            <p className="text-neutral-300 mb-3">
              To verify, type <span className="font-bold text-red-500">delete my account</span> below:
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full bg-[#141414] border border-neutral-700 rounded-md px-4 py-2 mb-4 focus:outline-none focus:border-red-500 text-white transition-colors placeholder:text-neutral-600"
              placeholder="delete my account"
            />
            <div className="flex flex-wrap gap-4">
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== "delete my account" || loadingDelete}
                className="font-bold px-6 cursor-pointer"
              >
                {loadingDelete ? <Loader2 className="animate-spin" /> : "Confirm Delete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleting(false);
                  setDeleteConfirmation("");
                }}
                className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800 font-bold cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}