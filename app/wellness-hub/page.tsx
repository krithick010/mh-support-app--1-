"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

type JournalEntry = { id: string; text: string; createdAt: string }
type MedSession = { id: string; dateISO: string; seconds: number }
type Affirmation = { id: string; text: string; isFavorite: boolean }

function todayKey() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

export default function WellnessHubPage() {
  // Role for volunteer oversight
  const [role, setRole] = useState<"student" | "volunteer" | "counsellor">("student")

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

  // Daily Affirmations
  const [currentAffirmation, setCurrentAffirmation] = useState("")
  const [savedAffirmations, setSavedAffirmations] = useState<Affirmation[]>([])
  const [showAffirmation, setShowAffirmation] = useState(false)

  // Audio player (Web Audio) - simple soft tone and calm noise
  const audioCtxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [track, setTrack] = useState<"tone" | "noise" | "">("")
  const [volume, setVolume] = useState(0.2)
  const sourceRef = useRef<AudioNode | null>(null)

  type BookRec = { id: string; title: string; author?: string; link?: string }
  type VideoRec = { id: string; title: string; url: string }
  type ResourceRec = { id: string; title: string; url: string }

  const [books, setBooks] = useState<BookRec[]>([])
  const [bookPicks, setBookPicks] = useState<BookRec[]>([])
  const [videos, setVideos] = useState<VideoRec[]>([])
  const [resources, setResources] = useState<ResourceRec[]>([])
  const [selectedVideo, setSelectedVideo] = useState<string>("")

  // Load persisted data
  useEffect(() => {
    try {
      setRole(((localStorage.getItem("role") as any) || "student") as any)
    } catch {}
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
      const sa = JSON.parse(localStorage.getItem("saved_affirmations") || "[]") as Affirmation[]
      setSavedAffirmations(sa)
    } catch {}
    try {
      const defaults: BookRec[] = [
        { id: "b1", title: "Atomic Habits", author: "James Clear", link: "https://jamesclear.com/atomic-habits" },
        { id: "b2", title: "The Happiness Trap", author: "Russ Harris" },
        { id: "b3", title: "Self-Compassion", author: "Kristin Neff" },
        { id: "b4", title: "Why We Sleep", author: "Matthew Walker" },
      ]
      const stored = JSON.parse(localStorage.getItem("wellness_books") || "null") as BookRec[] | null
      const merged = stored && stored.length ? stored : defaults
      setBooks(merged)
      // initialize picks
      setBookPicks(shufflePick(merged, 3))
    } catch {}
    try {
      const defaultVideos: VideoRec[] = [
        { id: "v1", title: "Box Breathing in 2 minutes", url: "https://www.youtube.com/watch?v=tEmt1Znux58" },
        { id: "v2", title: "5-4-3-2-1 Grounding Technique", url: "https://www.youtube.com/watch?v=30VMIEmA114" },
        { id: "v3", title: "Loving-Kindness Meditation", url: "https://www.youtube.com/watch?v=szt7f5NmE9E" },
      ]
      const storedV = JSON.parse(localStorage.getItem("wellness_videos") || "null") as VideoRec[] | null
      setVideos(storedV && storedV.length ? storedV : defaultVideos)
    } catch {}
    try {
      const defaultRes: ResourceRec[] = [
        { id: "r1", title: "WHO: Mental health", url: "https://www.who.int/health-topics/mental-health" },
        { id: "r2", title: "Mind UK: Information & support", url: "https://www.mind.org.uk/" },
        { id: "r3", title: "Verywell Mind: Coping Skills", url: "https://www.verywellmind.com/" },
      ]
      const storedR = JSON.parse(localStorage.getItem("wellness_resources") || "null") as ResourceRec[] | null
      setResources(storedR && storedR.length ? storedR : defaultRes)
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

  const saveAffirmations = useCallback((next: Affirmation[]) => {
    setSavedAffirmations(next)
    localStorage.setItem("saved_affirmations", JSON.stringify(next))
  }, [])

  // Save helpers for curated lists
  const saveBooks = useCallback((next: BookRec[]) => {
    setBooks(next)
    localStorage.setItem("wellness_books", JSON.stringify(next))
  }, [])
  const saveVideos = useCallback((next: VideoRec[]) => {
    setVideos(next)
    localStorage.setItem("wellness_videos", JSON.stringify(next))
  }, [])
  const saveResources = useCallback((next: ResourceRec[]) => {
    setResources(next)
    localStorage.setItem("wellness_resources", JSON.stringify(next))
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

  // Utils
  function shufflePick<T>(arr: T[], n: number) {
    const copy = [...arr]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy.slice(0, Math.max(1, Math.min(n, copy.length)))
  }

  // Audio functions
  function ensureAudio() {
    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const gain = ctx.createGain()
      gain.gain.value = volume
      gain.connect(ctx.destination)
      audioCtxRef.current = ctx
      gainRef.current = gain
    }
  }

  function stopAudio() {
    if (sourceRef.current && "disconnect" in sourceRef.current) {
      try {
        ;(sourceRef.current as any).stop?.()
      } catch {}
      try {
        sourceRef.current.disconnect()
      } catch {}
    }
    sourceRef.current = null
    setIsPlaying(false)
  }

  function playTone() {
    ensureAudio()
    const ctx = audioCtxRef.current!
    const osc = ctx.createOscillator()
    osc.type = "sine"
    osc.frequency.value = 432 // soft tone
    osc.connect(gainRef.current!)
    osc.start()
    sourceRef.current = osc
    setIsPlaying(true)
  }

  function createNoiseSource(kind: "lowpass"): AudioNode {
    const ctx = audioCtxRef.current!
    const bufferSize = 2 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1 // white noise
    }
    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.value = kind === "lowpass" ? 800 : 800
    src.connect(filter)
    filter.connect(gainRef.current!)
    src.start()
    return filter
  }

  function playNoise() {
    ensureAudio()
    const node = createNoiseSource("lowpass")
    sourceRef.current = node
    setIsPlaying(true)
  }

  function handlePlay(t: "tone" | "noise") {
    if (isPlaying) stopAudio()
    setTrack(t)
    if (t === "tone") playTone()
    else playNoise()
  }

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume
  }, [volume])

  useEffect(() => {
    return () => {
      stopAudio()
      try { audioCtxRef.current?.close() } catch {}
    }
  }, [])

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
      <h1 className="font-sans text-2xl text-primary text-balance">Wellness Hub — "Little practices, big impact."</h1>
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

      {/* Audio Library */}
      <div className="rounded-md border border-border bg-card p-4 space-y-3">
        <p className="font-sans">Audio Library</p>
        <p className="text-sm text-muted-foreground">Soft tone and calm noise for short focus or rest moments.</p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded-sm border border-border px-3 py-1.5 text-sm"
            onClick={() => handlePlay("tone")}
          >
            Play soft tone
          </button>
          <button
            className="rounded-sm border border-border px-3 py-1.5 text-sm"
            onClick={() => handlePlay("noise")}
          >
            Play calm noise
          </button>
          <button
            className="rounded-sm border border-border px-3 py-1.5 text-sm"
            onClick={stopAudio}
          >
            Stop
          </button>
          <label className="text-sm flex items-center gap-2 ml-2">
            Volume
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">Current: {isPlaying ? (track === "tone" ? "Soft tone" : "Calm noise") : "Stopped"}</p>
      </div>

      {/* Video Library (placeholder) */}
      <div className="rounded-md border border-border bg-card p-4 space-y-3">
        <p className="font-sans">Video Library</p>
        <p className="text-sm text-muted-foreground">Tap a card to open the video in a new tab. Placeholder thumbnails only.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {videos.map(v => (
            <div key={v.id} className="rounded-md border border-border bg-background p-3 space-y-2">
              <div className="aspect-video w-full rounded-sm bg-muted flex items-center justify-center text-xs text-muted-foreground">
                Thumbnail
              </div>
              <p className="text-sm font-medium">{v.title}</p>
              <div className="flex gap-2">
                <a href={v.url} target="_blank" rel="noreferrer" className="underline underline-offset-4 text-sm">Open</a>
                {role === "volunteer" && (
                  <button
                    onClick={() => saveVideos(videos.filter(x => x.id !== v.id))}
                    className="underline underline-offset-4 text-red-600 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {role === "volunteer" && (
          <AddItemForm
            label="Add video"
            onAdd={(title: string, url: string) => saveVideos([...videos, { id: crypto.randomUUID(), title, url }])}
          />
        )}
      </div>

      {/* Books Recommendations with shuffle */}
      <div className="rounded-md border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-sans">Book Recommendations</p>
          <button
            className="rounded-sm border border-border px-3 py-1.5 text-sm"
            onClick={() => setBookPicks(shufflePick(books, 3))}
          >
            Shuffle
          </button>
        </div>
        {bookPicks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No picks yet.</p>
        ) : (
          <ul className="space-y-2">
            {bookPicks.map(b => (
              <li key={b.id} className="rounded-md border border-border bg-background p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{b.title}</p>
                  {b.author && <p className="text-xs text-muted-foreground">{b.author}</p>}
                  {b.link && <a className="text-xs underline underline-offset-4" target="_blank" rel="noreferrer" href={b.link}>Learn more</a>}
                </div>
                {role === "volunteer" && (
                  <button
                    onClick={() => {
                      const next = books.filter(x => x.id !== b.id)
                      saveBooks(next)
                      setBookPicks(p => p.filter(x => x.id !== b.id))
                    }}
                    className="underline underline-offset-4 text-red-600 text-sm"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        {role === "volunteer" && (
          <AddItemForm
            label="Add book"
            onAdd={(title: string, urlOrAuthor: string) => {
              const rec = { id: crypto.randomUUID(), title, author: urlOrAuthor || undefined }
              saveBooks([...books, rec])
              setBookPicks(p => (p.length < 3 ? [...p, rec] : p))
            }}
            secondLabel="Author (optional)"
          />
        )}
      </div>

      {/* Resources Recommendations */}
      <div className="rounded-md border border-border bg-card p-4 space-y-3">
        <p className="font-sans">Helpful Resources</p>
        <ul className="space-y-2">
          {resources.map(r => (
            <li key={r.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-background p-3">
              <a href={r.url} target="_blank" rel="noreferrer" className="underline underline-offset-4 text-sm">
                {r.title}
              </a>
              {role === "volunteer" && (
                <button
                  onClick={() => saveResources(resources.filter(x => x.id !== r.id))}
                  className="underline underline-offset-4 text-red-600 text-sm"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
        {role === "volunteer" && (
          <AddItemForm
            label="Add resource"
            onAdd={(title: string, url: string) => saveResources([...resources, { id: crypto.randomUUID(), title, url }])}
          />
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

  {/* Mood Tracker removed as requested */}

      {/* Gentle Affirmations */}
  <div className="rounded-lg shadow-sm border p-6 bg-card border-border">
        <h2 className="text-xl font-semibold mb-4 text-primary">Gentle Affirmations</h2>
        <div className="space-y-4">
          {showAffirmation && currentAffirmation && (
    <div className="p-4 bg-background border border-border rounded-lg">
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
              <h3 className="font-medium mb-2 text-primary">Your Favorite Affirmations</h3>
        <div className="space-y-2">
                {savedAffirmations.filter(a => a.isFavorite).map((affirmation) => (
          <div key={affirmation.id} className="flex items-center justify-between p-3 bg-background rounded-md border border-border">
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

function AddItemForm({
  label,
  onAdd,
  secondLabel = "Link"
}: {
  label: string
  onAdd: (title: string, second: string) => void
  secondLabel?: string
}) {
  const [title, setTitle] = useState("")
  const [second, setSecond] = useState("")
  return (
    <form
      className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (!title.trim()) return
        onAdd(title.trim(), second.trim())
        setTitle("")
        setSecond("")
      }}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-md border border-border bg-background px-3 py-2 text-sm sm:col-span-2"
      />
      <input
        type="text"
        placeholder={secondLabel}
        value={second}
        onChange={(e) => setSecond(e.target.value)}
        className="rounded-md border border-border bg-background px-3 py-2 text-sm sm:col-span-2"
      />
      <button
        type="submit"
        className="rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm sm:col-span-1"
      >
        {label}
      </button>
    </form>
  )
}
