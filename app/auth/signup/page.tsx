"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@/app/components/userContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon, ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

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
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      return toast.error("Please agree to the terms and privacy policy");
    }

    setLoading(true);
    const signupToast = toast.loading("Creating your account...");

    try {
      await axios.post("/api/auth/signup", {
        userName: formData.userName,
        email: formData.email,
        password: formData.password
      });

      await refreshUser();
      toast.success("Welcome to Fasturl!", { id: signupToast });
      setTimeout(() => router.push("/"), 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed.", { id: signupToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-[#0A0A0A] text-white selection:bg-[#F07D51] selection:text-white">
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#18181B',
            color: '#fff',
            border: '1px solid #27272A'
          }
        }} 
      />

      <div className="w-full lg:w-1/2 bg-[#0F0F0F] p-8 lg:p-20 flex flex-col relative overflow-hidden min-h-[60vh] lg:min-h-screen border-r border-zinc-800/50">
        
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
              Shorten links, <br /> 
              <span className="text-[#F07D51]">expand</span> your digital reach.
            </h1>
            <p className="text-zinc-400 text-xl lg:text-2xl leading-relaxed max-w-md">
              Tired of messy URLs? Join Fasturl to create clean, professional, and trackable links in seconds.
            </p>
          </motion.div>
        </div>

        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#F07D51]/10 rounded-full blur-[120px] opacity-30 pointer-events-none" />
        <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 bg-[#F07D51]/5 rounded-full blur-[100px] opacity-20 pointer-events-none" />
      </div>

      <div className="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col justify-center bg-[#0A0A0A] min-h-screen">
        <div className="max-w-[440px] mx-auto w-full">
          <div className="mb-12">
            <h2 className="text-4xl font-extrabold text-white mb-3">Get Started</h2>
            <p className="text-zinc-500 font-medium text-lg">
              Already have an account?{" "}
              <button 
                onClick={() => router.push("/auth/signin")}
                className="text-[#F07D51] font-bold hover:text-[#ff8e66] cursor-pointer transition-all"
              >
                Sign In
              </button>
            </p>
          </div>

          <button 
            type="button"
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 py-4 border border-zinc-800 bg-zinc-900/50 rounded-2xl hover:bg-zinc-800 transition-all font-bold text-zinc-200 shadow-sm cursor-pointer mb-10 group"
          >
            <FcGoogle size={24} className="group-hover:scale-110 transition-transform" />
            Continue with Google
          </button>

          <div className="relative flex items-center justify-center mb-10">
            <div className="w-full border-t border-zinc-800"></div>
            <span className="absolute bg-[#0A0A0A] px-6 text-[11px] text-zinc-500 font-bold uppercase tracking-[0.3em]">or join with email</span>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Username</label>
              <input
                name="userName"
                type="text"
                placeholder="Pick a unique username"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 focus:bg-zinc-900 focus:border-[#F07D51] focus:ring-4 focus:ring-[#F07D51]/10 outline-none transition-all placeholder:text-zinc-600 text-lg text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 focus:bg-zinc-900 focus:border-[#F07D51] focus:ring-4 focus:ring-[#F07D51]/10 outline-none transition-all placeholder:text-zinc-600 text-lg text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Secure Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 focus:bg-zinc-900 focus:border-[#F07D51] focus:ring-4 focus:ring-[#F07D51]/10 outline-none transition-all placeholder:text-zinc-600 text-lg text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#F07D51] cursor-pointer transition-colors"
                >
                  {showPassword ? <HugeiconsIcon icon={ViewOffSlashIcon} size={22} /> : <HugeiconsIcon icon={ViewIcon} size={22} />}
                </button>
              </div>
            </div>

            <div
              className="flex items-center gap-4 cursor-pointer group pt-2"
              onClick={() => setAgreed(!agreed)}
            >
              <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${agreed ? 'bg-[#F07D51] border-[#F07D51] shadow-lg shadow-[#F07D51]/20' : 'border-zinc-700 group-hover:border-zinc-500'}`}>
                {agreed && <HugeiconsIcon icon={Tick02Icon} size={14} className="text-white stroke-[4px]" />}
              </div>
              <span className="text-sm text-zinc-500 select-none font-medium leading-snug">
                I agree to the <span className="text-zinc-200 font-bold cursor-pointer hover:underline">Terms</span> and <span className="text-zinc-200 font-bold cursor-pointer hover:underline">Privacy Policy</span>.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-[#F07D51] text-white font-bold text-xl transition-all hover:bg-[#e06d41] hover:shadow-[0_0_30px_rgba(240,125,81,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-6 cursor-pointer"
            >
              {loading ? (
                <div className="w-7 h-7 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Free Account
                  <HugeiconsIcon icon={ArrowRight01Icon} size={24} />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-12 text-center">
             <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-bold">
                Trusted by 50,000+ creators worldwide
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}