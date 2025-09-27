"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "./ui/button"
import { Menu, X, User, LogOut, Calendar, MessageSquare, Home, Users, Bot, Sparkles } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

export function Nav() {
  const pathname = usePathname()
  const { isAuthed, userRole, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
    window.location.href = "/"
  }

  const NavLink = ({ href, label, icon: Icon, mobile = false }: { 
    href: string; 
    label: string; 
    icon?: any;
    mobile?: boolean;
  }) => {
    const active = pathname === href
    const baseClasses = mobile 
      ? "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200" 
      : "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
    
    const activeClasses = active 
      ? "bg-primary/10 text-primary border border-primary/20" 
      : "text-slate-600 hover:text-slate-800 hover:bg-slate-100/50"
    
    const darkActiveClasses = active 
      ? "dark:bg-primary/20 dark:text-primary" 
      : "dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800/50"

    return (
      <Link 
        href={href} 
        className={`${baseClasses} ${activeClasses} ${darkActiveClasses}`}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
      >
        {Icon && <Icon size={mobile ? 20 : 16} />}
        {label}
      </Link>
    )
  }

  return (
    <>
      <nav className="w-full" aria-label="Main Navigation">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
            <span className="hidden sm:block">Flourish</span>
            <span className="sm:hidden">CW</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {!isAuthed || !userRole ? (
              // Public navigation - show when not authenticated or no role
              <>
                <NavLink href="/" label="Home" icon={Home} />
                <NavLink href="/appointments" label="Counsellors" icon={Calendar} />
                <NavLink href="/forum" label="Community" icon={MessageSquare} />
                <NavLink href="/volunteer" label="Volunteers" icon={Users} />
                <NavLink href="/wellness-hub" label="Wellness Hub" />
              </>
            ) : userRole === 'student' ? (
              // Student navigation
              <>
                <NavLink href="/wellness-hub" label="Wellness Hub" icon={Sparkles} />
                <NavLink href="/forum" label="Forum" icon={MessageSquare} />
                <NavLink href="/cookie" label="Chatbot" icon={Bot} />
                <NavLink href="/appointments" label="Book Appointment" icon={Calendar} />
              </>
            ) : userRole === 'counsellor' ? (
              // Counsellor navigation
              <>
                <NavLink href="/counsellor" label="Dashboard" icon={Home} />
                <NavLink href="/appointments" label="Appointments" icon={Calendar} />
                <NavLink href="/forum" label="Forum" icon={MessageSquare} />
              </>
            ) : userRole === 'volunteer' ? (
              // Volunteer navigation
              <>
                <NavLink href="/volunteer" label="Dashboard" icon={Home} />
                <NavLink href="/forum" label="Forum" icon={MessageSquare} />
                <NavLink href="/wellness-hub" label="Wellness Hub" icon={Sparkles} />
              </>
            ) : (
              // Default navigation for other roles
              <>
                <NavLink href="/" label="Home" icon={Home} />
                <NavLink href="/appointments" label="Counsellors" icon={Calendar} />
                <NavLink href="/forum" label="Community" icon={MessageSquare} />
                <NavLink href="/volunteer" label="Volunteers" icon={Users} />
                <NavLink href="/wellness-hub" label="Wellness Hub" />
              </>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthed ? (
              <>
                <NavLink href="/dashboard" label="Dashboard" />
                <NavLink href="/profile" label="Profile" icon={User} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm"
                >
                  <LogOut size={14} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-xl border-l border-border">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">Flourish</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {!isAuthed || !userRole ? (
                    // Public mobile navigation - show when not authenticated or no role
                    <>
                      <NavLink href="/" label="Home" icon={Home} mobile />
                      <NavLink href="/appointments" label="Counsellors" icon={Calendar} mobile />
                      <NavLink href="/forum" label="Community" icon={MessageSquare} mobile />
                      <NavLink href="/volunteer" label="Volunteers" icon={Users} mobile />
                      <NavLink href="/wellness-hub" label="Wellness Hub" mobile />
                    </>
                  ) : userRole === 'student' ? (
                    // Student mobile navigation
                    <>
                      <NavLink href="/wellness-hub" label="Wellness Hub" icon={Sparkles} mobile />
                      <NavLink href="/forum" label="Forum" icon={MessageSquare} mobile />
                      <NavLink href="/api/chat" label="Chatbot" icon={Bot} mobile />
                      <NavLink href="/appointments" label="Book Appointment" icon={Calendar} mobile />
                    </>
                  ) : userRole === 'counsellor' ? (
                    // Counsellor mobile navigation
                    <>
                      <NavLink href="/counsellor" label="Dashboard" icon={Home} mobile />
                      <NavLink href="/appointments" label="Appointments" icon={Calendar} mobile />
                      <NavLink href="/forum" label="Forum" icon={MessageSquare} mobile />
                    </>
                  ) : userRole === 'volunteer' ? (
                    // Volunteer mobile navigation
                    <>
                      <NavLink href="/volunteer" label="Dashboard" icon={Home} mobile />
                      <NavLink href="/forum" label="Forum" icon={MessageSquare} mobile />
                      <NavLink href="/wellness-hub" label="Wellness Hub" icon={Sparkles} mobile />
                    </>
                  ) : (
                    // Default mobile navigation for other roles
                    <>
                      <NavLink href="/" label="Home" icon={Home} mobile />
                      <NavLink href="/appointments" label="Counsellors" icon={Calendar} mobile />
                      <NavLink href="/forum" label="Community" icon={MessageSquare} mobile />
                      <NavLink href="/volunteer" label="Volunteers" icon={Users} mobile />
                      <NavLink href="/wellness-hub" label="Wellness Hub" mobile />
                    </>
                  )}
                  
                  {isAuthed && (
                    <>
                      <div className="my-4 border-t border-border" />
                      <NavLink href="/dashboard" label="Dashboard" mobile />
                      <NavLink href="/profile" label="Profile" icon={User} mobile />
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Auth Section */}
              <div className="p-4 border-t border-border">
                {isAuthed ? (
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
