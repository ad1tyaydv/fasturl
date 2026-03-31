"use client";

import { useRouter } from "next/navigation";

import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Tick01Icon, Cancel01Icon, RupeeIcon }
  from '@hugeicons/core-free-icons';

export default function PricingSection() {
  const router = useRouter();

  const Check = () => (
    <HugeiconsIcon icon={Tick01Icon} className="text-green-500 font-bold ml-2 shrink-0" size={25} />
  );
  const Cross = () => (
    <HugeiconsIcon icon={Cancel01Icon} className="text-red-500 font-bold ml-2 shrink-0" size={25} />
  );

  
  return (
    <section className="px-4 sm:px-8 py-12 md:py-20 max-w-6xl mx-auto flex flex-col items-center">
      <div className="text-center max-w-2xl mb-10">
        <h2 className="text-3xl font-one sm:text-4xl font-extrabold mb-4 leading-tight text-white">
          Unlock the Full Potential of Your Links
        </h2>
        <p className="text-neutral-400 font-two text-base">
          Stop guessing and start tracking. Deliver the insights you need to grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl items-stretch text-white">
        
        <div className="border border-neutral-800 rounded-xl p-6 bg-[#1c1c1c] flex flex-col shadow-sm hover:shadow-lg hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300">
          <div className="text-center border-b border-neutral-800 pb-4 mb-5">
            <h3 className="text-2xl font-bold tracking-wide">FREE</h3>
            <p className="text-3xl font-extrabold mt-2">₹0</p>
          </div>
          <div className="flex-1 space-y-3 text-base sm:text-lg font-medium">
            <p className="flex items-center">20 links/day <Check /></p>
            <p className="flex items-center">2 QR Code/day <Check /></p>

            <div className="pt-4 border-t border-neutral-800/80">
              <p className="mb-3 font-bold text-sm uppercase text-neutral-500 tracking-wider">Track:</p>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center whitespace-nowrap text-neutral-300">clicks <Check /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-300">Location <Check /></span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center whitespace-nowrap text-neutral-500">browsers <Cross /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-500">Operating System <Cross /></span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center whitespace-nowrap text-neutral-500">Devices <Cross /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-500">Top Referrers <Cross /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-500">⭐Bulk Link Creation <Cross /></span>
                </div>
                <div className="pt-2 space-y-2 border-t border-neutral-800/80">
                  <p className="flex items-center justify-between text-neutral-500">⭐Custom short URLs <Cross /></p>
                  <p className="flex items-center justify-between text-neutral-500">⭐Custom Domains <Cross /></p>
                  <p className="flex items-center justify-between text-neutral-500">⭐Password protection <Cross /></p>
                </div>
              </div>
            </div>
          </div>
          <button
            className="mt-8 w-full px-6 border border-neutral-700 bg-transparent py-2.5 rounded-lg text-base font-three transition hover:bg-[#2a2a2a] cursor-pointer text-white"
            onClick={() => router.push("/")}
          >
            Start Free
          </button>
        </div>

        <div className="relative flex flex-col z-10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-one z-20 shadow-md">
            Recommended
          </div>
          <div className="border-2 border-blue-600 rounded-xl p-6 bg-[#1c1c1c] flex flex-col h-full shadow-lg hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300">
            <div className="text-center border-b border-neutral-800 pb-4 mb-5 pt-2">
              <h3 className="text-2xl font-bold mb-1">Essentials</h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-3xl line-through text-red-500 decoration-2 decoration-red-500">₹1200</span>
                <p className="text-4xl font-extrabold">₹300<span className="text-sm font-normal text-neutral-400">/mo</span></p>
              </div>
            </div>
            <div className="flex-1 space-y-3 text-base sm:text-lg font-medium">
              <p className="flex items-center">20,000 links/mo <Check /></p>
              <p className="flex items-center">200 QR Code/mo <Check /></p>

              <div className="pt-4 border-t border-neutral-800/80">
                <p className="mb-3 font-bold text-sm uppercase text-neutral-500 tracking-wider">Track:</p>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="flex items-center whitespace-nowrap text-neutral-300">clicks <Check /></span>
                    <span className="flex items-center whitespace-nowrap text-neutral-300">Location <Check /></span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="flex items-center whitespace-nowrap text-neutral-300">browsers <Check /></span>
                    <span className="flex items-center whitespace-nowrap text-neutral-300">Operating System <Check /></span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="flex items-center whitespace-nowrap text-neutral-300">Devices <Check /></span>
                    <span className="flex items-center whitespace-nowrap text-neutral-300">Top Referrers <Check /></span>
                    <span className="flex items-center whitespace-nowrap text-neutral-300">⭐Bulk Link Creation <Check /></span>
                  </div>
                  <div className="pt-2 space-y-2 border-t border-neutral-800/80">
                    <p className="flex items-center justify-between text-neutral-500">⭐Custom short URLs <Cross /></p>
                    <p className="flex items-center justify-between text-neutral-500">⭐Custom Domains <Cross /></p>
                    <p className="flex items-center justify-between text-neutral-500">⭐Password protection <Cross /></p>
                  </div>
                </div>
              </div>
            </div>
            <button className="mt-8 w-full px-6 bg-blue-600 text-white py-2.5 rounded-lg text-base font-three transition hover:bg-blue-700 cursor-pointer shadow-sm">
              Upgrade
            </button>
          </div>
        </div>

        <div className="border border-neutral-800 rounded-xl p-6 bg-[#1c1c1c] flex flex-col shadow-sm hover:shadow-lg hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300">
          <div className="text-center border-b border-neutral-800 pb-4 mb-5">
            <h3 className="text-2xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">PRO</h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-3xl line-through text-red-500 decoration-2 decoration-red-500">₹5600</span>
              <p className="text-3xl font-extrabold">₹1200<span className="text-sm font-normal text-neutral-400">/mo</span></p>
            </div>
          </div>
          <div className="flex-1 space-y-3 text-base sm:text-lg font-medium">
            <p className="flex items-center">40,000 links/mo <Check /></p>
            <p className="flex items-center">2,000 QR Code/mo <Check /></p>

            <div className="pt-4 border-t border-neutral-800/80">
              <p className="mb-3 font-bold text-sm uppercase text-neutral-500 tracking-wider">Track:</p>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center whitespace-nowrap text-neutral-300">clicks <Check /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-300">Location <Check /></span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center whitespace-nowrap text-neutral-300">browsers <Check /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-300">Operating System <Check /></span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center whitespace-nowrap text-neutral-300">Devices <Check /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-300">Top Referrers <Check /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-300">⭐Bulk Link Creation <Check /></span>
                </div>
                <div className="pt-2 space-y-2 border-t border-neutral-800/80">
                  <p className="flex items-center justify-between text-neutral-300">⭐Custom short URLs <Check /></p>
                  <p className="flex items-center justify-between text-neutral-300">⭐Custom Domains <Check /></p>
                  <p className="flex items-center justify-between text-neutral-300">⭐Password protection <Check /></p>
                </div>
              </div>
            </div>
          </div>
          <button className="mt-8 w-full px-6 bg-white text-black py-2.5 rounded-lg text-base font-three transition hover:bg-gray-200 cursor-pointer font-bold">
            Upgrade
          </button>
        </div>
        
      </div>
    </section>
  );
}