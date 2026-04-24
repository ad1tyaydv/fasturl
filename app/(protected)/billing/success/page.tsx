"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useId } from "react";
import Navbar from "@/app/components/navbar";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const id = useId();

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const [confettiParticles, setConfettiParticles] = useState<any[]>([]);
  const [startPopper, setStartPopper] = useState(false);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        setPlan(data.plan);
        setIsActive(data.isActive);

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, []);

  useEffect(() => {
    if ((plan === "PRO" || plan === "ESSENTIAL") && isActive && !startPopper) {
      setStartPopper(true);

      const particles = [];
      const colors = ["#FBBF24", "#FFFFFF", "#FFE4A3", "#FFF7E0", "#E8B131"];

      for (let i = 0; i < 120; i++) {
        particles.push({
          id: `${id}-${i}`,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 6,
          initialX: Math.random() * 100 + "vw",
          initialY: Math.random() * -100 + "vh",
          trajectoryX: (Math.random() - 0.5) * 60,
          trajectoryY: (Math.random() - 1.2) * 80 - 40,
          opacity: Math.random() * 0.7 + 0.3,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 4 - 2,
          delay: Math.random() * 0.5,
        });
      }

      setConfettiParticles(particles);
    }
  }, [plan, isActive, startPopper, id]);

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 relative">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#1D9BF0] border-t-transparent rounded-full animate-spin" />
            <p className="text-neutral-400 animate-pulse">
              Verifying your subscription...
            </p>
          </div>
        ) : plan !== "FREE" && isActive ? (
          <div className="max-w-md w-full text-center space-y-8 relative">

            {/* 🎉 Confetti */}
            {confettiParticles.length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {confettiParticles.map((p) => (
                  <div
                    key={p.id}
                    className="absolute rounded-full animate-confetti-float"
                    style={{
                      backgroundColor: p.color,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      top: p.initialY,
                      left: p.initialX,
                      opacity: p.opacity,
                      '--trajectory-x': `${p.trajectoryX}vw`,
                      '--trajectory-y': `${p.trajectoryY}vh`,
                    } as React.CSSProperties}
                  />
                ))}
              </div>
            )}

            {/* ✅ Success UI */}
            <div className="relative">
              <div className="bg-amber-500/20 blur-3xl rounded-full absolute inset-0" />
              <div className="relative bg-gradient-to-b from-amber-400 to-amber-600 p-4 rounded-3xl">
                <CheckCircle2 className="w-12 h-12 text-black" />
              </div>
              <Sparkles className="w-8 h-8 text-amber-300 absolute -top-4 -right-4" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Upgrade Successful 🎉
              </h1>
              <p className="text-neutral-400 mt-2">
                You are now a{" "}
                <span className="text-amber-400 font-bold">{plan}</span> user
              </p>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200"
            >
              Go to Dashboard <ArrowRight />
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h1 className="text-2xl text-red-500 font-bold">
              Payment not verified ❌
            </h1>
            <p className="text-neutral-400">
              Your payment is still processing or failed.
            </p>

            <button
              onClick={() => router.push("/premium")}
              className="text-blue-400 underline"
            >
              Try again
            </button>
          </div>
        )}
      </main>

      <style>{`
        @keyframes confetti-float {
          0% { transform: translate(0,0); opacity: 1; }
          100% { transform: translate(var(--trajectory-x), var(--trajectory-y)); opacity: 0; }
        }
        .animate-confetti-float {
          animation: confetti-float 4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}