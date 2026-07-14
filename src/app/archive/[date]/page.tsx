import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Plane } from "lucide-react"
import { notFound } from "next/navigation"

import { StoryBrowser } from "@/components/story-browser"
import { formatEditionDate, formatEditionTimestamp, listArchiveDates, loadEditionByDate } from "@/lib/news"
import { pageMetadata } from "@/lib/seo"
import { stories } from "@/lib/stories"

export const revalidate = 3600

export async function generateStaticParams() {
  return (await listArchiveDates()).map((date) => ({ date }))
}

export async function generateMetadata({ params }: PageProps<"/archive/[date]">): Promise<Metadata> {
  const { date } = await params
  const edition = await loadEditionByDate(date, stories)
  if (!edition) return {}
  return pageMetadata(
    `${formatEditionDate(edition.generatedAt)} aviation briefing`,
    `The AvTLDR global aviation briefing for ${formatEditionDate(edition.generatedAt)}.`,
    `/archive/${date}`,
  )
}

export default async function ArchiveEditionPage({ params }: PageProps<"/archive/[date]">) {
  const { date } = await params
  const edition = await loadEditionByDate(date, stories)
  if (!edition) notFound()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/15 bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-h-11 shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="grid size-10 place-items-center bg-primary text-primary-foreground">
              <Plane className="size-5 -rotate-12" aria-hidden="true" />
            </span>
            <span className="text-xl font-black uppercase tracking-[-0.04em]">Av<span className="text-primary">TLDR</span></span>
          </Link>
          <Link href="/archive" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground hover:text-primary sm:tracking-[0.1em]">
            <ArrowLeft className="size-4" aria-hidden="true" /> All editions
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Archived edition</p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-[-0.045em] sm:text-7xl">{formatEditionDate(edition.generatedAt)}</h1>
        <p className="mt-4 text-sm text-muted-foreground">Published {formatEditionTimestamp(edition.generatedAt)}</p>
      </section>

      <StoryBrowser stories={edition.stories} editionDate={date} />
    </div>
  )
}
