"use client";

import { useRouter, usePathname } from "next/navigation";
import { 
  IoHomeOutline, 
  IoListOutline, 
  IoSettingsOutline, 
  IoPersonOutline, 
  IoQrCodeOutline, 
  IoAnalyticsOutline 
} from "react-icons/io5";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <IoHomeOutline size={20} /> },
    { name: 'Links', path: '/urls', icon: <IoListOutline size={20} /> },
    { name: 'QR Codes', path: '/qr', icon: <IoQrCodeOutline size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <IoAnalyticsOutline size={20} /> },
  ];

  const mobileItems = [
    { name: 'Home', path: '/', icon: <IoHomeOutline size={24} /> },
    { name: 'Links', path: '/urls', icon: <IoListOutline size={24} /> },
    { name: 'QR', path: '/qrcodes', icon: <IoQrCodeOutline size={24} /> },
    { name: 'Analytics', path: '/analytics', icon: <IoAnalyticsOutline size={24} /> },
  ];

  return (
    <>
      <aside className="w-64 border-r border-border flex-col py-6 px-4 shrink-0 hidden md:flex bg-muted/20">
        <div>
          <p className="text-xl font-one mb-4 px-2 uppercase tracking-wider text-muted-foreground">Menu</p>
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-three transition cursor-pointer ${
                  pathname === item.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-xl font-one mb-4 px-2 uppercase tracking-wider text-muted-foreground">Account</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => console.log('Profile clicked')} 
              className="flex items-center gap-3 px-4 py-3 rounded-lg font-three transition cursor-pointer text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <IoPersonOutline size={20} />
              Profile
            </button>
            <button
              onClick={() => console.log('Settings clicked')} 
              className="flex items-center gap-3 px-4 py-3 rounded-lg font-three transition cursor-pointer text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <IoSettingsOutline size={20} />
              Settings
            </button>
          </div>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 w-full border-t border-border flex justify-around items-center pb-safe z-30 bg-background">
        {mobileItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center gap-1 py-3 px-2 ${pathname === item.path ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.name}</span>
          </button>
        ))}
        <button
          onClick={() => console.log('Profile clicked')}
          className="flex flex-col items-center gap-1 py-3 px-2 text-muted-foreground hover:text-foreground"
        >
          <IoPersonOutline size={24} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </>
  );
}