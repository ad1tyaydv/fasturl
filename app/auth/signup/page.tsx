"use client";

import { useState } from "react";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const nextAvatar = () => setCurrentIndex((prev) => (prev + 1) % avatars.length);
  const prevAvatar = () => setCurrentIndex((prev) => (prev - 1 + avatars.length) % avatars.length);

  const getAvatarIndex = (offset: number) => {
    return (currentIndex + offset + avatars.length) % avatars.length;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post("/api/auth/signup", {
        username,
        password,
        avatar: avatars[currentIndex],
      });

      localStorage.setItem("userData", JSON.stringify({
        username: res.data.user.username,
        avatar: res.data.user.avatar,
      }));

      router.push("/");
      router.refresh();

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 409) {
          setMessage({
            type: "error",
            text: "Username already exists",
          });
        } else {
          setMessage({
            type: "error",
            text: error.response?.data?.message || "Something went wrong!",
          });
        }
      } else {
        setMessage({
          type: "error",
          text: "Something went wrong!",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h1>

        <div className="flex flex-col items-center mb-6">
          <div className="relative flex items-center justify-center w-full h-20">

            <button
              type="button"
              onClick={prevAvatar}
              className="absolute left-4 z-10 p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600 cursor-pointer"
            >
              <AiOutlineLeft size={22} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden opacity-30 blur-[1.5px] scale-90 transition-all duration-300">
                <img
                  src={avatars[getAvatarIndex(-1)]}
                  alt="prev"
                  className="w-full h-full object-cover" />
              </div>

              <div className="w-16 h-16 rounded-full border-2 border-black overflow-hidden shadow-md transition-all duration-300">
                <img
                  src={avatars[currentIndex]}
                  alt="selected"
                  className="w-full h-full object-cover" />
              </div>

              <div className="w-10 h-10 rounded-full overflow-hidden opacity-30 blur-[1.5px] scale-90 transition-all duration-300">
                <img
                  src={avatars[getAvatarIndex(1)]}
                  alt="next"
                  className="w-full h-full object-cover" />
              </div>
            </div>

            <button
              type="button"
              onClick={nextAvatar}
              className="absolute right-4 z-10 p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600 cursor-pointer"
            >
              <AiOutlineRight size={22} />
            </button>
          </div>
          <p className="text-[10px] question-font tracking-widest text-gray-400 mt-2 font-semibold">SELECT AVATAR</p>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded text-sm text-center ${message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}
          >
            {message.text}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium text-sm">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          Already have an account? <a href="/auth/login" className="text-black font-semibold underline">Login</a>
        </p>
      </div>
    </div>
  );
}