"use client";

import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] bg-neutral-800 border border-neutral-700 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <span className="text-green-400">✓</span>
      <span>{message}</span>
      <button onClick={onClose} className="text-neutral-400 hover:text-white ml-2">
        <X size={14} />
      </button>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-neutral-700 rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

function OtpInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[i]) {
        const next = [...value];
        next[i] = "";
        onChange(next);
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
      }
    }
  };

  const handleChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
      onChange(next);
      refs.current[Math.min(pasted.length, 5)]?.focus();
      e.preventDefault();
    }
  };

  return (
    <div className="flex gap-3 justify-center my-6">
      {value.map((v, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className="w-11 h-12 text-center text-lg font-bold bg-[#111] border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors caret-transparent"
        />
      ))}
    </div>
  );
}

export default function AuthenticationPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [forgotEmail, setForgotEmail] = useState(""); // populated from user session
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpLoading, setOtpLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetNew, setResetNew] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [showResetNew, setShowResetNew] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [otpError, setOtpError] = useState("");

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setToast("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast("Passwords do not match");
      return;
    }

    setLoadingPassword(true);

    try {
      await axios.post("/api/auth/update/resetPassword", {
        currentPassword,
        newPassword,
      });

      setToast("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err: any) {
      setToast(
        err?.response?.data?.message || "Failed to update password"
      );
    } finally {
      setLoadingPassword(false);
    }
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

  const handleForgotPassword = async () => {
    setSendingOtp(true);
    try {
      const res = await axios.post("/api/auth/OTP/sendOTP");
      const email = res.data?.email || forgotEmail || "your email";
      setForgotEmail(email);
      setOtp(Array(6).fill(""));
      setOtpError("");
      setOtpModalOpen(true);

    } catch (err) {
      console.error("Send OTP failed", err);

    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) return;
    setOtpLoading(true);
    setOtpError("");
    try {
      await axios.post("/api/auth/OTP/verifyOTP", { otp: code });
      setOtpModalOpen(false);
      setResetNew("");
      setResetConfirm("");
      setResetModalOpen(true);
    } catch (err: any) {
      setOtpError(err?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetNew || resetNew !== resetConfirm) return;
    setResetLoading(true);
    try {
      await axios.post("/api/auth/update/otpPassword", { password: resetNew });
      setResetLoading(false);
      setResetModalOpen(false);
      setToast("Password updated successfully.");
    } catch (err) {
      console.error("Reset password failed", err);
      setResetLoading(false);
    }
  };

  const closeAll = () => {
    setOtpModalOpen(false);
    setResetModalOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-300">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {otpModalOpen && (
        <Modal onClose={closeAll}>
          <h3 className="text-lg font-bold text-neutral-100 mb-1">Enter OTP</h3>
          <p className="text-neutral-400 text-sm">
            OTP has been sent to{" "}
            <span className="text-white font-semibold">{forgotEmail}</span>
          </p>

          <OtpInput value={otp} onChange={setOtp} />

          {otpError && (
            <p className="text-red-400 text-sm text-center -mt-2 mb-4">{otpError}</p>
          )}

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 cursor-pointer"
            onClick={handleVerifyOtp}
            disabled={otp.join("").length < 6 || otpLoading}
          >
            {otpLoading ? <Loader2 className="animate-spin mx-auto" /> : "Verify OTP"}
          </Button>
        </Modal>
      )}

      {resetModalOpen && (
        <Modal onClose={() => setResetModalOpen(false)}>
          <h3 className="text-lg font-bold text-neutral-100 mb-1">Set New Password</h3>
          <p className="text-neutral-400 text-sm mb-6">Enter and confirm your new password.</p>

          {/* New Password */}
          <label className="block text-sm text-neutral-400 mb-1 font-medium">New Password</label>
          <div className="relative mb-4">
            <input
              type={showResetNew ? "text" : "password"}
              value={resetNew}
              onChange={(e) => setResetNew(e.target.value)}
              className="w-full bg-[#111] border border-neutral-700 rounded-md px-4 py-2 pr-10 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowResetNew(!showResetNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
            >
              {showResetNew ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
            </button>
          </div>

          <label className="block text-sm text-neutral-400 mb-1 font-medium">Confirm Password</label>
          <div className="relative mb-6">
            <input
              type={showResetConfirm ? "text" : "password"}
              value={resetConfirm}
              onChange={(e) => setResetConfirm(e.target.value)}
              className="w-full bg-[#111] border border-neutral-700 rounded-md px-4 py-2 pr-10 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowResetConfirm(!showResetConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
            >
              {showResetConfirm ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
            </button>
          </div>

          {resetNew && resetConfirm && resetNew !== resetConfirm && (
            <p className="text-red-400 text-sm -mt-4 mb-4">Passwords do not match.</p>
          )}

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 cursor-pointer"
            onClick={handleResetPassword}
            disabled={!resetNew || resetNew !== resetConfirm || resetLoading}
          >
            {resetLoading ? <Loader2 className="animate-spin mx-auto" /> : "Update Password"}
          </Button>
        </Modal>
      )}

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
            <div className="hidden sm:block" />
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 cursor-pointer"
                onClick={handleUpdatePassword}
                disabled={loadingPassword}
              >
                {loadingPassword ? <Loader2 className="animate-spin" /> : "Update Password"}
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white font-bold px-6 py-2.5 cursor-pointer"
                onClick={handleForgotPassword}
                disabled={sendingOtp}
              >
                {sendingOtp ? <Loader2 className="animate-spin" size={16} /> : "Forgot Password"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-neutral-800 my-10 max-w-2xl" />

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