import Link from "next/link"
import { Show, UserButton } from "@clerk/nextjs"
import { Plane } from "lucide-react"

import { NewsFeed } from "@/components/news-feed"
import { UpdateCountdown } from "@/components/update-countdown"
import { editionDay, loadEdition } from "@/lib/news"
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

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header>
        <div className="bg-slate-950 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] sm:px-6 sm:tracking-[0.18em] lg:px-8">
            <p className="hidden sm:block">Aviation intelligence, distilled daily</p>
            <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
              <Link href="/pro" className="text-primary hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                Become Pro
              </Link>
              <UpdateCountdown />
            </div>
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
          <div className="flex min-h-11 items-center gap-3 text-xs font-bold uppercase tracking-[0.1em]">
            <Show when="signed-out">
              <Link href="/sign-in" className="hover:text-primary hover:underline">Log in</Link>
              <Link href="/sign-up" className="bg-primary px-3 py-2 text-primary-foreground hover:bg-foreground">Sign up</Link>
            </Show>
            <Show when="signed-in">
              <Link href="/account" className="hover:text-primary hover:underline">Your account</Link>
              <UserButton />
            </Show>
          </div>
        </div>
      </header>

      <NewsFeed stories={edition.stories} editionDate={editionDay(edition.generatedAt)} />
    </div>
  )
}
