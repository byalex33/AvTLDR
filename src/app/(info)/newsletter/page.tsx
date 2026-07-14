import type { Metadata } from "next"
import { Mail, Plane } from "lucide-react"

export const metadata: Metadata = {
  title: "Newsletter — AvTLDR.news",
  description: "Get the AvTLDR aviation briefing in your inbox.",
}

export default function NewsletterPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="relative overflow-hidden bg-foreground px-6 py-14 text-background sm:px-12 sm:py-20">
        <Plane className="absolute -right-16 -top-10 size-72 -rotate-12 text-background/[0.04]" strokeWidth={1} aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Your inbox has clearance</p>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-7xl">Aviation news. No holding pattern.</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-background/65">One sharp daily briefing. The stories that matter, why they matter, and none of the press-release altitude.</p>

          <a
            href="mailto:contact@avtldr.news?subject=Clear%20me%20for%20the%20AvTLDR%20newsletter&body=Please%20add%20this%20email%20address%20to%20the%20AvTLDR%20newsletter."
            className="mt-10 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background"
          >
            <Mail className="size-4" aria-hidden="true" />
            Put me on the manifest
          </a>
          <p className="mt-4 text-xs text-background/45">Opens your email app. No mysterious forms, no data broker nonsense.</p>
        </div>
      </div>
    </main>
  )
}
