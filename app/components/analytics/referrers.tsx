"use client"
import * as React from "react"
import { useMemo, useState } from "react"
import { Globe, Search, Instagram, Twitter, Facebook, Linkedin, MessageCircle, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const getReferrerIcon = (referrer: string, size = "w-4 h-4") => {
  const ref = referrer?.toLowerCase() || ""
  if (ref.includes("google") || ref.includes("bing") || ref.includes("yahoo"))
    return <Search className={`${size} text-blue-400`} />
  if (ref.includes("instagram"))
    return <Instagram className={`${size} text-pink-500`} />
  if (ref.includes("twitter") || ref.includes("x.com"))
    return <Twitter className={`${size} text-sky-400`} />
  if (ref.includes("facebook"))
    return <Facebook className={`${size} text-blue-600`} />
  if (ref.includes("linkedin"))
    return <Linkedin className={`${size} text-blue-700`} />
  if (ref.includes("whatsapp") || ref.includes("t.me"))
    return <MessageCircle className={`${size} text-green-500`} />
  return <Globe className={`${size} text-neutral-400`} />
}

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

  return (
    <>
      <Card className="bg-transparent text-white w-full h-full flex flex-col border-none shadow-none">
        <CardContent className="px-6 flex-1 flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between text-[15px] uppercase tracking-[0.15em] font-three">
              <span>Referrers</span>
              <span>Clicks</span>
            </div>

            <div className="flex flex-col gap-5">
              {top5.length > 0 ? (
                top5.map((item, index) => (
                  <div key={index} className="group flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-900 rounded-lg">
                          {getReferrerIcon(item.referrer)}
                        </div>
                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                          {item.referrer}
                        </span>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-white">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm text-neutral-600 italic">
                  No data found
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto pt-8">
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-white/5 rounded-xl transition-all border border-neutral-800/50 cursor-pointer"
            >
              View all
            </button>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#1c1c1c] border border-neutral-800 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-6 top-6 text-neutral-500 hover:text-white transition-colors cursor-pointer z-10"
            >
              <X size={24} />
            </button>

            <div className="px-8 pt-8 pb-6">
              <h2 className="text-2xl font-one font-bold text-white mb-1">
                Referrers
              </h2>
              <p className="text-neutral-500 text-xs font-three uppercase tracking-widest">
                Full breakdown of traffic referrers
              </p>
            </div>

            <div className="px-8 py-4 border-y border-neutral-800/50 flex justify-between text-[11px] font-bold uppercase tracking-widest text-neutral-500 font-three">
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
                    className="flex items-center justify-between py-3 px-4 rounded-2xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-neutral-900 rounded-lg flex-shrink-0">
                        {getReferrerIcon(item.referrer)}
                      </div>
                      <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{item.referrer}</span>
                    </div>
                    <div className="flex items-center gap-10 text-sm tabular-nums font-three">
                      <span className="text-white font-bold">{item.count.toLocaleString()}</span>
                      <span className="text-neutral-500 w-10 text-right">{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="p-6 bg-neutral-900/30 border-t border-neutral-800 flex justify-between items-center text-[11px] text-neutral-500 font-three uppercase tracking-widest">
               <span>Total Analytics</span>
               <span className="text-white font-bold">{total.toLocaleString()} clicks</span>
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
              background: #262626;
              border-radius: 10px;
            }
          `}</style>
        </div>
      )}
    </>
  )
}
