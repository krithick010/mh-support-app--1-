"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isCounsellorRoute = pathname.startsWith("/counsellor")

  if (isCounsellorRoute) {
    return <>{children}</>
  }

  return (
    <main className="relative z-10 mx-auto max-w-4xl px-6 py-12 min-h-[calc(100vh-120px)] flex flex-col justify-center">
      <div className="w-full max-w-2xl mx-auto">{children}</div>
    </main>
  )
}
