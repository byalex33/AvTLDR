import Link from "next/link"
import { Plane } from "lucide-react"

import { NewsFeed } from "@/components/news-feed"
import { UpdateCountdown } from "@/components/update-countdown"
import { editionDay, formatEditionDate, formatEditionTimestamp, loadEdition } from "@/lib/news"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo"
import { stories } from "@/lib/stories"

export const revalidate = 3600

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "AvTLDR.news",
    url: SITE_URL,
    logo: `${SITE_URL}/web-app-manifest-512x512.png`,
    email: "contact@avtldr.news",
    description: SITE_DESCRIPTION,
    publishingPrinciples: `${SITE_URL}/methodology`,
    ethicsPolicy: `${SITE_URL}/methodology`,
    correctionsPolicy: `${SITE_URL}/methodology#corrections`,
    masthead: `${SITE_URL}/about`,
    foundingLocation: { "@type": "Country", name: "United Kingdom" },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "AvTLDR",
    alternateName: "AvTLDR.news",
    url: SITE_URL,
    inLanguage: "en-GB",
    publisher: { "@id": `${SITE_URL}/#organization` },
  },
]

export default async function Home() {
  const edition = await loadEdition(stories)
  const editionDate = formatEditionDate(edition.generatedAt)

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header>
        <div className="bg-slate-950 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] sm:px-6 sm:tracking-[0.18em] lg:px-8">
            <p>Aviation intelligence, distilled daily</p>
            <UpdateCountdown />
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 border-b border-foreground/15 px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid size-10 place-items-center bg-primary text-primary-foreground">
              <Plane className="size-5 -rotate-12" aria-hidden="true" />
            </span>
            <span className="text-xl font-black uppercase tracking-[-0.04em] sm:text-2xl">
              Av<span className="text-primary">TLDR</span>
            </span>
          </Link>
          <div className="min-w-0 text-right">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Today&apos;s edition</p>
            <p className="mt-1 text-sm font-semibold">{editionDate}</p>
            <p className="mt-1 text-xs text-muted-foreground">Updated {formatEditionTimestamp(edition.generatedAt)}</p>
          </div>
        </div>
      </header>

      <NewsFeed stories={edition.stories} editionDate={editionDay(edition.generatedAt)} />
    </div>
  )
}
