import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Plane } from "lucide-react"

import { listArchiveDates } from "@/lib/news"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata(
  "Daily aviation news archive",
  "Browse previous daily editions of the AvTLDR global aviation briefing.",
  "/archive",
)

export const revalidate = 3600

export default async function ArchivePage() {
  const dates = await listArchiveDates()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/15 bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex min-h-11 shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="grid size-10 place-items-center bg-primary text-primary-foreground">
              <Plane className="size-5 -rotate-12" aria-hidden="true" />
            </span>
            <span className="text-xl font-black uppercase tracking-[-0.04em]">Av<span className="text-primary">TLDR</span></span>
          </Link>
          <Link href="/" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground hover:text-primary sm:tracking-[0.1em]">
            <ArrowLeft className="size-4" aria-hidden="true" /> Today&apos;s briefing
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Daily archive</p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-[-0.045em] sm:text-7xl">Previous editions</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Every successful daily briefing is kept here so links and summaries remain available.
        </p>

        {dates.length ? (
          <ol className="mt-12 divide-y divide-foreground/15 border-y border-foreground/15">
            {dates.map((date) => (
              <li key={date}>
                <Link href={`/archive/${date}`} className="group flex items-center justify-between gap-4 py-6 text-lg font-bold hover:text-primary">
                  <time dateTime={date}>{new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`))}</time>
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-12 border border-dashed border-foreground/30 px-6 py-12 text-center text-muted-foreground">
            The archive will begin filling after the next successful daily update.
          </p>
        )}
      </main>
    </div>
  )
}
