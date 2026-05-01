"use client";

import { useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { IoEyeOutline, IoEyeOffOutline, IoLockClosedOutline } from "react-icons/io5";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";

export default function VerifyPage() {
  const { shortUrl } = useParams();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/shortUrl/verify", {
        shortUrl,
        password,
      });
      window.location.href = res.data.original;

    } catch (err: any) {
      setError(err.response?.data?.message || "Incorrect password");

    } finally {
      setLoading(false);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  
  return (
    <div className="h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-none w-full max-w-sm shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4 p-3 bg-neutral-800 border border-neutral-700">
            <IoLockClosedOutline size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-center">
            Password Required
          </h2>
          <p className="text-neutral-500 text-sm mt-1">
            This link is protected with a password
          </p>
        </div>

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="w-full bg-black border border-neutral-700 p-3 rounded-none outline-none focus:border-white transition-colors pr-12 font-mono"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
          >
            {showPassword ? <HugeiconsIcon icon={ViewOffSlashIcon} /> : <HugeiconsIcon icon={ViewIcon} />}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-xs mb-4 font-medium uppercase tracking-wider">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !password}
          className="w-full bg-white text-black py-3 rounded-none font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Unlock Link"}
        </button>
      </div>
    </div>
  );
}