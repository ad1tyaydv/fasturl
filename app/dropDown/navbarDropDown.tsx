"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Settings01Icon, Logout01Icon }
  from '@hugeicons/core-free-icons';

import { User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserAccountNavProps {
  user: any;
  onLogout: () => void;
}

export function UserAccountNav({ user, onLogout }: UserAccountNavProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="h-10 w-10 rounded-full bg-[#222222] border border-neutral-700 flex items-center justify-center hover:bg-[#333333] transition-colors cursor-pointer">
          <User className="h-5 w-5 text-neutral-400" />
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-[#1A1A1A] border-neutral-800 text-white p-2">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.email && (
              <p className="font-medium text-sm text-neutral-200 truncate">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator className="bg-neutral-800" />
        
        <DropdownMenuItem 
          onClick={() => router.push('/settings')}
          className="cursor-pointer gap-2 focus:text-white  transition-colors py-2.5 rounded-md"
        >
          <HugeiconsIcon icon={Settings01Icon} />
          <span className="text-sm">Manage Account</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={onLogout}
          className="cursor-pointer gap-2 text-red-400 transition-colors py-2.5 rounded-md"
        >
          <HugeiconsIcon icon={Logout01Icon} />
          <span className="text-sm font-medium">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}