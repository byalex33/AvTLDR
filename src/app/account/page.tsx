import { UserButton } from "@clerk/nextjs"
import { Bookmark, Download, Plane, Search, Settings } from "lucide-react"
import Link from "next/link"

import { requirePro } from "@/lib/auth"
import { editionDay, listArchiveDates, loadArchiveEdition, loadEdition } from "@/lib/news"
import { customBriefing, loadProProfile, searchEditions, storyCategories } from "@/lib/pro"
import { stories, storyPath, type Story } from "@/lib/stories"

import { removeSearch, savePreferences, saveSearch, toggleBookmark } from "./actions"

export const dynamic = "force-dynamic"

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const [{ userId, user }, edition, params] = await Promise.all([requirePro(), loadEdition(stories), searchParams])
  const profile = await loadProProfile(userId)
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 120) : ""
  const customStories = customBriefing(edition.stories, profile)
  const publishers = [...new Set(edition.stories.map((story) => story.source))].toSorted()
  const dates = query ? await listArchiveDates() : []
  const archived = query ? (await Promise.all(dates.map(loadArchiveEdition))).filter((item) => item !== undefined) : []
  if (query && !archived.some((item) => editionDay(item.generatedAt) === editionDay(edition.generatedAt))) archived.unshift(edition)
  const results = searchEditions(archived, query)
  const name = user.firstName || user.primaryEmailAddress?.emailAddress || "Pro member"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/15 bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-h-11 items-center gap-3">
            <span className="grid size-10 place-items-center bg-primary text-primary-foreground"><Plane className="size-5 -rotate-12" aria-hidden="true" /></span>
            <span className="text-xl font-black uppercase">Av<span className="text-primary">TLDR</span> <span className="text-xs tracking-widest">Pro</span></span>
          </Link>
          <div className="flex items-center gap-4"><span className="hidden text-sm text-muted-foreground sm:inline">{name}</span><UserButton /></div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Member dashboard</p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-[-0.045em] sm:text-6xl">Your aviation briefing</h1>
        {typeof user.privateMetadata.stripeCustomerId === "string" && <form action="/api/stripe/portal" method="post" className="mt-5"><button className="text-sm font-bold text-primary hover:underline">Manage billing →</button></form>}

        <div className="mt-12 grid gap-10 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <aside className="h-fit border-t-2 border-foreground pt-6 lg:sticky lg:top-6">
            <h2 className="flex items-center gap-2 font-serif text-2xl font-bold"><Settings className="size-5 text-primary" /> Preferences</h2>
            <form action={savePreferences} className="mt-6">
              <fieldset>
                <legend className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Topics</legend>
                <div className="mt-3 space-y-2">{storyCategories.map((category) => <Check key={category} name="category" value={category} checked={profile.categories.includes(category)} />)}</div>
              </fieldset>
              <fieldset className="mt-7">
                <legend className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Publishers</legend>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">Leave all clear to include every publisher.</p>
                <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-2">{publishers.map((publisher) => <Check key={publisher} name="publisher" value={publisher} checked={profile.publishers.includes(publisher)} />)}</div>
              </fieldset>
              <button className="mt-6 min-h-11 w-full bg-foreground px-4 py-2 text-xs font-black uppercase tracking-widest text-background hover:bg-primary" type="submit">Save briefing</button>
            </form>
          </aside>

          <div className="min-w-0 space-y-16">
            <section aria-labelledby="custom-briefing">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-foreground pb-4">
                <div><p className="text-xs font-bold uppercase tracking-widest text-primary">Today</p><h2 id="custom-briefing" className="mt-2 font-serif text-3xl font-bold">Custom daily briefing</h2></div>
                <div className="flex gap-2"><ExportLink href="/api/pro/export/csv" label="CSV" /><ExportLink href="/api/pro/export/pdf" label="PDF" /></div>
              </div>
              <StoryList stories={customStories.map((story) => ({ date: editionDay(edition.generatedAt), story }))} bookmarked={profile.bookmarks} />
            </section>

            <section aria-labelledby="archive-search">
              <h2 id="archive-search" className="flex items-center gap-2 font-serif text-3xl font-bold"><Search className="size-6 text-primary" /> Search every edition</h2>
              <form className="mt-5 flex gap-2" action="/account">
                <label htmlFor="archive-query" className="sr-only">Search all editions</label>
                <input id="archive-query" name="q" type="search" defaultValue={query} maxLength={120} placeholder="Airline, aircraft, airport..." className="min-h-12 min-w-0 flex-1 border border-foreground/25 bg-card px-4 outline-none focus:border-primary" />
                <button type="submit" className="min-h-12 bg-primary px-5 text-xs font-black uppercase tracking-widest text-primary-foreground">Search</button>
              </form>
              {query && <form action={saveSearch} className="mt-3"><input type="hidden" name="query" value={query} /><button className="text-xs font-bold text-primary hover:underline">Save this search</button></form>}
              {query && <p className="mt-6 text-sm text-muted-foreground">{results.length} result{results.length === 1 ? "" : "s"} for “{query}”</p>}
              <StoryList stories={results} bookmarked={profile.bookmarks} />
            </section>

            <section className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="flex items-center gap-2 font-serif text-2xl font-bold"><Bookmark className="size-5 text-primary" /> Bookmarks</h2>
                <StoryList stories={profile.bookmarks.map((bookmark) => ({ date: bookmark.date, story: { ...bookmark, importance: 0, whatHappened: "", whyItMatters: "", publishedAt: "" } }))} bookmarked={profile.bookmarks} compact />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold">Saved searches</h2>
                {profile.savedSearches.length ? <ul className="mt-5 divide-y divide-foreground/15 border-y border-foreground/15">{profile.savedSearches.map((saved) => (
                  <li key={saved} className="flex items-center justify-between gap-3 py-3"><Link className="font-semibold hover:text-primary" href={`/account?q=${encodeURIComponent(saved)}`}>{saved}</Link><form action={removeSearch.bind(null, saved)}><button className="text-xs text-muted-foreground hover:text-foreground">Remove</button></form></li>
                ))}</ul> : <p className="mt-5 text-sm text-muted-foreground">Save an archive search to keep it here.</p>}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

function Check({ name, value, checked }: { name: string; value: string; checked: boolean }) {
  return <label className="flex min-h-9 items-center gap-3 text-sm"><input type="checkbox" name={name} value={value} defaultChecked={checked} className="size-4 accent-orange-500" /><span>{value}</span></label>
}

function ExportLink({ href, label }: { href: string; label: string }) {
  return <a href={href} className="inline-flex min-h-11 items-center gap-2 border border-foreground/25 px-3 text-xs font-black uppercase tracking-widest hover:bg-foreground hover:text-background"><Download className="size-4" />{label}</a>
}

function StoryList({ stories, bookmarked, compact = false }: { stories: Array<{ date: string; story: Story }>; bookmarked: Array<{ date: string; id: string }>; compact?: boolean }) {
  if (!stories.length) return <p className="mt-6 border border-dashed border-foreground/25 p-8 text-center text-sm text-muted-foreground">Nothing here yet.</p>
  return <ol className="mt-5 divide-y divide-foreground/15 border-y border-foreground/15">{stories.map(({ date, story }) => {
    const saved = bookmarked.some((item) => item.date === date && item.id === story.id)
    return <li key={`${date}-${story.id}`} className={compact ? "py-4" : "py-6"}>
      <p className="text-[0.68rem] font-bold uppercase tracking-widest text-primary">{story.category} · {date}</p>
      <Link href={storyPath(date, story.id)} className={`mt-2 block font-serif font-bold hover:text-primary ${compact ? "text-lg" : "text-2xl"}`}>{story.headline}</Link>
      {!compact && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{story.summary}</p>}
      <form action={toggleBookmark.bind(null, date, story.id)} className="mt-3"><button className="inline-flex min-h-9 items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"><Bookmark className={`size-4 ${saved ? "fill-current text-primary" : ""}`} />{saved ? "Remove bookmark" : "Bookmark"}</button></form>
    </li>
  })}</ol>
}
