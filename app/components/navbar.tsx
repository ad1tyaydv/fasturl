"use client";

import { useRouter } from "next/navigation";
import { ModeToggle } from "./toggleTheme";

interface NavbarProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
}

export default function Navbar({ isLoggedIn, handleLogout }: NavbarProps) {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-border z-20 shrink-0 bg-background">
      <h1 
        className="text-lg sm:text-xl font-three cursor-pointer" 
        onClick={() => router.push('/')}
      >
        SHORTLY
      </h1>

      <div className="flex items-center gap-4 cursor-pointer">
        <ModeToggle />

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-1.5 rounded-md transition cursor-pointer font-medium text-sm sm:text-base"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/auth/signin")}
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-1.5 rounded-md transition cursor-pointer font-medium text-sm sm:text-base"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}