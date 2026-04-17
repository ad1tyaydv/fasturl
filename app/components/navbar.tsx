"use client";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "./userContext";
import { UserAccountNav } from "../dropDown/navbarDropDown";
import axios from "axios";

export default function Navbar() {
  const router = useRouter();
  const { user, setUser, logout } = useUser();
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Links", path: "/urls" },
    { name: "Bulk Links", path: "/bulklinks" },
    { name: "QR Codes", path: "/qr" },
    { name: "Analytics", path: "/analytics" },
    { name: "Domains", path: "/domain" },
    { name: "Premium", path: "/premium" },
    { name: "Docs", path: "/docs" },
    { name: "Settings", path: "/settings/profile" },
  ];

  const tier = user?.plan ?? "FREE";
  const isPaid = tier !== "FREE" && tier !== "";
  const avatarUrl = user?.image ?? null;


  const handleLogout = async () => {
    try {
      await logout();

    } catch (error) {
      console.error("Logout failed");
    }
  };


  const avatarTrigger = (
    <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1e1e1e] border border-white/10 flex items-center justify-center shrink-0 cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-full h-full object-cover cursor-pointer"
        />
      ) : (
        <span className="text-white/40 text-xs font-bold">
          {user?.userName?.[0]?.toUpperCase() ?? "?"}
        </span>
      )}
    </div>
  );


  return (
    <nav className="flex items-center justify-between px-6 sm:px-10 py-6 border-b border-neutral-800 z-30 shrink-0 bg-[#141414] text-white sticky top-0 shadow-sm">
      <div className="flex items-center gap-10">
        <h1
          className="text-xl sm:text-2xl font-three font-bold cursor-pointer tracking-tighter"
          onClick={() => router.push("/")}
        >
          FASTURL
        </h1>

        <div className="hidden lg:flex items-center gap-1">
          {menuItems.map((item) => {
            const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path); return (
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

      <div className="flex items-center gap-6 sm:mr-12 lg:mr-16">
        {user && (
          <>
            <div className="relative flex flex-col items-center">
              <button
                onClick={() => router.push("/premium")}
                className={`border font-three px-5 py-2 rounded-lg font-bold text-xs uppercase transition-all duration-500 cursor-pointer shadow-sm
                  ${isPaid
                    ? "bg-linear-to-r from-amber-400 via-yellow-200 to-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                    : "bg-[#222222] text-white border-neutral-700 hover:bg-[#333333]"
                  }`}
              >
                {tier}
              </button>
            </div>

            <UserAccountNav
              user={user}
              onLogout={handleLogout}
              trigger={avatarTrigger}
            />
          </>
        )}

        {!user && (
          <button
            onClick={() => router.push("/auth/signin")}
            className="bg-white text-black hover:bg-gray-200 px-8 py-2.5 rounded-lg transition-all cursor-pointer font-three text-sm font-semibold shadow-sm"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
