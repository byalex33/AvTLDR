import Link from "next/link"

import { NewsFeed } from "@/components/news-feed"
import { Badge } from "@/components/ui/badge"
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
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
            AV
          </span>
          <span className="text-lg font-semibold tracking-tight">
            AvTLDR<span className="text-primary">.news</span>
          </span>
        </Link>
        <Badge variant="outline" className="hidden sm:inline-flex">
          Updated every 24 hours
        </Badge>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pb-12 sm:pt-16 lg:px-8">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="mb-4">{editionDate}</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Global aviation news,
            <span className="text-primary"> minus the holding pattern.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            The important stories across airlines, aircraft, safety, technology, and defence—summarised once a day.
          </p>
        </div>
      </section>

      <NewsFeed stories={currentStories} />

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 AvTLDR.news</p>
          <p>Headlines summarised. Reporting belongs to the linked publishers.</p>
        </div>
      </footer>
    </div>
  )
}
