"use client";

import { useState } from "react";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>

        {message && (
          <div
            className={`mb-4 p-3 question-font rounded text-center ${
              message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 question-font border border-gray-400 rounded-none focus:outline-none focus:border-black"
              required
            />
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 question-font border border-gray-400 rounded-none w-full focus:outline-none focus:border-black pr-10"
              required
            />
            <span
              className="absolute right-3 top-13 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={25} /> : <AiOutlineEye size={25} />}
            </span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`bg-black question-font text-white py-3 rounded-none font-semibold hover:bg-gray-900 transition cursor-pointer ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-center question-fonts text-gray-500 text-sm">
          Don't have an account? <a href="/auth/signup" className="text-black font-medium">Sign Up</a>
        </p>
      </div>
    </div>
  );
}