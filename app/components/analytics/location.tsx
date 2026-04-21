"use client"
import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import ReactCountryFlag from "react-country-flag"
import { HugeiconsIcon } from '@hugeicons/react'
import { EarthIcon } from '@hugeicons/core-free-icons'
import { IoCloseOutline } from "react-icons/io5"

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
                Countries
              </h2>
              <div className="flex gap-6 text-xs uppercase tracking-widest text-neutral-500 font-three">
                <span>Visitors</span>
                <span>%</span>
              </div>
            </div>

            <div className="px-6 py-4 flex flex-col gap-1 max-h-[380px] overflow-y-auto">
              {sortedData.length > 0 ? (
                sortedData.map((item, index) => {
                  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-7 h-7 flex items-center justify-center bg-neutral-900 rounded-md flex-shrink-0">
                          <FlagIcon country={item.country} />
                        </div>
                        <span className="text-sm text-neutral-300">{item.country}</span>
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
