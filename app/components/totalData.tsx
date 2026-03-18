"use client";

import { IoLinkOutline, IoQrCodeOutline, IoStatsChartOutline } from "react-icons/io5";

interface StatsProps {
  totalLinks: number;
  totalQrs: number;
  totalClicks: number;
}

export default function TotalData({ totalLinks, totalQrs, totalClicks }: StatsProps) {
  const stats = [
    {
      label: "Total Links",
      value: totalLinks,
      icon: <IoLinkOutline size={28} className="text-blue-500" />,
      description: "Successfully shortened and active"
    },
    {
      label: "QR Codes",
      value: totalQrs,
      icon: <IoQrCodeOutline size={28} className="text-purple-500" />,
      description: "Scannable assets generated"
    },
    {
      label: "Total Clicks",
      value: totalClicks,
      icon: <IoStatsChartOutline size={28} className="text-green-500" />,
      description: "Real-time engagement tracked"
    }
  ];


  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-16">
      <div className="flex flex-col items-center mb-12 text-center">
        <p className="text-2xl md:text-3xl font-one font-one text-foreground">
          Total Links, QR and Clicks are tracked live
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="relative bg-card border-2 border-border p-8 flex flex-col items-center text-center transition-all duration-300 group hover:border-primary hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]"
          >

            <div className="mb-6 p-4 bg-secondary rounded-none">
              {stat.icon}
            </div>

            <div className="space-y-1">
              <h3 className="text-5xl font-bold font-one tracking-tighter">
                {stat.value.toLocaleString()}
              </h3>
              <p className="text-2xl font-one uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border w-full">
              <p className="text-sm text-muted-foreground font-three italic">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center mt-10 text-xl text-muted-foreground font-two">
        Stats are updated every time a link is visited. 
        <span className="text-primary font-bold">Live.</span>
      </p>
    </section>
  );
}