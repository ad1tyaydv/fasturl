"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "./userContext";
import { set } from "date-fns";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

export default function Premium() {
  const router = useRouter();
  const { user, logout, loading } = useUser();

  const handleUpgrade = async (plan: string) => {
    try {
      const res = await axios.get("/api/auth/me");

      if (!res.data.authenticated) {
        router.push("/auth/signin");
        return;
      }

      router.push(`/premium/checkout?plan=${plan}`);

    } catch (error) {
      router.push("/auth/signin");
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <main className="max-w-6xl mx-auto px-4 py-12">

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">
            Unlock the Full Potential of Your Links
          </h1>
          <p className="text-white/40 text-sm">
            Stop guessing and start tracking. Deliver the insights you need to grow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-white/70">Free</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/50">
                Current
              </span>
            </div>

            <div className="text-3xl font-bold mb-1">₹0</div>
            <div className="text-xs text-white/30 mb-5">
              Perfect to get started
            </div>

            <ul className="flex flex-col gap-2 mb-6 flex-1">
              {[
                "100 links/month",
                "30 QR Codes/month",
                "Click tracking",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-white/50"
                >
                  <CheckIcon className="w-4 h-4 shrink-0 text-white/30" />
                  {f}
                </li>
              ))}
            </ul>

            <button className="w-full py-2.5 rounded-xl border border-white/10 text-sm text-white/40 font-medium cursor-default">
              Start Free
            </button>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[11px] font-semibold shadow-md whitespace-nowrap">
              ⭐ Recommended
            </div>

            <div className="flex items-center justify-between mb-4 pt-2">
              <span className="text-xl font-bold text-blue-400">
                Essentials
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300">
                Popular
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-sm line-through text-white/25">
                ₹1,200
              </span>
              <span className="text-3xl font-bold">
                ₹300
                <span className="text-base font-normal text-white/40">
                  /mo
                </span>
              </span>
            </div>

            <div className="text-xs text-white/30 mb-5">
              Most popular choice
            </div>

            <ul className="flex flex-col gap-2 mb-6 flex-1">
              {[
                "10,000 links/month",
                "300 QR Codes/month",
                "Detailed analytics",
                "Bulk link creation",
                "Custom URLs",
                "Let people know where they're being redirected",
                "4 custom domains",
                "Security options",
                "Support 24/7",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-white/70"
                >
                  <CheckIcon className="w-4 h-4 shrink-0 text-blue-400" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade("ESSENTIALS")}
              className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Upgrade to Essentials
            </button>
          </div>

          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-yellow-400">
                Pro
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300">
                Best value
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-sm line-through text-white/25">
                ₹5,600
              </span>
              <span className="text-3xl font-bold">
                ₹1,200
                <span className="text-base font-normal text-white/40">
                  /mo
                </span>
              </span>
            </div>

            <div className="text-xs text-white/30 mb-5">
              For power users
            </div>

            <ul className="flex flex-col gap-2 mb-6 flex-1">
              {[
                "40,000 links/month",
                "2,000 QR Codes/month",
                "Detailed analytics",
                "Bulk link creation",
                "Custom URLs",
                "Let people know where they're being redirected",
                "10 custom domains",
                "API access",
                "Security options",
                "Priority Support 24/7",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-white/70"
                >
                  <CheckIcon className="w-4 h-4 shrink-0 text-yellow-400" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade("PRO")}
              className="w-full py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-semibold transition-colors cursor-pointer"
            >
              Upgrade to Pro
            </button>
          </div>

        </div>

        <p className="mt-12 text-center text-white/30 text-sm">
          Need help choosing?{" "}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=fasturl@tutamail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Contact our team
          </a>
        </p>

      </main>
    </div>
  );
}