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
  IoHardwareChipOutline,
  IoShareSocialOutline,
  IoCompassOutline
} from "react-icons/io5";

import { ModeToggle } from "../components/toggleTheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function AnalyticsPage() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any | null>(null);
  const [urls, setUrls] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

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

  const handleLinkAnaltyics = async (linkId: string) => {
    setIsLoadingAnalytics(true);
    setAnalytics(null);
    try {
        const res = await axios.get("/api/analytics", {
            params: { linkId: linkId }
        });
        setAnalytics(res.data);
    } catch (error) {
        console.log("Something went wrong", error);
    } finally {
        setIsLoadingAnalytics(false);
    }
  };


  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    color: "hsl(var(--card-foreground))",
    borderColor: "hsl(var(--border))",
    borderRadius: "8px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
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
          <div className="max-w-6xl mx-auto">
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
                      onClick={() => {
                        setSelectedLink(url);
                        handleLinkAnaltyics(url.id);
                      }}
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
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button
                  onClick={() => setSelectedLink(null)}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4 cursor-pointer"
                >
                  <IoArrowBackOutline size={18} /> Back
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

                {isLoadingAnalytics ? (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-muted-foreground animate-pulse">Loading analytics data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                    
                    <AnalyticsCard title="Geographic Distribution" icon={<IoGlobeOutline size={18}/>}>
                        <div className="h-[250px] w-full mt-4 overflow-y-auto pr-2">
                            {analytics?.countries?.map((c: any) => (
                            <div key={`${c.country}-${c.state}`} className="flex justify-between items-center text-sm border-b border-border py-2">
                                <span className="text-foreground font-medium">
                                    {c.country} <span className="text-muted-foreground text-xs ml-1">({c.state || "Unknown"})</span>
                                </span>
                                <span className="font-bold bg-muted px-2 py-1 rounded-md text-xs">
                                    {c.count} clicks
                                </span>
                            </div>
                            ))}
                            {!analytics?.countries?.length && (
                                <p className="text-xs text-muted-foreground pt-4">No location data available.</p>
                            )}
                        </div>
                    </AnalyticsCard>

                    <AnalyticsCard title="Top Referrers" icon={<IoShareSocialOutline size={18}/>}>
                        <div className="h-[250px] w-full mt-4">
                            {analytics?.referrers?.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analytics.referrers} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="referrer" type="category" width={80} stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{fill: 'var(--accent)', opacity: 0.2}} contentStyle={tooltipStyle} />
                                        <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-xs text-muted-foreground pt-4">No referrer data available.</p>
                            )}
                        </div>
                    </AnalyticsCard>

                    <AnalyticsCard title="Browsers" icon={<IoCompassOutline size={18}/>}>
                        <div className="flex flex-col sm:flex-row items-center h-[250px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <Pie data={analytics?.browsers || []} nameKey="browser" dataKey="count" innerRadius={50} outerRadius={80} paddingAngle={5}>
                                {analytics?.browsers?.map((_: any, index: number) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="w-full space-y-3 px-4 overflow-y-auto max-h-full">
                            {analytics?.browsers?.map((b: any, index: number) => (
                            <div key={b.browser} className="flex justify-between items-center text-sm border-b border-border pb-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-foreground font-medium">{b.browser}</span>
                                </div>
                                <span className="font-bold">{b.count}</span>
                            </div>
                            ))}
                        </div>
                        </div>
                    </AnalyticsCard>

                    <AnalyticsCard title="Devices" icon={<IoPhonePortraitOutline size={18}/>}>
                        <div className="flex flex-col sm:flex-row items-center h-[250px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <Pie data={analytics?.devices || []} nameKey="devices" dataKey="count" innerRadius={50} outerRadius={80} paddingAngle={5}>
                                {analytics?.devices?.map((_: any, index: number) => <Cell key={index} fill={COLORS[(index + 2) % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="w-full space-y-3 px-4 overflow-y-auto max-h-full">
                            {analytics?.devices?.map((d: any, index: number) => (
                            <div key={d.devices} className="flex justify-between items-center text-sm border-b border-border pb-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }} />
                                    <span className="text-foreground font-medium">{d.devices}</span>
                                </div>
                                <span className="font-bold">{d.count}</span>
                            </div>
                            ))}
                        </div>
                        </div>
                    </AnalyticsCard>

                    <AnalyticsCard title="Operating Systems" icon={<IoHardwareChipOutline size={18}/>}>
                        <div className="h-[250px] w-full mt-4">
                            {analytics?.os?.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analytics.os} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis dataKey="os" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                        <Tooltip cursor={{fill: 'var(--accent)', opacity: 0.2}} contentStyle={tooltipStyle} />
                                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-xs text-muted-foreground pt-4">No OS data available.</p>
                            )}
                        </div>
                    </AnalyticsCard>

                    </div>
                )}
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
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">{icon} {title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}