"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Link04Icon,
  Layers01Icon,
  CodeIcon,
} from '@hugeicons/core-free-icons';

type ViewType = "links" | "bulk" | "api";

interface SidebarProps {
  view: ViewType;
  onViewChange: (newView: ViewType) => void;
}


export default function UrlsPageSidebar({ view, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: "links", label: "My Links", icon: Link04Icon },
    { id: "bulk", label: "Bulk Links", icon: Layers01Icon },
    { id: "api", label: "API Links", icon: CodeIcon },
  ];


  return (
    <aside className="w-full sm:w-56 p-3 sm:p-5 sm:border-r border-neutral-800/60 flex flex-row sm:flex-col gap-1.5 overflow-x-auto sm:overflow-hidden border-b sm:border-b-0 shrink-0">

      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id as ViewType)}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg font-three transition-all duration-200 
            cursor-pointer text-sm sm:text-[15px] group w-full text-left
            ${view === item.id
              ? "bg-neutral-800/80 text-white shadow-sm shadow-black/20"
              : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/40"
            }
          `}
        >
          <HugeiconsIcon 
            icon={item.icon} 
            size={18} 
            className={`${view === item.id ? "text-blue-500" : "text-neutral-500 group-hover:text-neutral-300"}`} 
          />
          <span className="whitespace-nowrap">{item.label}</span>
        </button>
      ))}
    </aside>
  );
}