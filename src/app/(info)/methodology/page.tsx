import type { Metadata } from "next"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata(
  "Methodology and corrections",
  "How AvTLDR selects, summarises, checks, and corrects its daily aviation briefing.",
  "/methodology",
)

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Editorial standards</p>
      <h1 className="mt-3 font-serif text-4xl font-bold tracking-[-0.04em] sm:text-6xl">Methodology &amp; corrections</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">A short, transparent account of how each briefing is made.</p>

      <div className="mt-12 space-y-9 text-base leading-8 text-foreground/80">
        <section id="corrections">
          <h2 className="font-serif text-2xl font-bold text-foreground">How stories are selected</h2>
          <p className="mt-3">We scan a fixed group of established aviation publishers once each day, verify publication dates, remove duplicates, and rank stories by safety, scale, industry consequences, and lasting significance. Every selected article must have been published within the 24 hours before the edition is made.</p>
          <p className="mt-3">We exclude older or undated reporting and do not repeat a previously published story unless the source contains a meaningful factual update. Developing or unusually significant stories do not receive an exception to the 24-hour publication window.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">How summaries are made</h2>
          <p className="mt-3">Automated tools condense the source reporting into a headline, summary, what happened, and why it matters. Summaries must retain the original publisher and source URL. AvTLDR is a briefing service, not the original reporter; the linked source remains authoritative.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">Corrections</h2>
          <p className="mt-3">If a summary is inaccurate, misleading, or missing important context, email <a className="font-semibold text-primary underline underline-offset-4" href="mailto:contact@avtldr.news?subject=Correction">contact@avtldr.news</a> with the headline and source link. We review correction requests and update the briefing where appropriate.</p>
        </section>
      </div>
    </main>
  )
}
