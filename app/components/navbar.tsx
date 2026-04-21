"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "./userContext";
import { NavbarDropDown } from "../dropDown/navbarDropDown";
import {
  X,
  LogOut,
  User,
  LayoutDashboard,
  Link2,
  LayoutGrid,
  QrCode,
  BarChart3,
  Globe,
  Zap,
  FileText,
  Settings,
  LucideIcon,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout05Icon, User02Icon } from "@hugeicons/core-free-icons";

interface MenuItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const { user, logout, loading } = useUser();
  const pathname = usePathname();

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
      router.push("/");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 sm:px-10 py-6 border-b border-neutral-800 z-30 shrink-0 bg-[#141414] text-white sticky top-0 shadow-sm">
        <div className="flex items-center gap-10">
          <h1
            className="text-xl sm:text-2xl font-three font-bold cursor-pointer tracking-tighter"
            onClick={() => router.push("/")}
          >
            FASTURL
          </h1>

          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item: MenuItem) => {
              const basePath = item.path.split("?")[0];
              const isActive =
                item.path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(basePath);

              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shrink-0 cursor-pointer ${isActive
                      ? "bg-[#1D9BF0] text-white shadow-sm"
                      : "text-neutral-400 hover:bg-[#222222] hover:text-white"
                    }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 lg:mr-16">
          {loading ? (
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="hidden sm:block w-20 h-8 bg-neutral-800 animate-pulse rounded-lg border border-neutral-700" />
              <div className="w-9 h-9 rounded-full bg-neutral-800 animate-pulse border border-white/10" />
            </div>
          ) : user ? (
            <>
              <button
                onClick={() => router.push("/premium")}
                className={`hidden sm:block border font-three px-5 py-2 rounded-lg font-bold text-xs uppercase transition-all duration-500 cursor-pointer shadow-sm
                  ${isPaid
                    ? "bg-linear-to-r from-amber-400 via-yellow-200 to-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                    : "bg-[#222222] text-white border-neutral-700 hover:bg-[#333333]"
                  }`}
              >
                {tier}
              </button>

              <div className="lg:block hidden">
                <NavbarDropDown
                  user={user}
                  onLogout={handleLogout}
                  trigger={
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1e1e1e] border border-white/10 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white/40 text-xs font-bold">
                          {user?.userName?.[0]?.toUpperCase() ?? "?"}
                        </span>
                      )}
                    </div>
                  }
                />
              </div>

              <div
                className="lg:hidden block"
                onClick={() => setIsSidebarOpen(true)}
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1e1e1e] border border-white/10 flex items-center justify-center cursor-pointer active:scale-95 transition-all">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white/40 text-xs font-bold">
                      {user?.userName?.[0]?.toUpperCase() ?? "?"}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => router.push("/auth/signin")}
              className="bg-white text-black hover:bg-gray-200 px-6 sm:px-8 py-2.5 rounded-lg transition-all cursor-pointer font-three text-sm font-semibold shadow-sm"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[100] transition-opacity duration-300 lg:hidden ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#141414] z-[101] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden border-l border-neutral-800 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-8 py-8 mb-4">
            <h1 className="text-2xl font-three font-bold tracking-tighter text-white">
              FASTURL
            </h1>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-3 bg-[#1e1e1e] hover:bg-[#282828] text-neutral-400 hover:text-white rounded-full transition-all duration-200 mr-8 border border-white/5 active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
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
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-three font-medium text-lg transition-all ${isActive
                      ? "bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/20"
                      : "text-neutral-400 hover:bg-[#1e1e1e] hover:text-white"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-white" : "text-neutral-500"
                      }`}
                  />
                  {item.name}
                </button>
              );
            })}
          </div>

          <div className="mt-auto p-6 bg-[#181818]/50 border-t border-neutral-800 flex flex-col gap-2 pb-10">
            <button
              onClick={() => navigateTo("/settings/profile")}
              className="flex items-center gap-4 px-5 py-4 rounded-xl font-three font-medium text-lg text-neutral-300 hover:bg-[#222222] transition-all"
            >
              <HugeiconsIcon icon={User02Icon} />
              Manage Account
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-5 py-4 rounded-xl font-three font-medium text-lg text-red-400 hover:bg-red-500/10 transition-all"
            >
              <HugeiconsIcon icon={Logout05Icon} />
                Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}