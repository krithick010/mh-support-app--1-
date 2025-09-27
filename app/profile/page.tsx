"use client"

import { useEffect, useState } from "react"

type Role = "student" | "volunteer" | "counsellor"

export default function ProfilePage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<Role | "">("")

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user")
      if (raw) {
        const u = JSON.parse(raw) as { email: string; name: string; role: Role }
        setEmail(u.email || "")
        setName(u.name || "")
        setRole(u.role || "")
      } else {
        // fallbacks
        setName(localStorage.getItem("name") || "")
        setRole((localStorage.getItem("role") as Role) || "")
      }
    } catch {
      // ignore
    }
  }, [])

  function logout() {
    localStorage.removeItem("role")
    localStorage.removeItem("name")
    // keep auth_user if you want "remembered" credentials or remove to fully sign out
    // remove to fully sign out everywhere:
    localStorage.removeItem("auth_user")
    window.location.href = "/"
  }

  return (
    <section className="space-y-6">
      <h1 className="font-sans text-2xl text-accent text-balance">Your Profile — {'"You’re doing your best."'} </h1>
      <div className="rounded-sm border border-border bg-card p-4 space-y-2">
        <p>
          <span className="font-sans">Email:</span> {email || "—"}
        </p>
        <p>
          <span className="font-sans">Name:</span> {name || "—"}
        </p>
        <p>
          <span className="font-sans">Role:</span> {role || "—"}
        </p>
      </div>

      <div className="pt-4">
        <button
          onClick={logout}
          className="rounded-sm border border-border bg-card px-4 py-2 text-sm"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </section>
  )
}
