"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"

type Role = "student" | "volunteer" | "counsellor"

export default function SignupPage() {
  const router = useRouter()
  const { isAuthed, login } = useAuth()
  const [role, setRole] = useState<Role>("student")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthed) {
      router.replace("/dashboard")
    }
  }, [isAuthed, router])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email.includes("@")) {
      setError("Please use a valid email address.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    const profile = { email: email.trim(), password, name: name.trim(), role }
    localStorage.setItem("auth_user", JSON.stringify(profile))
    login(role, profile.name, profile.email)
    router.push("/dashboard")
  }

  return (
    <section className="space-y-6">
      <h1 className="font-sans text-2xl text-accent text-balance">Create your account — {'"Start gently."'} </h1>
      <p className="text-sm text-muted-foreground">Set a display name, choose a role, and set your sign-in details.</p>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="space-y-2">
          <legend className="text-sm">Email</legend>
          <input
            className="w-full rounded-sm border border-border bg-card px-3 py-2"
            type="email"
            placeholder="you@example.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm">Password</legend>
          <input
            className="w-full rounded-sm border border-border bg-card px-3 py-2"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm">Preferred name</legend>
          <input
            className="w-full rounded-sm border border-border bg-card px-3 py-2"
            placeholder="e.g., Alex"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm">I am a</legend>
          <div className="flex gap-4">
            {(["student", "volunteer", "counsellor"] as Role[]).map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="role" 
                  value={r} 
                  checked={role === r} 
                  onChange={() => setRole(r)}
                  className="text-primary focus:ring-primary" 
                />
                <span className="capitalize text-sm">{r}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex items-center gap-3">
          <button className="rounded-sm bg-primary px-4 py-2 text-primary-foreground" type="submit">
            Create account →
          </button>
          <span className="text-sm">
            Already have an account?{" "}
            <a className="underline underline-offset-4" href="/login">
              Login
            </a>
          </span>
        </div>
      </form>
    </section>
  )
}
