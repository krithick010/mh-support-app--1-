"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

function BreathingGuide() {
  const phases = useMemo(
    () => [
      { label: "Inhale", seconds: 4 },
      { label: "Hold", seconds: 4 },
      { label: "Exhale", seconds: 4 },
      { label: "Hold", seconds: 4 },
    ],
    [],
  )
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [remaining, setRemaining] = useState(phases[0].seconds)
  const [running, setRunning] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    timerRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1
        // next phase
        const nextIndex = (phaseIndex + 1) % phases.length
        setPhaseIndex(nextIndex)
        return phases[nextIndex].seconds
      })
    }, 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phaseIndex])

  const toggle = () => setRunning((v) => !v)
  const reset = () => {
    setRunning(false)
    setPhaseIndex(0)
    setRemaining(phases[0].seconds)
  }

  return (
    <Card className="p-4 rounded-lg bg-card">
      <h4 className="text-sm font-medium text-pretty">Guided Breathing</h4>
      <p className="text-xs text-muted-foreground mt-1">{"Try box breathing: in 4s, hold 4s, out 4s, hold 4s."}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{"Phase"}</span>
          <span className="text-xl font-semibold text-balance">{phases[phaseIndex].label}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm text-muted-foreground">{"Remaining"}</span>
          <span className="text-xl font-semibold">{remaining}s</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button onClick={toggle} variant="default" className="rounded-md">
          {running ? "Pause" : "Start"}
        </Button>
        <Button onClick={reset} variant="secondary" className="rounded-md">
          Reset
        </Button>
      </div>
    </Card>
  )
}

function Helplines() {
  const lines = [
    { label: "Emergency Services (US/Canada)", number: "911" },
    { label: "988 Suicide & Crisis Lifeline (US)", number: "988" },
    { label: "Samaritans (UK & ROI)", number: "+44 116 123" },
    { label: "Lifeline (AU)", number: "13 11 14" },
  ]
  return (
    <Card className="p-4 rounded-lg bg-card">
      <h4 className="text-sm font-medium">{"Helplines"}</h4>
      <p className="text-xs text-muted-foreground mt-1">
        {"If you’re in immediate danger, call your local emergency number."}
      </p>
      <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        {lines.map((l) => (
          <li key={l.label} className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
            <span className="text-sm text-pretty">{l.label}</span>
            <Link
              href={`tel:${l.number}`}
              className="text-sm font-medium text-primary underline underline-offset-2 whitespace-nowrap"
            >
              {l.number}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function SOSPanel() {
  useEffect(() => {
    // Optional: flag that SOS has been viewed (for future analytics)
    try {
      localStorage.setItem("sos_last_seen", new Date().toISOString())
    } catch {}
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="rounded-md bg-accent text-accent-foreground hover:opacity-90 font-semibold"
          aria-label="Open SOS options"
        >
          SOS • Get Help Now
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-balance">You are not alone. Help is here.</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <Card className="p-4 rounded-lg bg-card">
            <h4 className="text-sm font-medium">{"Emergency Booking"}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {"Request the earliest available session with a counsellor."}
            </p>
            <div className="mt-3">
              <Link href="/appointments?emergency=1" className="inline-block">
                <Button className="rounded-md">{"Book Emergency Session"}</Button>
              </Link>
            </div>
          </Card>

          <BreathingGuide />

          <Helplines />
        </div>
      </DialogContent>
    </Dialog>
  )
}
