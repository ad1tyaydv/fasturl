"use client"

import { useMemo } from "react"
import { 
  Chrome, 
  Compass, 
  Globe, 
  Wind, 
  Layers,
  Layout
} from "lucide-react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"


const getBrowserIcon = (browser: string) => {
  const name = browser.toLowerCase();
  if (name.includes("chrome")) return <Chrome className="w-4 h-4 text-amber-500" />;
  if (name.includes("safari")) return <Compass className="w-4 h-4 text-blue-500" />;
  if (name.includes("firefox")) return <Wind className="w-4 h-4 text-orange-500" />;
  if (name.includes("edge")) return <Layout className="w-4 h-4 text-sky-600" />;
  if (name.includes("opera")) return <Layers className="w-4 h-4 text-red-600" />;
  if (name.includes("brave")) return <Globe className="w-4 h-4 text-orange-400" />;
  return <Globe className="w-4 h-4 text-neutral-500" />;
};


interface BrowserAnalyticsProps {
  data?: any[];
  days?: number;
}

export default function BrowserAnalytics({ data = [], days = 7 }: BrowserAnalyticsProps) {
  
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);

    const browserCounts: Record<string, number> = {};

    data.forEach((item: any) => {
      if (item.createdAt) {
        const itemDate = new Date(item.createdAt);
        if (itemDate < cutoffDate) return;
      }

      const browserName = item.browser || "Unknown";
    
      const count = item.count !== undefined ? item.count : 1; 

      browserCounts[browserName] = (browserCounts[browserName] || 0) + count;
    });


    return Object.entries(browserCounts)
      .map(([browser, count]) => ({ browser, count }))
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
            <span>Source</span>
            <span>Clicks</span>
          </div>

          <div className="flex flex-col gap-5">
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => {
                const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                const browserName = item.browser;

                return (
                  <div key={index} className="group flex flex-col gap-2">
                    <div className="flex items-center justify-between transition-transform duration-200 group-hover:translate-x-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-900 rounded-lg group-hover:bg-neutral-800 transition-colors">
                          {getBrowserIcon(browserName)}
                        </div>
                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                          {browserName}
                        </span>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-white">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="h-[3px] w-full bg-neutral-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500/80 transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-neutral-600 italic">
                No active session data for this period
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-8">
          <button 
            className="w-full py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-white/5 rounded-xl transition-all border border-neutral-800/50 cursor-pointer"
          >
            View All
          </button>
        </div>
      </CardContent>
    </Card>
  )
}