"use client"

import * as React from "react"
import { useMemo } from "react"
import { 
  Globe, 
  Search, 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin, 
  MessageCircle 
} from "lucide-react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

const getReferrerIcon = (referrer: string) => {
  const ref = referrer?.toLowerCase() || "";
  if (ref.includes("google") || ref.includes("bing") || ref.includes("yahoo")) 
    return <Search className="w-4 h-4 text-blue-400" />;
  if (ref.includes("instagram")) 
    return <Instagram className="w-4 h-4 text-pink-500" />;
  if (ref.includes("twitter") || ref.includes("x.com")) 
    return <Twitter className="w-4 h-4 text-sky-400" />;
  if (ref.includes("facebook")) 
    return <Facebook className="w-4 h-4 text-blue-600" />;
  if (ref.includes("linkedin")) 
    return <Linkedin className="w-4 h-4 text-blue-700" />;
  if (ref.includes("whatsapp") || ref.includes("t.me")) 
    return <MessageCircle className="w-4 h-4 text-green-500" />;
  if (ref === "direct" || ref === "direct / internal" || ref === "") 
    return <Globe className="w-4 h-4 text-neutral-400" />;
    
  return <Globe className="w-4 h-4 text-neutral-500" />;
};

interface ReferrerAnalyticsProps {
  data?: any[];
  days?: number;
}

export default function ReferrerAnalytics({ data = [], days = 7 }: ReferrerAnalyticsProps) {
  
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);

    const referrerCounts: Record<string, number> = {};

    data.forEach((item: any) => {
      if (item.createdAt) {
        const itemDate = new Date(item.createdAt);
        if (itemDate < cutoffDate) return;
      }

      const referrerName = item.referrer ? item.referrer : "Direct / Internal";
      const count = item.count !== undefined ? item.count : 1; 

      referrerCounts[referrerName] = (referrerCounts[referrerName] || 0) + count;
    });

    return Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
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
            <span>Referrers</span>
            <span>Clicks</span>
          </div>

          <div className="flex flex-col gap-5">
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => {
                
                return (
                  <div key={index} className="group flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-900 rounded-lg">
                          {getReferrerIcon(item.referrer)}
                        </div>
                        <span className="text-sm font-medium">
                          {item.referrer}
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