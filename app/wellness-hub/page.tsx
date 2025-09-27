"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type JournalEntry = { id: string; text: string; createdAt: string }
type MedSession = { id: string; dateISO: string; seconds: number }

function todayKey() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

export default function WellnessHubPage() {
  // Journaling
  const [draft, setDraft] = useState("")
  const [entries, setEntries] = useState<JournalEntry[]>([])
  // Breathing
  const [breathingOn, setBreathingOn] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0) // 0: Inhale, 1: Hold, 2: Exhale, 3: Rest
  const [phaseTime, setPhaseTime] = useState(4)
  const breathingTimer = useRef<number | null>(null)
  // Meditation
  const [medOn, setMedOn] = useState(false)
  const [medSeconds, setMedSeconds] = useState(0)
  const [medSessions, setMedSessions] = useState<MedSession[]>([])
  const medTimer = useRef<number | null>(null)
  // Habits (today)
  const [habits, setHabits] = useState<{ gratitude: boolean; five: boolean; stretch: boolean }>({
    gratitude: false,
    five: false,
    stretch: false,
  })

  // Load persisted data
  useEffect(() => {
    try {
      const je = JSON.parse(localStorage.getItem("journal_entries") || "[]") as JournalEntry[]
      setEntries(je)
    } catch {}
    try {
      const ms = JSON.parse(localStorage.getItem("meditation_sessions") || "[]") as MedSession[]
      setMedSessions(ms)
    } catch {}
    try {
      const hk = "habits_" + todayKey()
      const hv = JSON.parse(localStorage.getItem(hk) || "{}") as Partial<typeof habits>
      setHabits({ gratitude: Boolean(hv.gratitude), five: Boolean(hv.five), stretch: Boolean(hv.stretch) })
    } catch {}
  }, [])

  // Save helpers
  const saveEntries = useCallback((next: JournalEntry[]) => {
    setEntries(next)
    localStorage.setItem("journal_entries", JSON.stringify(next))
  }, [])

  const saveSessions = useCallback((next: MedSession[]) => {
    setMedSessions(next)
    localStorage.setItem("meditation_sessions", JSON.stringify(next))
  }, [])

  const saveHabits = useCallback((next: typeof habits) => {
    setHabits(next)
    localStorage.setItem("habits_" + todayKey(), JSON.stringify(next))
  }, [])

  // Journaling actions
  function addEntry() {
    if (!draft.trim()) return
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      text: draft.trim(),
      createdAt: new Date().toISOString(),
    }
    const next = [entry, ...entries]
    saveEntries(next)
    setDraft("")
  }
  function deleteEntry(id: string) {
    const next = entries.filter((e) => e.id !== id)
    saveEntries(next)
  }

  // Breathing cycle
  const phases = ["Inhale", "Hold", "Exhale", "Rest"]
  useEffect(() => {
    if (!breathingOn) return
    breathingTimer.current = window.setInterval(() => {
      setPhaseTime((t) => {
        if (t > 1) return t - 1
        // move to next phase
        setPhaseIndex((i) => (i + 1) % 4)
        return 4
      })
    }, 1000)
    return () => {
      if (breathingTimer.current) window.clearInterval(breathingTimer.current)
    }
  }, [breathingOn])

  function toggleBreathing() {
    setBreathingOn((on) => !on)
    setPhaseTime(4)
    setPhaseIndex(0)
  }

  // Meditation timer
  useEffect(() => {
    if (!medOn) return
    medTimer.current = window.setInterval(() => {
      setMedSeconds((s) => s + 1)
    }, 1000)
    return () => {
      if (medTimer.current) window.clearInterval(medTimer.current)
    }
  }, [medOn])

  function startStopMeditation() {
    if (medOn) {
      // stopping: save session if > 0
      if (medSeconds > 0) {
        const session: MedSession = {
          id: crypto.randomUUID(),
          dateISO: new Date().toISOString(),
          seconds: medSeconds,
        }
        saveSessions([session, ...medSessions])
      }
      setMedOn(false)
      setMedSeconds(0)
    } else {
      setMedOn(true)
      setMedSeconds(0)
    }
  }

  const totalMinutes = useMemo(() => Math.floor(medSessions.reduce((acc, s) => acc + s.seconds, 0) / 60), [medSessions])

  // Simple daily streak: count back consecutive days with at least one session
  const streak = useMemo(() => {
    const byDay = new Map<string, number>()
    for (const s of medSessions) {
      const day = s.dateISO.slice(0, 10)
      byDay.set(day, (byDay.get(day) || 0) + 1)
    }
    let days = 0
    const d = new Date()
    while (true) {
      const key = d.toISOString().slice(0, 10)
      if (byDay.has(key)) {
        days++
        d.setDate(d.getDate() - 1)
      } else {
        break
      }
    }
    return days
  }, [medSessions])

  return (
    <section className="space-y-6">
      <h1 className="font-sans text-2xl">Wellness Hub — {'"Little practices, big impact."'} </h1>

      {/* Journaling */}
      <div className="space-y-3 rounded-sm border border-border bg-card p-4">
        <p className="font-sans">Journaling</p>
        <p className="text-sm text-muted-foreground">
          Write a few lines to clear your mind. {'"Let it out, gently."'}{" "}
        </p>
        <textarea
          className="w-full rounded-sm border border-border bg-background p-2"
          rows={5}
          placeholder="What’s on your mind today?"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <button onClick={addEntry} className="rounded-sm bg-primary px-3 py-1.5 text-primary-foreground">
            Save entry →
          </button>
          <span className="text-sm text-muted-foreground">{entries.length} entries saved</span>
        </div>
        {entries.length > 0 && (
          <div className="space-y-2">
            <p className="font-sans">Your entries</p>
            <ul className="space-y-2">
              {entries.map((e) => (
                <li key={e.id} className="rounded-sm border border-border bg-background p-2">
                  <p className="text-xs text-muted-foreground">{new Date(e.createdAt).toLocaleString()}</p>
                  <p className="whitespace-pre-wrap">{e.text}</p>
                  <div className="pt-2">
                    <button
                      onClick={() => deleteEntry(e.id)}
                      className="rounded-sm border border-border bg-card px-2 py-1 text-xs"
                      aria-label="Delete journal entry"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Box Breathing Coach (4-4-4-4) */}
      <div className="space-y-2 rounded-sm border border-border bg-card p-4">
        <p className="font-sans">Box Breathing</p>
        <p className="text-sm">Inhale (4), hold (4), exhale (4), rest (4). Follow the phase and the timer.</p>
        <div className="flex items-center justify-between">
          <p className="text-sm">
            Phase: <span className="font-sans">{phases[phaseIndex]}</span>
          </p>
          <p className="text-sm">Time: {phaseTime}s</p>
        </div>
        <div>
          <button onClick={toggleBreathing} className="rounded-sm bg-primary px-3 py-1.5 text-primary-foreground">
            {breathingOn ? "Stop" : "Start"} breathing →
          </button>
        </div>
      </div>

      {/* Meditation Tracker */}
      <div className="space-y-2 rounded-sm border border-border bg-card p-4">
        <p className="font-sans">Meditation</p>
        <p className="text-sm">Press start, sit quietly, and stop when done. We’ll track your sessions.</p>
        <div className="flex items-center justify-between">
          <p className="text-sm">
            Current session: {Math.floor(medSeconds / 60)}m {medSeconds % 60}s
          </p>
          <p className="text-sm">
            Streak: {streak} day{streak === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={startStopMeditation} className="rounded-sm bg-primary px-3 py-1.5 text-primary-foreground">
            {medOn ? "Stop" : "Start"} session →
          </button>
          <span className="text-sm text-muted-foreground">Total: {totalMinutes} min</span>
        </div>
        {medSessions.length > 0 && (
          <div className="pt-2">
            <p className="font-sans">Recent sessions</p>
            <ul className="list-disc pl-5 text-sm">
              {medSessions.slice(0, 5).map((s) => (
                <li key={s.id}>
                  {new Date(s.dateISO).toLocaleString()} — {Math.floor(s.seconds / 60)}m {s.seconds % 60}s
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Daily Techniques Checklist */}
      <div className="space-y-2 rounded-sm border border-border bg-card p-4">
        <p className="font-sans">Today’s gentle practices</p>
        <p className="text-sm text-muted-foreground">Mark what you tried today. Progress, not perfection.</p>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={habits.gratitude}
              onChange={(e) => saveHabits({ ...habits, gratitude: e.target.checked })}
            />
            Write a brief gratitude note
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={habits.five}
              onChange={(e) => saveHabits({ ...habits, five: e.target.checked })}
            />
            5 senses grounding
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={habits.stretch}
              onChange={(e) => saveHabits({ ...habits, stretch: e.target.checked })}
            />
            Light stretch or short walk
          </label>
        </div>
        <p className="text-xs text-muted-foreground">Saved for {todayKey()}.</p>
      </div>
    </section>
  )
}
