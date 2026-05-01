"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "./userContext";
import { NavbarDropDown } from "../dropDown/navbarDropDown";
import Link from "next/link";
import {
  X,
  LayoutDashboard,
  Link2,
  LayoutGrid,
  QrCode,
  BarChart3,
  Globe,
  Zap,
  FileText,
  Settings,
  Bell,
  LucideIcon,
  Moon,
  Sun,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout05Icon, User02Icon } from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";

interface MenuItem {
  name: string;
  path: string;
  icon: LucideIcon;
}


export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const { user, logout, loading } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems: MenuItem[] = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Links", path: "/links?types=links", icon: Link2 },
    { name: "Bulk Links", path: "/bulklinks", icon: LayoutGrid },
    { name: "QR Codes", path: "/qr", icon: QrCode },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Domains", path: "/domain", icon: Globe },
    { name: "Premium", path: "/premium", icon: Zap },
    { name: "Docs", path: "/docs", icon: FileText },
    { name: "Settings", path: "/settings/profile", icon: Settings },
  ];

  const tier = user?.plan ?? "FREE";
  const isPaid = tier !== "FREE" && tier !== "";
  const avatarUrl = user?.image ?? null;

  const handleLogout = async () => {
    try {
      await logout();
      setIsSidebarOpen(false);
      window.location.href = "/";
      window.location.reload();
      
    } catch (error) {
      console.error("Logout failed");
    }
  };


  return (
    <>
      <nav className="flex items-center justify-between px-6 sm:px-10 py-6 border-b border-border z-30 shrink-0 bg-background text-foreground sticky top-0 shadow-sm">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img
              src="/favicon.ico"
              alt="FastURL Logo"
              className="w-7 h-7 object-contain"
            />
            <h1 className="text-xl sm:text-2xl font-three font-bold tracking-tighter">
              FASTURL
            </h1>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item: MenuItem) => {
              const basePath = item.path.split("?")[0];
              const isActive =
                item.path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(basePath);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shrink-0 ${isActive
                    ? "bg-[#1D9BF0] text-white shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 lg:mr-16">
          {loading ? (
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="hidden sm:block w-20 h-8 bg-muted animate-pulse rounded-lg border border-border" />
              <div className="w-9 h-9 rounded-full bg-muted animate-pulse border border-white/10" />
            </div>
          ) : user ? (
            <>
              <Link
                href="/notification"
                className="p-2 hover:bg-accent rounded-full transition-colors relative group"
              >
                <Bell className="w-6 h-6 text-muted-foreground group-hover:text-foreground" />
                {user?.unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background">
                    {user.unreadNotifications > 9 ? "9+" : user.unreadNotifications}
                  </span>
                )}
              </Link>

              <Link
                href="/premium"
                className={`hidden sm:block border font-three px-5 py-2 rounded-lg font-bold text-xs uppercase transition-all duration-500 shadow-sm
                  ${isPaid
                    ? "bg-linear-to-r from-amber-400 via-yellow-200 to-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                    : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
                  }`}
              >
                {tier}
              </Link>

              <div className="lg:block hidden">
                <NavbarDropDown
                  user={user}
                  onLogout={handleLogout}
                  trigger={
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary border border-border flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-ring/20 transition-all">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs font-bold">
                          {user?.userName?.[0]?.toUpperCase() ?? "?"}
                        </span>
                      )}
                    </div>
                  }
                />
              </div>

              <div
                className="lg:hidden block cursor-pointer"
                onClick={() => setIsSidebarOpen(true)}
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary border border-border flex items-center justify-center active:scale-95 transition-all">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground text-xs font-bold">
                      {user?.userName?.[0]?.toUpperCase() ?? "?"}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
               {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 hover:bg-accent rounded-full transition-colors cursor-pointer"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              <Link
                href="/auth/signin"
                className="bg-primary text-primary-foreground hover:opacity-90 px-6 sm:px-8 py-2.5 rounded-lg transition-all font-three text-sm font-semibold shadow-sm"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[100] transition-opacity duration-300 lg:hidden ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-background z-[101] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden border-l border-border ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-8 py-8 mb-4">
            <h1 className="text-2xl font-three font-bold tracking-tighter text-foreground">
              FASTURL
            </h1>

            <div className="flex items-center gap-2">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-3 bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground rounded-full transition-all duration-200 border border-border active:scale-90 cursor-pointer"
                >
                  {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
              )}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-3 bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground rounded-full transition-all duration-200 border border-border active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 px-6 space-y-1 overflow-y-auto pb-10">
            {menuItems.map((item: MenuItem) => {
              const basePath = item.path.split("?")[0];
              const isActive =
                item.path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(basePath);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl font-three font-medium text-lg transition-all ${isActive
                    ? "bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/20"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-white" : "text-neutral-500"
                      }`}
                  />
                  {item.name}
                </Link>
              );
            })}

            {user && (
              <Link
                href="/notification"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl font-three font-medium text-lg transition-all ${pathname === "/notification"
                  ? "bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                <Bell
                  className={`w-5 h-5 ${pathname === "/notification" ? "text-white" : "text-neutral-500"
                    }`}
                />
                Notifications
              </Link>
            )}
          </div>

          {user ? (
            <div className="mt-auto p-6 bg-secondary/50 border-t border-border flex flex-col gap-2 pb-10">
              <Link
                href="/settings/profile"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-4 px-5 py-4 rounded-xl font-three font-medium text-lg text-foreground hover:bg-accent transition-all"
              >
                <HugeiconsIcon icon={User02Icon} />
                Manage Account
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-5 py-4 rounded-xl font-three font-medium text-lg text-destructive hover:bg-destructive/10 transition-all text-left"
              >
                <HugeiconsIcon icon={Logout05Icon} />
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-auto p-6 border-t border-border">
              <Link 
                href="/auth/signin" 
                onClick={() => setIsSidebarOpen(false)}
                className="block w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all text-center"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}