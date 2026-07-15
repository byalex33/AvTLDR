import { Search } from "lucide-react"
import Link from "next/link"

import { requirePro } from "@/lib/auth"
import { editionDay, listArchiveDates, loadArchiveEdition, loadEdition } from "@/lib/news"
import { loadProProfile, searchEditions } from "@/lib/pro"
import { stories } from "@/lib/stories"

import { removeSearch, saveSearch } from "../actions"
import { StoryList } from "../story-list"

export const dynamic = "force-dynamic"

export default async function SearchPage({ searchParams }: PageProps<"/account/search">) {
  const [{ userId }, edition, params] = await Promise.all([requirePro(), loadEdition(stories), searchParams])
  const profile = await loadProProfile(userId)
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 120) : ""
  const dates = query ? await listArchiveDates() : []
  const archived = query ? (await Promise.all(dates.map(loadArchiveEdition))).filter((item) => item !== undefined) : []
  if (query && !archived.some((item) => editionDay(item.generatedAt) === editionDay(edition.generatedAt))) archived.unshift(edition)
  const results = searchEditions(archived, query)

  return <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Pro archive</p>
    <h1 className="mt-3 flex items-center gap-3 font-serif text-4xl font-bold tracking-[-0.045em] sm:text-6xl"><Search className="size-9 text-primary" /> Search every edition</h1>
    <div className="mt-12 grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="h-fit border-t-2 border-foreground pt-5">
        <h2 className="font-serif text-2xl font-bold">Saved searches</h2>
        {profile.savedSearches.length ? <ul className="mt-4 divide-y divide-foreground/15 border-y border-foreground/15">{profile.savedSearches.map((saved) => <li key={saved} className="flex items-center justify-between gap-3 py-3"><Link className="min-w-0 truncate font-semibold hover:text-primary" href={`/account/search?q=${encodeURIComponent(saved)}`}>{saved}</Link><form action={removeSearch.bind(null, saved)}><button className="text-xs text-muted-foreground hover:text-foreground">Remove</button></form></li>)}</ul> : <p className="mt-4 text-sm text-muted-foreground">Save a search to keep it here.</p>}
      </aside>
      <section className="min-w-0">
        <form className="flex gap-2" action="/account/search">
          <label htmlFor="archive-query" className="sr-only">Search all editions</label>
          <input id="archive-query" name="q" type="search" defaultValue={query} maxLength={120} placeholder="Airline, aircraft, airport..." className="min-h-12 min-w-0 flex-1 border border-foreground/25 bg-card px-4 outline-none focus:border-primary" />
          <button type="submit" className="min-h-12 bg-primary px-5 text-xs font-black uppercase tracking-widest text-primary-foreground">Search</button>
        </form>
        {params.saved === "1" && <p role="status" className="mt-4 border border-green-700/25 bg-green-50 p-3 text-sm font-semibold text-green-800">Search saved.</p>}
        {query && <form action={saveSearch} className="mt-3"><input type="hidden" name="query" value={query} /><button className="text-xs font-bold text-primary hover:underline">Save this search</button></form>}
        {query && <p className="mt-6 text-sm text-muted-foreground">{results.length} result{results.length === 1 ? "" : "s"} for “{query}”</p>}
        <StoryList stories={results} bookmarked={profile.bookmarks} />
      </section>
    </div>
  </main>
}
