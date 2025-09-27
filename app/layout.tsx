import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Nav } from "../components/nav"
import { ConditionalHeader } from "../components/conditional-header"
import { Suspense } from "react"
import { MainLayout } from "../components/main-layout"
import { ConditionalQuotes } from "../components/conditional-quotes"
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
  title: "Flourish",
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
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <AuthProvider>
          {/* Motivational quotes grid pattern (hidden on counsellor routes) */}
          <ConditionalQuotes />
          
          <Suspense fallback={<div>Loading...</div>}>
            <ConditionalHeader />
            <div className="flex-grow">
              <MainLayout>
                {children}
              </MainLayout>
            </div>
          </Suspense>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
