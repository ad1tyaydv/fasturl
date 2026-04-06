"use client"

import { useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import ReactCountryFlag from "react-country-flag"

import { HugeiconsIcon } from '@hugeicons/react';
import { 
  GlobeXIcon, SmartPhone02Icon, Tablet02Icon }
  from '@hugeicons/core-free-icons';

const getCountryFlag = (country: string) => {
  const map: Record<string, string> = {
    "united states": "US",
    "united states of america": "US",
    "usa": "US",
    "india": "IN",
    "brazil": "BR",
    "canada": "CA",
    "united kingdom": "GB",
    "uk": "GB",
    "germany": "DE",
    "france": "FR",
    "china": "CN",
    "japan": "JP",
  }

  return map[country?.toLowerCase()] || "🌍"
}

interface CountryAnalyticsProps {
  data?: any[];
  days?: number;
}

export default function CountryAnalytics({ data = [], days = 7 }: CountryAnalyticsProps) {
  
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);

    const countryCounts: Record<string, number> = {};

    data.forEach((item: any) => {
      if (item.createdAt) {
        const itemDate = new Date(item.createdAt);
        if (itemDate < cutoffDate) return;
      }

      const countryName = item.country || "Unknown";
      const count = item.count !== undefined ? item.count : 1; 

      countryCounts[countryName] = (countryCounts[countryName] || 0) + count;
    });

  
    return Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data, days]);


  const maxCount = useMemo(() => 
    sortedData.length > 0 ? Math.max(...sortedData.map(d => d.count)) : 0, 
    [sortedData]
  )


  return (
    <Card className="bg-transparent text-white w-full h-full flex flex-col border-none shadow-none">
      
      <CardContent className="px-6 flex-1 flex flex-col">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between text-[15px] uppercase tracking-[0.15em] font-three">
            <span>Location</span>
            <span>Visitors</span>
          </div>

          <div className="flex flex-col gap-5">
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => {
                return (
                  <div key={index} className="group flex flex-col gap-2">
                    <div className="flex items-center justify-between transition-transform">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-neutral-900 rounded-lg">
                          <span className="text-base leading-none">
                            <ReactCountryFlag
                              countryCode={getCountryFlag(item.country)}
                              svg
                              style={{
                                width: "18px",
                                height: "18px",
                              }}
                            />
                          </span>
                        </div>
                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                          {item.country}
                        </span>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-white">
                        {item.count.toLocaleString()}
                      </span>
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