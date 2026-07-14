import Link from "next/link"
import { Plane } from "lucide-react"

import { NewsFeed, ThemeToggle } from "@/components/news-feed"
import { loadStories } from "@/lib/news"
import { stories } from "@/lib/stories"

export const revalidate = 3600

export default async function Home() {
  const currentStories = await loadStories(stories)
  const editionDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/London",
  }).format(new Date())

  return (
    <div className="min-h-screen bg-background">
      <header>
        <div className="bg-foreground text-background">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] sm:px-6 lg:px-8">
            <p>Aviation intelligence, distilled daily</p>
            <p className="hidden text-background/60 sm:block">London · Updated every 24 hours</p>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-foreground/15 px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid size-10 place-items-center bg-primary text-primary-foreground">
              <Plane className="size-5 -rotate-12" aria-hidden="true" />
            </span>
            <span className="text-xl font-black uppercase tracking-[-0.04em] sm:text-2xl">
              Av<span className="text-primary">TLDR</span>
            </span>
          </Link>
          <div className="text-right">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Today&apos;s edition</p>
            <p className="mt-1 text-sm font-semibold">{editionDate}</p>
          </div>
        </div>
      </header>

      <NewsFeed stories={currentStories} />

      <footer className="mt-16 bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 border-b border-background/15 pb-10 md:grid-cols-[1.3fr_0.7fr_1fr]">
            <div>
              <p className="text-2xl font-black uppercase tracking-[-0.04em]">
                Av<span className="text-primary">TLDR</span>
              </p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-background/60">
                A clearer view of the global aviation industry, delivered once a day.
              </p>
            </div>

            <nav aria-label="Footer" className="text-sm">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary">The small print</p>
              <div className="mt-4 flex flex-col items-start gap-3 text-background/70">
                <Link className="hover:text-background hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/terms">Terms</Link>
                <Link className="hover:text-background hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/privacy">Privacy</Link>
                <a className="hover:text-background hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="mailto:contact@avtldr.news">Contact us</a>
              </div>
            </nav>

            <div className="border-l-2 border-primary pl-5">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary">Clear your inbox for take-off</p>
              <p className="mt-3 font-serif text-2xl font-bold leading-tight">The briefing, without the baggage.</p>
              <Link
                href="/newsletter"
                className="mt-5 inline-flex border border-background/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Join the newsletter →
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start gap-3 text-xs text-background/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 AvTLDR</p>
            <p>Headlines summarised. Reporting belongs to the linked publishers.</p>
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  )
}
