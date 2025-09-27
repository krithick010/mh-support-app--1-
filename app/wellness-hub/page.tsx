"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type JournalEntry = { id: string; text: string; createdAt: string }
type MedSession = { id: string; dateISO: string; seconds: number }
type MoodEntry = { id: string; mood: string; note: string; date: string }
type Affirmation = { id: string; text: string; isFavorite: boolean }

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
  
  // Mood Tracker
  const [currentMood, setCurrentMood] = useState("")
  const [moodNote, setMoodNote] = useState("")
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  
  // Daily Affirmations
  const [currentAffirmation, setCurrentAffirmation] = useState("")
  const [savedAffirmations, setSavedAffirmations] = useState<Affirmation[]>([])
  const [showAffirmation, setShowAffirmation] = useState(false)

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
    try {
      const me = JSON.parse(localStorage.getItem("mood_entries") || "[]") as MoodEntry[]
      setMoodEntries(me)
    } catch {}
    try {
      const sa = JSON.parse(localStorage.getItem("saved_affirmations") || "[]") as Affirmation[]
      setSavedAffirmations(sa)
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

  const saveMoodEntries = useCallback((next: MoodEntry[]) => {
    setMoodEntries(next)
    localStorage.setItem("mood_entries", JSON.stringify(next))
  }, [])

  const saveAffirmations = useCallback((next: Affirmation[]) => {
    setSavedAffirmations(next)
    localStorage.setItem("saved_affirmations", JSON.stringify(next))
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

  // Mood tracking functions
  function saveMood() {
    if (!currentMood) return
    const moodEntry: MoodEntry = {
      id: crypto.randomUUID(),
      mood: currentMood,
      note: moodNote.trim(),
      date: todayKey(),
    }
    const next = [moodEntry, ...moodEntries.filter(e => e.date !== todayKey())] // Replace today's entry
    saveMoodEntries(next)
    setMoodNote("")
  }

  function deleteMoodEntry(id: string) {
    const next = moodEntries.filter((e) => e.id !== id)
    saveMoodEntries(next)
  }

  // Affirmation functions
  const dailyAffirmations = [
    "I am worthy of love and respect.",
    "I choose to be kind to myself today.",
    "My feelings are valid and important.",
    "I am capable of handling whatever comes my way.",
    "I deserve peace and happiness.",
    "I am growing stronger every day.",
    "I trust myself to make good decisions.",
    "I am enough, just as I am.",
    "My past does not define my future.",
    "I choose joy and gratitude today."
  ]

  function getRandomAffirmation() {
    const available = dailyAffirmations.filter(a => !savedAffirmations.some(sa => sa.text === a))
    if (available.length === 0) return dailyAffirmations[Math.floor(Math.random() * dailyAffirmations.length)]
    return available[Math.floor(Math.random() * available.length)]
  }

  function showNewAffirmation() {
    setCurrentAffirmation(getRandomAffirmation())
    setShowAffirmation(true)
  }

  function saveCurrentAffirmation() {
    if (!currentAffirmation) return
    const affirmation: Affirmation = {
      id: crypto.randomUUID(),
      text: currentAffirmation,
      isFavorite: true,
    }
    const next = [...savedAffirmations, affirmation]
    saveAffirmations(next)
  }

  function toggleAffirmationFavorite(id: string) {
    const next = savedAffirmations.map(a => 
      a.id === id ? { ...a, isFavorite: !a.isFavorite } : a
    )
    saveAffirmations(next)
  }

  function deleteAffirmation(id: string) {
    const next = savedAffirmations.filter(a => a.id !== id)
    saveAffirmations(next)
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
    <section className="space-y-4">
      {/* friendly, encouraging header */}
      <h1 className="font-sans text-2xl text-accent text-balance">Wellness Hub — "Little practices, big impact."</h1>
      <p className="text-sm text-muted-foreground">
        Simple, gentle tools for your wellbeing. Take what helps, leave what doesn't.
      </p>

      <div className="pt-2 space-y-4">
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
      </div>

      {/* Mood Tracker */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Mood Tracker</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">How are you feeling today?</label>
            <div className="flex gap-2 flex-wrap">
              {["😊 Happy", "😌 Calm", "😔 Sad", "😤 Angry", "😰 Anxious", "😴 Tired", "🤔 Confused", "❤️ Loved"].map((mood) => (
                <button
                  key={mood}
                  onClick={() => setCurrentMood(mood)}
                  className={`px-3 py-2 rounded-md text-sm border transition-colors ${
                    currentMood === mood
                      ? "bg-blue-100 border-blue-300 text-blue-700"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notes (optional)</label>
            <Textarea
              value={moodNote}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMoodNote(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[80px]"
            />
          </div>
          <Button onClick={saveMood} disabled={!currentMood} className="w-full">
            Save Mood Entry
          </Button>
          {moodEntries.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Recent Entries</h3>
              <div className="space-y-2">
                {moodEntries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <span className="font-medium">{entry.mood}</span>
                      {entry.note && <p className="text-sm text-gray-600 mt-1">{entry.note}</p>}
                      <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMoodEntry(entry.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Daily Affirmations */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Affirmations</h2>
        <div className="space-y-4">
          {showAffirmation && currentAffirmation && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-lg font-medium text-center mb-4">"{currentAffirmation}"</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={saveCurrentAffirmation} variant="outline">
                  Save to Favorites
                </Button>
                <Button onClick={() => setShowAffirmation(false)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          )}
          <Button onClick={showNewAffirmation} className="w-full">
            Get New Affirmation
          </Button>
          {savedAffirmations.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Your Favorite Affirmations</h3>
              <div className="space-y-2">
                {savedAffirmations.filter(a => a.isFavorite).map((affirmation) => (
                  <div key={affirmation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <p className="flex-1">"{affirmation.text}"</p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAffirmationFavorite(affirmation.id)}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        {affirmation.isFavorite ? "★" : "☆"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAffirmation(affirmation.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
