"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckInForm } from "../../components/check-in-form"
import Link from "next/link"

type Role = "student" | "volunteer" | "counsellor"
type CheckIn = {
  ts: number
  tier: 1 | 2 | 3
}

function moodStreakSymbol(tier: 1 | 2 | 3) {
  // + for T1, - for T2, ! for T3
  if (tier === 1) return "+"
  if (tier === 2) return "-"
  return "!"
}

export default function DashboardPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("student")
  const [name, setName] = useState("")
  const [history, setHistory] = useState<CheckIn[]>([])

  useEffect(() => {
    const r = (localStorage.getItem("role") as Role) || "student"
    setRole(r)
    if (r === "counsellor") {
      router.replace("/counsellor")
      return
    }
    setName(localStorage.getItem("name") || "")
    const saved = localStorage.getItem("checkins")
    const h = saved ? JSON.parse(saved) : []
    const compact: CheckIn[] = h
      .sort((a: CheckIn, b: CheckIn) => a.ts - b.ts)
      .slice(-10)
      .map((x: any) => ({ ts: x.ts, tier: x.tier }))
    setHistory(compact)
  }, [])

  const progressBar = useMemo(() => {
    const total = 10
    const filled = history.length
    const blocks = Math.round((filled / total) * 10)
    return `[${"■".repeat(blocks)}${"□".repeat(10 - blocks)}] ${Math.round((filled / total) * 100)}%`
  }, [history])

  if (role === "student") {
    return (
      <section className="space-y-6">
        <h1 className="font-sans text-2xl text-accent">
          {name ? `Hi ${name},` : "Hi,"} welcome back — glad you’re here.
        </h1>
        <p className="text-sm text-muted-foreground">
          Mood streak: <span className="font-mono">{history.map((h) => moodStreakSymbol(h.tier)).join(" ")}</span>
        </p>
        <p className="text-sm text-muted-foreground">Check-ins: {progressBar}</p>
        <CheckInForm />
      </section>
    )
  }

  if (role === "volunteer") {
    return (
      <section className="space-y-6">
        <h1 className="font-sans text-2xl">Volunteer Dashboard</h1>
        <p className="text-sm text-muted-foreground">Moderate forum posts and add/edit Wellness Hub entries.</p>
        <div className="space-y-3 rounded-md border border-border bg-card p-4">
          <p className="font-sans">Forum moderation</p>
          <p className="text-sm">Go to the Forum page to edit posts, reply, or ban users if needed.</p>
          <Link className="underline underline-offset-4 text-sm" href="/forum">
            Open Forum →
          </Link>
        </div>
        <div className="space-y-3 rounded-md border border-border bg-card p-4">
          <p className="font-sans">Wellness Hub tools</p>
          <p className="text-sm">Add journaling prompts and breathing exercises on the Wellness Hub page.</p>
          <Link className="underline underline-offset-4 text-sm" href="/wellness-hub">
            Open Wellness Hub →
          </Link>
        </div>
      </section>
    )
  }

  // counsellor
  return (
    <section className="space-y-6">
      <h1 className="font-sans text-2xl">Counsellor Dashboard</h1>
      <p className="text-sm text-muted-foreground">View appointments, messages, trends, and update the Wellness Hub.</p>

      <div className="space-y-2 rounded-md border border-border bg-card p-4">
        <p className="font-sans">Appointments</p>
        <Link className="underline underline-offset-4 text-sm" href="/appointments">
          Review bookings →
        </Link>
      </div>

      <div className="space-y-2 rounded-md border border-border bg-card p-4">
        <p className="font-sans">Messages</p>
        <p className="text-sm text-muted-foreground">Messaging placeholder. This area remains neutral.</p>
      </div>

      <AnalyticsTrends />
      <div className="space-y-2 rounded-md border border-border bg-card p-4">
        <p className="font-sans">Wellness Hub</p>
        <Link className="underline underline-offset-4 text-sm" href="/wellness-hub">
          Edit Wellness Hub →
        </Link>
      </div>
    </section>
  )
}

function AnalyticsTrends() {
  const [avg, setAvg] = useState<number>(0)
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    const saved = localStorage.getItem("checkins")
    const all = saved ? JSON.parse(saved) : []
    setCount(all.length)
    if (all.length) {
      const sum = all.reduce((s: number, x: any) => s + Number(x.score || 0), 0)
      setAvg(sum / all.length)
    }
  }, [])

  return (
    <div className="space-y-2 rounded-md border border-border bg-card p-4">
      <p className="font-sans">Wellbeing trends (neutral)</p>
      <p className="text-sm">Check-ins recorded: {count}</p>
      <p className="text-sm">Average relative indicator: [{avg ? "■■■■■" : "□□□"}]</p>
      <p className="text-xs text-muted-foreground">
        Exact thresholds are not shown to prevent gaming. This is a broad indicator.
      </p>
    </div>
  )
}
