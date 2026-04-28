"use client"

import { useMemo, useState } from "react"
import { Globe, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

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
  const color = key ? BROWSER_COLORS[key] : "currentColor"
  const iconUrl = domain
    ? `https://icons.duckduckgo.com/ip3/${domain.split("/")[0]}.ico`
    : null

  const dim = size === "sm" ? "w-7 h-7 rounded-md" : "w-9 h-9 rounded-xl"
  const imgSize = size === "sm" ? 18 : 22

  if (!iconUrl) {
    return (
      <div className={`${dim} flex items-center justify-center bg-secondary`}>
        <Globe className="w-4 h-4 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div
      className={`${dim} flex items-center justify-center flex-shrink-0`}
      style={{ backgroundColor: color === 'currentColor' ? 'hsl(var(--secondary))' : `${color}15` }}
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
            parent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
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
      <Card className="bg-transparent text-foreground w-full h-full flex flex-col border-none shadow-none">
        <CardContent className="px-6 flex-1 flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between text-[15px] uppercase tracking-[0.15em] font-three text-muted-foreground">
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
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          {item.browser}
                        </span>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-foreground">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
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
              View All
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
                Browsers
              </h2>
              <p className="text-muted-foreground text-xs font-three uppercase tracking-widest">
                Full breakdown of traffic sources
              </p>
            </div>

            <div className="px-8 py-4 border-y border-border/50 flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground font-three">
              <span>Browser</span>
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
                      <BrowserLogo browser={item.browser} />
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.browser}</span>
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
