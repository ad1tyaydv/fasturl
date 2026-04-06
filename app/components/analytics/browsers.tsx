"use client"

import { useMemo } from "react"
import { Globe } from "lucide-react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"


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


function BrowserIcon({ browser }: { browser: string }) {
  const key = getBrowserKey(browser)
  const src = key ? BROWSER_LOGOS[key] : null
  const color = key ? BROWSER_COLORS[key] : "#737373"

  if (!src) {
    return (
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: "#171717" }}
      >
        <Globe className="w-4 h-4 text-neutral-500" />
      </div>
    )
  }


  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: `${color}18` }}
    >
      <img
        src={src}
        alt={browser}
        width={18}
        height={18}
        style={{
          filter: `invert(1) sepia(1) saturate(5) hue-rotate(0deg)`,
        }}
        className="browser-icon"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none"
        }}
      />
    </div>
  )
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


function BrowserLogo({ browser }: { browser: string }) {
  const key = getBrowserKey(browser)
  const domain = key ? BROWSER_FAVICON_DOMAINS[key] : null
  const color = key ? BROWSER_COLORS[key] : "#737373"

  const iconUrl = domain
    ? `https://icons.duckduckgo.com/ip3/${domain.split("/")[0]}.ico`
    : null

  if (!iconUrl) {
    return (
      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-neutral-900">
        <Globe className="w-4 h-4 text-neutral-500" />
      </div>
    )
  }

  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: `${color}15` }}
    >
      <img
        src={iconUrl}
        alt={browser}
        width={22}
        height={22}
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
  const sortedData = useMemo(() => {
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
            <span>Browsers</span>
            <span>Clicks</span>
          </div>

          <div className="flex flex-col gap-5">
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
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
          <button className="w-full py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-white/5 rounded-xl transition-all border border-neutral-800/50 cursor-pointer">
            View All
          </button>
        </div>
      </CardContent>
    </Card>
  )
}