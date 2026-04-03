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
  if (ref === "direct" || ref === "") 
    return <Globe className="w-4 h-4 text-neutral-400" />;
    
  return <Globe className="w-4 h-4 text-neutral-500" />;
};

interface ReferrerAnalyticsProps {
  data?: { referrer: string; count: number }[];
}

export default function ReferrerAnalytics({ data = [] }: ReferrerAnalyticsProps) {
  
  const sortedData = useMemo(() => {
    return [...data]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data]);


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
                return (
                  <div key={index} className="group flex flex-col gap-2">
                    <div className="flex items-center justify-between transition-transform duration-200 group-hover:translate-x-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-900 rounded-lg group-hover:bg-neutral-800 transition-colors">
                          {getReferrerIcon(item.referrer)}
                        </div>
                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors capitalize">
                          {item.referrer || "Direct / Internal"}
                        </span>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-white">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="h-[3px] w-full bg-neutral-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500/80 transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-neutral-600 italic">
                No referral data recorded
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