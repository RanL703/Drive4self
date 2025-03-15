"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: Theme
  enableSystem?: boolean
  forcedTheme?: Theme
}

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
} | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  forcedTheme,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    if (forcedTheme) {
      setTheme(forcedTheme)
      document.documentElement.className = forcedTheme
    }
  }, [forcedTheme])

  const value = {
    theme: forcedTheme || theme,
    setTheme: (newTheme: Theme) => {
      if (forcedTheme) return
      setTheme(newTheme)
      document.documentElement.className = newTheme
    },
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
} 