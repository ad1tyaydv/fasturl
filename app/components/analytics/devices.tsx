"use client"
import { useMemo, useState } from "react"
import { MonitorSmartphone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { HugeiconsIcon } from '@hugeicons/react'
import { ComputerVideoIcon, SmartPhone02Icon, Tablet02Icon } from '@hugeicons/core-free-icons'

const getDeviceIcon = (device: string) => {
  const type = device?.toLowerCase() || ""
  if (type.includes("desktop") || type.includes("windows") || type.includes("mac"))
    return <HugeiconsIcon icon={ComputerVideoIcon} size={20} />
  if (type.includes("mobile") || type.includes("iphone") || type.includes("android"))
    return <HugeiconsIcon icon={SmartPhone02Icon} />
  if (type.includes("tablet") || type.includes("ipad"))
    return <HugeiconsIcon icon={Tablet02Icon} />
  return <MonitorSmartphone className="w-4 h-4 text-neutral-500" />
}

interface DeviceAnalyticsProps {
  data?: any[]
  days?: number
}

export default function DeviceAnalytics({ data = [], days = 7 }: DeviceAnalyticsProps) {
  const [showModal, setShowModal] = useState(false)

  const allData = useMemo(() => {
    if (!data || data.length === 0) return []

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    cutoffDate.setHours(0, 0, 0, 0)

    const deviceCounts: Record<string, number> = {}

    data.forEach((item: any) => {
      if (item.createdAt) {
        const itemDate = new Date(item.createdAt)
        if (itemDate < cutoffDate) return
      }
      const deviceName = item.device || item.devices || "Unknown"
      const count = item.count !== undefined ? item.count : 1
      deviceCounts[deviceName] = (deviceCounts[deviceName] || 0) + count
    })

    return Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }))
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
              <span>Device Type</span>
              <span>Clicks</span>
            </div>

            <div className="flex flex-col gap-5">
              {top5.length > 0 ? (
                top5.map((item, index) => {
                  const deviceName = item.device || "Unknown"
                  return (
                    <div key={index} className="group flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-neutral-900 rounded-lg">
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
                    </div>
                  )
                })
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
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-neutral-800">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-white font-three">
                Devices
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
                  const deviceName = item.device || "Unknown"
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-1.5 bg-neutral-900 rounded-md flex-shrink-0">
                          {getDeviceIcon(deviceName)}
                        </div>
                        <span className="text-sm text-neutral-300 capitalize">{deviceName}</span>
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
