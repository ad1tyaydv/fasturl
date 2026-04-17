"use client"
import * as React from "react"
import { useMemo, useState } from "react"
import { Globe, Search, Instagram, Twitter, Facebook, Linkedin, MessageCircle } from "lucide-react"
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-neutral-800">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-white font-three">
                Referrers
              </h2>
              <div className="flex gap-6 text-xs uppercase tracking-widest text-neutral-500 font-three">
                <span>Clicks</span>
                <span>%</span>
              </div>
            </div>

            <div className="px-6 py-4 flex flex-col gap-1 max-h-[380px] overflow-y-auto">
              {allData.length > 0 ? (
                allData.map((item, index) => {
                  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-1.5 bg-neutral-900 rounded-md flex-shrink-0">
                          {getReferrerIcon(item.referrer)}
                        </div>
                        <span className="text-sm text-neutral-300">{item.referrer}</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm tabular-nums">
                        <span className="text-white font-bold">{item.count.toLocaleString()}</span>
                        <span className="text-neutral-500 w-10 text-right">{pct}%</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-12 text-center text-sm text-neutral-600 italic">
                  No data found
                </div>
              )}
            </div>

            <div className="px-6 pb-5 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 text-sm font-semibold text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-neutral-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
