"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@/app/components/userContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ViewIcon, 
  ViewOffSlashIcon, 
  ArrowRight01Icon, 
  ArrowLeft01Icon, 
  Loading02Icon, 
  Mail01Icon 
} from "@hugeicons/core-free-icons";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";


export default function SignupPage() {
  const router = useRouter();
  const { refreshUser } = useUser();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpValue, setOtpValue] = useState("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const handleSignupInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const signupToast = toast.loading("Sending verification code...");

    try {
      await axios.post("/api/auth/signup", {
        email: formData.email,
      });

      toast.success("OTP sent to your email!", { id: signupToast });
      setShowOtpScreen(true);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP.", { id: signupToast });

    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) return toast.error("Please enter the full 6-digit code");

    setLoading(true);
    const verifyToast = toast.loading("Creating your account...");

    try {
      const res = await axios.post("/api/auth/signup/verify-otp", {
        email: formData.email,
        otp: otpValue,
        userName: formData.userName,
        password: formData.password,
      });

      if (res.data.success) {
        await refreshUser();
        toast.success("Account created successfully!", { id: verifyToast });
        router.push("/");
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP code", { id: verifyToast });

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-background text-foreground selection:bg-[#F07D51]">
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
            style: { 
                background: 'hsl(var(--popover))', 
                color: 'hsl(var(--popover-foreground))', 
                border: '1px solid hsl(var(--border))' 
            } 
        }} 
      />

      <div className="w-full lg:w-1/2 bg-background p-8 lg:p-20 flex flex-col relative overflow-hidden min-h-[40vh] lg:min-h-screen border-r border-border/50">
        <div className="relative z-20 flex items-center gap-3 cursor-pointer w-fit group mb-auto" onClick={() => router.push("/")}>
          <img src="/favicon.ico" alt="Logo" className="w-10 h-10 transition-transform group-hover:scale-110" />
          <span className="text-2xl font-bold tracking-tight">Fasturl</span>
        </div>
        <div className="relative z-10 flex-grow flex flex-col justify-center lg:-mt-32">
          <h1 className="text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-10">
            {showOtpScreen ? "Check your " : "Shorten links, "} <br /> 
            <span className="text-[#83c5be]">{showOtpScreen ? "Inbox." : "expand reach."}</span>
          </h1>
          <p className="text-muted-foreground text-xl lg:text-2xl leading-relaxed max-w-md">
            {showOtpScreen 
              ? `We've sent a 6-digit verification code to ${formData.email}`
              : "Join Fasturl to create clean, professional, and trackable links in seconds."}
          </p>
        </div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#F07D51]/10 rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col justify-center bg-background min-h-screen relative">
        
        <div className="absolute top-8 left-8 lg:top-12 lg:left-20">
            <button 
                onClick={() => showOtpScreen ? setShowOtpScreen(false) : router.push("/")} 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium group cursor-pointer"
            >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                {showOtpScreen ? "Back to Signup" : "Back to Home"}
            </button>
        </div>

        <AnimatePresence mode="wait">
          {!showOtpScreen ? (
            <motion.div 
              key="signup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-[440px] mx-auto w-full"
            >
              <div className="mb-12">
                <h2 className="text-4xl font-extrabold mb-3">Get Started</h2>
                <p className="text-muted-foreground text-lg">
                  Already have an account? <button onClick={() => router.push("/auth/signin")} className="text-[#83c5be] font-bold cursor-pointer">Sign In</button>
                </p>
              </div>

              <form onSubmit={handleSignupInitiate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Username</label>
                  <input name="userName" type="text" placeholder="Pick a username" value={formData.userName} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl border border-border bg-secondary/50 focus:border-[#83c5be] focus:ring-4 focus:ring-[#83c5be]/10 outline-none text-foreground transition-all" required />
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                  <input name="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl border border-border bg-secondary/50 focus:border-[#83c5be] focus:ring-4 focus:ring-[#83c5be]/10 outline-none text-foreground transition-all" required />
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                  <div className="relative">
                    <input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl border border-border bg-secondary/50 focus:border-[#83c5be] focus:ring-4 focus:ring-[#83c5be]/10 outline-none text-foreground transition-all" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#83c5be] cursor-pointer">
                      {showPassword ? <HugeiconsIcon icon={ViewOffSlashIcon} size={22} /> : <HugeiconsIcon icon={ViewIcon} size={22} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-5 rounded-2xl bg-foreground text-background font-bold text-xl hover:bg-[#83c5be] hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer">
                  {loading ? <HugeiconsIcon icon={Loading02Icon} className="animate-spin" /> : <>Create Account <HugeiconsIcon icon={ArrowRight01Icon} size={22} /></>}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="otp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[440px] mx-auto w-full text-center"
            >
              <div className="mb-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-secondary text-[#83c5be] rounded-[28px] flex items-center justify-center mb-8 border border-border">
                  <HugeiconsIcon icon={Mail01Icon} size={40} />
                </div>
                <h2 className="text-4xl font-extrabold mb-4">Verify Email</h2>
                <p className="text-muted-foreground text-lg">Enter the 6-digit code we sent you.</p>
              </div>

              <div className="flex flex-col items-center gap-8">
                <InputOTP maxLength={6} value={otpValue} onChange={(val) => setOtpValue(val)}>
                  <InputOTPGroup className="gap-3">
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot 
                        key={i} 
                        index={i} 
                        className="w-14 h-16 rounded-2xl border-border bg-secondary/50 text-3xl font-bold focus:border-[#83c5be] focus:ring-4 focus:ring-[#83c5be]/10 text-foreground" 
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                <button 
                  onClick={handleVerifyOtp}
                  disabled={loading || otpValue.length !== 6}
                  className="w-full py-5 bg-[#83c5be] text-black font-bold text-xl rounded-2xl hover:bg-[#2a9d8f] transition-all disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
                >
                  {loading ? <HugeiconsIcon icon={Loading02Icon} className="animate-spin" /> : "Verify & Complete"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}