"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

type Role = "student" | "volunteer" | "counsellor"

interface AuthContextType {
  isAuthed: boolean
  userRole: Role | null
  userName: string
  userEmail: string
  login: (role: Role, name: string, email: string) => void
  logout: () => void
  refreshAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false)
  const [userRole, setUserRole] = useState<Role | null>(null)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")

  const refreshAuth = () => {
    try {
      const role = localStorage.getItem("role") as Role | null
      const name = localStorage.getItem("name") || ""
      const email = localStorage.getItem("userEmail") || ""
      
      if (role && (name || email)) {
        setIsAuthed(true)
        setUserRole(role)
        setUserName(name)
        setUserEmail(email)
      } else {
        setIsAuthed(false)
        setUserRole(null)
        setUserName("")
        setUserEmail("")
      }
    } catch (error) {
      console.error("Error reading auth state:", error)
      setIsAuthed(false)
      setUserRole(null)
      setUserName("")
      setUserEmail("")
    }
  }

  const login = (role: Role, name: string, email: string) => {
    localStorage.setItem("role", role)
    localStorage.setItem("name", name)
    localStorage.setItem("userEmail", email)
    setIsAuthed(true)
    setUserRole(role)
    setUserName(name)
    setUserEmail(email)
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent("authStateChanged"))
  }

  const logout = () => {
    localStorage.removeItem("role")
    localStorage.removeItem("name")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("auth_user")
    setIsAuthed(false)
    setUserRole(null)
    setUserName("")
    setUserEmail("")
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent("authStateChanged"))
  }

  useEffect(() => {
    // Initial load
    refreshAuth()

    // Listen for storage events from other tabs
    const handleStorageChange = () => refreshAuth()
    const handleAuthChange = () => refreshAuth()

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("authStateChanged", handleAuthChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("authStateChanged", handleAuthChange)
    }
  }, [])

  const value = {
    isAuthed,
    userRole,
    userName,
    userEmail,
    login,
    logout,
    refreshAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}