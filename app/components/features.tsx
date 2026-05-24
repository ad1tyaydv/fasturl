"use client";

import {
  IoFlashOutline,
  IoShareSocialOutline,
  IoShieldCheckmarkOutline,
  IoStatsChartOutline,
  IoWarningOutline,
  IoPhonePortraitOutline,
} from "react-icons/io5";

interface FasturlFeaturesProps {
  isLoggedIn: boolean;
  userPlan?: string;
}

export default function Features({}: FasturlFeaturesProps) {

  const features = [
    {
      title: "Instant & Effortless",
      desc: "Transform clunky, long URLs into compact links instantly. No complex steps required.",
      icon: <IoFlashOutline size={22} />,
      iconBg: "bg-orange-100 dark:bg-orange-500/10",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Compact & Distributable",
      desc: "Create perfectly sized links that look clean and are incredibly easy to drop into any social post or message.",
      icon: <IoShareSocialOutline size={22} />,
      iconBg: "bg-blue-100 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Encrypted & Safe",
      desc: "Every generated link routes through industry-standard encryption, keeping your data and user privacy completely locked down.",
      icon: <IoShieldCheckmarkOutline size={22} />,
      iconBg: "bg-purple-100 dark:bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Live Analytics",
      desc: "Monitor your link performance as it happens. Get instant access to click rates, locations, and device types.",
      icon: <IoStatsChartOutline size={22} />,
      iconBg: "bg-pink-100 dark:bg-pink-500/10",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
    {
      title: "Malware Protection",
      desc: "Built-in filters automatically detect and block malicious destinations, ensuring your audience always lands safely.",
      icon: <IoWarningOutline size={22} />,
      iconBg: "bg-emerald-100 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Cross-Platform Ready",
      desc: "Manage and generate links flawlessly whether you are at your desktop or on the move with your smartphone.",
      icon: <IoPhonePortraitOutline size={22} />,
      iconBg: "bg-amber-100 dark:bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <section className="py-24 px-6 bg-background font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground tracking-tight">
            Fast, simple and secure link shortening

          </h2>
          <p className="text-muted-foreground text-semibold md:text-lg max-w-3xl mx-auto">
            Shorten long URLs into clean, fast, and shareable links. Create reliable short links with analytics, quick redirects, and an easy-to-use experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-full ${f.iconBg} ${f.iconColor} flex items-center justify-center mb-6`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}