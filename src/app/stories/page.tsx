import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Plane } from "lucide-react"

import { StoryBrowser } from "@/components/story-browser"
import { loadStories } from "@/lib/news"
import { stories } from "@/lib/stories"

export const metadata: Metadata = {
  title: "All aviation stories | AvTLDR",
  description: "Browse and filter the latest aviation stories by publisher and topic.",
}

export const revalidate = 3600

export default async function StoriesPage() {
  const currentStories = await loadStories(stories)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/15 bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="grid size-10 place-items-center bg-primary text-primary-foreground">
              <Plane className="size-5 -rotate-12" aria-hidden="true" />
            </span>
            <span className="text-xl font-black uppercase tracking-[-0.04em] sm:text-2xl">
              Av<span className="text-primary">TLDR</span>
            </span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground hover:text-primary">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Today&apos;s briefing
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Story archive</p>
        <h1 className="mt-3 font-serif text-5xl font-bold tracking-[-0.045em] sm:text-7xl">All stories</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Browse today&apos;s aviation briefing by publisher or topic, then sort it your way.
        </p>
      </section>

      <StoryBrowser stories={currentStories} />

      <footer className="border-t border-foreground/15 px-4 py-8 text-center text-xs text-muted-foreground">
        Headlines summarised. Reporting belongs to the linked publishers.
      </footer>
    </div>
  )
}
