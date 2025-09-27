import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Nav } from "../components/nav"
import { Suspense } from "react"
import { AuthProvider } from "../contexts/AuthContext"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Campus Wellbeing",
  description: "Warm, simple mental health support system for students",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plexMono.variable} antialiased`}>
      <body className="font-mono bg-background text-foreground">
        <AuthProvider>
          {/* Motivational quotes grid pattern */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="quotes-grid w-full h-full relative">
              {/* Row 1 - Top */}
              <div className="quote-item quote-1" style={{left: '8%', top: '10%'}}>It's okay to ask for help</div>
              <div className="quote-item quote-2" style={{left: '38%', top: '8%'}}>You are not alone</div>
              <div className="quote-item quote-3" style={{left: '68%', top: '12%'}}>Small steps count</div>
              <div className="quote-item quote-4" style={{left: '88%', top: '10%'}}>Breathe deeply</div>
              
              {/* Row 2 - Upper middle */}
              <div className="quote-item quote-5" style={{left: '5%', top: '25%'}}>Progress over perfection</div>
              <div className="quote-item quote-6" style={{left: '25%', top: '28%'}}>Your feelings are valid</div>
              <div className="quote-item quote-7" style={{left: '75%', top: '26%'}}>You have strength within</div>
              <div className="quote-item quote-8" style={{left: '92%', top: '28%'}}>Self-care isn't selfish</div>
              
              {/* Row 3 - Center (sparse for main content) */}
              <div className="quote-item quote-9" style={{left: '3%', top: '45%'}}>One step at a time</div>
              <div className="quote-item quote-10" style={{left: '85%', top: '48%'}}>Tomorrow is a new day</div>
              
              {/* Row 4 - Lower middle */}
              <div className="quote-item quote-11" style={{left: '8%', top: '65%'}}>You belong here</div>
              <div className="quote-item quote-12" style={{left: '28%', top: '68%'}}>Growth takes time</div>
              <div className="quote-item quote-13" style={{left: '78%', top: '66%'}}>Be kind to yourself</div>
              <div className="quote-item quote-14" style={{left: '90%', top: '68%'}}>You matter</div>
              
              {/* Row 5 - Bottom */}
              <div className="quote-item quote-15" style={{left: '12%', top: '85%'}}>Healing happens</div>
              <div className="quote-item quote-16" style={{left: '35%', top: '88%'}}>Stay hopeful</div>
              <div className="quote-item quote-17" style={{left: '65%', top: '86%'}}>Keep going</div>
              <div className="quote-item quote-18" style={{left: '82%', top: '88%'}}>You're enough</div>
              
              {/* Additional quotes for variety */}
              <div className="quote-item quote-19" style={{left: '18%', top: '15%'}}>Rest is productive</div>
              <div className="quote-item quote-20" style={{left: '55%', top: '18%'}}>You're doing great</div>
              <div className="quote-item quote-21" style={{left: '15%', top: '78%'}}>Trust yourself</div>
              <div className="quote-item quote-22" style={{left: '58%', top: '82%'}}>Stay present</div>
            </div>
          </div>
          
          <Suspense fallback={<div>Loading...</div>}>
            <header className="sticky top-0 z-40 border-b border-border bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
              <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3">
                <Nav />
              </div>
            </header>
            <main className="relative z-10 mx-auto max-w-4xl px-6 py-12 min-h-[calc(100vh-120px)] flex flex-col justify-center">
              <div className="w-full max-w-2xl mx-auto">
                {children}
              </div>
            </main>
          </Suspense>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
