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
      <div className="space-y-4">
        <blockquote className="text-sm italic text-muted-foreground">
          "Small steps count. Start where you are."
        </blockquote>
        <div className="flex items-center gap-3">
          <Link className="rounded-sm bg-primary px-4 py-2 text-primary-foreground" href="/login">
            Login
          </Link>
          <Link className="rounded-sm border border-border bg-card px-4 py-2" href="/signup">
            Signup
          </Link>
          <Link className="underline underline-offset-4 text-sm" href="/dashboard">
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
