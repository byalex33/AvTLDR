import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Plane } from "lucide-react"
import { notFound } from "next/navigation"

import { ShareButton } from "@/components/share-button"
import { SourceLink, StoryMeta } from "@/components/news-feed"
import { editionDay, formatEditionDate, loadEdition, loadEditionByDate } from "@/lib/news"
import { SITE_URL } from "@/lib/seo"
import { stories, storyPath } from "@/lib/stories"

export const revalidate = 3600

export async function generateStaticParams() {
  const edition = await loadEdition(stories)
  const date = editionDay(edition.generatedAt)
  return edition.stories.map((story) => ({ date, id: story.id }))
}

export async function generateMetadata({ params }: PageProps<"/stories/[date]/[id]">): Promise<Metadata> {
  const { date, id } = await params
  const edition = await loadEditionByDate(date, stories)
  if (!edition) return {}
  const story = edition.stories.find((item) => item.id === id)
  if (!story) return {}
  const path = storyPath(date, id)
  const image = `${path}/opengraph-image`

  return {
    title: story.headline,
    description: story.summary,
    alternates: { canonical: path },
    openGraph: {
      title: story.headline,
      description: story.summary,
      url: path,
      siteName: "AvTLDR.news",
      locale: "en_GB",
      type: "article",
      publishedTime: edition.generatedAt,
      images: [{ url: image, width: 1200, height: 630, alt: story.headline }],
    },
    twitter: {
      card: "summary_large_image",
      title: story.headline,
      description: story.summary,
      images: [image],
    },
  }
}

export default async function StoryPage({ params }: PageProps<"/stories/[date]/[id]">) {
  const { date, id } = await params
  const edition = await loadEditionByDate(date, stories)
  const story = edition?.stories.find((item) => item.id === id)
  if (!edition || !story) notFound()

  const path = storyPath(date, id)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: story.headline,
    description: story.summary,
    image: story.imageUrl ? [story.imageUrl] : [`${SITE_URL}${path}/opengraph-image`],
    datePublished: edition.generatedAt,
    dateModified: edition.generatedAt,
    articleSection: story.category,
    mainEntityOfPage: `${SITE_URL}${path}`,
    isBasedOn: story.url,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  }

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="border-b border-foreground/15 bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex min-h-11 shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="grid size-10 place-items-center bg-primary text-primary-foreground">
              <Plane className="size-5 -rotate-12" aria-hidden="true" />
            </span>
            <span className="text-xl font-black uppercase tracking-[-0.04em]">Av<span className="text-primary">TLDR</span></span>
          </Link>
          <Link href={`/archive/${date}`} className="inline-flex min-h-11 shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground hover:text-primary sm:tracking-[0.1em]">
            <ArrowLeft className="size-4" aria-hidden="true" /> Full edition
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <article>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{story.category} · {formatEditionDate(edition.generatedAt)}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.02] font-bold tracking-[-0.045em] text-balance sm:text-7xl sm:leading-[0.98]">{story.headline}</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">{story.summary}</p>

          {story.imageUrl && <div className="mt-10 aspect-[16/9] bg-slate-950 bg-cover bg-center" aria-hidden="true" style={{ backgroundImage: `url("${story.imageUrl}")` }} />}

          <div className="mt-10 grid gap-px bg-foreground/15 border border-foreground/15 md:grid-cols-2">
            <section className="bg-card p-7 sm:p-9">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">What happened</h2>
              <p className="mt-4 text-lg leading-8">{story.whatHappened}</p>
            </section>
            <section className="bg-card p-7 sm:p-9">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Why it matters</h2>
              <p className="mt-4 text-lg leading-8">{story.whyItMatters}</p>
            </section>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-foreground/15 py-5">
            <StoryMeta story={story} />
            <div className="flex items-center gap-5">
              <ShareButton story={story} editionDate={date} />
              <SourceLink story={story} />
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">This is an automated summary of reporting by {story.source}. Follow the source link for the original article and full context.</p>
        </article>
      </main>
    </div>
  )
}
