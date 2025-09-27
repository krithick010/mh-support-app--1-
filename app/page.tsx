import { HomeCTA } from "../components/home-cta"
import { SOSPanel } from "../components/sos-panel"

export default function Home() {
  return (
    <section className="space-y-4">
      {/* friendly, encouraging header */}
      <h1 className="font-sans text-2xl text-accent text-balance">Campus Wellbeing — "You belong here."</h1>
      <p className="text-sm text-muted-foreground">
        Warm, simple support for your day. Continue in a way that feels comfortable.
      </p>

      <div className="pt-2">
        <SOSPanel />
      </div>

      {/* clear CTAs and auth-aware UI */}
      <HomeCTA />
    </section>
  )
}
