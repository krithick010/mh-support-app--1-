"use client"

import type React from "react"

import { useEffect, useState } from "react"

type ChatMessage = { role: "you" | "assistant"; text: string; ts: number }

export default function CookiePage() {
  const [key, setKey] = useState("")
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    setKey(localStorage.getItem("cookie_api_key") || "")
    const saved = localStorage.getItem("cookie_chat")
    if (saved) setMessages(JSON.parse(saved))
  }, [])

  function saveKey() {
    localStorage.setItem("cookie_api_key", key)
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    const next = [
      ...messages,
      { role: "you", text: trimmed, ts: Date.now() },
      // mock assistant reply
      {
        role: "assistant",
        text: '"Thanks for sharing. One small step you can take right now is to breathe and notice your feet on the floor."',
        ts: Date.now() + 1,
      },
    ]
    setMessages(next)
    localStorage.setItem("cookie_chat", JSON.stringify(next))
    setInput("")
  }

  return (
    <section className="space-y-6">
      <h1 className="font-sans text-2xl">Cookie (Chatbot)</h1>
      <p className="text-sm text-muted-foreground">
        Placeholder — add your API key below to enable real chat later. For now, this is a simple mock.
      </p>

      <div className="space-y-3 rounded-sm border border-border bg-card p-4">
        <label className="text-sm" htmlFor="api-key">
          API Key
        </label>
        <input
          id="api-key"
          className="w-full rounded-sm border border-border bg-background px-3 py-2"
          placeholder="Paste key here"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button onClick={saveKey} className="rounded-sm bg-primary px-3 py-1.5 text-primary-foreground">
          Save →
        </button>
      </div>

      <div className="space-y-3 rounded-sm border border-border bg-card p-4">
        <p className="font-sans">Chat</p>
        <div className="max-h-64 overflow-auto rounded-sm border border-border bg-background p-3 text-sm">
          {messages.length === 0 ? (
            <p className="text-muted-foreground">"Say hello — I’m here to listen."</p>
          ) : (
            <ul className="space-y-2">
              {messages.map((m, i) => (
                <li key={m.ts + i} className="leading-relaxed">
                  <span className="font-mono text-xs mr-2">{m.role === "you" ? "You" : "Cookie"}</span>
                  <span>{m.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            className="flex-1 rounded-sm border border-border bg-background px-3 py-2"
            placeholder='Type a message (e.g., "Feeling overwhelmed today")'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="rounded-sm bg-primary px-3 py-2 text-primary-foreground" type="submit">
            Send
          </button>
        </form>
      </div>
    </section>
  )
}
