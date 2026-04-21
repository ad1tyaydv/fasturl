"use client";

import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Loader2, X, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Sub-components ---

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] bg-neutral-900 border border-neutral-800 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <span className="text-green-500 font-bold">✓</span>
      <span className="font-one text-sm">{message}</span>
      <button onClick={onClose} className="text-neutral-500 hover:text-white ml-2 cursor-pointer">
        <X size={14} />
      </button>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
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
    <div className="flex gap-2 sm:gap-3 justify-center my-8">
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
          className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-[#111] border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-[#1D9BF0] transition-all caret-transparent"
        />
      ))}
    </div>
  );
}

// --- Main Component ---

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

  const [forgotEmail, setForgotEmail] = useState("");
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
      await axios.post("/api/auth/update/resetPassword", { currentPassword, newPassword });
      setToast("Password updated successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      setToast(err?.response?.data?.message || "Failed to update password");
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
      const email = res.data?.email || "your email";
      setForgotEmail(email);
      setOtp(Array(6).fill(""));
      setOtpError("");
      setOtpModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) return;
    setOtpLoading(true);
    try {
      await axios.post("/api/auth/OTP/verifyOTP", { otp: code });
      setOtpModalOpen(false);
      setResetModalOpen(true);
    } catch (err: any) {
      setOtpError(err?.response?.data?.message || "Invalid OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetNew || resetNew !== resetConfirm) return;
    setResetLoading(true);
    try {
      await axios.post("/api/auth/update/otpPassword", { password: resetNew });
      setResetModalOpen(false);
      setToast("Password updated successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 font-one">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* OTP Modal */}
      {otpModalOpen && (
        <Modal onClose={() => setOtpModalOpen(false)}>
          <h3 className="text-xl font-bold text-neutral-100 mb-1">Verify OTP</h3>
          <p className="text-neutral-400 text-sm mb-4">Sent to <span className="text-white font-semibold">{forgotEmail}</span></p>
          <OtpInput value={otp} onChange={setOtp} />
          {otpError && <p className="text-red-500 text-sm text-center -mt-4 mb-4">{otpError}</p>}
          <Button
            className="w-full bg-[#1D9BF0] hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all"
            onClick={handleVerifyOtp}
            disabled={otp.join("").length < 6 || otpLoading}
          >
            {otpLoading ? <Loader2 className="animate-spin mx-auto" /> : "Verify Code"}
          </Button>
        </Modal>
      )}

      {/* Reset Password Modal */}
      {resetModalOpen && (
        <Modal onClose={() => setResetModalOpen(false)}>
          <h3 className="text-xl font-bold text-neutral-100 mb-6">Reset Password</h3>
          <div className="space-y-4">
            {[
              { label: "New Password", val: resetNew, set: setResetNew, show: showResetNew, setShow: setShowResetNew },
              { label: "Confirm Password", val: resetConfirm, set: setResetConfirm, show: showResetConfirm, setShow: setShowResetConfirm }
            ].map((f, i) => (
              <div key={i}>
                <label className="block text-sm text-neutral-400 mb-1.5 font-medium">{f.label}</label>
                <div className="relative">
                  <input
                    type={f.show ? "text" : "password"}
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#1D9BF0]"
                  />
                  <button onClick={() => f.setShow(!f.show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    {f.show ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Button
            className="w-full mt-8 bg-white text-black hover:bg-neutral-200 font-bold py-3 rounded-xl"
            onClick={handleResetPassword}
            disabled={!resetNew || resetNew !== resetConfirm || resetLoading}
          >
            {resetLoading ? <Loader2 className="animate-spin mx-auto" /> : "Update Password"}
          </Button>
        </Modal>
      )}

      {/* Update Password Main Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-200 mb-8">Update Password</h2>
        <div className="space-y-5 max-w-2xl">
          {[
            { label: "Current Password", val: currentPassword, set: setCurrentPassword, show: showCurrent, setShow: setShowCurrent },
            { label: "New Password", val: newPassword, set: setNewPassword, show: showNew, setShow: setShowNew },
            { label: "Confirm Password", val: confirmPassword, set: setConfirmPassword, show: showConfirm, setShow: setShowConfirm }
          ].map((field, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-center">
              <label className="sm:text-right text-neutral-400 font-medium text-sm sm:text-base">{field.label}</label>
              <div className="relative">
                <input
                  type={field.show ? "text" : "password"}
                  value={field.val}
                  onChange={(e) => field.set(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-[#1D9BF0] text-white transition-all"
                />
                <button
                  type="button" onClick={() => field.setShow(!field.show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                >
                  {field.show ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                </button>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4">
            <div className="hidden sm:block" />
            <div className="flex flex-row gap-2 sm:gap-3 w-full">
              <Button
                className="flex-1 sm:flex-none bg-white text-black hover:bg-neutral-200 font-bold px-4 sm:px-10 py-2.5 cursor-pointer text-xs sm:text-sm"
                onClick={handleUpdatePassword}
                disabled={loadingPassword}
              >
                {loadingPassword ? <Loader2 className="animate-spin h-4 w-4 mx-auto text-black" /> : "Update Password"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none bg-transparent border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white font-bold px-4 sm:px-8 py-2.5 cursor-pointer text-xs sm:text-sm"
                onClick={handleForgotPassword}
                disabled={sendingOtp}
              >
                {sendingOtp ? <Loader2 className="animate-spin h-4 w-4 mx-auto" /> : "Forgot Password"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-neutral-800/50 my-12 max-w-2xl" />

      {/* Danger Zone Section */}
      <div className="pt-2">
        <h2 className="text-2xl font-bold text-neutral-200 mb-4">Danger Zone</h2>
        <p className="text-neutral-400 mb-8 max-w-2xl text-sm leading-relaxed">
          Deleting your account is permanent. All links and analytical data will be <span className="text-red-500 font-medium">removed forever.</span>
        </p>

        {!isDeleting ? (
          <Button
            variant="outline"
            onClick={() => setIsDeleting(true)}
            className="flex items-center gap-2 border-neutral-800 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 font-bold px-6 py-2.5 rounded-lg transition-all cursor-pointer"
          >
            <Trash2 size={16} />
            Delete Account
          </Button>
        ) : (
          <div className="bg-[#1c1c1c] p-6 rounded-xl border border-neutral-800 max-w-2xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3 mb-6">
              <AlertTriangle className="text-neutral-500 shrink-0 mt-0.5" size={18} />
              <p className="text-neutral-300 text-sm">
                To confirm, type <span className="font-bold text-white">delete my account</span> below.
              </p>
            </div>
            
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-4 py-2.5 mb-6 focus:outline-none focus:border-neutral-500 text-white transition-all placeholder:text-neutral-700 text-sm"
              placeholder="delete my account"
            />
            
            <div className="flex flex-row items-center gap-3 w-full">
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== "delete my account" || loadingDelete}
                className="flex-1 sm:flex-none font-bold px-8 py-2.5 cursor-pointer"
              >
                {loadingDelete ? <Loader2 className="animate-spin mx-auto" /> : "Confirm Delete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => { setIsDeleting(false); setDeleteConfirmation(""); }}
                className="flex-1 sm:flex-none bg-transparent border-neutral-700 text-neutral-400 hover:bg-neutral-800 font-bold cursor-pointer px-6"
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