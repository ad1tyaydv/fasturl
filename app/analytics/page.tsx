"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { 
  IoHomeOutline, 
  IoListOutline, 
  IoSettingsOutline, 
  IoPersonOutline, 
  IoQrCodeOutline, 
  IoAnalyticsOutline,
  IoArrowBackOutline,
  IoLinkOutline,
  IoGlobeOutline,
  IoPhonePortraitOutline,
} from "react-icons/io5";

import { ModeToggle } from "../components/toggleTheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function AnalyticsPage() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any | null>(null);
  const [urls, setUrls] = useState<any[]>([]);

  const analyticsData = {
    countries: [
      { name: "USA", value: 400 }, { name: "India", value: 300 }, { name: "UK", value: 200 }, { name: "Germany", value: 100 },
    ],
    devices: [
      { name: "Mobile", value: 600 }, { name: "Desktop", value: 350 }, { name: "Tablet", value: 50 },
    ],
    browsers: [
      { name: "Chrome", value: 500 }, { name: "Safari", value: 300 }, { name: "Firefox", value: 100 },
    ]
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (!res.data.authenticated) {
          router.push("/auth/signin");
        } else {
          setIsLoggedIn(true);
          const urlRes = await axios.get("/api/fetchUrls");
          setUrls(urlRes.data.urls);
        }
      } catch {
        router.push("/auth/signin");
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    setIsLoggedIn(false);
    router.push("/auth/signin");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden relative transition-colors duration-300 bg-background text-foreground">
      
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-border z-20 shrink-0 bg-background">
        <h1 className="text-lg sm:text-xl font-semibold cursor-pointer" onClick={() => router.push('/')}>
          SHORTLY
        </h1>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {isLoggedIn && (
            <button onClick={handleLogout} className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-1.5 rounded-md transition cursor-pointer font-medium text-sm sm:text-base">
              Logout
            </button>
          )}
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden pb-16 md:pb-0">
        
        <aside className="w-64 border-r border-border flex-col py-6 px-4 shrink-0 hidden md:flex bg-muted/20">
          <div>
            <p className="text-xs font-bold mb-4 px-2 uppercase tracking-wider text-muted-foreground">Menu</p>
            <div className="flex flex-col gap-2">
              <SidebarItem icon={<IoHomeOutline size={20} />} label="Dashboard" active={pathname === '/'} onClick={() => router.push('/')} />
              <SidebarItem icon={<IoListOutline size={20} />} label="Links" active={pathname === '/urls'} onClick={() => router.push('/urls')} />
              <SidebarItem icon={<IoQrCodeOutline size={20} />} label="QR Codes" active={pathname === '/qrcodes'} onClick={() => router.push('/qrcodes')} />
              <SidebarItem icon={<IoAnalyticsOutline size={20} />} label="Analytics" active={pathname === '/analytics'} onClick={() => router.push('/analytics')} />
            </div>
          </div>
          <div className="mt-auto">
            <p className="text-xs font-bold mb-4 px-2 uppercase tracking-wider text-muted-foreground">Account</p>
            <div className="flex flex-col gap-2">
              <SidebarItem icon={<IoPersonOutline size={20} />} label="Profile" onClick={() => {}} />
              <SidebarItem icon={<IoSettingsOutline size={20} />} label="Settings" onClick={() => {}} />
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-background">
          <div className="max-w-5xl mx-auto">
            {!selectedLink ? (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold">Link Analytics</h1>
                  <p className="text-muted-foreground mt-1">Select a link to see deep-dive statistics.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {urls.map((url) => (
                    <div 
                      key={url.id}
                      onClick={() => setSelectedLink(url)}
                      className="p-6 rounded-xl border border-border bg-card hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><IoLinkOutline size={20} /></div>
                        <div className="text-xs font-bold text-muted-foreground uppercase">Clicks: {url.clicks || 0}</div>
                      </div>
                      <h3 className="font-bold truncate text-foreground">{url.shorturl}</h3>
                      <p className="text-xs text-muted-foreground truncate mb-4">{url.original}</p>
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-tighter">
                        View Detailed Report →
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* DETAILED VIEW */
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button 
                  onClick={() => setSelectedLink(null)}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                  <IoArrowBackOutline size={18} /> Back to all links
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold">{selectedLink.shorturl}</h2>
                    <p className="text-primary truncate max-w-md">{selectedLink.original}</p>
                  </div>
                  <div className="bg-card border border-border px-6 py-4 rounded-xl shadow-sm">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Total Clicks</p>
                    <p className="text-3xl font-black">{selectedLink.clicks || 0}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                  <AnalyticsCard title="Geographic Distribution" icon={<IoGlobeOutline size={18}/>}>
                    <div className="h-[300px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.countries}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                          <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} />
                          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </AnalyticsCard>

                  <AnalyticsCard title="Devices & Browsers" icon={<IoPhonePortraitOutline size={18}/>}>
                    <div className="flex flex-col sm:flex-row items-center h-[300px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={analyticsData.devices} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {analyticsData.devices.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="w-full space-y-3 px-4">
                        {analyticsData.browsers.map((b) => (
                          <div key={b.name} className="flex justify-between text-sm border-b border-border pb-1">
                            <span className="text-muted-foreground font-medium">{b.name}</span>
                            <span className="font-bold">{b.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AnalyticsCard>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 w-full border-t border-border flex justify-around items-center pb-safe z-30 bg-background">
        <MobileNavItem icon={<IoHomeOutline size={24} />} label="Home" active={pathname === '/'} onClick={() => router.push('/')} />
        <MobileNavItem icon={<IoListOutline size={24} />} label="Links" active={pathname === '/urls'} onClick={() => router.push('/urls')} />
        <MobileNavItem icon={<IoQrCodeOutline size={24} />} label="QR" active={pathname === '/qrcodes'} onClick={() => router.push('/qrcodes')} />
        <MobileNavItem icon={<IoAnalyticsOutline size={24} />} label="Analytics" active={pathname === '/analytics'} onClick={() => router.push('/analytics')} />
        <MobileNavItem icon={<IoPersonOutline size={24} />} label="Profile" onClick={() => {}} />
      </nav>
    </div>
  );
}
function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
        active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function MobileNavItem({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 py-3 px-2 ${active ? 'text-primary' : 'text-muted-foreground'}`}>
      {icon} <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function AnalyticsCard({ title, icon, children }: any) {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">{icon} {title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}