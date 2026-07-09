"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [dark, setDark] = React.useState(false)

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setDark(isDark)
  }, [])

  const toggle = React.useCallback(() => {
    const root = document.documentElement
    const next = !root.classList.contains("dark")
    root.classList.toggle("dark", next)
    root.classList.toggle("light", !next)
    setDark(next)
  }, [])

  return (
    <Button variant="outline" size="icon" onClick={toggle} aria-label="Переключить тему">
      {dark ? <Sun /> : <Moon />}
    </Button>
  )
}
