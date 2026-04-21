"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@/app/components/userContext";
import { motion } from "framer-motion";
import { Command } from "lucide-react";
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
    <div className="min-h-screen w-full bg-white text-black font-sans selection:bg-black selection:text-white flex overflow-hidden">
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-16 bg-[#0a0a0a] text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#333_0%,transparent_50%)]" />
        </div>

        <div className="relative z-10 flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Command className="text-black" size={22} />
          </div>
          <span className="text-sm font-bold tracking-[0.3em] uppercase">Fasturl</span>
        </div>

        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl font-light leading-[1.05] tracking-tight mb-10">
              Welcome back <br />
              <span className="italic font-serif opacity-90">to your workspace.</span> <br />
              Everything is ready. <br />
            </h1>

            <div className="space-y-6 mt-16 border-l border-white/10 pl-8">
              <p className="text-sm text-white/40 max-w-xs leading-relaxed italic">
                "We designed this space to be your command center. Clean, efficient, and built for speed."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-white/20" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">fasturl</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-10 opacity-30" />
      </div>

      <div className="w-full lg:w-[45%] flex items-center justify-center bg-white overflow-y-auto p-8 relative">
        {show2FA && (
          <button
            onClick={() => setShow2FA(false)}
            className="absolute top-10 left-10 flex items-center gap-2 text-slate-400 hover:text-black transition-colors cursor-pointer group z-20"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back</span>
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-[400px]"
        >
          {!show2FA && (
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Command className="text-white" size={16} />
              </div>
              <span className="font-bold tracking-[0.2em] text-[10px] uppercase">Fasturl</span>
            </div>
          )}

          {!show2FA ? (
            <>
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-4xl font-bold tracking-tighter mb-3">Sign in</h2>
                <p className="text-slate-400 text-base font-medium">
                  New here?{" "}
                  <button
                    onClick={() => router.push("/auth/signup")}
                    className="text-black font-bold hover:underline underline-offset-4 transition-all cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2.5">
                  <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-black ml-0.5">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-base focus:border-black outline-none transition-all placeholder:text-slate-300 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-black ml-0.5">Password</label>
                  <div className="relative group">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-base focus:border-black outline-none transition-all placeholder:text-slate-300 bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-black transition-colors cursor-pointer"
                    >
                      {showPassword ? <HugeiconsIcon icon={ViewOffSlashIcon} /> : <HugeiconsIcon icon={ViewIcon} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4.5 rounded-2xl bg-black text-white font-bold text-sm transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl mt-4 cursor-pointer"
                >
                  {loading ? (
                    <HugeiconsIcon icon={Loading02Icon} className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <HugeiconsIcon icon={ArrowRight01Icon} />
                    </>
                  )}
                </button>
              </form>

              <div className="relative flex items-center justify-center my-10">
                <div className="w-full border-t border-slate-100"></div>
                <span className="absolute bg-white px-5 text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold">OR</span>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-4 py-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-base font-bold text-slate-900 shadow-sm active:scale-[0.99] cursor-pointer"
              >
                <FcGoogle size={22} />
                Continue with Google
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="mb-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-black/20">
                  <HugeiconsIcon icon={FingerPrintIcon} size={32} />
                </div>
                <h2 className="text-4xl font-bold tracking-tighter mb-4">Verify Identity</h2>
                <p className="text-slate-400 text-base font-medium max-w-[280px]">
                  Enter the unique 6-digit code from your authenticator app.
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
                      className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-white border border-slate-200 focus:border-black outline-none text-black font-bold text-2xl text-center transition-all"
                      placeholder="•"
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerify2FA}
                  disabled={verifying2FA || otp.join("").length !== 6}
                  className="w-full py-4.5 bg-black text-white font-bold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl border-none text-sm cursor-pointer flex items-center justify-center gap-3"
                >
                  {verifying2FA ? (
                    <HugeiconsIcon icon={Loading02Icon} className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Confirm Access
                    </>
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