"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "../../contexts/AuthContext"

type Role = "student" | "volunteer" | "counsellor"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthed, login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("student")
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
    
    // For demo purposes, we'll create a simple authentication system
    // In a real app, you'd validate against a backend
    if (!email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    
    try {
      // Check if user exists in localStorage (for demo)
      const raw = localStorage.getItem("auth_user")
      if (raw) {
        const user = JSON.parse(raw) as { email: string; password: string; name: string; role: Role }
        if (user.email === email.trim() && user.password === password) {
          // Use existing account - use the stored role instead of form role
          const profile = { 
            email: email.trim(), 
            password, 
            name: user.name || email.split("@")[0], 
            role: user.role // Use stored role
          }
          localStorage.setItem("auth_user", JSON.stringify(profile))
          login(user.role, user.name || email.split("@")[0], user.email)
          router.push("/dashboard")
          return
        }
      }
      
      // Create new session with provided credentials (for demo)
      const profile = { 
        email: email.trim(), 
        password, 
        name: email.split("@")[0], 
        role 
      }
      localStorage.setItem("auth_user", JSON.stringify(profile))
      login(role, profile.name, profile.email)
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
