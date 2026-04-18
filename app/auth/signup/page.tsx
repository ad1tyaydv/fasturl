"use client";

import React, { useState } from "react";
import { 
  Check,
  Command,
} from "lucide-react";
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
  const { setUser } = useUser();

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
      
      const newUser = { userName: formData.userName, email: formData.email, plan: "FREE" };
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("plan", "FREE");
      setUser(newUser);

      toast.success("Welcome to Fasturl!", { id: signupToast });
      setTimeout(() => router.push("/"), 1000);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed.", { id: signupToast });

    } finally {
      setLoading(false);
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
              The internet <br />
              <span className="italic font-serif opacity-90">is noisy enough.</span> <br />
              Keep your links clean. <br />
            </h1>
            
            <div className="space-y-6 mt-16 border-l border-white/10 pl-8">
              <p className="text-sm text-white/40 max-w-xs leading-relaxed italic">
                "We built Fasturl because we were tired of cluttered dashboards. We wanted something that felt calm, intentional, and human."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-white/20" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">fasturl</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-10 opacity-30">
        </div>
      </div>

      <div className="w-full lg:w-[45%] flex items-center justify-center bg-white overflow-y-auto p-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-[400px]" 
        >
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Command className="text-white" size={16} />
            </div>
            <span className="font-bold tracking-[0.2em] text-[10px] uppercase">Fasturl</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-bold tracking-tighter mb-3">Create account</h2>
            <p className="text-slate-400 text-base font-medium">
              Already a member?{" "}
              <button 
                onClick={() => router.push("/auth/signin")}
                className="text-black font-bold hover:underline underline-offset-4 transition-all cursor-pointer"
              >
                Log in
              </button>
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-black ml-0.5">Username</label>
              <input
                name="userName"
                type="text"
                placeholder="Username"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-base focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all placeholder:text-slate-300 bg-slate-50/30"
                required
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-black ml-0.5">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@domain.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-base focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all placeholder:text-slate-300 bg-slate-50/30"
                required
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-black ml-0.5">Secure Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-base focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all placeholder:text-slate-300 bg-slate-50/30"
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

            <div 
              className="flex items-center gap-4 cursor-pointer group py-1"
              onClick={() => setAgreed(!agreed)}
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                agreed ? 'bg-black border-black shadow-sm' : 'border-slate-200 group-hover:border-slate-300'
              }`}>
                {agreed && <HugeiconsIcon icon={Tick02Icon} className="text-white stroke-[4px]" />}
              </div>
              <span className="text-xs text-slate-400 font-medium select-none">
                I agree to the <span className="text-black font-bold">Terms</span> and <span className="text-black font-bold">Privacy Policy</span>.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 rounded-2xl bg-black text-white font-bold text-sm transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl mt-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create an account
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
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-4 py-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-base font-bold text-slate-900 shadow-sm active:scale-[0.99] cursor-pointer"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>
        </motion.div>
      </div>
    </div>
  );
}