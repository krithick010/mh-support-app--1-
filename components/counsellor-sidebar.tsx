"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  BarChart,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { name: "Dashboard", href: "/counsellor", icon: LayoutDashboard },
  { name: "Students", href: "/counsellor/students", icon: Users },
  { name: "Messages", href: "/counsellor/messages", icon: MessageSquare },
  { name: "Schedule", href: "/counsellor/schedule", icon: Calendar },
  { name: "Reports", href: "/counsellor/reports", icon: FileText },
  { name: "Analytics", href: "/counsellor/analytics", icon: BarChart },
  { name: "Settings", href: "/counsellor/settings", icon: Settings },
]

export function CounsellorSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-background">
      <div className="flex h-full flex-col">
        <div className="p-4">
          <h2 className="text-xl font-bold">Counsellor Portal</h2>
          <p className="text-sm text-muted-foreground">Manage sessions, messages, and analytics</p>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <link.icon className="mr-3 h-5 w-5" />
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
