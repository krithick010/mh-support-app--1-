export type MoodTier = 0 | 1 | 2

export const COMPLAINTS: { key: string; label: string; weight: 1 | 2 | 3 }[] = [
  // Mild (1)
  { key: "stress", label: "Stress", weight: 1 },
  { key: "overthinking", label: "Overthinking", weight: 1 },
  { key: "excessive-worry", label: "Excessive worry", weight: 1 },

  // Moderate (2)
  { key: "relationship-issues", label: "Relationship issues", weight: 2 },
  { key: "family-issues", label: "Family issues", weight: 2 },
  { key: "loneliness", label: "Loneliness", weight: 2 },
  { key: "sleep-disturbances", label: "Sleep disturbances", weight: 2 },

  // Severe (3)
  { key: "anxiety", label: "Anxiety", weight: 3 },
  { key: "grief", label: "Grief", weight: 3 },
  { key: "addiction", label: "Addiction", weight: 3 },
  { key: "substance-use", label: "Substance use", weight: 3 },
  { key: "sudden-change", label: "Sudden change in behaviour", weight: 3 },
  { key: "self-harm", label: "Self-harm", weight: 3 },
]

// 0–2: naive, placeholder-only sentiment
export function sentimentScore(text: string): MoodTier {
  const t = text.toLowerCase()
  const severe = ["hopeless", "empty", "angry", "self-harm", "hurt myself", "worthless"]
  const moderate = ["sad", "tired", "irritated", "overwhelmed", "stressed"]
  if (severe.some((w) => t.includes(w))) return 2
  if (moderate.some((w) => t.includes(w))) return 1
  return 0
}

export function moodScoreFromChoice(choice: "positive" | "mixed" | "difficult"): MoodTier {
  if (choice === "positive") return 0
  if (choice === "mixed") return 1
  return 2
}

export function computeMHRS(params: {
  freeText: string
  moodChoice: "positive" | "mixed" | "difficult"
  complaints: string[]
}) {
  const sentiment = sentimentScore(params.freeText)
  const mood = moodScoreFromChoice(params.moodChoice)
  const complaintSum = params.complaints.reduce((sum, key) => {
    const c = COMPLAINTS.find((x) => x.key === key)
    return sum + (c ? c.weight : 0)
  }, 0)
  const score = sentiment + mood + complaintSum
  const hasSelfHarm = params.complaints.includes("self-harm")
  let tier: 1 | 2 | 3 = 1
  if (score <= 3) tier = 1
  else if (score >= 4 && score <= 7) tier = 2
  else tier = 3
  if (hasSelfHarm || score >= 8) tier = 3
  return { score, sentiment, mood, complaintSum, hasSelfHarm, tier }
}

export function tierSuggestion(tier: 1 | 2 | 3) {
  if (tier === 1) {
    return {
      title: "Thanks for sharing. You might try a breathing break.",
      route: "/wellness-hub",
      why: "Your responses suggest a light support moment could help right now.",
      cta: "Go to Wellness Hub →",
      kind: "wellness" as const,
    }
  }
  if (tier === 2) {
    return {
      title: "Cookie is ready to chat whenever you’d like.",
      route: "/cookie",
      why: "A gentle conversation could be supportive at the moment.",
      cta: "Open Cookie →",
      kind: "chat" as const,
    }
  }
  return {
    title: "Talking to your counsellor could help you through this.",
    route: "/appointments",
    why: "Your responses indicate that personal support may be most helpful.",
    cta: "Book appointment →",
    kind: "counsellor" as const,
  }
}
