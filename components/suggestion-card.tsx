"use client"

import Link from "next/link"
import { useState } from "react"

type Suggestion = {
  title: string
  route: string
  why: string
  cta: string
  kind: "wellness" | "chat" | "counsellor"
}

export function SuggestionCard({
  suggestion,
  onOverride,
}: {
  suggestion: Suggestion
  onOverride: (choice: "wellness" | "chat" | "counsellor" | "skip") => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <section className="rounded-md border border-border bg-card p-4 space-y-4">
      <p className="text-accent">{suggestion.title}</p>
      <div className="flex items-center gap-3">
        <Link
          href={suggestion.route}
          className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:underline underline-offset-4"
        >
          {suggestion.cta}
        </Link>
        <button type="button" onClick={() => setOpen((v) => !v)} className="text-sm underline underline-offset-4">
          {open ? "Why (hide) ←" : "Why this suggestion? →"}
        </button>
      </div>
      {open && <p className="text-sm text-muted-foreground">{suggestion.why}</p>}
      <hr className="border-border" />
      <div className="space-y-2">
        <p className="text-sm">Prefer a different path? Choose one:</p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <button className="underline underline-offset-4" onClick={() => onOverride("wellness")}>
            Wellness Hub
          </button>
          <span>·</span>
          <button className="underline underline-offset-4" onClick={() => onOverride("chat")}>
            Cookie (Chatbot)
          </button>
          <span>·</span>
          <button className="underline underline-offset-4" onClick={() => onOverride("counsellor")}>
            Counsellor
          </button>
          <span>·</span>
          <button className="underline underline-offset-4" onClick={() => onOverride("skip")}>
            Skip
          </button>
        </div>
      </div>
    </section>
  )
}
