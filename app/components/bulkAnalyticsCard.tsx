"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { IoArrowForwardOutline } from "react-icons/io5";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-3 rounded-none shadow-xl text-popover-foreground z-50">
        <p className="font-bold text-xs uppercase tracking-widest font-one text-muted-foreground">
          {payload[0].name}
        </p>
        <p className="text-sm text-blue-500 font-bold mt-1 font-three">
          {payload[0].value} {payload[0].value === 1 ? "click" : "clicks"}
        </p>
      </div>
    );
  }
  return null;
};

interface BulkAnalyticsCardItemProps {
  title: string;
  icon: React.ReactNode;
  data: any[];
  nameKey: string;
  colorOffset?: number;
  onExpand: () => void;
}

export const BulkAnalyticsCardItem = ({
  title,
  icon,
  data,
  nameKey,
  colorOffset = 0,
  onExpand,
}: BulkAnalyticsCardItemProps) => {
  
  return (
    <div className="bg-background border border-border rounded-none shadow-sm flex flex-col h-full hover:border-muted-foreground/30 transition-all group">
      <div className="p-6 pb-2 flex flex-row items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-3 text-foreground font-one uppercase tracking-widest">
          <span className="text-blue-500">{icon}</span> {title}
        </h3>
        <button
          onClick={onExpand}
          className="p-1.5 rounded-none text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer border border-transparent hover:border-border"
        >
          <IoArrowForwardOutline size={18} />
        </button>
      </div>
      
      <div className="p-6 pt-0 flex-1">
        <div className="flex flex-col sm:flex-row items-center h-[220px] mt-2 gap-4">
          {data && data.length > 0 ? (
            <>
              <div className="w-full h-full min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      nameKey={nameKey}
                      dataKey="count"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      stroke="none"
                      animationBegin={0}
                      animationDuration={1200}
                    >
                      {data.map((_: any, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[(index + colorOffset) % COLORS.length]} 
                          className="outline-none cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full space-y-3 px-2 overflow-hidden">
                {data.slice(0, 4).map((item: any, index: number) => (
                  <div
                    key={`${item[nameKey]}-${index}`}
                    className="flex justify-between items-center text-xs border-b border-border transition-colors last:border-0 pb-2"
                  >
                    <div className="flex items-center gap-2 truncate mr-2">
                      <div 
                        className="w-2 h-2 shrink-0" 
                        style={{ backgroundColor: COLORS[(index + colorOffset) % COLORS.length] }}
                      />
                      <span className="truncate font-medium text-muted-foreground font-three uppercase tracking-tight">
                        {item[nameKey] || "Unknown"}
                      </span>
                    </div>
                    <span className="font-bold text-foreground font-two tabular-nums">
                      {item.count}
                    </span>
                  </div>
                ))}
                {data.length > 4 && (
                  <p className="text-[10px] text-muted-foreground font-three italic text-right">
                    + {data.length - 4} more
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center w-full h-full space-y-3 py-10">
              <div className="w-12 h-12 rounded-none bg-secondary flex items-center justify-center text-muted-foreground border border-border">
                {icon}
              </div>
              <p className="text-muted-foreground font-three text-sm italic tracking-tight">
                No data recorded
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};