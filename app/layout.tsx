import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Nav } from "../components/nav"
import { Suspense } from "react"

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
        {/* Motivational quotes overlay */}
        <div className="motivational-quote quote-left">It's okay to ask for help.</div>
        <div className="motivational-quote quote-right">Small steps count.</div>
        <div className="motivational-quote quote-left-2">You are not alone.</div>
        <div className="motivational-quote quote-right-2">Breathe. You are doing your best.</div>
        
        <Suspense fallback={<div>Loading...</div>}>
          <header className="border-b border-border bg-background">
            <div className="mx-auto max-w-prose px-4 py-4">
              <Nav />
            </div>
          </header>
          <main className="mx-auto max-w-prose px-4 py-8">{children}</main>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
