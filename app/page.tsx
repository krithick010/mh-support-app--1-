import { HomeCTA } from "../components/home-cta"
import { SOSPanel } from "../components/sos-panel"

export default function Home() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6">
      <div className="space-y-2 max-w-xl">
  <h1 className="font-sans text-3xl text-accent text-balance">Zenly — You belong here.</h1>
        <p className="text-sm text-muted-foreground">
          Warm, simple support for your day. Continue in a way that feels comfortable.
        </p>
      </div>

      <div className="pt-1">
        <SOSPanel />
      </div>

      {/* clear CTAs and auth-aware UI */}
      <HomeCTA />
    </section>
  )
}
