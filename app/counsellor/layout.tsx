"use client"

import { CounsellorSidebar } from "@/components/counsellor-sidebar"

export default function CounsellorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <div className="flex min-h-screen relative z-10">
      <CounsellorSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
