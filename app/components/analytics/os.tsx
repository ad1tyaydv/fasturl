"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"

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
  macos: "currentColor",
  "mac os": "currentColor",
  ios: "currentColor",
  ipados: "currentColor",
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
  const color = key ? OS_COLORS[key] : "currentColor"
  const dim = size === "sm" ? "w-7 h-7 rounded-md" : "w-9 h-9 rounded-xl"
  const imgSize = size === "sm" ? 18 : 22

  if (!src) {
    return (
      <div
        className={`${dim} flex items-center justify-center text-xs font-bold flex-shrink-0 bg-secondary text-muted-foreground`}
      >
        ?
      </div>
    )
  }

  return (
    <div
      className={`${dim} flex items-center justify-center flex-shrink-0`}
      style={{ backgroundColor: color === 'currentColor' ? 'hsl(var(--secondary))' : `${color}20` }}
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
      <Card className="bg-transparent text-foreground w-full h-full flex flex-col border-none shadow-none">
        <CardContent className="px-6 flex-1 flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between text-[15px] uppercase tracking-[0.15em] font-three text-muted-foreground">
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
                          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                            {osName}
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
                Operating Systems
              </h2>
              <p className="text-muted-foreground text-xs font-three uppercase tracking-widest">
                Full breakdown of user operating systems
              </p>
            </div>

            <div className="px-8 py-4 border-y border-border/50 flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground font-three">
              <span>OS</span>
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
                      <OSLogo os={item.os} />
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.os}</span>
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
