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
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 1100,
          easing: "cubic-bezier(0.7, 0, 0.2, 1)",
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      )
    })
  }

  if (!mounted) return <Button variant="outline" className="w-14 h-8 rounded-full" />

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full flex items-center justify-between px-1.5 overflow-hidden group border-muted-foreground/100 hover:border-primary/200 transition-colors cursor-pointer"
    >
      <Sun className={`h-4 w-4 transition-all duration-300 ${theme === 'dark' ? 'text-muted-foreground/40' : 'text-yellow-500'}`} />
      <Moon className={`h-4 w-4 transition-all duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-muted-foreground/40'}`} />
      
      <div className={`absolute h-6 w-6 rounded-full bg-accent/50 -z-10 transition-all duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
    </Button>
  )
}