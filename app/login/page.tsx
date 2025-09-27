"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Role = "student" | "volunteer" | "counsellor"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If already authenticated, optionally skip login
    const role = localStorage.getItem("role")
    if (role) {
      // You can redirect if desired:
      // router.replace("/dashboard")
    }
  }, [router])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const raw = localStorage.getItem("auth_user")
      if (!raw) {
        setError("No account found. Please sign up first.")
        return
      }
      const user = JSON.parse(raw) as { email: string; password: string; name: string; role: Role }
      if (user.email !== email.trim() || user.password !== password) {
        setError("Invalid email or password.")
        return
      }
      // set auth compatibility keys
      localStorage.setItem("role", user.role)
      localStorage.setItem("name", user.name || "")
      router.push("/dashboard")
    } catch {
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="font-sans text-2xl text-accent text-balance">Welcome back — {'"We’re in your corner."'} </h1>
      <p className="text-sm text-muted-foreground">Sign in with your email to continue.</p>

      <blockquote className="text-sm italic text-muted-foreground">
        {'"You don’t have to have it all figured out to move forward."'}
      </blockquote>

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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </fieldset>

        <div className="flex items-center gap-3">
          <button className="rounded-sm bg-primary px-4 py-2 text-primary-foreground" type="submit">
            Login →
          </button>
          <Link href="/signup" className="rounded-sm border border-border bg-card px-4 py-2" aria-label="Go to Sign Up">
            Sign up
          </Link>
          <span className="text-muted-foreground text-sm">{'"You’re safe here. Take your time."'} </span>
        </div>
      </form>
      <p className="text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Sign Up
        </Link>
      </p>
      <p className="text-sm">
        New here?{" "}
        <Link href="/signup" className="underline underline-offset-4" prefetch>
          Create an account
        </Link>
      </p>
    </section>
  )
}
