"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { IoArrowForwardOutline } from "react-icons/io5";

// Matches your existing color palette
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1c1c] border border-neutral-800 p-3 rounded-lg shadow-md text-white z-50">
        <p className="font-semibold text-sm font-one">{payload[0].name}</p>
        <p className="text-xs text-blue-500 font-bold mt-1 font-three">{payload[0].value} clicks</p>
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
    <div className="bg-[#1c1c1c] border border-neutral-800 rounded-xl shadow-sm flex flex-col h-full hover:shadow-lg hover:shadow-black/50 transition-all group">
      {/* Card Header */}
      <div className="p-6 pb-2 flex flex-row items-center justify-between">
        <h3 className="text-md font-bold flex items-center gap-2 text-white font-one">
          <span className="text-blue-500">{icon}</span> {title}
        </h3>
        <button
          onClick={onExpand}
          className="p-1.5 rounded-full text-neutral-400 hover:bg-[#2a2a2a] hover:text-white transition-all cursor-pointer"
        >
          <IoArrowForwardOutline size={18} />
        </button>
      </div>
      
      {/* Content Section */}
      <div className="p-6 pt-0 flex-1">
        <div className="flex flex-col sm:flex-row items-center h-[220px] mt-2 gap-4">
          {data && data.length > 0 ? (
            <>
              {/* Pie Chart Representation */}
              <div className="w-full h-full min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      nameKey={nameKey}
                      dataKey="count"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={5}
                      stroke="none"
                    >
                      {data.map((_: any, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[(index + colorOffset) % COLORS.length]} 
                          className="outline-none"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend / Data List (Top 4) */}
              <div className="w-full space-y-2.5 px-2 overflow-hidden">
                {data.slice(0, 4).map((item: any, index: number) => (
                  <div
                    key={`${item[nameKey]}-${index}`}
                    className="flex justify-between items-center text-xs border-b border-neutral-800 pb-1.5 group-hover:border-neutral-700 transition-colors"
                  >
                    <span className="truncate max-w-[110px] font-medium text-neutral-300 font-three">
                      {item[nameKey] || "Unknown"}
                    </span>
                    <span className="font-bold text-white font-two">{item.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center w-full h-full space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center text-neutral-600">
                {icon}
              </div>
              <p className="text-neutral-500 font-two text-lg italic tracking-tight">No batch data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};