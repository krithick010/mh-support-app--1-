"use client"

import { usePathname } from "next/navigation"
import { Nav } from "./nav"

export function ConditionalHeader() {
  const pathname = usePathname()
  const hide = pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/signup")
  if (hide) return null

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3">
        <Nav />
      </div>
    </header>
  )
}
