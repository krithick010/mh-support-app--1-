"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function Nav() {
  const pathname = usePathname()
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const authed = Boolean(localStorage.getItem("role") || localStorage.getItem("userEmail"))
    setIsAuthed(authed)
  }, [pathname])

  useEffect(() => {
    const sync = () => {
      const authed = Boolean(localStorage.getItem("role") || localStorage.getItem("userEmail"))
      setIsAuthed(authed)
    }
    window.addEventListener("storage", sync)
    return () => window.removeEventListener("storage", sync)
  }, [])

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href
    return (
      <Link href={href} className={`hover:underline underline-offset-4 ${active ? "text-accent" : ""}`}>
        {label}
      </Link>
    )
  }

  return (
    <nav aria-label="Main">
      <div className="flex w-full items-center justify-between gap-3 text-sm">
        {/* left group */}
        <div className="flex items-center gap-3">
          <NavLink href="/" label="Home" />
          <span>·</span>
          <NavLink href="/appointments" label="Counsellors" />
          <span>·</span>
          <NavLink href="/forum" label="Volunteers" />
        </div>

        {/* right group */}
        <div className="flex items-center gap-3">
          <NavLink href="/appointments" label="Book Appointment" />
          {isAuthed ? (
            <>
              <span>·</span>
              <NavLink href="/profile" label="Profile" />
              <span>·</span>
              {/* Logout per traditional norms: only visible after login */}
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem("auth_user")
                    localStorage.removeItem("role")
                    localStorage.removeItem("name")
                    // optional: signal other tabs
                    window.dispatchEvent(new StorageEvent("storage"))
                  } catch {}
                  window.location.href = "/"
                }}
                className="hover:underline underline-offset-4"
                aria-label="Log out"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <span>·</span>
              <NavLink href="/login" label="Login" />
              <span>·</span>
              <NavLink href="/signup" label="Signup" />
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
