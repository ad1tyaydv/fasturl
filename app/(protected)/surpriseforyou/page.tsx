"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Check, Gift, LogIn, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Rotating3DBall } from "@/app/components/Rotating3DBall";
import { useUser } from "@/app/components/userContext";
import { motion, AnimatePresence } from "framer-motion";

export default function SurprisePage() {
  const [showSurprise, setShowSurprise] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const handleCopy = () => {
    navigator.clipboard.writeText("FAST90");
    setCopied(true);
    toast.success("Coupon code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenSurprise = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setShowSurprise(true);
    
    // Party popper effect - Refined to be less intense and smaller
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
      startVelocity: 30, 
      spread: 360, 
      ticks: 60, 
      zIndex: 10,
      scalar: 1 
    };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 20 * (timeLeft / duration);
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#83c5be", "#ffffff", "#000000"]
      });
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#83c5be", "#ffffff", "#000000"]
      });
    }, 250);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center p-6 animate-in fade-in duration-700 overflow-hidden bg-white dark:bg-background">
      <Rotating3DBall isRevealed={showSurprise} />
      
      <div className="relative z-10 max-w-2xl w-full text-center">
        {!showSurprise ? (
          <div className="space-y-12 animate-in zoom-in-95 duration-500">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-two text-foreground leading-tight tracking-tight">
                A Special Reward for You
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-one leading-relaxed max-w-xl mx-auto">
                I appreciate your efforts to visit this page, so you should be rewarded.
              </p>
              <p className="text-lg md:text-xl font-medium text-foreground/80 font-three uppercase tracking-[0.2em]">
                Click below to reveal
              </p>
            </div>

            <Button
              onClick={handleOpenSurprise}
              size="lg"
              className="group relative bg-[#83c5be] hover:bg-[#83c5be]/90 text-white font-two text-xl px-10 py-8 rounded-3xl gap-4 transition-all shadow-lg hover:-translate-y-1 active:translate-y-0 cursor-pointer overflow-hidden"
            >
              <Gift className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span className="relative z-10">OPEN SURPRISE</span>
              <Sparkles className="w-5 h-5 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
            </Button>
          </div>
        ) : (
          <div className="space-y-10 animate-in zoom-in-95 slide-in-from-bottom-20 duration-700">
            <div className="p-12 rounded-[50px] bg-white dark:bg-secondary/20 border-2 border-[#83c5be]/30 relative overflow-hidden backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-transparent via-[#83c5be] to-transparent opacity-60"></div>
              
              <h2 className="text-4xl md:text-6xl font-two text-foreground mb-10 tracking-tight">
                Congratulations! 🎊
              </h2>
              
              <div 
                onClick={handleCopy}
                className="group/code relative flex flex-col items-center justify-center gap-6 bg-background/80 border-4 border-dashed border-[#83c5be]/40 p-10 rounded-[35px] cursor-pointer hover:border-[#83c5be] transition-all active:scale-95 shadow-inner"
              >
                <code className="text-6xl md:text-8xl font-two tracking-[0.1em] text-[#83c5be] select-all animate-in fade-in zoom-in-50 duration-1000">
                  FAST80
                </code>
                
                <div className="flex items-center gap-3 bg-[#83c5be]/10 px-6 py-2 rounded-full border border-[#83c5be]/20">
                  {copied ? (
                    <Check className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Copy className="w-6 h-6 text-[#83c5be]" />
                  )}
                  <span className="text-sm font-bold text-[#83c5be] uppercase tracking-widest">
                    {copied ? "Copied to clipboard" : "Click to copy code"}
                  </span>
                </div>
              </div>

              <div className="mt-12 space-y-8">
                <p className="text-2xl md:text-4xl font-one text-foreground leading-tight">
                  Use this code for a <span className="text-[#83c5be] font-two">80% DISCOUNT</span> on all plans.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    onClick={() => router.push("/premium")}
                    className="bg-[#83c5be] hover:bg-[#83c5be]/90 text-white font-bold text-xl px-10 py-8 rounded-2xl w-full sm:w-auto shadow-lg shadow-[#83c5be]/20 transition-all cursor-pointer"
                  >
                    Start Saving Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[40px] p-8 md:p-12 shadow-2xl border border-border overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#83c5be]" />
              
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center space-y-8">
                <div className="w-20 h-20 bg-[#83c5be]/10 rounded-[30px] flex items-center justify-center mx-auto text-[#83c5be]">
                  <LogIn className="w-10 h-10" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-3xl font-two text-foreground leading-tight">
                    Almost there!
                  </h3>
                  <p className="text-lg text-muted-foreground font-one leading-relaxed">
                    You need to be logged in to claim your surprise reward. Please log in first and come back to this page again.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    onClick={() => router.push("/auth/signin")}
                    className="w-full bg-[#83c5be] hover:bg-[#83c5be]/90 text-white font-bold text-xl py-8 rounded-2xl shadow-lg shadow-[#83c5be]/20 transition-all cursor-pointer"
                  >
                    Go to Login
                  </Button>
                  <button 
                    onClick={() => setShowLoginModal(false)}
                    className="text-muted-foreground hover:text-foreground font-bold transition-colors cursor-pointer"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
