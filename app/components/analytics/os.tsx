"use client"

import { useMemo } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

const OS_LOGOS: Record<string, string> = {
  windows: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg",
  "windows 10": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg",
  "windows 11": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg",
  macos: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apple/apple-original.svg",
  "mac os": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apple/apple-original.svg",
  ios: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apple/apple-original.svg",
  ipados: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apple/apple-original.svg",
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
  macos: "#000000",
  "mac os": "#000000",
  ios: "#000000",
  ipados: "#000000",
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
  if (name.includes("mac") || name.includes("ios") || name.includes("apple") || name.includes("darwin")) return "macos"
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

function OSLogo({ os }: { os: string }) {
  const key = getOSKey(os)
  const src = key ? OS_LOGOS[key] : null
  const color = key ? OS_COLORS[key] : "#737373"

  if (!src) {
    return (
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: "#2a2a2a", color: "#737373" }}
      >
        ?
      </div>
    )
  }

  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: `${color}20` }}
    >
      <img
        src={src}
        alt={os}
        width={22}
        height={22}
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
  const sortedData = useMemo(() => {
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
      .slice(0, 5)
  }, [data, days])

  const maxCount = useMemo(
    () => (sortedData.length > 0 ? Math.max(...sortedData.map((d) => d.count)) : 0),
    [sortedData]
  )

  return (
    <Card className="bg-transparent text-white w-full h-full flex flex-col border-none shadow-none">
      <CardContent className="px-6 flex-1 flex flex-col">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between text-[15px] uppercase tracking-[0.15em] font-three">
            <span>Operating System</span>
            <span>Clicks</span>
          </div>

          <div className="flex flex-col gap-5">
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => {
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
          <button className="w-full py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-white/5 rounded-xl transition-all border border-neutral-800/50 cursor-pointer">
            View all
          </button>
        </div>
      </CardContent>
    </Card>
  )
}