"use client"
import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import ReactCountryFlag from "react-country-flag"
import { HugeiconsIcon } from '@hugeicons/react'
import { EarthIcon } from '@hugeicons/core-free-icons'
import { X } from "lucide-react"

const getCountryFlag = (country: string): string | null => {
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
  return map[country?.toLowerCase()] || null
}

interface CountryAnalyticsProps {
  data?: any[]
  days?: number
}

export default function LocationAnalytics({ data = [], days = 7 }: CountryAnalyticsProps) {
  const [showModal, setShowModal] = useState(false)

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return []

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    cutoffDate.setHours(0, 0, 0, 0)

    const countryCounts: Record<string, number> = {}

    data.forEach((item: any) => {
      if (item.createdAt) {
        const itemDate = new Date(item.createdAt)
        if (itemDate < cutoffDate) return
      }
      const countryName = item.country || "Unknown"
      const count = item.count !== undefined ? item.count : 1
      countryCounts[countryName] = (countryCounts[countryName] || 0) + count
    })

    return Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
  }, [data, days])

  const top5 = sortedData.slice(0, 5)
  const total = sortedData.reduce((sum, d) => sum + d.count, 0)

  const FlagIcon = ({ country }: { country: string }) => {
    const code = getCountryFlag(country)
    return code ? (
      <ReactCountryFlag countryCode={code} svg style={{ width: "18px", height: "18px" }} />
    ) : (
      <HugeiconsIcon icon={EarthIcon} size={22} className="text-neutral-400" />
    )
  }

  return (
    <>
      <Card className="bg-transparent text-white w-full h-full flex flex-col border-none shadow-none">
        <CardContent className="px-6 flex-1 flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between text-[15px] uppercase tracking-[0.15em] font-three">
              <span>Location</span>
              <span>Visitors</span>
            </div>

            <div className="flex flex-col gap-5">
              {top5.length > 0 ? (
                top5.map((item, index) => (
                  <div key={index} className="group flex flex-col gap-2">
                    <div className="flex items-center justify-between transition-transform">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-neutral-900 rounded-lg">
                          <FlagIcon country={item.country} />
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
                Locations
              </h2>
              <p className="text-neutral-500 text-xs font-three uppercase tracking-widest">
                Full breakdown of visitor locations
              </p>
            </div>

            <div className="px-8 py-4 border-y border-neutral-800/50 flex justify-between text-[11px] font-bold uppercase tracking-widest text-neutral-500 font-three">
              <span>Country</span>
              <div className="flex gap-10">
                <span>Visitors</span>
                <span className="w-10 text-right">%</span>
              </div>
            </div>

            <div className="px-4 py-2 flex flex-col gap-1 max-h-[450px] overflow-y-auto custom-scrollbar">
              {sortedData.map((item, index) => {
                const pct = total > 0 ? Math.round((item.count / total) * 100) : 0
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 px-4 rounded-2xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-8 h-8 flex items-center justify-center bg-neutral-900 rounded-lg flex-shrink-0">
                        <FlagIcon country={item.country} />
                      </div>
                      <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{item.country}</span>
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
               <span className="text-white font-bold">{total.toLocaleString()} visitors</span>
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
