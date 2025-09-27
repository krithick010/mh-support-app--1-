"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"

type ChatMessage = { 
  id: string
  role: "you" | "assistant"
  text: string
  ts: number
  edited?: boolean
  editedAt?: number
}

type ChatRoom = {
  id: string
  name: string
  messages: ChatMessage[]
  createdAt: number
}

export default function CookiePage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [currentRoomId, setCurrentRoomId] = useState<string>("")
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedRooms = localStorage.getItem("cookie_chat_rooms")
    const savedCurrentRoom = localStorage.getItem("cookie_current_room")
    
    if (savedRooms) {
      const rooms = JSON.parse(savedRooms)
      setChatRooms(rooms)
      if (savedCurrentRoom && rooms.find((r: ChatRoom) => r.id === savedCurrentRoom)) {
        setCurrentRoomId(savedCurrentRoom)
        const currentRoom = rooms.find((r: ChatRoom) => r.id === savedCurrentRoom)
        if (currentRoom) setMessages(currentRoom.messages)
      } else if (rooms.length > 0) {
        setCurrentRoomId(rooms[0].id)
        setMessages(rooms[0].messages)
      }
    } else {
      // Create default room
      const defaultRoom: ChatRoom = {
        id: "default",
        name: "General Chat",
        messages: [],
        createdAt: Date.now()
      }
      setChatRooms([defaultRoom])
      setCurrentRoomId(defaultRoom.id)
      localStorage.setItem("cookie_chat_rooms", JSON.stringify([defaultRoom]))
      localStorage.setItem("cookie_current_room", defaultRoom.id)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  function createNewRoom() {
    const newRoom: ChatRoom = {
      id: generateId(),
      name: `Chat ${chatRooms.length + 1}`,
      messages: [],
      createdAt: Date.now()
    }
    const updatedRooms = [...chatRooms, newRoom]
    setChatRooms(updatedRooms)
    setCurrentRoomId(newRoom.id)
    setMessages([])
    localStorage.setItem("cookie_chat_rooms", JSON.stringify(updatedRooms))
    localStorage.setItem("cookie_current_room", newRoom.id)
  }

  function switchRoom(roomId: string) {
    const room = chatRooms.find(r => r.id === roomId)
    if (room) {
      setCurrentRoomId(roomId)
      setMessages(room.messages)
      localStorage.setItem("cookie_current_room", roomId)
    }
  }

  function deleteRoom(roomId: string) {
    if (chatRooms.length <= 1) return // Keep at least one room
    const updatedRooms = chatRooms.filter(r => r.id !== roomId)
    setChatRooms(updatedRooms)
    
    if (currentRoomId === roomId) {
      const newCurrentRoom = updatedRooms[0]
      setCurrentRoomId(newCurrentRoom.id)
      setMessages(newCurrentRoom.messages)
      localStorage.setItem("cookie_current_room", newCurrentRoom.id)
    }
    localStorage.setItem("cookie_chat_rooms", JSON.stringify(updatedRooms))
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "you",
      text: trimmed,
      ts: Date.now()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsTyping(true)

    try {
      // Get response from Gemini API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          conversationHistory: messages.slice(-10) // Send last 10 messages for context
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        text: data.response,
        ts: Date.now()
      }

      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)
      updateRoomMessages(finalMessages)
    } catch (error) {
      console.error('Error getting response:', error)
      // Fallback response if API fails
      const fallbackMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. In the meantime, remember that it's okay to take things one step at a time.",
        ts: Date.now()
      }

      const finalMessages = [...newMessages, fallbackMessage]
      setMessages(finalMessages)
      updateRoomMessages(finalMessages)
    } finally {
      setIsTyping(false)
    }
  }



  function updateRoomMessages(newMessages: ChatMessage[]) {
    const updatedRooms = chatRooms.map(room => 
      room.id === currentRoomId 
        ? { ...room, messages: newMessages }
        : room
    )
    setChatRooms(updatedRooms)
    localStorage.setItem("cookie_chat_rooms", JSON.stringify(updatedRooms))
  }

  function startEditMessage(message: ChatMessage) {
    setEditingMessageId(message.id)
    setEditingText(message.text)
  }

  function saveEditMessage() {
    if (!editingMessageId) return
    
    const updatedMessages = messages.map(msg => 
      msg.id === editingMessageId 
        ? { ...msg, text: editingText, edited: true, editedAt: Date.now() }
        : msg
    )
    setMessages(updatedMessages)
    updateRoomMessages(updatedMessages)
    setEditingMessageId(null)
    setEditingText("")
  }

  function deleteMessage(messageId: string) {
    const updatedMessages = messages.filter(msg => msg.id !== messageId)
    setMessages(updatedMessages)
    updateRoomMessages(updatedMessages)
  }

  function clearCurrentChat() {
    setMessages([])
    updateRoomMessages([])
  }

  function formatTimestamp(ts: number) {
    const date = new Date(ts)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const currentRoom = chatRooms.find(r => r.id === currentRoomId)

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-sans text-2xl">Cookie (Chatbot)</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={createNewRoom}
            className="rounded-sm bg-secondary px-3 py-1.5 text-secondary-foreground text-sm"
          >
            + New Chat
          </button>
          <button 
            onClick={clearCurrentChat}
            className="rounded-sm bg-destructive px-3 py-1.5 text-destructive-foreground text-sm"
          >
            Clear Chat
          </button>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        AI-powered mental health support chatbot using Google's Gemini model for empathetic conversations.
      </p>

      {/* Chat Rooms */}
      {chatRooms.length > 1 && (
        <div className="space-y-3 rounded-sm border border-border bg-card p-4">
          <p className="font-sans text-sm">Chat Rooms</p>
          <div className="flex flex-wrap gap-2">
            {chatRooms.map((room) => (
              <div key={room.id} className="flex items-center gap-1">
                <button
                  onClick={() => switchRoom(room.id)}
                  className={`rounded-sm px-3 py-1.5 text-sm transition-colors shadow-sm ${
                    currentRoomId === room.id
                      ? "bg-primary text-primary-foreground border border-primary/30"
                      : "bg-secondary text-secondary-foreground border border-accent/20 hover:bg-accent/10"
                  }`}
                >
                  {room.name} ({room.messages.length})
                </button>
                {chatRooms.length > 1 && (
                  <button
                    onClick={() => deleteRoom(room.id)}
                    className="rounded-sm bg-destructive px-2 py-1.5 text-destructive-foreground text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="space-y-3 rounded-sm border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="font-sans">
            {currentRoom?.name || "Chat"} 
            <span className="text-xs text-muted-foreground ml-2">
              ({messages.length} messages)
            </span>
          </p>
        </div>
        
        <div className="max-h-96 overflow-auto rounded-sm border border-border bg-background p-3 text-sm space-y-3">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">"Say hello — I'm here to listen." 💚</p>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "you" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                    m.role === "you" 
                      ? "bg-primary text-primary-foreground border border-primary/20" 
                      : "bg-secondary text-secondary-foreground border border-accent/20"
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs opacity-70">
                            {m.role === "you" ? "You" : "Cookie"}
                          </span>
                          <span className="text-xs opacity-50">
                            {formatTimestamp(m.ts)}
                          </span>
                          {m.edited && (
                            <span className="text-xs opacity-50">(edited)</span>
                          )}
                        </div>
                        
                        {editingMessageId === m.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full rounded border border-border bg-background px-2 py-1 text-foreground"
                              rows={2}
                            />
                            <div className="flex gap-1">
                              <button
                                onClick={saveEditMessage}
                                className="rounded bg-primary px-2 py-1 text-primary-foreground text-xs"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingMessageId(null)}
                                className="rounded bg-secondary px-2 py-1 text-secondary-foreground text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="leading-relaxed">{m.text}</p>
                        )}
                      </div>
                      
                      {m.role === "you" && editingMessageId !== m.id && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditMessage(m)}
                            className="text-xs opacity-50 hover:opacity-100"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteMessage(m.id)}
                            className="text-xs opacity-50 hover:opacity-100"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs opacity-70">Cookie</span>
                      <span className="text-xs opacity-50">typing...</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            className="flex-1 rounded-sm border border-border bg-background px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            placeholder='Type a message (e.g., "Feeling anxious today") 💙'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button 
            className="rounded-sm bg-primary px-3 py-2 text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-sm" 
            type="submit"
            disabled={isTyping || !input.trim()}
          >
            Send ✨
          </button>
        </form>
      </div>
    </section>
  )
}
