"use client";

import Navbar from "./navbar";
import Sidebar from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  handleLogout: () => void;
}

export default function DashboardLayout({ children, isLoggedIn, handleLogout }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden relative transition-colors duration-300 bg-background text-foreground">
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <div className="flex flex-1 overflow-hidden pb-16 md:pb-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}