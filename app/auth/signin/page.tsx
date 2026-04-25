"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@/app/components/userContext";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  ViewOffSlashIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Loading02Icon,
  FingerPrintIcon,
} from "@hugeicons/core-free-icons";


export default function Login() {
  const router = useRouter();
  const { refreshUser } = useUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying2FA, setVerifying2FA] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loginToast = toast.loading("Verifying credentials...");

    try {
      const res = await axios.post("/api/auth/signin", {
        email: formData.email,
        password: formData.password,
      });

      const loggedInUser = res.data.user;

      if (loggedInUser.twofactorEnabled) {
        setShow2FA(true);
        toast.success("Security verification required", { id: loginToast });
      } else {
        await refreshUser();
        toast.success("Welcome back!", { id: loginToast });
        router.push("/");
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed!", {
        id: loginToast,
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

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpBackspace = (index: number) => {
    const newOtp = [...otp];
    if (!otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();

    } else {
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleVerify2FA = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setVerifying2FA(true);
    const verifyToast = toast.loading("Authenticating...");

    try {
      const res = await axios.post("/api/auth/signin/2faVerify", {
        email: formData.email,
        otp: otpCode,
      });

      if (res.status === 200 && res.data.success) {
        await refreshUser();
        toast.success("Access granted", { id: verifyToast });
        router.push("/");
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP", {
        id: verifyToast,
      });
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
      
    } finally {
      setVerifying2FA(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-[#0A0A0A] text-white selection:bg-[#F07D51] selection:text-white">
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: { background: '#18181B', color: '#fff', border: '1px solid #27272A' }
        }} 
      />

      <div className="w-full lg:w-1/2 bg-[#0F0F0F] p-8 lg:p-20 flex flex-col relative overflow-hidden min-h-[50vh] lg:min-h-screen border-r border-zinc-800/50">
        
        <div 
          className="relative z-20 flex items-center gap-3 cursor-pointer w-fit group mb-auto lg:pt-4" 
          onClick={() => router.push("/")}
        >
          <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
            <img src="/favicon.ico" alt="Fasturl Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Fasturl</span>
        </div>

        <div className="relative z-10 flex-grow flex flex-col justify-center lg:-mt-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h1 className="text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-10">
              Welcome back <br /> 
              <span className="text-[#83c5be]">to your workspace.</span>
            </h1>
            <p className="text-zinc-400 text-xl lg:text-2xl leading-relaxed max-w-md">
                Everything is ready for you. Log in to manage your links and view your analytics.
            </p>
          </motion.div>
        </div>

        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#F07D51]/10 rounded-full blur-[120px] opacity-30 pointer-events-none" />
      </div>

      <div className="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col justify-center bg-[#0F0F0F] min-h-screen relative">
        
        {show2FA && (
          <button
            onClick={() => setShow2FA(false)}
            className="absolute top-10 left-10 lg:top-20 lg:left-20 flex items-center gap-2 text-zinc-500 hover:text-[#2a9d8f] transition-all cursor-pointer group z-20"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Go Back</span>
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-[440px] mx-auto"
        >
          {!show2FA ? (
            <>
              <div className="mb-12">
                <h2 className="text-4xl font-extrabold text-white mb-3">Sign In</h2>
                <p className="text-zinc-500 font-medium text-lg">
                  New here?{" "}
                  <button
                    onClick={() => router.push("/auth/signup")}
                    className="text-[#83c5be] font-bold hover:text-[#2a9d8f] cursor-pointer transition-all"
                  >
                    Create an account
                  </button>
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 focus:bg-zinc-900 focus:border-[#83c5be] focus:ring-4 focus:ring-[#83c5be]/10 outline-none transition-all placeholder:text-zinc-600 text-lg text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 focus:bg-zinc-900 focus:border-[#83c5be] focus:ring-4 focus:ring-[#83c5be]/10 outline-none transition-all placeholder:text-zinc-600 text-lg text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#83c5be] cursor-pointer transition-colors"
                    >
                      {showPassword ? <HugeiconsIcon icon={ViewOffSlashIcon} size={22} /> : <HugeiconsIcon icon={ViewIcon} size={22} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl bg-white text-black font-bold text-xl transition-all hover:bg-[#83c5be] hover:shadow-[0_0_30px_rgba(131,197,190,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4 cursor-pointer"
                >
                  {loading ? (
                    <HugeiconsIcon icon={Loading02Icon} className="w-7 h-7 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <HugeiconsIcon icon={ArrowRight01Icon} size={24} />
                    </>
                  )}
                </button>
              </form>

              {/* <div className="relative flex items-center justify-center my-10">
                <div className="w-full border-t border-zinc-800"></div>
                <span className="absolute bg-[#0A0A0A] px-6 text-[11px] text-zinc-500 font-bold uppercase tracking-[0.3em]">or</span>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-4 border border-zinc-800 bg-zinc-900/50 rounded-2xl hover:bg-zinc-800 transition-all font-bold text-zinc-200 shadow-sm cursor-pointer group"
              >
                <FcGoogle size={24} className="group-hover:scale-110 transition-transform" />
                Continue with Google
              </button> */}
            </>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="mb-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-zinc-900 text-[#F07D51] rounded-[28px] flex items-center justify-center mb-8 border border-zinc-800 shadow-xl shadow-[#F07D51]/10">
                  <HugeiconsIcon icon={FingerPrintIcon} size={40} />
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight text-white mb-4">Verify Identity</h2>
                <p className="text-zinc-500 text-lg font-medium max-w-[320px] leading-relaxed">
                  Enter the 6-digit code from your authenticator app to continue.
                </p>
              </div>

              <div className="w-full space-y-10">
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
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          handleOtpBackspace(index);
                        }
                      }}
                      className="w-12 h-16 sm:w-14 sm:h-18 rounded-2xl bg-zinc-900/50 border border-zinc-800 focus:border-[#F07D51] focus:bg-zinc-900 focus:ring-4 focus:ring-[#F07D51]/10 outline-none text-white font-bold text-3xl text-center transition-all"
                      placeholder="-"
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerify2FA}
                  disabled={verifying2FA || otp.join("").length !== 6}
                  className="w-full py-5 bg-[#F07D51] text-white font-bold text-xl rounded-2xl transition-all hover:bg-[#e06d41] hover:shadow-[0_0_30px_rgba(240,125,81,0.3)] active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-3"
                >
                  {verifying2FA ? (
                    <HugeiconsIcon icon={Loading02Icon} className="w-7 h-7 animate-spin" />
                  ) : (
                    "Confirm Access"
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}