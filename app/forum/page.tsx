"use client"

import { useEffect, useState } from "react"

type Post = {
  id: string
  authorAnon: string
  content: string
  hidden?: boolean
  replies?: { id: string; content: string }[]
}

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [role, setRole] = useState<"student" | "volunteer" | "counsellor">("student")
  const [content, setContent] = useState("")

  useEffect(() => {
    setRole((localStorage.getItem("role") as any) || "student")
    const saved = localStorage.getItem("forum_posts")
    setPosts(saved ? JSON.parse(saved) : [])
  }, [])

  function save(next: Post[]) {
    setPosts(next)
    localStorage.setItem("forum_posts", JSON.stringify(next))
  }

  function addPost() {
    if (!content.trim()) return
    const next: Post[] = [
      ...posts,
      {
        id: crypto.randomUUID(),
        authorAnon: "Anon",
        content: content.trim(),
        replies: [],
      },
    ]
    save(next)
    setContent("")
  }

  function reply(id: string, text: string) {
    const next = posts.map((p) =>
      p.id === id ? { ...p, replies: [...(p.replies || []), { id: crypto.randomUUID(), content: text }] } : p,
    )
    save(next)
  }

  function hide(id: string, val: boolean) {
    const next = posts.map((p) => (p.id === id ? { ...p, hidden: val } : p))
    save(next)
  }

  function deletePost(id: string) {
    const next = posts.filter((p) => p.id !== id)
    save(next)
  }

  function deleteReply(postId: string, replyId: string) {
    const next = posts.map((p) =>
      p.id === postId
        ? { ...p, replies: (p.replies || []).filter((r) => r.id !== replyId) }
        : p,
    )
    save(next)
  }

  function banUser(_authorAnon: string) {
    // Placeholder only
    alert("User banned (placeholder).")
  }

  return (
    <section className="space-y-6">
      <h1 className="font-sans text-2xl">Forum (anonymous)</h1>

      <div className="space-y-3 rounded-md border border-border bg-card p-4">
        <label className="text-sm" htmlFor="new-post">
          Write a new thread
        </label>
        <textarea
          id="new-post"
          className="w-full rounded-md border border-border bg-background p-2"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share respectfully. No personal details."
        />
        <button onClick={addPost} className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground">
          Post →
        </button>
      </div>

      <div className="space-y-3">
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No threads yet. You can start one — your voice matters.</p>
        ) : (
          posts.map((p) => (
            <Thread
              key={p.id}
              post={p}
              canModerate={role === "volunteer"}
              onReply={(text) => reply(p.id, text)}
              onHide={(v) => hide(p.id, v)}
              onDelete={() => deletePost(p.id)}
              onDeleteReply={(replyId) => deleteReply(p.id, replyId)}
              onBan={() => banUser(p.authorAnon)}
            />
          ))
        )}
      </div>
    </section>
  )
}

function Thread({
  post,
  canModerate,
  onReply,
  onHide,
  onDelete,
  onDeleteReply,
  onBan,
}: {
  post: Post
  canModerate: boolean
  onReply: (text: string) => void
  onHide: (v: boolean) => void
  onDelete: () => void
  onDeleteReply: (replyId: string) => void
  onBan: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [replyText, setReplyText] = useState("")
  if (post.hidden) {
    return (
      <div className="rounded-md border border-border bg-card p-3">
        <p className="text-sm text-muted-foreground">This post is hidden.</p>
        {canModerate && (
          <button className="underline underline-offset-4 text-sm" onClick={() => onHide(false)}>
            Unhide
          </button>
        )}
      </div>
    )
  }
  return (
    <article className="rounded-md border border-border bg-card p-3 space-y-2">
      <p>{post.content}</p>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button onClick={() => setExpanded((v) => !v)} className="underline underline-offset-4">
          {expanded ? "Collapse ←" : "Expand →"}
        </button>
        <button
          onClick={() => {
            if (!replyText.trim()) return
            onReply(replyText.trim())
            setReplyText("")
            setExpanded(true)
          }}
          className="underline underline-offset-4"
        >
          Reply
        </button>
        {canModerate && (
          <>
            <button
              onClick={() => onHide(true)}
              className="underline underline-offset-4 text-destructive-foreground"
              style={{ background: "transparent" }}
            >
              Remove
            </button>
            <button
              onClick={() => {
                if (confirm("Delete this thread? This cannot be undone.")) onDelete()
              }}
              className="underline underline-offset-4 text-red-600"
              style={{ background: "transparent" }}
            >
              Delete thread
            </button>
            <button onClick={onBan} className="underline underline-offset-4">
              Ban user
            </button>
          </>
        )}
      </div>
      {expanded && (
        <div className="space-y-2">
          <textarea
            className="w-full rounded-md border border-border bg-background p-2 text-sm"
            rows={2}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply"
          />
          <div className="space-y-1">
            {(post.replies || []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No replies yet.</p>
            ) : (
              (post.replies || []).map((r) => (
                <div key={r.id} className="text-sm flex items-start justify-between gap-2">
                  <p className="flex-1">{r.content}</p>
                  {canModerate && (
                    <button
                      onClick={() => {
                        if (confirm("Delete this reply? This cannot be undone.")) onDeleteReply(r.id)
                      }}
                      className="underline underline-offset-4 text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </article>
  )
}
