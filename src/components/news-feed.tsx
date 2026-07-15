"use client"

import Link from "next/link"
import { useMemo, useState, useSyncExternalStore } from "react"
import { ArrowRight, ArrowUpRight, CalendarDays, Newspaper, Plane, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/share-button"
import { Switch } from "@/components/ui/switch"
import { formatStoryPublishedAt, storyPath, type Story, type StoryCategory } from "@/lib/stories"

const categories: Array<"All" | StoryCategory> = [
  "All",
  "Airlines",
  "Aircraft",
  "Safety",
  "Military",
  "Technology",
]

function subscribeToMilitaryPreference(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener("avtldr:military", callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener("avtldr:military", callback)
  }
}

function getMilitaryPreference() {
  return localStorage.getItem("avtldr:military") !== "false"
}

export function NewsFeed({ stories, editionDate }: { stories: Story[]; editionDate: string }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("All")
  const showMilitary = useSyncExternalStore(
    subscribeToMilitaryPreference,
    getMilitaryPreference,
    () => true
  )

  const visibleStories = useMemo(
    () =>
      stories.filter(
        (story) =>
          (showMilitary || story.category !== "Military") &&
          (category === "All" || story.category === category)
      ),
    [category, showMilitary, stories]
  )

  function toggleMilitary(checked: boolean) {
    localStorage.setItem("avtldr:military", String(checked))
    window.dispatchEvent(new Event("avtldr:military"))
    if (!checked && category === "Military") setCategory("All")
  }

  const [lead, ...rest] = visibleStories.slice(0, 7)

  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 gap-y-2 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <label className="flex min-h-11 items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Topic</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as (typeof categories)[number])}
            className="min-h-11 cursor-pointer border-0 border-b border-foreground/25 bg-transparent py-1 pr-8 font-serif text-lg font-bold outline-none focus:border-foreground"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <div className="flex min-h-11 items-center gap-3">
          <label htmlFor="military-news" className="flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
            <Shield className="size-4" aria-hidden="true" />
            Military news
          </label>
          <Switch
            id="military-news"
            checked={showMilitary}
            onCheckedChange={toggleMilitary}
            className="data-checked:bg-foreground"
            aria-label="Show military news"
          />
        </div>
      </div>

      <main id="briefing" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {!lead ? (
          <div className="border border-dashed border-foreground/30 px-6 py-20 text-center">
            <p className="font-serif text-2xl font-bold">No stories in this category today.</p>
            <Button className="mt-5 min-h-11" variant="outline" onClick={() => setCategory("All")}>
              View the full briefing
            </Button>
          </div>
        ) : (
          <>
            <section aria-labelledby="lead-story" className="grid border-y-2 border-foreground lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
              <article className="group relative flex min-h-[28rem] flex-col justify-between overflow-hidden bg-slate-950 p-6 text-white sm:min-h-[32rem] sm:p-10 lg:p-12">
                {lead.imageUrl ? (
                  <>
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-[1.025] motion-reduce:transform-none" style={{ backgroundImage: `url("${lead.imageUrl}")` }} />
                    <div className="absolute inset-0 bg-black/65" />
                  </>
                ) : (
                  <Plane className="absolute -right-10 top-4 size-64 -rotate-12 text-white/[0.035]" strokeWidth={1} aria-hidden="true" />
                )}
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Lead story</p>
                </div>
                <div className="relative max-w-3xl">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/55">{lead.category}</p>
                  <h2 id="lead-story" className="font-serif text-4xl leading-[1.02] font-bold tracking-[-0.035em] text-balance sm:text-6xl">
                    <Link href={storyPath(editionDate, lead.id)} className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{lead.headline}</Link>
                  </h2>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{lead.summary}</p>
                </div>
              </article>

              <aside className="flex flex-col bg-card p-6 sm:p-10 lg:p-12">
                <div className="flex items-center justify-between border-b border-foreground/15 pb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em]">The short version</p>
                  <span className="font-mono text-xs text-muted-foreground">01</span>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-8 py-10">
                  <StoryPoint label="TL;DR" text={`${lead.whatHappened} ${lead.whyItMatters}`} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/15 pt-5">
                  <StoryMeta story={lead} />
                  <div className="flex items-center gap-4">
                    <ShareButton story={lead} editionDate={editionDate} />
                    <SourceLink story={lead} />
                  </div>
                </div>
              </aside>
            </section>

            {rest.length > 0 && (
              <section aria-labelledby="latest-news" className="mt-16">
                <div className="mb-7 flex items-end justify-between gap-4 border-b-2 border-foreground pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Also in today&apos;s edition</p>
                    <h2 id="latest-news" className="mt-2 font-serif text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                      The rest of the briefing
                    </h2>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="hidden text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground sm:block">
                      {visibleStories.length} stories · updated daily
                    </p>
                    <Link
                      href="/stories"
                      className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-primary hover:underline"
                    >
                      See all stories
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                <div className="grid gap-px bg-foreground/15 border border-foreground/15 md:grid-cols-2 xl:grid-cols-3">
                  {rest.map((story) => (
                    <article key={story.id} className="group flex min-h-[29rem] flex-col bg-card p-6 transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-1 hover:bg-secondary hover:shadow-lg motion-reduce:transform-none sm:p-7">
                      <div>
                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary">{story.category}</span>
                      </div>
                      <h3 className="mt-8 font-serif text-2xl leading-tight font-bold tracking-[-0.025em] group-hover:text-primary sm:text-3xl">
                        <Link href={storyPath(editionDate, story.id)} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{story.headline}</Link>
                      </h3>
                      <p className="mt-4 leading-7 text-muted-foreground">{story.summary}</p>
                      <div className="mt-8 space-y-6 border-t border-foreground/15 pt-6">
                        <StoryPoint label="TL;DR" text={`${story.whatHappened} ${story.whyItMatters}`} compact />
                      </div>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-8">
                        <StoryMeta story={story} />
                        <div className="flex items-center gap-4">
                          <ShareButton story={story} editionDate={editionDate} />
                          <SourceLink story={story} compact />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </>
  )
}

function StoryPoint({ label, text, compact = false }: { label: string; text: string; compact?: boolean }) {
  return (
    <div>
      <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">{label}</p>
      <p className={compact ? "text-sm leading-6 text-foreground/80" : "text-base leading-7 text-muted-foreground"}>{text}</p>
    </div>
  )
}

export function StoryMeta({ story }: { story: Story }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {story.recencyLabel && (
        <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground ring-1 ring-primary">
          {story.recencyLabel}
        </span>
      )}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-foreground/10">
        <Newspaper className="size-3.5 text-primary" aria-hidden="true" />
        {story.source}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-foreground/10">
        <CalendarDays className="size-3.5 text-primary" aria-hidden="true" />
        {formatStoryPublishedAt(story.publishedAt)}
      </span>
    </div>
  )
}

export function SourceLink({ story, compact = false }: { story: Story; compact?: boolean }) {
  return (
    <a
      href={story.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {compact ? "Source" : "Read source"}
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
      <span className="sr-only">: {story.headline}</span>
    </a>
  )
}
