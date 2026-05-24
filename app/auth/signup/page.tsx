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
  Mail01Icon,
  ChromeIcon
} from "@hugeicons/core-free-icons";
import { signIn } from "next-auth/react";

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

      <div className="hidden lg:flex w-full lg:w-1/2 bg-background p-8 lg:p-20 flex-col relative overflow-hidden lg:min-h-screen border-r border-border/50">
        <div className="relative z-20 flex items-center gap-3 cursor-pointer w-fit group mb-auto lg:pt-4" onClick={() => router.push("/")}>
          <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
            <img src="/favicon.ico" alt="Fasturl Logo" className="w-full h-full object-contain" />
          </div>
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
        
        {!showOtpScreen && (
          <button
            onClick={() => router.push("/")}
            className="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all cursor-pointer z-20"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Back</span>
          </button>
        )}

        {showOtpScreen && (
          <button
            onClick={() => setShowOtpScreen(false)}
            className="absolute top-10 left-10 lg:top-20 lg:left-20 flex items-center gap-2 text-muted-foreground hover:text-[#2a9d8f] transition-all cursor-pointer group z-20"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Go Back</span>
          </button>
        )}

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

              <div className="relative flex items-center justify-center my-10">
                <div className="w-full border-t border-border"></div>
                <span className="absolute bg-background px-6 text-[11px] text-muted-foreground font-bold uppercase tracking-[0.3em]">or</span>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-4 border border-border bg-white text-black rounded-2xl transition-all font-bold shadow-sm cursor-pointer group hover:bg-zinc-50"
                onClick={() => signIn("google", {
                  callbackUrl: "/"
                })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Continue with Google
              </button>
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