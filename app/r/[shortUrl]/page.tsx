"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { HourglassIcon, SparklesIcon, Link04Icon } from "@hugeicons/core-free-icons";

const MovableCharacter = ({ char, index }: { char: string; index: number }) => {
  return (
    <motion.span
      initial={{ y: 0 }}
      animate={{
        y: [0, -8, 0, -4, 0],
        rotate: [0, -2, 2, -1, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.1,
      }}
      className="inline-block"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
};

export default function RedirectPage() {
  const params = useParams();
  const shortUrl = params.shortUrl as string;

  const [redirectTo, setRedirectTo] = useState("");
  const [count, setCount] = useState(3);
  const redirectText = "REDIRECTING";

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const res = await fetch(`/api/redirect/${shortUrl}`);
        const data = await res.json();
        setRedirectTo(data.url);

        setTimeout(() => {
          if (data.url) window.location.href = data.url;
        }, 3500);

      } catch (error) {
        console.error("Redirect failed", error);
      }
    };

    fetchUrl();
  }, [shortUrl]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
    
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0] text-[#2D2926] p-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#D4A373] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] bg-[#CCD5AE] rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-xl w-full"
      >
        <div className="absolute -inset-2 border-2 border-[#2D2926] rounded-[40px] rotate-1 pointer-events-none opacity-10" />
        <div className="absolute -inset-1 border border-[#2D2926] rounded-[30px] -rotate-1 pointer-events-none opacity-20" />

        <div className="relative bg-[#FFFEFA] border-2 border-[#2D2926] rounded-3xl p-10 md:p-16 shadow-[12px_12px_0px_0px_rgba(45,41,38,1)]">
          
          <div className="flex justify-center mb-8">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="relative"
            >
              <HugeiconsIcon icon={HourglassIcon} size={80} strokeWidth={1} className="text-[#BC6C25]" />
              <motion.div
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                className="absolute -top-2 -right-2"
              >
                <HugeiconsIcon icon={SparklesIcon} className="text-[#D4A373]" />
              </motion.div>
            </motion.div>
          </div>

          <div className="text-center mb-6">
            <div className="text-4xl md:text-6xl font-black tracking-tighter mb-4 flex justify-center overflow-hidden font-serif">
              {redirectText.split("").map((char, i) => (
                <MovableCharacter key={i} char={char} index={i} />
              ))}
            </div>
            
            <div className="flex flex-col items-center gap-2">
               <h2 className="text-xl font-medium italic opacity-80">
                You are being redirected to:
              </h2>
               <div className="flex items-center gap-2 bg-[#FEFAE0] border border-[#2D2926]/10 px-4 py-2 rounded-full mt-2">
                 <HugeiconsIcon icon={Link04Icon} size={16} className="text-[#BC6C25]" />
                 <span className="text-sm font-mono truncate max-w-[200px] md:max-w-xs text-[#5E5B54]">
                   {redirectTo || "fetching link..."}
                 </span>
               </div>
            </div>
          </div>

          <div className="max-w-sm mx-auto text-center mb-10">
            <p className="text-[#5E5B54] leading-relaxed text-lg font-serif">
              {count === 0 
                ? "Redirecting now..." 
                : `Redirecting in ${count} second${count !== 1 ? 's' : ''}.`}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => (window.location.href = redirectTo)}
              disabled={!redirectTo}
              className="group relative px-8 py-3 bg-[#2D2926] text-[#FFFEFA] rounded-xl font-bold transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] shadow-[4px_4px_0px_0px_rgba(188,108,37,1)] hover:shadow-[6px_6px_0px_0px_rgba(188,108,37,1)] disabled:opacity-50"
            >
              Go Now
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-[#2D2926]/10 text-center">
            <div className="inline-flex items-center gap-2 text-sm tracking-widest uppercase opacity-40 font-sans">
              <div className="w-8 h-[1px] bg-[#2D2926]" />
              FastURL
              <div className="w-8 h-[1px] bg-[#2D2926]" />
            </div>
          </div>

        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-6 -left-4 w-16 h-16 bg-[#FEFAE0] border border-[#2D2926]/20 rounded-lg -rotate-12 shadow-sm hidden md:block"
        />
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-6 -right-4 w-12 h-12 bg-[#E9EDC9] border border-[#2D2926]/20 rounded-full rotate-12 shadow-sm hidden md:block"
        />
      </motion.div>
    </div>
  );
}