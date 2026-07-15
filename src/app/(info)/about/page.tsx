import type { Metadata } from "next"
import Link from "next/link"

import { EDITORIAL_NAME, pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata(
  "About AvTLDR",
  "Who publishes AvTLDR, how the daily aviation briefing is produced, and how to contact the editorial desk.",
  "/about",
)

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Publisher information</p>
      <h1 className="mt-3 font-serif text-4xl font-bold tracking-[-0.04em] sm:text-6xl">About AvTLDR</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        AvTLDR is an independent, UK-based daily briefing for people who want a clearer view of global aviation.
      </p>

      <div className="mt-12 space-y-9 text-base leading-8 text-foreground/80">
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">What we publish</h2>
          <p className="mt-3">Each edition brings together 12 to 16 consequential stories spanning airlines, aircraft, safety, military aviation, and technology. Every summary identifies and links to the original publisher so readers can inspect the reporting and full context.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">The editorial desk</h2>
          <p className="mt-3">Articles are published by the <strong className="text-foreground">{EDITORIAL_NAME}</strong>. Tools assist with collection, deduplication, ranking, and concise formatting. Our published selection rules, source attribution requirements, and correction process govern every edition.</p>
          <p className="mt-3">Read the complete <Link className="font-semibold text-primary underline underline-offset-4" href="/methodology">methodology and corrections policy</Link>.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">Contact</h2>
          <p className="mt-3">Questions, corrections, rights enquiries, and source suggestions can be sent to <a className="font-semibold text-primary underline underline-offset-4" href="mailto:contact@avtldr.news">contact@avtldr.news</a>.</p>
        </section>
      </div>
    </main>
  )
}
