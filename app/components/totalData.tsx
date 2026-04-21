"use client";

import axios from "axios";
import { useEffect, useState } from "react";

function useCountUp(endValue: number, duration: number = 800) {
  const [count, setCount] = useState(0);

  
  useEffect(() => {
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      setCount(Math.floor(progress * endValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [endValue, duration]);

  return count;
}

export default function TotalData() {
  const [stats, setStats] = useState({
    links: 0,
    qr: 0,
    clicks: 0,
    customers: 0
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await axios.get("/api/totalData");

        setStats({
          links: res.data.totalLinks || 0,
          qr: res.data.totalqrCodes || 0,
          clicks: res.data.totalClicks || 0,
          customers: res.data.totalUsers || 0
        });

      } catch (e) {

        try {
          const res = await axios.get("/api/public/totalData");

          setStats({
            links: res.data.totalLinks || 0,
            qr: res.data.totalqrCodes || 0,
            clicks: res.data.totalClicks || 0,
            customers: res.data.totalUsers || 0
          });

        } catch {
          console.log("Stats not available");
        }
      }
    };

    fetchUserStats();
  }, []);


  const displayLinks = useCountUp(stats.links);
  const displayQR = useCountUp(stats.qr);
  const displayClicks = useCountUp(stats.clicks);
  const displayCustomers = useCountUp(stats.customers);

  const statItems = [
    { topLabel: "Powering", value: displayLinks, bottomLabel: "Links" },
    { topLabel: "Generated", value: displayQR, bottomLabel: "QR Codes" },
    { topLabel: "Serving", value: displayClicks, bottomLabel: "Clicks" },
    { topLabel: "Trusted By", value: displayCustomers, bottomLabel: "Happy Customers" }
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

              <h3 className="text-[#1D9BF0] text-4xl md:text-6xl font-one tracking-tight tabular-nums">
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