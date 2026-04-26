"use client";

import Link from "next/link";
import {
  IoLayersOutline, 
  IoListOutline, 
  IoKeyOutline,
} from "react-icons/io5";
import { motion } from "framer-motion";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Analytics01Icon, ArrowRightDoubleIcon, QrCodeIcon }
  from '@hugeicons/core-free-icons';
import { useUser } from "./userContext";

interface FasturlFeaturesProps {
  isLoggedIn: boolean;
  userPlan: string;
}


export default function Features({ isLoggedIn }: FasturlFeaturesProps) {
  const { user } = useUser();

  const features = [
    {
      title: "Advanced Link Analytics & Real-Time Tracking",
      desc: "Understand your audience better with powerful and easy-to-use link analytics. Track every click and see details like browser, device, operating system, and where your traffic is coming from. Get clear insights with location tracking and referrer data. Your dashboard shows everything in one place, helping you see what works and what doesn't. Use these insights to improve your links and optimize your pages for better results and higher conversions.",
      icon: <HugeiconsIcon icon={Analytics01Icon} size={48} />,
      image: "/fasturl_analytics.png",
      path: "/analytics",
      color: "bg-blue-600 hover:bg-blue-700",
      bgLight: "bg-blue-500/5",
      border: "border-blue-900/20",
      accent: "text-blue-500",
      buttonText: "Explore Analytics"
    },
    {
      title: "Bulk URL Shortener & Mass Management",
      desc: "Scale your operations effortlessly with our high-speed batch link shortener. Shorten multiple links instantly by uploading a CSV or pasting a list, saving you hours of manual work. This mass url shortener tool is perfect for enterprise url shortener needs, allowing you to manage and track thousands of digital marketing links from a single interface.",
      icon: <IoLayersOutline size={48} />,
      image: "/fasturl_bulk.png",
      path: "/bulklinks",
      color: "bg-purple-600 hover:bg-purple-700",
      bgLight: "bg-purple-500/5",
      border: "border-purple-900/20",
      accent: "text-purple-500",
      buttonText: "Shorten in Bulk"
    },
    {
      title: "Dynamic QR Code Generation",
      desc: "Make your QR codes smarter and more useful. Create QR codes in seconds and link them to short URLs that you can update anytime. Even after printing, you stay in control of where users land. Perfect for menus, packaging, posters, and more - just scan and connect instantly.",
      icon: <HugeiconsIcon icon={QrCodeIcon} size={48} />,
      image: "/fasturl_qrCodes.png",
      path: "/qr",
      color: "bg-emerald-600 hover:bg-emerald-700",
      bgLight: "bg-emerald-500/5",
      border: "border-emerald-900/20",
      accent: "text-emerald-500",
      buttonText: "Create QR Codes"
    },
    {
      title: "Professional Link Management Platform",
      desc: "Take full control of your links with a simple and powerful link management platform. Easily create, edit, and organize your short links in one place. Add features like password protection and link expiry to keep your links secure and under control. Customize your links with your brand name to keep everything consistent and professional.",
      icon: <IoListOutline size={48} />,
      image: "/fasturl_linkmanagement.png",
      path: "/links?types=links",
      color: "bg-orange-600 hover:bg-orange-700",
      bgLight: "bg-orange-500/5",
      border: "border-orange-900/20",
      accent: "text-orange-500",
      buttonText: "Manage Your Links"
    },
    {
      title: "Developer API & Programmable Links",
      desc: "Easily add link shortening to your own apps with our developer-friendly API. Create short links, manage redirects, and get real-time analytics—all through simple API calls. It's built to handle high traffic, so you can scale without worry. Perfect for SaaS apps, CRMs, and marketing tools, our API helps you automate workflows and keep everything running smoothly.",
      icon: <IoKeyOutline size={48} />,
      image: "/fasturl_apikeys.png",
      path: "/apikeys",
      color: "bg-pink-600 hover:bg-pink-700",
      bgLight: "bg-pink-500/5",
      border: "border-pink-900/20",
      accent: "text-pink-500",
      buttonText: "Explore API"
    },
  ];

  
  return (
    <section className="py-24 px-6 bg-[#141414] border-t border-neutral-800 transition-colors duration-300 overflow-hidden font-one">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-three font-bold mb-6 text-white tracking-tight">Everything You Need to <span className="text-red-500">Scale</span></h2>
          <p className="text-neutral-400 font-one text-lg max-w-2xl mx-auto">Powerful link management tools and enterprise-grade analytics designed to help you track your brand's reach and engagement across the globe.</p>
        </div>

        <div className="space-y-48">
          {features.map((f, i) => (
            <div 
              key={i} 
              className={`flex flex-col lg:items-center gap-12 lg:gap-20 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
            >
              <motion.div 
                initial={{ x: i % 2 === 0 ? -60 : 60, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                  duration: 1, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1
                }}
                className="flex-1 space-y-6"
              >
                <div className={`inline-flex p-3 rounded-2xl ${f.bgLight} ${f.accent} mb-2 shadow-sm`}>
                  {f.icon}
                </div>
                <h3 className="text-3xl font-one font-bold text-white leading-tight">{f.title}</h3>
                <p className="text-lg text-neutral-400 font-three leading-relaxed">
                  {f.desc}
                </p>
                <div className="pt-4">
                  <Link
                    href={!isLoggedIn ? "/auth/signin" : user?.plan === "FREE" ? "/premium" : f.path}
                    className={`px-6 py-2.5 text-white font-bold inline-flex items-center justify-center gap-3 cursor-pointer transition-all hover:scale-105 active:scale-95 rounded-lg text-sm shadow-lg ${f.color}`}
                  >
                    {f.buttonText} <HugeiconsIcon icon={ArrowRightDoubleIcon} />
                  </Link>
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: i % 2 === 0 ? 60 : -60, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                  duration: 1, 
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex-1 relative flex justify-center"
              >
                <div className={`absolute -inset-4 rounded-3xl opacity-20 blur-2xl ${f.bgLight} transition-all duration-500 group-hover:opacity-30`}></div>
                <motion.div 
                  whileHover={{ 
                    rotateY: i % 2 === 0 ? 2 : -2,
                    rotateX: 1,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className={`relative aspect-video bg-[#1a1a1a] border ${f.border} rounded-2xl overflow-hidden shadow-2xl group cursor-pointer w-full max-w-[480px]`}
                  style={{ perspective: 1000 }}
                >
                  <img 
                    src={f.image} 
                    alt={f.title}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500"></div>
                </motion.div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}