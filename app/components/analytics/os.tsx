"use client"

import { useMemo } from "react"
import { 
  Monitor, 
  Smartphone, 
  Apple, 
  Layout, 
  Terminal,
} from "lucide-react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

const getOSIcon = (os: string) => {
  const name = os?.toLowerCase() || "";
  if (name.includes("windows")) 
    return <Layout className="w-4 h-4 text-blue-500" />;
  if (name.includes("mac") || name.includes("ios") || name.includes("apple") || name.includes("darwin")) 
    return <Apple className="w-4 h-4 text-neutral-300" />;
  if (name.includes("android")) 
    return <Smartphone className="w-4 h-4 text-emerald-500" />;
  if (name.includes("linux") || name.includes("ubuntu") || name.includes("debian")) 
    return <Terminal className="w-4 h-4 text-orange-500" />;
    
  return <Monitor className="w-4 h-4 text-neutral-500" />;
};

interface OSAnalyticsProps {
  data?: any[];
  days?: number;
}

export default function OSAnalytics({ data = [], days = 7 }: OSAnalyticsProps) {
  
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);

    const osCounts: Record<string, number> = {};

    data.forEach((item: any) => {
      if (item.createdAt) {
        const itemDate = new Date(item.createdAt);
        if (itemDate < cutoffDate) return;
      }

      const osName = item.os || item.operatingSystem || "Unknown";
      const count = item.count !== undefined ? item.count : 1; 

      osCounts[osName] = (osCounts[osName] || 0) + count;
    });

    return Object.entries(osCounts)
      .map(([os, count]) => ({ os, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data, days]);

  const maxCount = useMemo(() => 
    sortedData.length > 0 ? Math.max(...sortedData.map(d => d.count)) : 0, 
    [sortedData]
  );

  return (
    <Card className="bg-transparent text-white w-full h-full flex flex-col border-none shadow-none">
      
      <CardContent className="px-6 flex-1 flex flex-col">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between text-[15px] uppercase tracking-[0.15em] font-three">
            <span>OS</span>
            <span>Clicks</span>
          </div>

          <div className="flex flex-col gap-5">
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => {
                const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                const osName = item.os || "Unknown";

                return (
                  <div key={index} className="group flex flex-col gap-2">
                    <div className="flex items-center justify-between transition-transform duration-200 group-hover:translate-x-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-900 rounded-lg group-hover:bg-neutral-800 transition-colors">
                          {getOSIcon(osName)}
                        </div>
                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                          {osName}
                        </span>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-white">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="h-[3px] w-full bg-neutral-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sky-400/80 transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-neutral-600 italic">
                No data found
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-8">
          <button className="w-full py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-white/5 rounded-xl transition-all border border-neutral-800/50 cursor-pointer">
            View all
          </button>
        </div>
      </CardContent>
    </Card>
  )
}