"use client"
import { useMemo, useState } from "react"
import { MonitorSmartphone, X } from "lucide-react"
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
  return <MonitorSmartphone className="w-4 h-4 text-muted-foreground" />
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
      <Card className="bg-transparent text-foreground w-full h-full flex flex-col border-none shadow-none">
        <CardContent className="px-6 flex-1 flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between text-[15px] uppercase tracking-[0.15em] font-three text-muted-foreground">
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
                          <div className="p-2 bg-secondary rounded-lg">
                            {getDeviceIcon(deviceName)}
                          </div>
                          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors capitalize">
                            {deviceName}
                          </span>
                        </div>
                        <span className="text-sm font-bold tabular-nums text-foreground">
                          {item.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )
                })
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
                Devices
              </h2>
              <p className="text-muted-foreground text-xs font-three uppercase tracking-widest">
                Full breakdown of device usage
              </p>
            </div>

            <div className="px-8 py-4 border-y border-border/50 flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground font-three">
              <span>Device</span>
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
                      <div className="p-2 bg-secondary rounded-lg flex-shrink-0">
                        {getDeviceIcon(item.device)}
                      </div>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors capitalize">{item.device}</span>
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
