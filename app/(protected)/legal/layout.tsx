"use client";

import Navbar from "@/app/components/navbar";
import { useRouter, usePathname } from "next/navigation";

const links = [
  { name: "Terms of Service", path: "/legal/terms" },
  { name: "Privacy Policy", path: "/legal/privacyPolicy" },
  { name: "Cookie Policy", path: "/legal/cookies" },
];

export default function LegalLayout({ children }: { children: React.ReactNode;}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      <Navbar />

      <div className="flex">
        <div className="w-64 border-r border-border p-6 min-h-[calc(100vh-64px)]">

          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition cursor-pointer ${
                  pathname === link.path
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-10 max-w-4xl">
          {children}
        </div>
      </div>
    </div>
  );
}