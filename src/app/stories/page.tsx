import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Plane } from "lucide-react"

import { StoryBrowser } from "@/components/story-browser"
import { editionDay, formatEditionTimestamp, loadEdition } from "@/lib/news"
import { pageMetadata } from "@/lib/seo"
import { stories } from "@/lib/stories"

export const metadata: Metadata = pageMetadata(
  "Latest aviation news and stories",
  "Browse the latest global aviation news by airline, aircraft, safety, military aviation, technology, and publisher.",
  "/stories",
)

export const revalidate = 3600

export default async function StoriesPage() {
  const edition = await loadEdition(stories)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/15 bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-h-11 shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="grid size-10 place-items-center bg-primary text-primary-foreground">
              <Plane className="size-5 -rotate-12" aria-hidden="true" />
            </span>
            <span className="text-xl font-black uppercase tracking-[-0.04em] sm:text-2xl">
              Av<span className="text-primary">TLDR</span>
            </span>
          </Link>
          <Link href="/" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground hover:text-primary sm:tracking-[0.1em]">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Today&apos;s briefing
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Story archive</p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-[-0.045em] sm:text-7xl">All stories</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Browse today&apos;s aviation briefing by publisher or topic, then sort it your way.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">Last updated {formatEditionTimestamp(edition.generatedAt)}</p>
      </section>

      <StoryBrowser stories={edition.stories} editionDate={editionDay(edition.generatedAt)} />
    </div>
  )
}
