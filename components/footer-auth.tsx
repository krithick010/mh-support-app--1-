"use client"

import { useEffect, useState } from "react"

export function FooterAuth() {
  const [quote, setQuote] = useState("")

  function isAuthed() {
    return Boolean(typeof window !== "undefined" && localStorage.getItem("role"))
  }

  function logout() {
    localStorage.removeItem("role")
    localStorage.removeItem("name")
    window.location.href = "/"
  }

  useEffect(() => {
    const quotes = [
      "The only journey is the one within.",
      "Your present circumstances don't determine where you can go; they merely determine where you start.",
      "The best way out is always through.",
      "You are not your illness.",
      "Your feelings are valid.",
    ]
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  if (!isAuthed()) return null

  return (
    <div className="flex items-center justify-end">
      <button
        onClick={logout}
        className="rounded-sm border border-border bg-card px-4 py-2 text-sm"
        aria-label="Logout"
      >
        Logout
      </button>
    </div>
  )
}
