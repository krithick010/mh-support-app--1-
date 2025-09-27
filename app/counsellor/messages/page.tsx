"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Conversation = {
  id: string
  name: string
  lastMessage: string
}

type Message = {
  id: string
  from: "me" | "them"
  text: string
}

const sampleConversations: Conversation[] = [
  { id: "1", name: "Asha R.", lastMessage: "Thank you for your help" },
  { id: "2", name: "Rahul K.", lastMessage: "Can we reschedule?" },
  { id: "3", name: "Priya S.", lastMessage: "See you tomorrow" },
]

const sampleMessages: Record<string, Message[]> = {
  "1": [
    { id: "m1", from: "them", text: "Hi, I'm feeling anxious about exams." },
    { id: "m2", from: "me", text: "Thanks for reaching out. Let's break this down." },
    { id: "m3", from: "them", text: "That would help." },
  ],
  "2": [
    { id: "m1", from: "them", text: "Can we reschedule?" },
    { id: "m2", from: "me", text: "Sure, what time works for you?" },
  ],
  "3": [
    { id: "m1", from: "them", text: "See you tomorrow" },
    { id: "m2", from: "me", text: "Looking forward to it." },
  ],
}

export default function MessagesPage() {
  const [activeId, setActiveId] = useState("1")
  const [input, setInput] = useState("")

  const messages = sampleMessages[activeId] ?? []
  const active = sampleConversations.find((c) => c.id === activeId)

  const send = () => {
    if (!input.trim()) return
    messages.push({ id: Math.random().toString(), from: "me", text: input.trim() })
    setInput("")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sampleConversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full rounded-md px-3 py-2 text-left hover:bg-muted ${
                  activeId === c.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{c.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium leading-none">{c.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{c.lastMessage}</div>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{active?.name ?? "Conversation"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-y-auto space-y-3 pr-2">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      m.from === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send()
                }}
              />
              <Button onClick={send}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
