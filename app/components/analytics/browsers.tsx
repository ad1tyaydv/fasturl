"use client"

import { useMemo, useState } from "react"
import { Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const BROWSER_LOGOS: Record<string, string> = {
  chrome:  "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlechrome.svg",
  safari:  "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/safari.svg",
  firefox: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/firefox.svg",
  edge:    "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoftedge.svg",
  opera:   "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/opera.svg",
  brave:   "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/brave.svg",
  samsung: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/samsung.svg",
  ie:      "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/internetexplorer.svg",
  vivaldi: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/vivaldi.svg",
  arc:     "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/arc.svg",
}

const BROWSER_COLORS: Record<string, string> = {
  chrome:  "#4285F4",
  safari:  "#006CFF",
  firefox: "#FF7139",
  edge:    "#0078D4",
  opera:   "#FF1B2D",
  brave:   "#FB542B",
  samsung: "#1428A0",
  ie:      "#1EBBEE",
  vivaldi: "#EF3939",
  arc:     "#FCBFBD",
}

const BROWSER_FAVICON_DOMAINS: Record<string, string> = {
  chrome:  "google.com/chrome",
  safari:  "apple.com",
  firefox: "firefox.com",
  edge:    "microsoft.com/edge",
  opera:   "opera.com",
  brave:   "brave.com",
  samsung: "samsung.com",
  ie:      "microsoft.com",
  vivaldi: "vivaldi.com",
  arc:     "arc.net",
}

const getBrowserKey = (browser: string): string | null => {
  const name = browser.toLowerCase()
  if (name.includes("chrome") && !name.includes("chromium")) return "chrome"
  if (name.includes("safari") && !name.includes("chrome")) return "safari"
  if (name.includes("firefox")) return "firefox"
  if (name.includes("edge")) return "edge"
  if (name.includes("opera")) return "opera"
  if (name.includes("brave")) return "brave"
  if (name.includes("samsung")) return "samsung"
  if (name.includes("ie") || name.includes("internet explorer")) return "ie"
  if (name.includes("vivaldi")) return "vivaldi"
  if (name.includes("arc")) return "arc"
  return null
}

function BrowserLogo({ browser, size = "md" }: { browser: string; size?: "sm" | "md" }) {
  const key = getBrowserKey(browser)
  const domain = key ? BROWSER_FAVICON_DOMAINS[key] : null
  const color = key ? BROWSER_COLORS[key] : "#737373"
  const iconUrl = domain
    ? `https://icons.duckduckgo.com/ip3/${domain.split("/")[0]}.ico`
    : null

  const dim = size === "sm" ? "w-7 h-7 rounded-md" : "w-9 h-9 rounded-xl"
  const imgSize = size === "sm" ? 18 : 22

  if (!iconUrl) {
    return (
      <div className={`${dim} flex items-center justify-center bg-neutral-900`}>
        <Globe className="w-4 h-4 text-neutral-500" />
      </div>
    )
  }

  return (
    <div
      className={`${dim} flex items-center justify-center flex-shrink-0`}
      style={{ backgroundColor: `${color}15` }}
    >
      <img
        src={iconUrl}
        alt={browser}
        width={imgSize}
        height={imgSize}
        className="rounded-sm object-contain"
        onError={(e) => {
          const target = e.currentTarget
          const parent = target.parentElement
          if (parent) {
            parent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737373" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
          }
        }}
      />
    </div>
  )
}

interface BrowserAnalyticsProps {
  data?: any[]
  days?: number
}

export default function BrowserAnalytics({ data = [], days = 7 }: BrowserAnalyticsProps) {
  const [showModal, setShowModal] = useState(false)

  const allData = useMemo(() => {
    if (!data || data.length === 0) return []

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    cutoffDate.setHours(0, 0, 0, 0)

    const browserCounts: Record<string, number> = {}

    data.forEach((item: any) => {
      if (item.createdAt) {
        const itemDate = new Date(item.createdAt)
        if (itemDate < cutoffDate) return
      }
      const browserName = item.browser || "Unknown"
      const count = item.count !== undefined ? item.count : 1
      browserCounts[browserName] = (browserCounts[browserName] || 0) + count
    })

    return Object.entries(browserCounts)
      .map(([browser, count]) => ({ browser, count }))
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
              <span>Browsers</span>
              <span>Clicks</span>
            </div>

            <div className="flex flex-col gap-5">
              {top5.length > 0 ? (
                top5.map((item, index) => (
                  <div key={index} className="group flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BrowserLogo browser={item.browser} />
                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                          {item.browser}
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
              View All
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
                Browsers
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
                        <BrowserLogo browser={item.browser} size="sm" />
                        <span className="text-sm text-neutral-300">{item.browser}</span>
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
