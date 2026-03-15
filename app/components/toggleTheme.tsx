"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="rounded-full">
        <div className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
        variant="outline"
        onClick={toggleTheme}
        className="w-15 h-8 rounded-full flex items-center justify-between px-2 cursor-pointer"
        >
        <Sun className="h-4 w-4 dark:text-muted-foreground/40" />
        <Moon className="h-4 w-4 text-muted-foreground/40 dark:text-white" />
    </Button>
  )
}