import "~/styles/globals.css"
import { ThemeProvider } from "~/components/theme-provider"
import React from "react"

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

