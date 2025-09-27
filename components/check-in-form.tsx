"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { COMPLAINTS, computeMHRS, tierSuggestion } from "../lib/mhrs"
import { SuggestionCard } from "./suggestion-card"
import Link from "next/link"
import { SOSPanel } from "./sos-panel"

type CheckInResult = {
  ts: number
  freeText: string
  moodChoice: "positive" | "mixed" | "difficult"
  complaints: string[]
  score: number
  tier: 1 | 2 | 3
  hasSelfHarm: boolean
  overridden?: "wellness" | "chat" | "counsellor" | "skip"
}

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export function CheckInForm() {
  const [freeText, setFreeText] = useState("")
  const [moodChoice, setMoodChoice] = useState<"positive" | "mixed" | "difficult">("mixed")
  const [complaints, setComplaints] = useState<string[]>([])
  const [result, setResult] = useState<CheckInResult | null>(null)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("checkins")
    const history: CheckInResult[] = saved ? JSON.parse(saved) : []
    const tKey = todayKey()
    const today = history.find((h) => new Date(h.ts).toDateString() === new Date().toDateString())
    if (today) setResult(today)
  }, [])

  const emergency = useMemo(() => {
    if (!result) return false
    return result.hasSelfHarm || result.score >= 8
  }, [result])

  function toggleComplaint(key: string) {
    setComplaints((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const computed = computeMHRS({ freeText, moodChoice, complaints })
    const payload: CheckInResult = {
      ts: Date.now(),
      freeText,
      moodChoice,
      complaints: [...complaints],
      score: computed.score,
      tier: computed.tier,
      hasSelfHarm: computed.hasSelfHarm,
    }
    const saved = localStorage.getItem("checkins")
    const history: CheckInResult[] = saved ? JSON.parse(saved) : []
    const tKey = todayKey()
    // Replace today's check-in to prevent duplicates
    const filtered = history.filter((h) => new Date(h.ts).toDateString() !== new Date().toDateString())
    const next = [...filtered, payload]
    localStorage.setItem("checkins", JSON.stringify(next))
    setResult(payload)
    setBannerDismissed(false)
  }

  function handleOverride(choice: CheckInResult["overridden"]) {
    if (!result) return
    const saved = localStorage.getItem("checkins")
    const history: CheckInResult[] = saved ? JSON.parse(saved) : []
    const updated = history.map((h) =>
      new Date(h.ts).toDateString() === new Date(result.ts).toDateString() ? { ...h, overridden: choice } : h,
    )
    localStorage.setItem("checkins", JSON.stringify(updated))
    setResult({ ...result, overridden: choice })
  }

  if (result) {
    const suggestion = tierSuggestion(result.tier)
    return (
      <div className="space-y-4">
        {!bannerDismissed && (result.hasSelfHarm || result.score >= 8) && (
          <div className="sticky top-0 z-10 rounded-md border border-border bg-destructive p-3 text-destructive-foreground">
            <p>
              If you are in immediate danger, please contact your counsellor now —{" "}
              <Link href="/appointments" className="underline underline-offset-4">
                Book appointment →
              </Link>
            </p>
            <button className="mt-2 underline underline-offset-4" onClick={() => setBannerDismissed(true)}>
              Dismiss
            </button>
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Thanks for checking in today. Your selections help us tailor suggestions.
        </p>
        <SuggestionCard suggestion={suggestion} onOverride={handleOverride} />
        <details className="rounded-md border border-border bg-card p-3">
          <summary className="cursor-pointer underline underline-offset-4">View today’s responses</summary>
          <div className="mt-2 space-y-2 text-sm">
            <p>
              Mood:{" "}
              {result.moodChoice === "positive"
                ? "Calm/Happy/Energetic"
                : result.moodChoice === "mixed"
                  ? "Sad/Tired/Irritated"
                  : "Anxious/Hopeless/Angry/Empty"}
            </p>
            <p>Complaints: {result.complaints.length ? result.complaints.join(", ") : "None selected"}</p>
            <p className="text-muted-foreground">We don’t show exact thresholds to keep this supportive and fair.</p>
          </div>
        </details>
        <button className="underline underline-offset-4 text-sm" onClick={() => setResult(null)}>
          Re-do today’s check-in →
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-md border border-border bg-card p-4">
      <fieldset className="space-y-2">
        <legend className="font-sans">How are you feeling today?</legend>
        <textarea
          className="w-full rounded-md border border-border bg-background p-2"
          rows={3}
          placeholder="Write freely. This space is for you."
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
        />
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="font-sans">Mood</legend>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mood"
              value="positive"
              checked={moodChoice === "positive"}
              onChange={() => setMoodChoice("positive")}
            />
            <span>Calm / Happy / Energetic</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mood"
              value="mixed"
              checked={moodChoice === "mixed"}
              onChange={() => setMoodChoice("mixed")}
            />
            <span>Sad / Tired / Irritated</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mood"
              value="difficult"
              checked={moodChoice === "difficult"}
              onChange={() => setMoodChoice("difficult")}
            />
            <span>Anxious / Hopeless / Angry / Empty</span>
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="font-sans">Chief complaints (select all that apply)</legend>
        <div className="grid grid-cols-1 gap-2">
          {COMPLAINTS.map((c) => (
            <label key={c.key} className="flex items-center gap-2">
              <input type="checkbox" checked={complaints.includes(c.key)} onChange={() => toggleComplaint(c.key)} />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
            Get suggestion →
          </button>
          <span className="text-sm text-muted-foreground">You’re in control. You can choose any option later.</span>
        </div>
        <div>
          <SOSPanel />
        </div>
      </div>
    </form>
  )
}
