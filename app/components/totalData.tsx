"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function TotalData() {
  const [stats, setStats] = useState({ links: 0, qr: 0, clicks: 0, customers: 0 });


  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await axios.get("/api/totalData");
        setStats({
          links: res.data.totalLinks || 0,
          qr: res.data.totalqrCodes || 0,
          clicks: res.data.totalClicks || 0,
          customers: res.data.totalUsers || 1300000 
        });
        
      } catch (e) {
        console.log("Stats not available yet");
      }
    };

    fetchUserStats();

  }, []);


  const statItems = [
    {
      topLabel: "Powering",
      value: stats.links,
      bottomLabel: "Links",
    },
    {
      topLabel: "Generated",
      value: stats.qr,
      bottomLabel: "QR Codes",
    },
    {
      topLabel: "Serving",
      value: stats.clicks,
      bottomLabel: "Clicks",
    },
    {
      topLabel: "Trusted By",
      value: stats.customers,
      bottomLabel: "Happy Customers",
    }
  ];


  return (
    <section className="w-full bg-[#141414] py-20 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4">
          {statItems.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center space-y-4"
            >
              <p className="text-[#1D9BF0] text-xl md:text-2xl font-three">
                {item.topLabel}
              </p>

              <h3 className="text-[#1D9BF0] text-4xl md:text-6xl font-one tracking-tight">
                {item.value.toLocaleString()} +
              </h3>

              <p className="text-white text-lg md:text-xl font-one">
                {item.bottomLabel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}