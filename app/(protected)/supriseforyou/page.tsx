"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Check, Gift } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

function Rotating3DBall({ isRevealed = false }: { isRevealed?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      const THREE = (window as any).THREE;
      if (!THREE || !canvasRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current, 
        alpha: true, 
        antialias: true 
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const geometry = new THREE.IcosahedronGeometry(1.5, 1);
      
      const material = new THREE.MeshPhongMaterial({
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        emissive: isRevealed ? 0x83c5be : 0x000000,
        emissiveIntensity: isRevealed ? 0.5 : 0
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const pointLight = new THREE.PointLight(isRevealed ? 0x83c5be : 0xffffff, 2);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      camera.position.z = 5;

      let clock = new THREE.Clock();
      
      const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        
        mesh.rotation.y = elapsedTime * 0.4;
        mesh.rotation.x = elapsedTime * 0.2;

        if (isRevealed) {
          const scale = 1.2 + Math.sin(elapsedTime * 2) * 0.15;
          mesh.scale.set(scale, scale, scale);
        }

        renderer.render(scene, camera);
        requestRef.current = requestAnimationFrame(animate);
      };

      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    };
  }, [isRevealed]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40 dark:opacity-20"
    />
  );
}

export default function SurprisePage() {
  const [showSurprise, setShowSurprise] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText("FAST30");
    setCopied(true);
    toast.success("Coupon code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenSurprise = () => {
    setShowSurprise(true);
    
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
      startVelocity: 45, 
      spread: 360, 
      ticks: 100, 
      zIndex: 10,
      scalar: 2 
    };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40 * (timeLeft / duration);
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
    <div className="relative min-h-[90vh] flex items-center justify-center p-6 animate-in fade-in duration-700 overflow-hidden">
      <Rotating3DBall isRevealed={showSurprise} />
      
      <div className="relative z-10 max-w-2xl w-full text-center">
        {!showSurprise ? (
          <div className="space-y-12 animate-in zoom-in-95 duration-500">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-two text-foreground leading-tight tracking-tight">
                A Special Reward for You
              </h2>
              <p className="text-2xl md:text-3xl text-muted-foreground font-one leading-relaxed max-w-xl mx-auto">
                I appreciate your efforts to visit this page, so you should be rewarded.
              </p>
              <p className="text-xl md:text-2xl font-medium text-foreground/80 font-three uppercase tracking-[0.2em]">
                Click below to reveal
              </p>
            </div>

            <Button
              onClick={handleOpenSurprise}
              size="lg"
              className="group relative bg-[#83c5be] hover:bg-[#83c5be]/90 text-white font-two text-2xl px-12 py-10 rounded-3xl gap-4 transition-all shadow-[0_20px_50px_rgba(131,197,190,0.3)] hover:shadow-[#83c5be]/40 hover:-translate-y-2 active:translate-y-0 cursor-pointer overflow-hidden"
            >
              <Gift className="w-8 h-8 group-hover:rotate-12 transition-transform" />
              <span className="relative z-10">OPEN SURPRISE</span>
              <Sparkles className="w-6 h-6 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </Button>
          </div>
        ) : (
          <div className="space-y-10 animate-in zoom-in-40 slide-in-from-bottom-20 duration-700">
            <div className="p-12 rounded-[50px] bg-secondary/60 dark:bg-secondary/20 border-2 border-[#83c5be]/30 relative overflow-hidden backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-transparent to-transparent opacity-60"></div>
              
              <h2 className="text-3xl md:text-6xl font-two text-foreground mb-10 tracking-tight">
                Congratulations! 🎊
              </h2>
              
              <div 
                onClick={handleCopy}
                className="group/code relative flex flex-col items-center justify-center gap-6 bg-background/80 border-4 border-dashed p-10 rounded-[35px] cursor-pointer hover:border-[#83c5be] transition-all active:scale-95 shadow-inner"
              >
                <code className="text-3xl md:text-6xl font-two tracking-[0.1em] text-[#83c5be] select-all animate-in fade-in zoom-in-50 duration-1000">
                  FAST30
                </code>
                
                <div className="flex items-center gap-3 bg-[#83c5be]/10 px-6 py-2 rounded-full border border-[#83c5be]/20">
                  {copied ? (
                    <Check className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Copy className="w-6 h-6 text-[#83c5be]" />
                  )}
                  <span className="text-sm font-bold text-[#83c5be] uppercase tracking-widest">
                    {copied ? "Copied to clipboard" : "copy code"}
                  </span>
                </div>
              </div>

              <div className="mt-12 space-y-8">
                <p className="text-2xl md:text-4xl font-one text-foreground leading-tight">
                  Use this code for a <span className="text-[#83c5be] font-two">30% DISCOUNT</span> on all plans.
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
      
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
