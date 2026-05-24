"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  ViewOffSlashIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Loading02Icon,
  FingerPrintIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";


export default function ResetPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);


  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter your email");
    }

    setLoading(true);
    const otpToast = toast.loading("Sending OTP...");

    try {
      await axios.post("/api/auth/signin/sendOtp", { email });
      toast.success("OTP sent to your email", { id: otpToast });
      setStep(2);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP", {
        id: otpToast,
      });

    } finally {
      setLoading(false);
    }
  };


  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      return toast.error("Please enter all 6 digits of OTP");
    }
    if (!newPassword || !confirmPassword) {
      return toast.error("Please fill in all password fields");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    const resetToast = toast.loading("Updating password...");

    try {
      await axios.post("/api/auth/signin/resetPassword", {
        email,
        otp: otpCode,
        newPassword,
      });
      toast.success("Password updated successfully!", { id: resetToast });
      setTimeout(() => router.push("/auth/signin"), 2000);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password", {
        id: resetToast,
      });

    } finally {
      setLoading(false);
    }
  };


  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };


  const handleOtpBackspace = (index: number) => {
    if (!otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();

    } else {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };


  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    const numbersOnly = pastedData.replace(/\D/g, "");
    
    if (!numbersOnly) return;

    const newOtp = [...otp];
    const length = Math.min(numbersOnly.length, 6);

    for (let i = 0; i < length; i++) {
      newOtp[i] = numbersOnly[i];
    }

    setOtp(newOtp);

    const focusIndex = length < 6 ? length : 5;
    otpRefs.current[focusIndex]?.focus();
  };
  

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-background text-foreground selection:bg-[#F07D51] selection:text-white">
      <Toaster position="bottom-right" />

      <div className="hidden lg:flex w-full lg:w-1/2 bg-background p-8 lg:p-20 flex-col relative overflow-hidden lg:min-h-screen border-r border-border/50">
        <div
          className="relative z-20 flex items-center gap-3 cursor-pointer w-fit group mb-auto lg:pt-4"
          onClick={() => router.push("/")}
        >
          <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
            <img
              src="/favicon.ico"
              alt="Fasturl Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight">
            Fasturl
          </span>
        </div>

        <div className="relative z-10 flex-grow flex flex-col justify-center lg:-mt-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h1 className="text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.05] mb-10">
              Reset your <br />
              <span className="text-[#83c5be]">password.</span>
            </h1>
            <p className="text-muted-foreground text-xl lg:text-2xl leading-relaxed max-w-md">
              Don't worry, it happens. Follow the steps to regain access to your
              account.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#F07D51]/10 rounded-full blur-[120px] opacity-30 pointer-events-none" />
      </div>

      <div className="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col justify-center bg-background min-h-screen relative">
        <button
          onClick={() => (step === 1 ? router.push("/auth/signin") : setStep(1))}
          className="absolute top-10 left-10 lg:top-20 lg:left-20 flex items-center gap-2 text-muted-foreground hover:text-[#83c5be] transition-all cursor-pointer group z-20"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-bold uppercase tracking-widest">
            {step === 1 ? "Back to Sign In" : "Go Back"}
          </span>
        </button>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-[440px] mx-auto"
        >
          {step === 1 ? (
            <>
              <div className="mb-12">
                <h2 className="text-4xl font-extrabold text-foreground mb-3">
                  Forgot Password
                </h2>
                <p className="text-muted-foreground font-medium text-lg">
                  Enter your email address to receive a 6-digit verification
                  code.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl border border-border bg-secondary/50 focus:bg-secondary focus:border-[#83c5be] focus:ring-4 focus:ring-[#83c5be]/10 outline-none transition-all placeholder:text-muted-foreground/50 text-lg text-foreground"
                      required
                    />
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-6 h-6"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl bg-foreground text-background font-bold text-xl transition-all hover:bg-[#83c5be] hover:shadow-[0_0_30px_rgba(131,197,190,0.3)] hover:text-white active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4 cursor-pointer"
                >
                  {loading ? (
                    <HugeiconsIcon
                      icon={Loading02Icon}
                      className="w-7 h-7 animate-spin"
                    />
                  ) : (
                    <>
                      Send OTP
                      <HugeiconsIcon icon={ArrowRight01Icon} size={24} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col">
              <div className="mb-10 text-center">
                <div className="w-20 h-20 bg-secondary text-[#83c5be] rounded-[28px] mx-auto flex items-center justify-center mb-8 border border-border shadow-xl shadow-[#83c5be]/10">
                  <HugeiconsIcon icon={FingerPrintIcon} size={40} />
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
                  Verification
                </h2>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                  We've sent a 6-digit code to{" "}
                  <span className="text-foreground font-bold">{email}</span>
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-8">
                <div className="flex gap-2 sm:gap-3 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Backspace" && handleOtpBackspace(index)
                      }
                      onPaste={handlePaste} /* Added onPaste handler here */
                      className="w-12 h-16 sm:w-14 sm:h-18 rounded-2xl bg-secondary/50 border border-border focus:border-[#83c5be] focus:bg-secondary focus:ring-4 focus:ring-[#83c5be]/10 outline-none text-foreground font-bold text-3xl text-center transition-all"
                      placeholder="-"
                    />
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl border border-border bg-secondary/50 focus:bg-secondary focus:border-[#83c5be] focus:ring-4 focus:ring-[#83c5be]/10 outline-none transition-all placeholder:text-muted-foreground/50 text-lg text-foreground"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#83c5be] cursor-pointer transition-colors"
                      >
                        {showPassword ? (
                          <HugeiconsIcon icon={ViewOffSlashIcon} size={22} />
                        ) : (
                          <HugeiconsIcon icon={ViewIcon} size={22} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl border border-border bg-secondary/50 focus:bg-secondary focus:border-[#83c5be] focus:ring-4 focus:ring-[#83c5be]/10 outline-none transition-all placeholder:text-muted-foreground/50 text-lg text-foreground"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#83c5be] cursor-pointer transition-colors"
                      >
                        {showConfirmPassword ? (
                          <HugeiconsIcon icon={ViewOffSlashIcon} size={22} />
                        ) : (
                          <HugeiconsIcon icon={ViewIcon} size={22} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl bg-[#83c5be] text-white font-bold text-xl transition-all hover:bg-[#2a9d8f] hover:shadow-[0_0_30px_rgba(131,197,190,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4 cursor-pointer"
                >
                  {loading ? (
                    <HugeiconsIcon
                      icon={Loading02Icon}
                      className="w-7 h-7 animate-spin"
                    />
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}