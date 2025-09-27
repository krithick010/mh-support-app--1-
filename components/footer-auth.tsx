"use client"

export function FooterAuth() {
  function isAuthed() {
    return Boolean(typeof window !== "undefined" && localStorage.getItem("role"))
  }

  function logout() {
    localStorage.removeItem("role")
    localStorage.removeItem("name")
    window.location.href = "/"
  }

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
