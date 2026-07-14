"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Plane, Search, X } from "lucide-react"

import { SourceLink, StoryMeta } from "@/components/news-feed"
import { ShareButton } from "@/components/share-button"
import { browseStories, storyPath, type Story, type StoryCategory } from "@/lib/stories"

const categories: Array<"All" | StoryCategory> = [
  "All",
  "Airlines",
  "Aircraft",
  "Safety",
  "Military",
  "Technology",
]

export function StoryBrowser({ stories, editionDate }: { stories: Story[]; editionDate: string }) {
  const [publisher, setPublisher] = useState("All")
  const [category, setCategory] = useState<(typeof categories)[number]>("All")
  const [sort, setSort] = useState("importance")
  const [query, setQuery] = useState("")

  const publishers = useMemo(
    () => [...new Set(stories.map((story) => story.source))].toSorted(),
    [stories]
  )

  const visibleStories = useMemo(() => {
    return browseStories(stories, { publisher, category, query, sort })
  }, [category, publisher, query, sort, stories])

  function clearFilters() {
    setPublisher("All")
    setCategory("All")
    setQuery("")
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:px-8">
      <aside className="h-fit border-t-2 border-foreground pt-5 lg:sticky lg:top-6" aria-label="Story filters">
        <label className="block">
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Search</span>
          <span className="mt-2 flex min-h-11 items-center gap-2 border-b border-foreground/25 focus-within:border-primary">
            <Search className="size-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Aircraft, airline..."
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/60 sm:text-sm"
            />
          </span>
        </label>

        <label className="mt-7 block">
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Sort by</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="mt-2 min-h-11 w-full border border-foreground/20 bg-card px-3 text-base font-semibold outline-none focus:border-primary sm:text-sm"
          >
            <option value="importance">Top stories</option>
            <option value="publisher">Publisher A–Z</option>
            <option value="category">Topic A–Z</option>
          </select>
        </label>

        <fieldset className="mt-8">
          <legend className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Publishers</legend>
          <div className="mt-3 space-y-1">
            {["All", ...publishers].map((item) => {
              const count = item === "All" ? stories.length : stories.filter((story) => story.source === item).length
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={publisher === item}
                  onClick={() => setPublisher(item)}
                  className={`flex min-h-11 w-full items-center justify-between gap-3 px-2 py-2 text-left text-sm transition-colors ${
                    publisher === item ? "bg-foreground font-bold text-background" : "hover:bg-secondary"
                  }`}
                >
                  <span>{item === "All" ? "All publishers" : item}</span>
                  <span className={publisher === item ? "text-background/60" : "text-muted-foreground"}>{count}</span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <label className="mt-8 block">
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Topic</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as (typeof categories)[number])}
            className="mt-2 min-h-11 w-full border border-foreground/20 bg-card px-3 text-base font-semibold outline-none focus:border-primary sm:text-sm"
          >
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </aside>

      <main className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-foreground/20 pb-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">{visibleStories.length}</span> {visibleStories.length === 1 ? "story" : "stories"}
          </p>
          {(publisher !== "All" || category !== "All" || Boolean(query)) && (
            <button type="button" onClick={clearFilters} className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-primary hover:underline">
              <X className="size-3.5" aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>

        {visibleStories.length ? (
          <div className="divide-y divide-foreground/15 border-y border-foreground/15">
            {visibleStories.map((story) => (
              <article key={story.id} className="group grid gap-6 bg-card py-7 sm:grid-cols-[12rem_minmax(0,1fr)] sm:px-5">
                <div
                  className="flex min-h-40 items-center justify-center overflow-hidden bg-slate-950 bg-cover bg-center text-white"
                  style={story.imageUrl ? { backgroundImage: `linear-gradient(rgb(0 0 0 / 0.18), rgb(0 0 0 / 0.18)), url("${story.imageUrl}")` } : undefined}
                >
                  {!story.imageUrl && <Plane className="size-10 -rotate-12 opacity-25" aria-hidden="true" />}
                </div>
                <div className="flex min-w-0 flex-col">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary">{story.category}</p>
                  <h2 className="mt-3 max-w-3xl font-serif text-2xl leading-tight font-bold tracking-[-0.025em] group-hover:text-primary sm:text-3xl">
                    <Link href={storyPath(editionDate, story.id)} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{story.headline}</Link>
                  </h2>
                  <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{story.summary}</p>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <StoryMeta story={story} />
                    <div className="flex items-center gap-4">
                      <ShareButton story={story} editionDate={editionDate} />
                      <SourceLink story={story} compact />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-foreground/30 px-6 py-20 text-center">
            <p className="font-serif text-2xl font-bold">No stories match those filters.</p>
            <button type="button" onClick={clearFilters} className="mt-4 min-h-11 text-sm font-bold text-primary hover:underline">Clear filters</button>
          </div>
        )}
      </main>
    </div>
  )
}
