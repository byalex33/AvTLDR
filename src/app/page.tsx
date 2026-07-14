import Link from "next/link"
import { Plane } from "lucide-react"

import { NewsFeed, ThemeToggle } from "@/components/news-feed"
import { UpdateCountdown } from "@/components/update-countdown"
import { editionDay, formatEditionDate, formatEditionTimestamp, loadEdition } from "@/lib/news"
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/seo"
import { stories } from "@/lib/stories"

export const revalidate = 3600

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: "AvTLDR",
    alternateName: "AvTLDR.news",
    url: SITE_URL,
    logo: `${SITE_URL}/web-app-manifest-512x512.png`,
    email: "contact@avtldr.news",
    description: SITE_DESCRIPTION,
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

      <footer className="mt-16 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-[1.3fr_0.7fr_1fr]">
            <div>
              <p className="text-2xl font-black uppercase tracking-[-0.04em]">
                Av<span className="text-primary">TLDR</span>
              </p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
                A clearer view of the global aviation industry, delivered once a day.
              </p>
            </div>

            <nav aria-label="Footer" className="text-sm">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary">The small print</p>
              <div className="mt-4 flex flex-col items-start gap-3 text-white/70">
                <Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/terms">Terms</Link>
                <Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/privacy">Privacy</Link>
                <Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/contact">Contact us</Link>
                <Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/methodology">Methodology &amp; corrections</Link>
                <Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/archive">Daily archive</Link>
              </div>
            </nav>

            <div className="border-l-2 border-primary pl-5">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary">Clear your inbox for take-off</p>
              <p className="mt-3 font-serif text-2xl font-bold leading-tight">The briefing, without the baggage.</p>
              <Link
                href="/newsletter"
                className="mt-5 inline-flex min-h-11 items-center border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Join the newsletter →
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start gap-3 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 AvTLDR</p>
            <p>Headlines summarised. Reporting belongs to the linked publishers.</p>
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  )
}
