"use client";

import { useState } from "react";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLeft } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post("/api/auth/signin", {
        email,
        password
      });
      
      setEmail("");
      setPassword("");

      router.push("/");

    } catch (error: any) {
      setMessage({ type: "error", text: error.response?.data?.message || "Invalid credentials!" });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-white text-black dark:bg-black dark:text-white transition-colors">
      
      <div className="hidden md:flex md:w-1/2 relative bg-gray-100 dark:bg-black/90 p-12 lg:p-20 flex-col justify-between overflow-hidden">
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-extrabold text-2xl">
            S
          </div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Shortly</h1>
        </div>

        <div className="relative z-10 text-center flex-grow flex flex-col items-center justify-center gap-8">
            <img
                src="https://images.unsplash.com/photo-1549497538-303791108f94?q=80&w=2564&auto=format&fit=crop" 
                alt="Cartoon people interacting with technology"
                className="w-full max-w-sm h-auto object-contain rounded-2xl"
            />
          <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">Welcome back! Log in to continue.</p>
        </div>

        <div className="absolute inset-0 bg-black/10 dark:bg-black/40 z-0"></div>
      </div>

      <div className="w-full md:w-1/2 relative flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white dark:bg-black">
        
        <button 
          onClick={() => router.push("/")}
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white transition font-medium question-font cursor-pointer"
        >
          <AiOutlineLeft size={20} />
          Back
        </button>
        
        <div className="w-full max-w-lg mt-12 md:mt-0">
          <h1 className="text-4xl font-bold mb-8 text-center text-black dark:text-white">Login</h1>

          {message && (
            <div
              className={`mb-6 p-4 question-font rounded text-center text-lg ${
                message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1.5">
              <label className="text-black dark:text-gray-200 font-medium text-base">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-4 text-lg question-font border border-gray-400 dark:border-gray-600 rounded-none bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-black dark:text-gray-200 font-medium text-base">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-4 text-lg question-font border border-gray-400 dark:border-gray-600 rounded-none w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white pr-12 transition-colors"
                required
              />
              <span
                className="absolute right-4 top-[52px] transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible size={28} /> : <AiOutlineEye size={28} />}
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`py-6 text-lg rounded-none font-semibold question-font transition cursor-pointer mt-4
                bg-black text-white hover:bg-gray-900 
                dark:bg-white dark:text-black dark:hover:bg-gray-100
                ${loading ? "opacity-70 dark:opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm question-font">
            Don't have an account? <a href="/auth/signup" className="text-black dark:text-white font-bold underline hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Sign Up</a>
          </p>
        </div>
      </div>

    </div>
  );
}