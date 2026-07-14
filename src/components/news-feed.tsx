"use client"

import { useMemo, useState, useSyncExternalStore } from "react"
import { ArrowUpRight, Clock3, Plane, Shield } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import type { Story, StoryCategory } from "@/lib/stories"

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

export function NewsFeed({ stories }: { stories: Story[] }) {
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

  const [lead, ...rest] = visibleStories

  return (
    <>
      <section className="border-y bg-muted/35">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <nav aria-label="News categories" className="flex gap-1 overflow-x-auto pb-1 lg:pb-0">
            {categories.map((item) => (
              <Button
                key={item}
                type="button"
                variant={category === item ? "default" : "ghost"}
                size="sm"
                className="shrink-0"
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
          </nav>

          <div className="flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2 lg:justify-start">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-muted-foreground" aria-hidden="true" />
              <label htmlFor="military-news" className="text-sm font-medium">
                Show military news
              </label>
            </div>
            <Switch
              id="military-news"
              checked={showMilitary}
              onCheckedChange={toggleMilitary}
              aria-label="Show military news"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {!lead ? (
          <div className="rounded-xl border border-dashed px-6 py-16 text-center">
            <p className="font-medium">No stories in this category today.</p>
            <Button className="mt-4" variant="outline" onClick={() => setCategory("All")}>
              View all news
            </Button>
          </div>
        ) : (
          <>
            <section aria-labelledby="lead-story" className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="flex min-h-72 flex-col justify-between overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground shadow-sm sm:p-8">
                <div className="flex items-start justify-between">
                  <Badge className="bg-white/15 text-white hover:bg-white/15">Lead story</Badge>
                  <Plane className="size-8 opacity-85" aria-hidden="true" />
                </div>
                <div className="mt-16">
                  <p className="mb-3 text-sm font-medium text-white/75">{lead.category}</p>
                  <h2 id="lead-story" className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                    {lead.headline}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">{lead.summary}</p>
                </div>
              </div>

              <Card className="justify-between shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <Badge variant="secondary">Today&apos;s TLDR</Badge>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock3 className="size-3.5" aria-hidden="true" />
                      {lead.publishedAt}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <StoryPoint label="What happened" text={lead.whatHappened} />
                  <Separator />
                  <StoryPoint label="Why it matters" text={lead.whyItMatters} />
                </CardContent>
                <div className="flex items-center justify-between border-t bg-muted/35 px-4 py-3">
                  <span className="text-xs text-muted-foreground">Source: {lead.source}</span>
                  <SourceLink story={lead} />
                </div>
              </Card>
            </section>

            {rest.length > 0 && (
              <section aria-labelledby="latest-news" className="mt-12">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-primary">The daily brief</p>
                    <h2 id="latest-news" className="mt-1 text-2xl font-semibold tracking-tight">
                      More worth knowing
                    </h2>
                  </div>
                  <p className="hidden text-sm text-muted-foreground sm:block">
                    {visibleStories.length} stories · updated daily
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {rest.map((story, index) => (
                    <Card key={story.id} className="transition-transform hover:-translate-y-0.5 hover:shadow-md">
                      <CardHeader>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <Badge variant={story.category === "Military" ? "destructive" : "secondary"}>
                            {story.category}
                          </Badge>
                          <span className="font-mono text-xs text-muted-foreground">
                            {String(index + 2).padStart(2, "0")}
                          </span>
                        </div>
                        <CardTitle className="text-xl tracking-tight">{story.headline}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-1 flex-col">
                        <p className="leading-6 text-muted-foreground">{story.summary}</p>
                        <div className="mt-5 space-y-3 rounded-lg bg-muted/60 p-4">
                          <StoryPoint label="What happened" text={story.whatHappened} compact />
                          <StoryPoint label="Why it matters" text={story.whyItMatters} compact />
                        </div>
                        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                          <span className="text-xs text-muted-foreground">
                            {story.source} · {story.publishedAt}
                          </span>
                          <SourceLink story={story} />
                        </div>
                      </CardContent>
                    </Card>
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
    <div className={compact ? "grid gap-1 sm:grid-cols-[7.25rem_1fr]" : "space-y-1.5"}>
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{label}</p>
      <p className={compact ? "text-sm leading-5" : "leading-6 text-muted-foreground"}>{text}</p>
    </div>
  )
}

function SourceLink({ story }: { story: Story }) {
  return (
    <a
      href={story.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      Read source
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
      <span className="sr-only">: {story.headline}</span>
    </a>
  )
}
