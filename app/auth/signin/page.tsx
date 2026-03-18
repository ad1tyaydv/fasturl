"use client";

import { useState } from "react";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";


export default function Login() {
  const router = useRouter();

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
      await axios.post("/api/auth/signin", {
        email: formData.email,
        password: formData.password
      });

      toast.success("Welcome back!", {
        id: loginToast
      });

      router.push("/");
      router.refresh();

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed!", { id: loginToast });

    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen flex w-full bg-white text-black selection:bg-purple-100">
      <Toaster position="top-center" />

      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <img
          src="https://image_5e3d7c.jpg"
          alt="Purple Mountain Landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-12 left-12 flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-[#1e1b2e] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Shortly</h1>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-900">Login</h1>
            <p className="text-gray-500">
              Don't have an account?{" "}
              <button 
                onClick={() => router.push("/auth/signup")}
                className="text-purple-600 hover:underline font-medium cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-gray-900"
              required
            />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white outline-none transition-all pr-12 placeholder:text-gray-400 text-gray-900"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all active:scale-[0.98] mt-2 shadow-md cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full border-t border-gray-200"></div>
              <span className="absolute bg-white px-4 text-sm text-gray-400 font-medium">Or login with</span>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all font-medium text-gray-700 shadow-sm cursor-pointer"
            >
              <FcGoogle size={20} />
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}