"use client";

import { useRouter } from "next/navigation";
import {
  IoLayersOutline, 
  IoListOutline, 
} from "react-icons/io5";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Analytics01Icon, ArrowRightDoubleIcon, QrCodeIcon }
  from '@hugeicons/core-free-icons';

interface FasturlFeaturesProps {
  isLoggedIn: boolean;
  userPlan: string;
}


export default function Features({ isLoggedIn, userPlan }: FasturlFeaturesProps) {
  const router = useRouter();

  const handleAccess = (path: string) => {
    if (!isLoggedIn) {
      router.push("/auth/signin");
      return;
    }
    if (userPlan === "FREE") {
      router.push("/premium");
      return;
    }
    router.push(path);
  };


  const features = [
    {
      title: "Detailed Link Analytics",
      desc: "Track every click with geographic data and device info.",
      icon: <HugeiconsIcon icon={Analytics01Icon} size={28} />,
      path: "/analytics",
      color: "bg-blue-600 hover:bg-blue-700",
      border: "border-blue-900/30",
    },
    {
      title: "Bulk Short URLs",
      desc: "Shorten hundreds of links at once via CSV upload.",
      icon: <IoLayersOutline size={28} />,
      path: "/bulklinks",
      color: "bg-purple-600 hover:bg-purple-700",
      border: "border-purple-900/30",
    },
    {
      title: "QR Code Generation",
      desc: "Create custom QR codes for every shortened link.",
      icon: <HugeiconsIcon icon={QrCodeIcon} size={28} />,
      path: "/qr",
      color: "bg-emerald-600 hover:bg-emerald-700",
      border: "border-emerald-900/30",
    },
    {
      title: "Link Management",
      desc: "Organize, edit, and delete your links in one dashboard.",
      icon: <IoListOutline size={28} />,
      path: "/links?types=links",
      color: "bg-orange-600 hover:bg-orange-700",
      border: "border-orange-900/30",
    },
  ];

  
  return (
    <section className="py-20 px-4 bg-[#141414] border-t border-neutral-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-three font-bold mb-3 text-white">Fasturl Plan Includes</h2>
          <p className="text-neutral-400 font-one">Premium tools to help you manage and track your brand's reach.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className={`bg-[#1c1c1c] border ${f.border} p-8 flex flex-col rounded-none shadow-sm transition-all hover:shadow-lg hover:-translate-y-1`}>
              <div className="text-white mb-4">
                {f.icon}
              </div>
              <h3 className="text-xl font-one font-bold mb-2 text-white">{f.title}</h3>
              <p className="text-sm text-neutral-400 font-three mb-8 flex-1 leading-relaxed">
                {f.desc}
              </p>
              <button
                onClick={() => handleAccess(f.path)}
                className={`w-full py-4 text-white font-one flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.97] rounded-none ${f.color}`}
              >
                Access Feature <HugeiconsIcon icon={ArrowRightDoubleIcon} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}