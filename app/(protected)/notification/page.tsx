"use client";

import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon } from "@hugeicons/core-free-icons";

export default function NotificationPage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <HugeiconsIcon icon={Notification01Icon} className="text-blue-500 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-one font-bold tracking-tight">Notifications</h1>
            <p className="text-neutral-500 text-sm mt-1 font-three">
              Stay updated with your account activity and announcements.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-neutral-800 rounded-3xl bg-[#1c1c1c]/30">
          <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 mb-6">
            <HugeiconsIcon icon={Notification01Icon} className="w-10 h-10 text-neutral-600" />
          </div>
          <h2 className="text-xl font-one mb-2 text-white">No new notifications</h2>
          <p className="text-neutral-500 font-three text-sm text-center max-w-xs">
            When you receive notifications about your links, domains, or account, they will appear here.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
