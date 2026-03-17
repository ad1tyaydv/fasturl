"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import DashboardLayout from "../../components/dashBoardComponent";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [name, setName] = useState("Adi");
  const [email, setEmail] = useState("codead0001@gmail.com");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setIsLoggedIn(!!res.data.authenticated);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();

  }, [router]);


  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    router.push("/auth/signin");
  };


  const handleDeleteAccount = async () => {
    if (deleteConfirmation === "delete my account") {
      try {
        console.log("Account deleted successfully");
        await handleLogout();
      } catch (error) {
        console.error("Error deleting account", error);
      }
    }
  };

  
  return (
    <DashboardLayout isLoggedIn={isLoggedIn} handleLogout={handleLogout}>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-8">
        <div className="mb-10">
          <div className="mb-8">
            <h4 className="text-muted-foreground text-sm font-semibold tracking-wide mb-1">
              Profile Management
            </h4>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2d3748]">
              Update Information
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex items-center gap-6 md:ml-[160px]">
              <div className="w-16 h-16 rounded-full bg-[#277da1] flex items-center justify-center text-white text-3xl select-none" style={{ backgroundColor: '#2e7d32' }}>
                A
              </div>
              <button className="bg-[#2e7d32] hover:bg-[#2e7d32]/90 text-white px-6 py-2.5 rounded font-medium transition-colors shadow-sm">
                Select a Photo
              </button>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-[#2d3748] mb-6">
              Contact Information
            </h2>
            
            <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-4 items-center mb-4 max-w-2xl">
              <label className="text-right text-[#2d3748] font-medium pr-4">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-4 items-center mb-6 max-w-2xl">
              <label className="text-right text-[#2d3748] font-medium pr-4">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-4 max-w-2xl">
              <div></div>
              <button className="bg-[#0288d1] hover:bg-[#0288d1]/90 text-white px-8 py-2.5 rounded shadow-sm transition-colors w-fit">
                Update
              </button>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="mb-8">
            <h4 className="text-muted-foreground text-sm font-semibold tracking-wide mb-1">
              Security
            </h4>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2d3748]">
              Update Password
            </h1>
          </div>

          <div className="mt-8">

            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4 items-center mb-4 max-w-2xl">
              <label className="text-right text-[#2d3748] font-medium pr-4">Current Password</label>
              <div className="relative">
                <input 
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black"
                >
                  {showCurrent ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4 items-center mb-4 max-w-2xl">
              <label className="text-right text-[#2d3748] font-medium pr-4">Password</label>
              <div className="relative">
                <input 
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button 
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black"
                >
                  {showNew ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4 items-center mb-6 max-w-2xl">
              <label className="text-right text-[#2d3748] font-medium pr-4">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black"
                >
                  {showConfirm ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4 max-w-2xl">
              <div></div>
              <button className="bg-[#0288d1] hover:bg-[#0288d1]/90 text-white px-8 py-2.5 rounded shadow-sm transition-colors w-fit">
                Update
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-[#c62828] mb-4">Danger Zone</h2>
          <p className="text-gray-600 mb-6 max-w-2xl">
            Once you delete your account, there is no going back. All of your links, QR codes, and analytics will be permanently removed.
          </p>

          {!isDeleting ? (
            <button 
              onClick={() => setIsDeleting(true)}
              className="text-[#c62828] border border-[#c62828] hover:bg-red-50 px-6 py-2.5 rounded font-medium transition-colors shadow-sm bg-white"
            >
              Delete Account
            </button>
          ) : (
            <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-2xl animate-in fade-in slide-in-from-top-2">
              <p className="text-[#2d3748] mb-3">
                To verify, type <span className="font-bold text-[#c62828]">delete my account</span> below:
              </p>
              <input 
                type="text" 
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="delete my account"
              />
              <div className="flex gap-4">
                <button 
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== "delete my account"}
                  className="bg-[#c62828] hover:bg-[#c62828]/90 text-white px-6 py-2.5 rounded font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Delete
                </button>
                <button 
                  onClick={() => {
                    setIsDeleting(false);
                    setDeleteConfirmation("");
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded font-medium transition-colors shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}