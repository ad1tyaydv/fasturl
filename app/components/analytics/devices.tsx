"use client"

import { useMemo } from "react"
import { MonitorSmartphone } from "lucide-react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ComputerVideoIcon, SmartPhone02Icon, Tablet02Icon }
  from '@hugeicons/core-free-icons';

const getDeviceIcon = (device: string) => {
  const type = device?.toLowerCase() || "";
  if (type.includes("desktop") || type.includes("windows") || type.includes("mac")) 
    return <HugeiconsIcon icon={ComputerVideoIcon} size={20} />
  if (type.includes("mobile") || type.includes("iphone") || type.includes("android")) 
    return <HugeiconsIcon icon={SmartPhone02Icon} />
  if (type.includes("tablet") || type.includes("ipad")) 
    return <HugeiconsIcon icon={Tablet02Icon} />
    
  return <MonitorSmartphone className="w-4 h-4 text-neutral-500" />;
};


interface DeviceAnalyticsProps {
  data?: any[];
  days?: number;
}

export default function DeviceListAnalytics({ data = [], days = 7 }: DeviceAnalyticsProps) {

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);

    const deviceCounts: Record<string, number> = {};

    data.forEach((item: any) => {
      if (item.createdAt) {
        const itemDate = new Date(item.createdAt);
        if (itemDate < cutoffDate) return;
      }

      const deviceName = item.device || item.devices || "Unknown";
      const count = item.count !== undefined ? item.count : 1; 

      deviceCounts[deviceName] = (deviceCounts[deviceName] || 0) + count;
    });

    return Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }))
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
            <span>Device Type</span>
            <span>Clicks</span>
          </div>

          <div className="flex flex-col gap-5">
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => {
                const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                const deviceName = item.device || "Unknown";

                return (
                  <div key={index} className="group flex flex-col gap-2">
                    <div className="flex items-center justify-between transition-transform duration-200 group-hover:translate-x-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-900 rounded-lg group-hover:bg-neutral-800 transition-colors">
                          {getDeviceIcon(deviceName)}
                        </div>
                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors capitalize">
                          {deviceName}
                        </span>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-white">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="h-[3px] w-full bg-neutral-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500/80 transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-neutral-600 italic">
                No active device data for this period
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-8">
          <button 
            className="w-full py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-white/5 rounded-xl transition-all border border-neutral-800/50 cursor-pointer"
          >
            View all
          </button>
        </div>
      </CardContent>
    </Card>
  )
}