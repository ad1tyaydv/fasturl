"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Link04Icon,
  Layers01Icon,
  CodeIcon,
  QrCodeIcon,
} from '@hugeicons/core-free-icons';

type ViewType = "links" | "bulk" | "api" | "qr";

interface SidebarProps {
  view: ViewType;
  onViewChange: (newView: ViewType) => void;
}

export default function UrlsPageSidebar({ view, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: "links", label: "My Links", icon: Link04Icon },
    { id: "bulk", label: "Bulk Links", icon: Layers01Icon },
    { id: "qr", label: "QR Codes", icon: QrCodeIcon },
    { id: "api", label: "API Links", icon: CodeIcon },
  ];

  return (
    <aside className="w-full sm:w-64 p-4 sm:p-6 sm:border-r border-neutral-800/60 flex flex-row sm:flex-col gap-4 overflow-x-auto sm:overflow-hidden border-b sm:border-b-0 shrink-0">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id as ViewType)}
          className={`
            flex items-center gap-4 px-4 py-3.5 rounded-xl font-three transition-all duration-200 
            cursor-pointer text-base sm:text-lg group w-full text-left
            ${view === item.id
              ? "bg-neutral-800/80 text-white shadow-sm shadow-black/20"
              : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/40"
            }
          `}
        >
          <HugeiconsIcon 
            icon={item.icon} 
            size={22} 
            className={`${view === item.id ? "text-blue-500" : "text-neutral-500 group-hover:text-neutral-300"}`} 
          />
          <span className="whitespace-nowrap font-medium">{item.label}</span>
        </button>
      ))}
    </aside>
  );
}