"use client";
import { HourglassIcon, SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'framer-motion';
import { Hourglass, Sparkles } from 'lucide-react';

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


const App = () => {
  const expiredText = "EXPIRED";
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0] text-[#2D2926] p-6 overflow-hidden font-serif">
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
              <HugeiconsIcon icon={HourglassIcon} size= {80} strokeWidth={1} className="text-[#BC6C25]" />
              <motion.div
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                className="absolute -top-2 -right-2"
              >
                <HugeiconsIcon icon={SparklesIcon} className="text-[#D4A373]" />
              </motion.div>
            </motion.div>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl md:text-8xl font-black tracking-tighter mb-2 flex justify-center overflow-hidden">
              {expiredText.split("").map((char, i) => (
                <MovableCharacter key={i} char={char} index={i} />
              ))}
            </div>
            <h2 className="text-xl md:text-2xl font-medium italic opacity-80">
              This moment has passed.
            </h2>
          </div>

          <div className="max-w-sm mx-auto text-center mb-10">
            <p className="text-[#5E5B54] leading-relaxed text-lg">
              The link you are looking for has returned to the digital dust. 
              It was set to expire, and its time was served well.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-[#2D2926]/10 text-center">
            <div className="inline-flex items-center gap-2 text-sm font-one tracking-widest uppercase opacity-40">
              <div className="w-8 h-[1px] bg-[#2D2926]" />
              FastURL
              <div className="w-8 h-[1px] bg-[#2D2926]" />
            </div>
            <p className="text-[10px] mt-2 opacity-30 font-one italic">Crafted with care for fleeting moments.</p>
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
};

export default App;