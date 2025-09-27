"use client"

import { usePathname } from "next/navigation"

export function ConditionalQuotes() {
  const pathname = usePathname()
  const isCounsellorRoute = pathname.startsWith("/counsellor")
  const isWellness = pathname.startsWith("/wellness-hub")

  if (isCounsellorRoute || isWellness) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="quotes-grid w-full h-full relative">
        {/* Row 1 - Top */}
        <div className="quote-item quote-1" style={{ left: "8%", top: "10%" }}>
          It's okay to ask for help
        </div>
        <div className="quote-item quote-2" style={{ left: "38%", top: "6%" }}>
          You are not alone
        </div>
        <div className="quote-item quote-3" style={{ left: "68%", top: "6%" }}>
          Small steps count
        </div>
        <div className="quote-item quote-4" style={{ left: "88%", top: "10%" }}>
          Breathe deeply
        </div>

        {/* Row 2 - Upper middle */}
        <div className="quote-item quote-5" style={{ left: "5%", top: "25%" }}>
          Progress over perfection
        </div>
        <div className="quote-item quote-7" style={{ left: "75%", top: "26%" }}>
          You have strength within
        </div>
        <div className="quote-item quote-8" style={{ left: "92%", top: "28%" }}>
          Self-care isn't selfish
        </div>

        {/* Row 3 - Center (sparse for main content) */}
        <div className="quote-item quote-9" style={{ left: "3%", top: "45%" }}>
          One step at a time
        </div>
        <div className="quote-item quote-10" style={{ left: "85%", top: "48%" }}>
          Tomorrow is a new day
        </div>

        {/* Row 4 - Lower middle */}
        <div className="quote-item quote-11" style={{ left: "8%", top: "65%" }}>
          You belong here
        </div>

        <div className="quote-item quote-13" style={{ left: "78%", top: "66%" }}>
          Be kind to yourself
        </div>
        <div className="quote-item quote-14" style={{ left: "90%", top: "68%" }}>
          You matter
        </div>

        {/* Row 5 - Bottom */}
        <div className="quote-item quote-15" style={{ left: "12%", top: "85%" }}>
          Healing happens
        </div>
        <div className="quote-item quote-16" style={{ left: "35%", top: "88%" }}>
          Stay hopeful
        </div>
        <div className="quote-item quote-17" style={{ left: "65%", top: "86%" }}>
          Keep going
        </div>
        <div className="quote-item quote-18" style={{ left: "82%", top: "88%" }}>
          You're enough
        </div>

        {/* Additional quotes for variety */}
        <div className="quote-item quote-19" style={{ left: "18%", top: "15%" }}>
          Rest is productive
        </div>
        <div className="quote-item quote-20" style={{ left: "65%", top: "18%" }}>
          You're doing great
        </div>
        <div className="quote-item quote-21" style={{ left: "15%", top: "78%" }}>
          Trust yourself
        </div>
        <div className="quote-item quote-22" style={{ left: "58%", top: "82%" }}>
          Stay present
        </div>
      </div>
    </div>
  )
}
