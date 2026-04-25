"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("FREE");
  const [planStartedAt, setPlanStartedAt] = useState("");
  const [planExpiresAt, setPlanExpiresAt] = useState("");
  const [totalLinks, setTotalLinks] = useState(0);
  const [bulkLinks, setBulkLinks] = useState(0);
  const [totalQrCodes, setTotalQrCodes] = useState(0);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (!res.data.authenticated) {
          router.push("/auth/signin");
          return;
        }

        setPlan(res.data.plan || "FREE");
        setPlanStartedAt(res.data.planStartedAt || "N/A");
        setPlanExpiresAt(res.data.planExpiresAt || "N/A");
        setTotalLinks(res.data.totalLinks || 0);
        setBulkLinks(res.data.bulkLinks || 0);
        setTotalQrCodes(res.data.totalQrCodes || 0);

      } catch {
        router.push("/auth/signin");

      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-neutral-200 mb-6">
        Subscription & Usage
      </h2>

      <div className="flex flex-col gap-5 w-full max-w-lg mb-8">
        <div className="flex items-center gap-4 text-base sm:text-lg min-h-[40px]">
          {loading ? (
            <div className="flex items-center gap-4 w-full">
              <Skeleton className="h-6 w-32 bg-zinc-800" />
              <Skeleton className="h-8 w-24 bg-zinc-800 rounded-lg" />
            </div>
          ) : (
            <>
              <div>
                <span className="text-neutral-400">Current Plan: </span>
                <span className={`font-bold ${plan === "FREE" ? "text-white" : "text-[#1D9BF0]"}`}>
                  {plan}
                </span>
              </div>
              {plan === "FREE" && (
                <Button 
                    onClick={() => router.push("/premium")}
                    className="bg-white h-8 text-black hover:bg-gray-200 font-bold px-4 text-sm cursor-pointer rounded-lg"
                >
                  Upgrade
                </Button>
              )}
            </>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-5 w-48 bg-zinc-800" />
            <Skeleton className="h-5 w-56 bg-zinc-800" />
          </div>
        ) : (
          (plan === "PRO" || plan === "ESSENTIAL") && (
            <div className="space-y-3">
              <div className="text-base sm:text-lg">
                <span className="text-neutral-400">Plan Started: </span>
                <span className="font-bold text-white">{planStartedAt}</span>
              </div>
              <div className="text-base sm:text-lg">
                <span className="text-neutral-400">Plan Expires: </span>
                <span className="font-bold text-white">{planExpiresAt}</span>
              </div>
            </div>
          )
        )}
      </div>

      <div className="w-full h-px bg-neutral-800 my-8 max-w-2xl"></div>

      <h3 className="text-xl font-bold text-neutral-200 mb-4">Usage Statistics</h3>
      
      <div className="flex flex-col gap-4 w-full max-w-lg mt-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
               <Skeleton className="h-5 w-28 bg-zinc-800" />
               <Skeleton className="h-5 w-12 bg-zinc-800" />
            </div>
          ))
        ) : (
          <>
            <div className="text-base sm:text-lg">
              <span className="text-neutral-400">Total Links: </span>
              <span className="font-bold text-white">{totalLinks}</span>
            </div>
            <div className="text-base sm:text-lg">
              <span className="text-neutral-400">Bulk Links: </span>
              <span className="font-bold text-white">{bulkLinks}</span>
            </div>
            <div className="text-base sm:text-lg">
              <span className="text-neutral-400">Total QR Codes: </span>
              <span className="font-bold text-white">{totalQrCodes}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}