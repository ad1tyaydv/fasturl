import { useRouter } from "next/navigation";

import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Tick01Icon, Cancel01Icon, Mail01Icon }
  from '@hugeicons/core-free-icons';

import axios from "axios";
import { useState } from "react";


export default function Premium() {
  const router = useRouter();

  const [tier, setTier] = useState("FREE");


  const handlePayments = async () => {
    try {
      await axios.post("/api/payments", {
        tier: tier
      })

    } catch (error) {
      console.log("Error while handling payments")
    }
  }


  const Check = () => (
  <HugeiconsIcon icon={Tick01Icon} className="text-green-500 font-bold ml-2 shrink-0" size={25} />
  );
  const Cross = () => (
    <HugeiconsIcon icon={Cancel01Icon} className="text-red-500 font-bold ml-2 shrink-0" size={25} />
  );
  

  return (
    <section className="px-4 sm:px-8 py-12 md:py-20 max-w-6xl mx-auto flex flex-col items-center">
      <div className="text-center max-w-2xl mb-16">
        <h2 className="text-3xl font-one sm:text-5xl font-extrabold mb-4 leading-tight text-white">
          Unlock the Full Potential of Your Links
        </h2>
        <p className="text-neutral-400 font-one text-base sm:text-lg mb-2">
          Stop guessing and start tracking. Deliver the insights you need to grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl items-stretch text-white">
        
        <div className="border border-neutral-800 rounded-xl p-6 bg-[#1c1c1c] flex flex-col shadow-sm hover:shadow-lg hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300">
          <div className="text-center border-b border-neutral-800 pb-4 mb-5">
            <h3 className="text-2xl font-bold tracking-wide">FREE</h3>
            <p className="text-4xl font-light tracking-tight text-neutral-100 mt-2">₹0</p>
            <p className="text-xs text-neutral-400 mt-2">Perfect to get started</p>
          </div>
          <div className="flex-1 space-y-3 text-base sm:text-lg font-medium">
            <p className="flex items-center text-neutral-200"><span>20 links/day</span> <Check /></p>
            <p className="flex items-center text-neutral-200"><span>2 QR Code/day</span> <Check /></p>

            <div className="pt-4 border-t border-neutral-800/80">
              <p className="mb-3 font-bold text-sm uppercase text-neutral-400 tracking-wider">What you'll track:</p>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center whitespace-nowrap text-neutral-300">Clicks <Check /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-300">Location <Check /></span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center whitespace-nowrap text-neutral-500">Browsers <Cross /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-500">OS Details <Cross /></span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center whitespace-nowrap text-neutral-500">Devices <Cross /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-500">Top Referrers <Cross /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-500">⭐Bulk Create <Cross /></span>
                </div>
                <div className="pt-2 space-y-2 border-t border-neutral-800/80">
                  <p className="flex items-center justify-between text-neutral-500">⭐Custom URLs <Cross /></p>
                  <p className="flex items-center justify-between text-neutral-500">⭐Custom Domains <Cross /></p>
                  <p className="flex items-center justify-between text-neutral-500">⭐Security Options <Cross /></p>
                </div>
              </div>
            </div>
          </div>
          <button
            className="mt-8 w-full px-6 border border-neutral-700 bg-transparent py-2.5 rounded-lg text-base font-three transition hover:bg-[#2a2a2a] cursor-pointer text-white font-medium"
            onClick={() => router.push("/")}
          >
            Start Free
          </button>
          <p className="text-xs text-neutral-500 text-center mt-3">No credit card required</p>
        </div>
        

        <div className="relative flex flex-col z-10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-one z-20 shadow-md font-semibold">
            ⭐ Recommended
          </div>
          <div className="border-2 border-blue-600 rounded-xl p-6 bg-[#1c1c1c] flex flex-col h-full shadow-lg hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300">
            <div className="text-center border-b border-neutral-800 pb-4 mb-5 pt-2">
              <h3 className="text-2xl font-bold mb-1">Essentials</h3>
              <p className="text-xs text-neutral-400 mb-2">Most popular choice</p>
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className="text-lg line-through text-neutral-500 decoration-1">1200</span>
                <p className="text-5xl font-light">₹300<span className="text-sm font-normal text-neutral-500">/month</span></p>
              </div>
            </div>
            <div className="flex-1 space-y-3 text-base sm:text-lg font-medium">
              <p className="flex items-center text-neutral-200"><span>20,000 links/month</span> <Check /></p>
              <p className="flex items-center text-neutral-200"><span>200 QR Codes/month</span> <Check /></p>

              <div className="pt-4 border-t border-neutral-800/80">
                <p className="mb-3 font-bold text-sm uppercase text-neutral-400 tracking-wider">Advanced tracking:</p>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="flex items-center whitespace-nowrap text-neutral-300">Clicks <Check /></span>
                    <span className="flex items-center whitespace-nowrap text-neutral-300">Location <Check /></span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="flex items-center whitespace-nowrap text-neutral-300">Browsers <Check /></span>
                    <span className="flex items-center whitespace-nowrap text-neutral-300">OS Details <Check /></span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="flex items-center whitespace-nowrap text-neutral-300">Devices <Check /></span>
                    <span className="flex items-center whitespace-nowrap text-neutral-300">Top Referrers <Check /></span>
                    <span className="flex items-center whitespace-nowrap text-neutral-300">⭐Bulk Create <Check /></span>
                  </div>
                  <div className="pt-2 space-y-2 border-t border-neutral-800/80">
                    <p className="flex items-center justify-between text-neutral-500">⭐Custom URLs <Cross /></p>
                    <p className="flex items-center justify-between text-neutral-500">⭐Custom Domains <Cross /></p>
                    <p className="flex items-center justify-between text-neutral-500">⭐Security Options <Cross /></p>
                  </div>
                </div>
              </div>
            </div>
            <button className="mt-8 w-full px-6 bg-blue-600 text-white py-2.5 rounded-lg text-base font-three transition hover:bg-blue-700 cursor-pointer shadow-sm font-medium">
              Upgrade Now
            </button>
            <p className="text-xs text-neutral-500 text-center mt-3">Switch anytime. Cancel without hassle.</p>
          </div>
        </div>

        <div className="border border-neutral-800 rounded-xl p-6 bg-[#1c1c1c] flex flex-col shadow-sm hover:shadow-lg hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300">
          <div className="text-center border-b border-neutral-800 pb-4 mb-5">
            <h3 className="text-2xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">PRO</h3>
            <p className="text-xs text-neutral-400 mb-2">For power users</p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="text-lg line-through text-neutral-500 decoration-1">₹5600</span>
              <p className="text-5xl font-light">₹1200<span className="text-sm font-normal text-neutral-500">/month</span></p>
            </div>
          </div>
          <div className="flex-1 space-y-3 text-base sm:text-lg font-medium">
            <p className="flex items-center text-neutral-200"><span>40,000 links/month</span> <Check /></p>
            <p className="flex items-center text-neutral-200"><span>2,000 QR Codes/month</span> <Check /></p>

            <div className="pt-4 border-t border-neutral-800/80">
              <p className="mb-3 font-bold text-sm uppercase text-neutral-400 tracking-wider">Full feature set:</p>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center whitespace-nowrap text-neutral-300">Clicks <Check /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-300">Location <Check /></span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center whitespace-nowrap text-neutral-300">Browsers <Check /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-300">OS Details <Check /></span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center whitespace-nowrap text-neutral-300">Devices <Check /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-300">Top Referrers <Check /></span>
                  <span className="flex items-center whitespace-nowrap text-neutral-300">⭐Bulk Create <Check /></span>
                </div>
                <div className="pt-2 space-y-2 border-t border-neutral-800/80">
                  <p className="flex items-center justify-between text-neutral-300">⭐Custom URLs <Check /></p>
                  <p className="flex items-center justify-between text-neutral-300">⭐Custom Domains <Check /></p>
                  <p className="flex items-center justify-between text-neutral-300">⭐Security Options <Check /></p>
                </div>
              </div>
            </div>
          </div>
          <button className="mt-8 w-full px-6 bg-white text-black py-2.5 rounded-lg text-base font-three transition hover:bg-gray-200 cursor-pointer font-bold">
            Upgrade Now
          </button>
          <p className="text-xs text-neutral-500 text-center mt-3">Full power unlocked</p>
        </div>
        
      </div>

      <div className="mt-16 text-center max-w-2xl">
        <p className="text-neutral-500 text-sm flex items-center justify-center gap-2">
          <HugeiconsIcon icon={Mail01Icon} />
          <span>
            Need help choosing?{" "}
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=fasturl@tutamail.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Contact our team
            </a>
          </span>
        </p>
      </div>
    </section>
  );
}