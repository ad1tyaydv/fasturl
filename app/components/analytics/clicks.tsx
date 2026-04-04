"use client"

import * as React from "react"
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  total: { 
    label: "Clicks",
    color: "#3b82f6" 
  },
} satisfies ChartConfig

interface ClicksAnalyticsProps {
  data?: any[];
  days?: number;
}

export default function ClicksAnalytics({ data = [], days = 7 }: ClicksAnalyticsProps) {

  const chartData = useMemo(() => {
    const dataMap: Record<string, any> = {}

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      dataMap[dateStr] = { date: dateStr, total: 0 }
    }

    data.forEach((c: any) => {
      if (!c.createdAt) return;
      const dateStr = new Date(c.createdAt).toISOString().slice(0, 10)
      
      if (dataMap[dateStr]) {
        dataMap[dateStr].total += 1
      }
    })

    return Object.values(dataMap).sort((a: any, b: any) => a.date.localeCompare(b.date))
  }, [data, days])

  
  const totalClicksCount = useMemo(() => 
    chartData.reduce((acc, curr) => acc + curr.total, 0),
    [chartData]
  )


  return (
    <Card className="bg-black text-white overflow-hidden border-none shadow-none">
      <CardHeader className="flex flex-col items-stretch border-b border-neutral-800 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 sm:py-6">
          <CardTitle className="text-xl font-three">Total Clicks</CardTitle>
        </div>
        
        <div className="flex border-t border-neutral-800 sm:border-t-0">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8 sm:py-6">
            <span className="text-lg font-bold sm:text-3xl font-two">
              {totalClicksCount.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-2 pt-6 sm:p-6">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} margin={{ top: 10 }}>
            <CartesianGrid 
              vertical={false} 
              stroke="#262626" 
              strokeDasharray="4 4" 
              opacity={0.5} 
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              interval={days > 14 ? 4 : 0} 
              style={{ fontSize: '11px', fill: '#737373' }}
              tickFormatter={(val) => {
                const date = new Date(val)
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }}
            />
            <ChartTooltip
              cursor={false} 
              content={
                <ChartTooltipContent 
                  className="bg-black border-neutral-800 text-white min-w-[120px]"
                  indicator="dot"
                  formatter={(value) => (
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-500 font-three">Total</span>
                      <span className="text-white font-medium ml-auto">
                        {(value ?? 0).toLocaleString()}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar 
              dataKey="total" 
              fill={chartConfig.total.color} 
              radius={[2, 2, 0, 0]}
              barSize={days > 14 ? 12 : 24} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}