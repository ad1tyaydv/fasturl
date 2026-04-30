"use client"
import { useMemo, useState } from "react"
import { Globe, Search, Instagram, Twitter, Facebook, Linkedin, MessageCircle, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"


const getDomain = (url: string) => {
  try {
    if (!url || url === "Direct / Internal") return "";
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    return domain.replace('www.', '');

  } catch {
    return url;
  }
};

const getLogo = (urlStr: string) => {
  const domain = getDomain(urlStr);
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
};

interface ReferrerAnalyticsProps {
  data?: any[]
  days?: number
}

export default function ReferrerAnalytics({ data = [], days = 7 }: ReferrerAnalyticsProps) {
  const [showModal, setShowModal] = useState(false)

  const allData = useMemo(() => {
    if (!data || data.length === 0) return []

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    cutoffDate.setHours(0, 0, 0, 0)

    const referrerCounts: Record<string, number> = {}

    data.forEach((item: any) => {
      if (item.createdAt) {
        const itemDate = new Date(item.createdAt)
        if (itemDate < cutoffDate) return
      }
      const referrerName = item.referrer ? item.referrer : "Direct / Internal"
      const count = item.count !== undefined ? item.count : 1
      referrerCounts[referrerName] = (referrerCounts[referrerName] || 0) + count
    })

    return Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
  }, [data, days])

  const top5 = allData.slice(0, 5)
  const total = allData.reduce((sum, d) => sum + d.count, 0)

  const ReferrerLogo = ({ referrer }: { referrer: string }) => {
    const logo = getLogo(referrer);
    
    if (logo) {
      return (
        <img 
          src={logo} 
          alt={referrer} 
          className="w-5 h-5 rounded-sm object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      );
    }

  };

  return (
    <>
      <Card className="bg-transparent text-foreground w-full h-full flex flex-col border-none shadow-none">
        <CardContent className="px-6 flex-1 flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between text-[15px] uppercase tracking-[0.15em] font-three text-muted-foreground">
              <span>Referrers</span>
              <span>Clicks</span>
            </div>

            <div className="flex flex-col gap-5">
              {top5.length > 0 ? (
                top5.map((item, index) => (
                  <div key={index} className="group flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-secondary rounded-lg overflow-hidden">
                          <ReferrerLogo referrer={item.referrer} />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[150px] sm:max-w-none">
                          {item.referrer}
                        </span>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-foreground">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground italic">
                  No data found
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto pt-8">
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-accent rounded-xl transition-all border border-border/50 cursor-pointer text-foreground"
            >
              View all
            </button>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-card border border-border rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors cursor-pointer z-10"
            >
              <X size={24} />
            </button>

            <div className="px-8 pt-8 pb-6">
              <h2 className="text-2xl font-one font-bold text-foreground mb-1">
                Referrers
              </h2>
              <p className="text-muted-foreground text-xs font-three uppercase tracking-widest">
                Full breakdown of traffic referrers
              </p>
            </div>

            <div className="px-8 py-4 border-y border-border/50 flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground font-three">
              <span>Referrer</span>
              <div className="flex gap-10">
                <span>Clicks</span>
                <span className="w-10 text-right">%</span>
              </div>
            </div>

            <div className="px-4 py-2 flex flex-col gap-1 max-h-[450px] overflow-y-auto custom-scrollbar">
              {allData.map((item, index) => {
                const pct = total > 0 ? Math.round((item.count / total) * 100) : 0
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 px-4 rounded-2xl hover:bg-accent transition-colors group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-8 h-8 flex items-center justify-center bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                        <ReferrerLogo referrer={item.referrer} />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[200px] sm:max-w-none">{item.referrer}</span>
                    </div>
                    <div className="flex items-center gap-10 text-sm tabular-nums font-three">
                      <span className="text-foreground font-bold">{item.count.toLocaleString()}</span>
                      <span className="text-muted-foreground w-10 text-right">{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="p-6 bg-secondary/30 border-t border-border flex justify-between items-center text-[11px] text-muted-foreground font-three uppercase tracking-widest">
               <span>Total Analytics</span>
               <span className="text-foreground font-bold">{total.toLocaleString()} clicks</span>
            </div>
          </div>
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: hsl(var(--muted-foreground) / 0.3);
              border-radius: 10px;
            }
          `}</style>
        </div>
      )}
    </>
  )
}
