"use client";

import { useState } from "react";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@/app/components/userContext";

export default function Login() {
  const router = useRouter();
  const { setUser } = useUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loginToast = toast.loading("Logging in...");

    try {
      const res = await axios.post("/api/auth/signin", {
        email: formData.email,
        password: formData.password
      });
      
      const loggedInUser = res.data.user;

      if(loggedInUser) {
        localStorage.setItem("user", loggedInUser.plan);
      }
      
      setUser(loggedInUser);
      toast.success("Welcome back!", { id: loginToast });
      router.push("/");

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed!", { id: loginToast });

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex w-full bg-[#0a0a0a] text-white selection:bg-red-500/30 overflow-hidden">
      <Toaster position="top-center" />

      <div className="hidden lg:flex lg:w-[60%] relative bg-[#0f0f0f] border-r border-white/5">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
          alt="Abstract Dark Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0a0a0a]/20 to-[#0a0a0a]"></div>
        
        <div className="absolute top-12 left-12 flex items-center gap-3 z-20">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Fasturl</h1>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-20">
            <h2 className="text-6xl font-bold leading-tight max-w-xl">
                Shorten Your <span className="text-red-500 text-glow">Links</span> <br /> 
                <span className="text-white/90">Instantly.</span>
            </h2>
            <div className="h-1 w-24 bg-red-600 my-8 rounded-full shadow-[0_0_10px_#dc2626]"></div>
            <p className="text-gray-300 text-xl max-w-md font-light leading-relaxed">
                Join thousands of users transforming long, messy URLs into powerful marketing assets.
            </p>
        </div>

        <div className="absolute bottom-12 left-12 text-white/20 text-sm font-mono tracking-tighter">
            PRO_VERSION // 2026_BUILD
        </div>
      </div>

      <div className="w-full lg:w-[40%] flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-[#0a0a0a]">
        <div className="w-full max-w-md mx-auto">
          
          <div className="flex lg:hidden items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              S
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Fasturl</h1>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-400">
              New here?{" "}
              <button 
                onClick={() => router.push("/auth/signup")}
                className="text-red-500 hover:text-red-400 font-medium cursor-pointer transition-colors"
              >
                Create an account
              </button>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-[#141414] border border-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#141414] border border-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all pr-12 placeholder:text-gray-600 text-white"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-7 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all active:scale-[0.98] mt-4 shadow-[0_10px_20px_rgba(220,38,38,0.2)] border-none text-lg cursor-pointer"
            >
              {loading ? "Verifying..." : "Login"}
            </Button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full border-t border-white/5"></div>
              <span className="absolute bg-[#0a0a0a] px-4 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">OR</span>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-white/10 bg-[#141414] hover:bg-[#1f1f1f] transition-all font-medium text-white shadow-sm cursor-pointer"
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}