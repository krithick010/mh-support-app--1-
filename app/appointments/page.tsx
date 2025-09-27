"use client"

import { useEffect, useState } from "react"

type Booking = {
  id: string
  name: string
  when: string
  notes?: string
}

export default function AppointmentsPage() {
  const [name, setName] = useState("")
  const [when, setWhen] = useState("")
  const [notes, setNotes] = useState("")
  const [list, setList] = useState<Booking[]>([])

  useEffect(() => {
    const savedName = localStorage.getItem("name") || ""
    setName(savedName)
    const saved = localStorage.getItem("appointments")
    setList(saved ? JSON.parse(saved) : [])
  }, [])

  function save(next: Booking[]) {
    setList(next)
    localStorage.setItem("appointments", JSON.stringify(next))
  }

  function add() {
    if (!name.trim()) {
      alert("Your real name is required for booking.")
      return
    }
    if (!when.trim()) return
    const b: Booking = { id: crypto.randomUUID(), name: name.trim(), when, notes: notes.trim() || undefined }
    save([...list, b])
    setWhen("")
    setNotes("")
  }

  function cancel(id: string) {
    save(list.filter((b) => b.id !== id))
  }

  return (
    <section className="space-y-6">
      <h1 className="font-sans text-2xl">Book Appointment</h1>
      <p className="text-sm text-muted-foreground">
        If you need timely support, you can request a timeslot with a counsellor.
      </p>

      <div className="space-y-3 rounded-md border border-border bg-card p-4">
        <label className="text-sm" htmlFor="real-name">
          Real name (required)
        </label>
        <input
          id="real-name"
          className="w-full rounded-md border border-border bg-background px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
        />

        <label className="text-sm" htmlFor="when">
          Date & time (local)
        </label>
        <input
          id="when"
          type="datetime-local"
          className="w-full rounded-md border border-border bg-background px-3 py-2"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
        />

        <label className="text-sm" htmlFor="notes">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          className="w-full rounded-md border border-border bg-background p-2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything you'd like your counsellor to know ahead of time"
        />

        <button onClick={add} className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground">
          Request slot →
        </button>
      </div>

      <div className="space-y-3">
        <p className="font-sans">Your requests</p>
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">No requests yet. You can make one above.</p>
        ) : (
          <ul className="space-y-2">
            {list.map((b) => (
              <li key={b.id} className="rounded-md border border-border bg-card p-3">
                <p>{b.when}</p>
                <p className="text-sm text-muted-foreground">Name: {b.name}</p>
                {b.notes && <p className="text-sm">Notes: {b.notes}</p>}
                <button onClick={() => cancel(b.id)} className="mt-2 underline underline-offset-4 text-sm">
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
