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

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const isDark = theme === "dark"
    
    const supportsTransition =
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!supportsTransition) {
      setTheme(isDark ? "light" : "dark")
      return
    }

    const x = event.clientX
    const y = event.clientY

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = (document as any).startViewTransition(async () => {
      setTheme(isDark ? "light" : "dark")
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 1000,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    })
  }

  if (!mounted) return <Button variant="outline" className="w-14 h-8 rounded-full border-muted-foreground/20" />

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full flex items-center justify-between px-1.5 overflow-hidden group border-muted-foreground/40 hover:border-primary/60 transition-colors cursor-pointer"
    >
      <Sun className={`h-3.5 w-3.5 transition-all duration-300 z-10 ${theme === 'dark' ? 'text-muted-foreground/50' : 'text-orange-500'}`} />
      <Moon className={`h-3.5 w-3.5 transition-all duration-300 z-10 ${theme === 'dark' ? 'text-blue-400' : 'text-muted-foreground/50'}`} />
      
      <div
        className={`absolute h-6 w-6 rounded-full bg-accent border border-border shadow-sm transition-all duration-300 ease-in-out ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`} 
      />
    </Button>
  )
}