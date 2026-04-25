"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useId } from "react";
import Navbar from "@/app/components/navbar";
import { CheckCircle2, ArrowRight, Sparkles, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        console.error("Something went wrong:");

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
      const colors = ["#FFFFFF", "#E4E4E7", "#71717A", "#A1A1AA"];

      for (let i = 0; i < 80; i++) {
        particles.push({
          id: `${id}-${i}`,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          initialX: Math.random() * 100 + "vw",
          initialY: Math.random() * -20 + "vh",
          trajectoryX: (Math.random() - 0.5) * 40,
          trajectoryY: Math.random() * 100 + 50,
          opacity: Math.random() * 0.6 + 0.4,
          delay: Math.random() * 2,
        });
      }
      setConfettiParticles(particles);
    }
  }, [plan, isActive, startPopper, id]);

  
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col relative overflow-hidden selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 relative">
        {loading ? (
          <div className="flex flex-col items-center gap-6">
            <div className="w-10 h-10 border-2 border-zinc-800 border-t-white rounded-full animate-spin" />
            <p className="text-zinc-500 font-medium tracking-tight">
              Verifying subscription...
            </p>
          </div>
        ) : plan !== "FREE" && isActive ? (
          <div className="max-w-[400px] w-full text-center space-y-10 relative">
            
            {confettiParticles.length > 0 && (
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {confettiParticles.map((p) => (
                  <div
                    key={p.id}
                    className="absolute rounded-full animate-confetti-fall"
                    style={{
                      backgroundColor: p.color,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      top: "-5vh",
                      left: p.initialX,
                      opacity: p.opacity,
                      animationDelay: `${p.delay}s`,
                      '--trajectory-x': `${p.trajectoryX}vw`,
                      '--trajectory-y': `${p.trajectoryY}vh`,
                    } as React.CSSProperties}
                  />
                ))}
              </div>
            )}

            <div className="relative flex justify-center">
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                <CheckCircle2 className="w-12 h-12 text-black" strokeWidth={2.5} />
              </div>
              <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full" />
              <Sparkles className="w-6 h-6 text-zinc-500 absolute -top-2 -right-2 animate-pulse" />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight">
                Upgrade Successful
              </h1>
              <p className="text-zinc-500 text-lg">
                Your account is now on the <span className="text-white font-semibold">{plan}</span> plan.
              </p>
            </div>

            <Button 
              onClick={() => router.push("/")}
              size="lg"
              className="w-full h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-bold text-lg cursor-pointer"
            >
              Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div className="max-w-[400px] w-full text-center space-y-8">
            <div className="flex justify-center">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-red-500" />
                </div>
            </div>
            
            <div className="space-y-2">
                <h1 className="text-2xl font-bold">Payment not verified</h1>
                <p className="text-zinc-500">
                    Your payment is still processing or failed to complete.
                </p>
            </div>

            <Button 
                variant="outline" 
                onClick={() => router.push("/premium")}
                className="w-full h-12 rounded-xl border-zinc-800 bg-transparent hover:bg-zinc-900 text-white cursor-pointer transition-all font-medium"
            >
                Try Again
            </Button>
          </div>
        )}
      </main>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(var(--trajectory-y)) translateX(var(--trajectory-x)) rotate(360deg); opacity: 0; }
        }
        .animate-confetti-fall {
          animation: confetti-fall 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
}