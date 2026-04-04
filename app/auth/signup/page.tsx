"use client";

import { useState } from "react";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@/app/components/userContext";
import { signIn } from "next-auth/react"


export default function Signup() {
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
    if (!agreed) return toast.error("Please agree to the terms & conditions");

    setLoading(true);
    const signupToast = toast.loading("Creating your account...");

    try {
      await axios.post("/api/auth/signup", {
        userName: formData.userName,
        email: formData.email,
        password: formData.password
      });
      
      const newUser = {
        userName: formData.userName,
        email: formData.email,
        plan: "FREE"
      }

      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("plan", "FREE");

      setUser(newUser);

      toast.success("Account created successfully!", { 
          id: signupToast
        });

      router.push("/");

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed!", { id: signupToast });

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
                Start Your <span className="text-red-500 text-glow">Journey</span> <br /> 
                <span className="text-white/90">With Us.</span>
            </h2>
            <div className="h-1 w-24 bg-red-600 my-8 rounded-full shadow-[0_0_10px_#dc2626]"></div>
            <p className="text-gray-300 text-xl max-w-md font-light leading-relaxed">
                Create an account to track your links, analyze your audience, and build your brand.
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
            <h1 className="text-4xl font-bold mb-2 text-white">Create an account</h1>
            <p className="text-gray-400">
              Already have an account?{" "}
              <button 
                onClick={() => router.push("/auth/signin")}
                className="text-red-500 hover:text-red-400 font-medium cursor-pointer transition-colors"
              >
                Log in
              </button>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400 ml-1">Username</label>
              <input
                name="userName"
                placeholder="Username"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-[#141414] border border-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400 ml-1">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-[#141414] border border-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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

            <div className="flex items-center gap-2 py-2">
              <input 
                type="checkbox" 
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-[#141414] text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer select-none">
                I agree to the <span className="text-red-500 underline decoration-red-500/30">terms & conditions</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-7 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all active:scale-[0.98] mt-2 shadow-[0_10px_20px_rgba(220,38,38,0.2)] border-none text-lg cursor-pointer"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full border-t border-white/5"></div>
              <span className="absolute bg-[#0a0a0a] px-4 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">OR</span>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-white/10 bg-[#141414] hover:bg-[#1f1f1f] transition-all font-medium text-white shadow-sm cursor-pointer"
              onClick={() => signIn("google")}
            >
              <FcGoogle size={20} />
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}