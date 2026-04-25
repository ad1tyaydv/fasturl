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


export default function Features({ isLoggedIn, userPlan }: FasturlFeaturesProps) {
  const { user } = useUser();

  const features = [
    {
      title: "Advanced Link Analytics & Real-Time Tracking",
      desc: "Gain deep insights into your audience with our comprehensive url shortener with analytics. Track every click in real-time and discover exactly where your traffic is coming from with geo tracking for links. Our dashboard provides detailed browser analytics for links and device tracking url data, allowing you to optimize your destination pages for maximum conversion. Understand your referral sources to see which social media link shortener campaigns are driving the most engagement.",
      icon: <HugeiconsIcon icon={Analytics01Icon} size={48} />,
      image: "/fasturl_analytics.png",
      path: "/analytics",
      color: "bg-blue-600 hover:bg-blue-700",
      bgLight: "bg-blue-500/5",
      border: "border-blue-900/20",
      accent: "text-blue-500"
    },
    {
      title: "Bulk URL Shortener & Mass Management",
      desc: "Scale your operations effortlessly with our high-speed batch link shortener. Shorten multiple links instantly by uploading a CSV or pasting a list, saving you hours of manual work. This mass url shortener tool is perfect for enterprise url shortener needs, allowing you to manage and track thousands of digital marketing links from a single interface. Use bulk link analytics to compare the performance of different campaigns and identify your highest-performing assets.",
      icon: <IoLayersOutline size={48} />,
      image: "/fasturl_bulk.png",
      path: "/bulklinks",
      color: "bg-purple-600 hover:bg-purple-700",
      bgLight: "bg-purple-500/5",
      border: "border-purple-900/20",
      accent: "text-purple-500"
    },
    {
      title: "Dynamic QR Code Generation",
      desc: "Bridge the gap between offline and online marketing with our integrated short link generator and QR code tool. Every QR code is dynamically linked to a shorten url, meaning you can update the destination link even after the QR code is printed. This smart link shortener feature is ideal for restaurant menus, business cards, and print ads. Track every scan with the same precision as your digital links, getting full location and device analytics for every physical interaction.",
      icon: <HugeiconsIcon icon={QrCodeIcon} size={48} />,
      image: "/fasturl_qrCodes.png",
      path: "/qr",
      color: "bg-emerald-600 hover:bg-emerald-700",
      bgLight: "bg-emerald-500/5",
      border: "border-emerald-900/20",
      accent: "text-emerald-500"
    },
    {
      title: "Professional Link Management Platform",
      desc: "Take absolute control of your digital presence with our professional link management platform. Organize, edit, and secure your links with advanced features like password protected links and link expiration tools. Our dashboard allows you to manage custom short links and branded links with ease, ensuring your brand stays consistent across all platforms. Use it as a marketing link shortener to add UTM parameters and track your campaign performance across Twitter, Instagram, and YouTube.",
      icon: <IoListOutline size={48} />,
      image: "/fasturl_linkmanagement.png",
      path: "/links?types=links",
      color: "bg-orange-600 hover:bg-orange-700",
      bgLight: "bg-orange-500/5",
      border: "border-orange-900/20",
      accent: "text-orange-500"
    },
    {
      title: "Developer API & Programmable Links",
      desc: "Integrate powerful link shortening capabilities directly into your own applications with our developer friendly api. Our robust link shortening api allows you to programmatically create short links, manage redirects, and fetch real time analytics api data for your internal dashboards. Designed for scalability, our rest api for url shortening supports high-volume link tracking and integration-ready workflows for SaaS platforms, CRMs, and automated marketing tools.",
      icon: <IoKeyOutline size={48} />,
      image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=1000",
      path: "/apikeys",
      color: "bg-pink-600 hover:bg-pink-700",
      bgLight: "bg-pink-500/5",
      border: "border-pink-900/20",
      accent: "text-pink-500"
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
              {/* Feature Text */}
              <motion.div 
                initial={{ x: i % 2 === 0 ? -150 : 150, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex-1 space-y-6"
              >
                <div className={`inline-flex p-3 rounded-2xl ${f.bgLight} ${f.accent} mb-2`}>
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
                    Get Started with {f.title.split(' ')[0]} <HugeiconsIcon icon={ArrowRightDoubleIcon} />
                  </Link>
                </div>
              </motion.div>

              {/* Feature Image Container */}
              <motion.div 
                initial={{ x: i % 2 === 0 ? 150 : -150, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex-1 relative"
              >
                <div className={`absolute -inset-4 rounded-3xl opacity-20 blur-2xl ${f.bgLight}`}></div>
                <div className={`relative aspect-video bg-[#1a1a1a] border ${f.border} rounded-3xl overflow-hidden shadow-2xl`}>
                  <img 
                    src={f.image} 
                    alt={f.title}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  
                  {/* Overlay for branding consistency */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-40"></div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}