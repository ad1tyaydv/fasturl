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

    const supportsTransition =
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!supportsTransition) {
      setTheme(theme === "dark" ? "light" : "dark")
      return
    }

    const x = event.clientX
    const y = event.clientY

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = (document as any).startViewTransition(() => {
      setTheme(theme === "dark" ? "light" : "dark")
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]

      document.documentElement.animate(
        {
          clipPath: theme === "dark"
            ? [...clipPath].reverse()
            : clipPath
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement:
            theme === "dark"
              ? "::view-transition-old(root)"
              : "::view-transition-new(root)"
        }
      )
    })
  }

  if (!mounted) {
    return (
      <Button
        variant="outline"
        className="w-15 h-8 rounded-full"
      />
    )
  }

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className="w-15 h-8 rounded-full flex items-center justify-between px-2 cursor-pointer transition-all"
    >
      <Sun className="h-4 w-4 dark:text-muted-foreground/40" />
      <Moon className="h-4 w-4 text-muted-foreground/40 dark:text-white" />
    </Button>
  )
}