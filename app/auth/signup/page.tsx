"use client";

import { useState } from "react";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/signup", 
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      router.push("/dashboard");
      router.refresh();

    } catch (error: any) {
        console.log("Error while signup, Please try again later", error)
      }
     finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium text-sm">Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 border border-gray-400 rounded-none focus:outline-none focus:border-black"
              required
            />
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="text-gray-700 font-medium text-sm">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 border border-gray-400 rounded-none w-full focus:outline-none focus:border-black pr-10"
              required
            />
            <span
              className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={25} /> : <AiOutlineEye size={25} />}
            </span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`bg-black text-white py-3 rounded-none font-semibold hover:bg-gray-900 transition cursor-pointer mt-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-xs">
          Already have an account? <a href="/auth/signin" className="text-black font-semibold underline">Sign In</a>
        </p>
      </div>
    </div>
  );
}