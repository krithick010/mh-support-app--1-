"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export function HomeCTA() {
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    setIsAuthed(Boolean(localStorage.getItem("role")))
  }, [])

  if (!isAuthed) {
    return (
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-center gap-3">
          <Link
            className="rounded-sm bg-primary px-5 py-2.5 text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            href="/login"
          >
            Login ✨
          </Link>
          <Link
            className="rounded-sm border border-border bg-card px-5 py-2.5 hover:bg-accent/5 transition-colors"
            href="/signup"
          >
            Signup
          </Link>
        </div>
        <div>
          <Link
            className="underline underline-offset-4 text-sm text-accent hover:text-accent/80 transition-colors"
            href="/dashboard"
            onClick={() => {
              try {
                localStorage.setItem("guest", "1")
                window.dispatchEvent(new CustomEvent("authStateChanged"))
              } catch {}
            }}
          >
            Continue without signup →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">"Glad you’re here. One day at a time."</p>
      <div className="flex items-center gap-3">
        <Link className="underline underline-offset-4" href="/dashboard">
          Go to your dashboard →
        </Link>
        <Link className="underline underline-offset-4" href="/profile">
          Manage profile →
        </Link>
      </div>
    </div>
  )
}
