"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { HugeiconsIcon } from '@hugeicons/react';
import { Settings01Icon, Logout01Icon } from '@hugeicons/core-free-icons';
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

interface UserAccountNavProps {
  user: any;
  onLogout: () => void;
  trigger?: React.ReactNode;
}

export function NavbarDropDown({ user, onLogout, trigger }: UserAccountNavProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        {trigger ?? (
          <div className="h-10 w-10 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
            <span className="text-muted-foreground text-sm font-bold cursor-pointer">
              {user?.userName?.[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-popover border-border text-popover-foreground p-2">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.email && (
              <p className="font-medium text-sm text-foreground truncate">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="cursor-pointer gap-2 focus:bg-accent focus:text-accent-foreground transition-colors py-2.5 rounded-md"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4" />
              <span className="text-sm">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              <span className="text-sm">Dark Mode</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/settings')}
          className="cursor-pointer gap-2 focus:bg-accent focus:text-accent-foreground transition-colors py-2.5 rounded-md"
        >
          <HugeiconsIcon icon={Settings01Icon} />
          <span className="text-sm">Manage Account</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors py-2.5 rounded-md"
        >
          <HugeiconsIcon icon={Logout01Icon} />
          <span className="text-sm font-medium">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
