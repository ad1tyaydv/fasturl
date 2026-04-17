"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

const OS_LOGOS: Record<string, string> = {
  windows: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg",
  "windows 10": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg",
  "windows 11": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg",
  macos: "https://cdn.simpleicons.org/apple/ffffff",
  "mac os": "https://cdn.simpleicons.org/apple/ffffff",
  ios: "https://cdn.simpleicons.org/apple/ffffff",
  ipados: "https://cdn.simpleicons.org/apple/ffffff",
  android: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/android/android-original.svg",
  linux: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
  ubuntu: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ubuntu/ubuntu-plain.svg",
  debian: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/debian/debian-original.svg",
  fedora: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fedora/fedora-original.svg",
  centos: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/centos/centos-original.svg",
  "red hat": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redhat/redhat-original.svg",
  chrome: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/chrome/chrome-original.svg",
  chromeos: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/chrome/chrome-original.svg",
  freebsd: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/freebsd/freebsd-original.svg",
  openbsd: "https://upload.wikimedia.org/wikipedia/en/e/ef/OpenBSD_logo.svg",
}

const OS_COLORS: Record<string, string> = {
  windows: "#0078D4",
  "windows 10": "#0078D4",
  "windows 11": "#0078D4",
  macos: "#ffffff",
  "mac os": "#ffffff",
  ios: "#ffffff",
  ipados: "#ffffff",
  android: "#3DDC84",
  linux: "#FCC624",
  ubuntu: "#E95420",
  debian: "#A81D33",
  fedora: "#294172",
  centos: "#262C3C",
  "red hat": "#CC0000",
  chrome: "#4285F4",
  chromeos: "#4285F4",
  freebsd: "#AB2B1C",
  openbsd: "#FD6500",
}

const getOSKey = (os: string): string | null => {
  const name = os?.toLowerCase().trim() || ""
  if (OS_LOGOS[name]) return name
  if (name.includes("windows")) return "windows"
  if (
    name.includes("mac") || name.includes("macos") || name.includes("mac os") ||
    name.includes("os x") || name.includes("darwin") || name.includes("ios") ||
    name.includes("ipados") || name.includes("apple")
  ) return "macos"
  if (name.includes("android")) return "android"
  if (name.includes("linux")) return "linux"
  if (name.includes("ubuntu")) return "ubuntu"
  if (name.includes("debian")) return "debian"
  if (name.includes("fedora")) return "fedora"
  if (name.includes("centos") || name.includes("rhel")) return "centos"
  if (name.includes("red hat")) return "red hat"
  if (name.includes("chrome")) return "chrome"
  if (name.includes("freebsd")) return "freebsd"
  if (name.includes("openbsd")) return "openbsd"
  return null
}

function OSLogo({ os, size = "md" }: { os: string; size?: "sm" | "md" }) {
  const key = getOSKey(os)
  const src = key ? OS_LOGOS[key] : null
  const color = key ? OS_COLORS[key] : "#737373"
  const dim = size === "sm" ? "w-7 h-7 rounded-md" : "w-9 h-9 rounded-xl"
  const imgSize = size === "sm" ? 18 : 22

  if (!src) {
    return (
      <div
        className={`${dim} flex items-center justify-center text-xs font-bold flex-shrink-0`}
        style={{ backgroundColor: "#2a2a2a", color: "#737373" }}
      >
        ?
      </div>
    )
  }

  return (
    <div
      className={`${dim} flex items-center justify-center flex-shrink-0`}
      style={{ backgroundColor: `${color}20` }}
    >
      <img
        src={src}
        alt={os}
        width={imgSize}
        height={imgSize}
        className="object-contain"
        onError={(e) => {
          const target = e.currentTarget
          const parent = target.parentElement
          if (parent) {
            parent.innerHTML = `<span style="font-size: 12px; font-weight: bold; color: ${color};">●</span>`
          }
        }}
      />
    </div>
  )
}

interface OSAnalyticsProps {
  data?: any[]
  days?: number
}

export default function OSAnalytics({ data = [], days = 7 }: OSAnalyticsProps) {
  const [showModal, setShowModal] = useState(false)

  const allData = useMemo(() => {
    if (!data || data.length === 0) return []

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    cutoffDate.setHours(0, 0, 0, 0)

    const osCounts: Record<string, number> = {}

    data.forEach((item: any) => {
      if (item.createdAt) {
        const itemDate = new Date(item.createdAt)
        if (itemDate < cutoffDate) return
      }
      const osName = item.os || item.operatingSystem || "Unknown"
      const count = item.count !== undefined ? item.count : 1
      osCounts[osName] = (osCounts[osName] || 0) + count
    })

    return Object.entries(osCounts)
      .map(([os, count]) => ({ os, count }))
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
              <span>Operating System</span>
              <span>Clicks</span>
            </div>

            <div className="flex flex-col gap-5">
              {top5.length > 0 ? (
                top5.map((item, index) => {
                  const osName = item.os || "Unknown"
                  return (
                    <div key={index} className="group flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <OSLogo os={osName} />
                          <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                            {osName}
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
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-neutral-800">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-white font-three">
                Operating Systems
              </h2>
              <div className="flex gap-6 text-xs uppercase tracking-widest text-neutral-500 font-three">
                <span>Clicks</span>
                <span>%</span>
              </div>
            </div>

            <div className="px-6 py-4 flex flex-col gap-1 max-h-[380px] overflow-y-auto">
              {allData.length > 0 ? (
                allData.map((item, index) => {
                  const osName = item.os || "Unknown"
                  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <OSLogo os={osName} size="sm" />
                        <span className="text-sm text-neutral-300">{osName}</span>
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
