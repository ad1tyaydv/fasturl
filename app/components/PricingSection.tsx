"use client";

import { useRouter } from "next/navigation";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";

export default function PricingSection() {
  const router = useRouter();
  
  const Check = () => <IoCheckmarkOutline className="text-green-500 font-bold inline-block ml-2" size={22} />;
  const Cross = () => <IoCloseOutline className="text-red-500 font-bold inline-block ml-2" size={22} />;

  
  return (
    <section className="px-4 sm:px-8 py-12 md:py-20 max-w-6xl mx-auto flex flex-col items-center">
      <div className="text-center max-w-2xl mb-10">
        <h2 className="text-3xl font-one sm:text-4xl font-extrabold mb-4 leading-tight">
          Unlock the Full Potential of Your Links
        </h2>
        <p className="text-muted-foreground font-two text-base">
          Stop guessing and start tracking. deliver the insights you need to grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl items-stretch text-foreground">
        
        <div className="border border-border rounded-xl p-6 bg-card flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="text-center border-b border-border pb-4 mb-5">
            <h3 className="text-2xl font-bold tracking-wide">FREE</h3>
            <p className="text-3xl font-extrabold mt-2">$0</p>
          </div>
          <div className="flex-1 space-y-3 text-base sm:text-lg font-medium">
            <p>20 links/day <Check /></p>
            <p>2 QR Code/day <Check /></p>
            
            <div className="pt-4 border-t border-border/50">
              <p className="mb-2 font-bold text-sm uppercase text-muted-foreground tracking-wider">Track:</p>
              <div className="space-y-2">
                <p>clicks <Check /> Location <Check /></p>
                <p className="">browsers <Cross /> Operating System <Cross /></p>
                <p className="">Devices <Cross /> Top Referrers <Cross /></p>
                <br/>
                <p className="">Custom short URLs <Cross /></p>
                <p className="">Custom Domains <Cross /></p>
                <p className="">password protection / expiry <Cross /></p>
              </div>
            </div>
          </div>
          <button 
            className="mt-8 w-full px-6 border border-border bg-transparent py-2.5 rounded-lg text-base font-three transition hover:bg-accent cursor-pointer"
            onClick={() => router.push("/")}
          >
            Start Free
          </button>
        </div>

        <div className="relative flex flex-col z-10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-one z-20 shadow-md">
            Recommended
          </div>
          <div className="border-2 border-primary rounded-xl p-6 bg-card flex flex-col h-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-center border-b border-border pb-4 mb-5 pt-2">
              <h3 className="text-2xl font-bold mb-1">Essentials</h3>
              <p className="text-4xl font-extrabold">$6<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            </div>
            <div className="flex-1 space-y-3 text-base sm:text-lg font-medium">
              <p>2000 links/mo <Check /></p>
              <p>100 QR Code/mon <Check /></p>
              
              <div className="pt-4 border-t border-border/50">
                <p className="mb-2 font-bold text-sm uppercase text-muted-foreground tracking-wider">Track:</p>
                <div className="space-y-2">
                    <p>clicks <Check /> Location <Check /></p>
                    <p className="">browsers <Check /> Operating System <Check /></p>
                    <p className="">Devices <Check /> Top Referrers <Check /></p>
                    <br/>
                    <p className="">Custom short URLs <Cross /></p>
                    <p className="">Custom Domains <Cross /></p>
                    <p className="">password protection / expiry <Cross /></p>
              </div>
              </div>
            </div>
            <button className="mt-8 w-full px-6 bg-primary text-primary-foreground py-2.5 rounded-lg text-base font-three transition hover:opacity-90 cursor-pointer shadow-sm">
              Upgrade
            </button>
          </div>
        </div>

        <div className="border border-border rounded-xl p-6 bg-card flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="text-center border-b border-border pb-4 mb-5">
            <h3 className="text-2xl font-three mb-1">PRO</h3>
            <p className="text-3xl font-extrabold mt-2">$30<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
          </div>
          <div className="flex-1 space-y-3 text-base sm:text-lg font-medium">
            <p>20000 links/mo <Check /></p>
            <p>1000 QR Code/mo <Check /></p>

            <div className="pt-4 border-t border-border/50"></div>

            <p className="mb-2 font-bold text-sm uppercase text-muted-foreground tracking-wider">Track:</p>
            <p>clicks <Check /> Location <Check /></p>
                <p className="">browsers <Check /> Operating System <Check /></p>
                <p className="">Devices <Check /> Top Referrers <Check /></p>
                <br/>
                <p className="">Custom short URLs <Check /></p>
                <p className="">Custom Domains <Check /></p>
                <p className="">password protection / expiry <Check /></p>
          </div>
          <button className="mt-8 w-full px-6 border border-border bg-secondary text-secondary-foreground py-2.5 rounded-lg text-base font-three transition hover:bg-secondary/80 cursor-pointer">
            Upgrade
          </button>
        </div>
      </div>
    </section>
  );
}