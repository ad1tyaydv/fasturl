"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Loader2 } from "lucide-react"; // Import spinner
import { Button } from "@/components/ui/button"; // Adjust path based on your setup
import Navbar from "../../components/navbar";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const [loadingName, setLoadingName] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setIsLoggedIn(!!res.data.authenticated);
        setUserName(res.data.userName);
        setEmail(res.data.email);

      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();

  }, [router]);


  const handleLogout = async () => {
    await axios.post("/api/auth/logout");

    setIsLoggedIn(false);
    router.push("/auth/signin");
  };


  const handleUpdateUserName = async () => {
    setLoadingName(true);

    try {
      await axios.post("/api/auth/update/userName", {
        email: email,
        userName: userName,
      });

      router.refresh();

    } catch (error) {
      console.log("Error while updating User Name", error);

    } finally {
      setLoadingName(false);
    }
  };


  const handleUpdateEmail = async () => {
    setLoadingEmail(true);
    try {
      await axios.post("/api/auth/update/email", { email: email });
      router.refresh();

    } catch (error) {
      console.log("Error while updating Email", error);

    } finally {
      setLoadingEmail(false);
    }
  };


  const handleUpdatePassword = async () => {
    setLoadingPassword(true);
    setTimeout(() => setLoadingPassword(false), 1500); 
  };


  const handleDeleteAccount = async () => {
    if (deleteConfirmation === "delete my account") {
      setLoadingDelete(true);

      try {
        await axios.post("api/auth/deleteAccount");
        await handleLogout();
        router.push("/");

      } catch (error) {
        console.error("Error deleting account", error);

      } finally {
        setLoadingDelete(false);
      }
    }
  };

  
  return (
    <div className="min-h-screen bg-[#141414] text-white transition-colors duration-300">
      <Navbar />

      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-8">
        <div className="mb-10">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Update Information
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex items-center gap-6 md:ml-[160px]">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl select-none font-bold"
                style={{ backgroundColor: "#2e7d32" }}
              >
                {userName ? userName.charAt(0).toUpperCase() : "A"}
              </div>
              <span className="text-2xl font-three text-white">{userName}</span>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-neutral-200 mb-6">
              Contact Information
            </h2>

            <div className="grid grid-cols-[120px_1fr_auto] sm:grid-cols-[160px_1fr_auto] gap-4 items-center mb-4 max-w-2xl">
              <label className="text-right text-neutral-400 font-medium pr-4">
                Name
              </label>
              <input
                type="text"
                value={userName}
                placeholder="Enter your UserName"
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 text-white transition-colors"
              />
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 font-bold px-6"
                onClick={handleUpdateUserName}
                disabled={loadingName}
              >
                {loadingName ? <Loader2 className="animate-spin" /> : "Update"}
              </Button>
            </div>

            <div className="grid grid-cols-[120px_1fr_auto] sm:grid-cols-[160px_1fr_auto] gap-4 items-center mb-6 max-w-2xl">
              <label className="text-right text-neutral-400 font-medium pr-4">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 text-white transition-colors"
              />
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 font-bold px-6"
                onClick={handleUpdateEmail}
                disabled={loadingEmail}
              >
                {loadingEmail ? <Loader2 className="animate-spin" /> : "Update"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Update Password
            </h1>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4 items-center mb-4 max-w-2xl">
              <label className="text-right text-neutral-400 font-medium pr-4">
                Current Password
              </label>
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
                  {showCurrent ? (
                    <IoEyeOffOutline size={18} />
                  ) : (
                    <IoEyeOutline size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4 items-center mb-4 max-w-2xl">
              <label className="text-right text-neutral-400 font-medium pr-4">
                New Password
              </label>
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
                  {showNew ? (
                    <IoEyeOffOutline size={18} />
                  ) : (
                    <IoEyeOutline size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4 items-center mb-6 max-w-2xl">
              <label className="text-right text-neutral-400 font-medium pr-4">
                Confirm Password
              </label>
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
                  {showConfirm ? (
                    <IoEyeOffOutline size={18} />
                  ) : (
                    <IoEyeOutline size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4 max-w-2xl">
              <div></div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 w-fit"
                onClick={handleUpdatePassword}
                disabled={loadingPassword}
              >
                {loadingPassword ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-neutral-800 my-12"></div>

        <div className="mt-8 pt-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Danger Zone</h2>
          <p className="text-neutral-400 mb-6 max-w-2xl">
            Once you delete your account, there is no going back. All of your
            links, QR codes, and analytics will be permanently removed.
          </p>

          {!isDeleting ? (
            <Button
              variant="outline"
              onClick={() => setIsDeleting(true)}
              className="text-red-500 border-red-500/50 hover:bg-red-500/10 hover:text-red-500 bg-transparent font-bold"
            >
              Delete Account
            </Button>
          ) : (
            <div className="bg-[#1c1c1c] p-6 rounded-lg border border-red-900/50 max-w-2xl animate-in fade-in slide-in-from-top-2">
              <p className="text-neutral-300 mb-3">
                To verify, type{" "}
                <span className="font-bold text-red-500">
                  delete my account
                </span>{" "}
                below:
              </p>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full bg-[#141414] border border-neutral-700 rounded-md px-4 py-2 mb-4 focus:outline-none focus:border-red-500 text-white transition-colors placeholder:text-neutral-600"
                placeholder="delete my account"
              />
              <div className="flex gap-4">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={
                    deleteConfirmation !== "delete my account" || loadingDelete
                  }
                  className="font-bold px-6"
                >
                  {loadingDelete ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Confirm Delete"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleting(false);
                    setDeleteConfirmation("");
                  }}
                  className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800 font-bold"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}